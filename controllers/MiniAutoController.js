const AutoModel=require('../models/MiniAutoModel')
const updateAuto = async (req, res) => {
    try {
      // Find the existing entry in the database
      let existingEntry = await AutoModel.findOne();
  
      if (existingEntry) {
        // If an entry exists, update it with the new data
        existingEntry.auto_dt = req.body?.auto_dt;
        existingEntry.auto_color = req.body?.auto_color;
        existingEntry.auto_spin = req.body?.auto_spin;
        await existingEntry.save();
      } else {
        // If no entry exists, create a new one
        const newEntry = new AutoModel({
          auto_dt: req.body.auto_dt,
          auto_color: req.body.auto_color,
          auto_spin: req.body.auto_spin
        });
        await newEntry.save();
      }
  
      res.status(200).send({ success: true });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };
  
  const getAuto = async (req, res) => {
    try {
      const latestEntry = await AutoModel.findOne()
      res.status(200).send({ latestEntry });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  };
  module.exports={
    updateAuto,
    getAuto
  }