const Product=require('../models/TournamentModel.js');
const moment = require('moment-timezone');
const addTournament=async(req,res)=>{
    try {
        const { tournament_name, price, short_description, start_time,end_time,category_name, description, tournament_image,entry_fee,banner_image } = req.body;
        const newProduct = new Product({
          tournament_name,
          price,
          start_time:start_time,
          end_time:end_time,
          short_description,
          category_name,
          description,
          tournament_image,
          entry_fee,
          banner_image
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Tournament added successfully', product: savedProduct });
      } catch (error) {
        res.status(500).json({ message: 'Error adding tournament', error: error.message });
      }
}
const getTodayTournaments = async (req, res) => {
  try {
    const currentDateTime = new Date();
    const last24Hours = new Date();
    console.log(currentDateTime);
    last24Hours.setHours(currentDateTime.getHours() - 24);
    currentDateTime.setHours(29,30,0,0)
    console.log(`>>>>>last@5>>>`,last24Hours);
    const currentDateTimeISO = currentDateTime.toISOString();
    const last24HoursISO = last24Hours.toISOString();
    console.log(currentDateTimeISO)
    console.log(last24HoursISO);
    // Fetch tournaments with end_time within the last 24 hours
    const todayTournaments = await Product.find({
      end_time: {
        $gte: last24HoursISO,
        $lte: currentDateTimeISO,
      }
    });

    // Check if any tournaments are found
    if (todayTournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found in the last 24 hours' });
    }

    res.status(200).json(todayTournaments);
  } catch (error) {
    console.error('Error retrieving tournaments:', error);
    res.status(500).json({ message: 'Error retrieving tournaments', error: error.message });
  }
};




module.exports={addTournament,getTodayTournaments}