const TournamentEntry = require('../models/TournamentEntryModel');
const Tournament=require("../models/TournamentModel");
const User=require('../models/userModel');
let cachedRandomScores = null;
const Funds=require("../Services/walletServices.js")
const addTournamentEntry = async (req, res) => {
  try {
    const { tournament_id, phone, amount, avatar, player_name } = req.body;
    const user=await User.findOne({phone});


    const newEntry = new TournamentEntry({
      tournament_id,
      phone,
      amount,
      avatar,
      player_name
    });
    user.wallet-=amount
    await user.save()

    const savedEntry = await newEntry.save();

    res.status(201).json({
      message: 'Tournament entry added successfully',
      entry: savedEntry,
      newBalance:user.wallet
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding tournament entry',
      error: error.message
    });
  }
};
const updateScoreByTransactionAndPhone = async (req, res) => {
  try {
    const { tournament_id, phone, score } = req.body; // Extract parameters from request body

    // Find the current entry by tournament_id and phone
    const existingEntry = await TournamentEntry.findOne({ tournament_id, phone });

    if (!existingEntry) {
      return res.status(404).json({ message: 'Tournament entry not found' });
    }

    // Check if the current score is greater or if the previous score is empty
    if (existingEntry.score == null || score > existingEntry.score) {
      // Update the score
      existingEntry.score = score;
      await existingEntry.save(); // Save the updated entry to the database

      return res.status(200).json({
        message: 'Score updated successfully',
        entry: existingEntry,
      });
    } else {
      return res.status(400).json({
        message: 'Score not updated as it is not greater than the current score',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error updating score',
      error: error.message,
    });
  }
};

let cachedRandomScoresByTournament = {}; // Cache random scores by tournament_id

const generateRandomScores = async (maxScore) => {
    const randomScores = [];
    for (let i = 0; i < 5; i++) {
        let ansScore = Math.floor(Math.random() * 1000) + 1000; // Generate random scores
        let ansId = Math.floor(Math.random() * 100000) + 100000;
        let ansAvatar = Math.floor(Math.random() * 10) + 1;
        randomScores.push({ score: ansScore, id: ansId, avatar: ansAvatar });
    }
    return randomScores.sort((a, b) => b.score - a.score); // Sort in descending order
};

const isEmpty = (value) => value === null || value === undefined || value === '';

const getLeaderboard = async (req, res) => {
    try {
        const { tournament_id, phone } = req.query;
        if (isEmpty(tournament_id) || isEmpty(phone)) {
            return res.status(400).json({ error: 'tournament_id and phone are required' });
        }

        // Find entries for the tournament
        console.log(tournament_id);
        const entries = await TournamentEntry.find({ tournament_id }).sort({ score: -1 });
        console.log(entries);

        // Determine the top player's score
        const topPlayerScore = entries.length > 0 ? entries[0].score : 1000;

        // Check cache or regenerate random scores
        const cachedTopScore = cachedRandomScoresByTournament[tournament_id]?.[0]?.score || 0;
        if (!cachedRandomScoresByTournament[tournament_id] || cachedTopScore < topPlayerScore) {
            cachedRandomScoresByTournament[tournament_id] = await generateRandomScores(topPlayerScore);
        }
        const cachedRandomScores = cachedRandomScoresByTournament[tournament_id];
        const userEntryIndex = entries.findIndex(entry => entry.phone === phone);
        const userEntry = userEntryIndex >= 0 ? entries[userEntryIndex] : null;

        if (isEmpty(userEntry)) {
            return res.json({
                message: 'Player not found in the tournament. Displaying random top 5 scores.',
                top5Scores: cachedRandomScores,
            });
        }

        const userRank = userEntryIndex + 1;

        // Respond with leaderboard details
        res.json({
            phone,
            tournament_id,
            userRank: userRank,
            userScore: userEntry.score || 0,
            topPlayerScore,
            top5Scores: cachedRandomScores,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const endTournament = async (req, res = null) => {
  try {
    const { tournament_id } = req.body; 
    const tournament = await Tournament.findById(tournament_id);
    const entries = await TournamentEntry.find({ tournament_id }).sort({ score: -1 }).limit(1);
    console.log(entries);
    if (entries.length === 0) {
      if (res) {
        return res.status(404).json({ message: 'No entries found for this tournament' });
      }
      throw new Error('No entries found for this tournament');
    }

    const topPlayers = entries.map(entry => ({
      player_name: entry.player_name,
      phone: entry.phone,
      score: entry.score,
    }));
    const user = await User.findOne({ phone: topPlayers[0].phone });
    if (user) {
      user.wallet += tournament.price;
      Funds.addTournamentFunds(user.phone, tournament.price);
      await user.save();
    }

    if (res) {
      return res.status(200).json({
        message: 'Tournament ended successfully. Top players have been rewarded.',
        topPlayers,
      });
    } else {
      console.log('Tournament ended successfully. Top players have been rewarded.', topPlayers);
    }
  } catch (error) {
    if (res) {
      return res.status(500).json({
        message: 'Error ending tournament and rewarding players',
        error: error.message,
      });
    } else {
      console.error('Error ending tournament and rewarding players:', error.message);
      throw error;
    }
  }
};

module.exports = { 
  addTournamentEntry,
  updateScoreByTransactionAndPhone,
  getLeaderboard,
  endTournament
};
