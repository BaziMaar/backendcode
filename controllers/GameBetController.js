const GameBetEntry=require('../models/GameBetModel.js')
const User = require('../models/userModel');
const receiveMoney = async (req, res) => {
  try {
      const { phone, avatar, score, amount, game_name } = req.body;

      // Find user by phone
      const sender = await User.findOne({ phone });
      if (!sender) {
          return res.status(404).json({ error: "Sender not found" });
      }

      // Add amount to sender's wallet
      sender.wallet += amount;
      sender.withdrwarl_amount+=(0.8*amount);
      await sender.save();

      // Create a new GameBetEntry
      const newBet = new GameBetEntry({
          phone,
          avatar,
          score,
          amount,
          game_name,
      });

      const savedBet = await newBet.save();

      // Send success response
      res.status(201).json({
          success: true,
          message: "Amount received and wallet updated successfully",
          newBalance: sender.wallet,
          betDetails: savedBet,
      });
  } catch (err) {
      // Handle unexpected errors
      res.status(500).json({ error: err.message });
  }
};

const sendMoney = async (req, res) => {
  try {
      const { phone, avatar, amount, game_name } = req.body;

      // Find sender by phone
      const sender = await User.findOne({ phone });
      if (!sender) {
          return res.status(404).json({ error: "Sender not found" });
      }

      // Check for sufficient funds
      if (sender.wallet < amount) {
          return res.status(400).json({ error: "Insufficient funds" });
      }

      // Deduct amount from sender's wallet
      sender.withdrwarl_amount+=amount;
      sender.wallet -= amount;
      await sender.save();

      // Create a new GameBetEntry
      const newBet = new GameBetEntry({
          phone,
          avatar,
          amount: -amount, // Store negative amount to represent deduction
          game_name,
      });
      const savedBet = await newBet.save();

      // Send response
      res.status(201).json({
          success: true,
          message: "Bet placed and wallet updated successfully",
          newBalance: sender.wallet,
          betDetails: savedBet
      });
  } catch (err) {
      // Handle unexpected errors
      res.status(500).json({ error: err.message });
  }
};

  
module.exports={
  receiveMoney,
  sendMoney

}
