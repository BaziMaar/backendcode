const mongoose = require('mongoose');
const PlinkoEntry = require('../models/PlinkoModel');
const Wallet=require('../models/walletModel');
const User=require('../models/userModel');


const generateController = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('savePlinkoData', async (data) => {
            try {
                const dataObj=JSON.parse(data)
                console.log(dataObj)
                const plinkoData = new PlinkoEntry({
                    game:dataObj.game,
                    phone: Number(dataObj.phone), // Ensure phone is a number
                    time: dataObj.time, // Assuming time is already a string
                    bet: mongoose.Types.Decimal128.fromString(dataObj.bet.toString()), // Convert bet to Decimal128
                    payOut: mongoose.Types.Decimal128.fromString(dataObj.payOut.toString()), // Convert payOut to Decimal128
                    profit: mongoose.Types.Decimal128.fromString(dataObj.profit.toString()), // Convert profit to Decimal128
                    user_id: dataObj.user_id // Ensure user_id is a string
                });
                console.log(plinkoData)
                await plinkoData.save();
                io.emit('saveDataResponse', { status: 'success',data:dataObj });
                const user=await User.findOne({phone:dataObj.user_id});
                if(game=="plinko"){
                    user.wallet+=dataObj.profit
                }
                await user.save()
                
            } catch (err) {
                io.emit('saveDataResponse', { status: 'error', error: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};
const savePlinkoEntry=(io)=>async(req,res)=>{
    try{
        const dataObj=req.body;
        const plinkoData = new PlinkoEntry({
            game:dataObj.game,
            phone: Number(dataObj.phone), // Ensure phone is a number
            time: dataObj.time, // Assuming time is already a string
            bet: mongoose.Types.Decimal128.fromString(dataObj.bet.toString()), // Convert bet to Decimal128
            payOut: mongoose.Types.Decimal128.fromString(dataObj.payOut.toString()), // Convert payOut to Decimal128
            profit: mongoose.Types.Decimal128.fromString(dataObj.profit.toString()), // Convert profit to Decimal128
            user_id: dataObj.user_id // Ensure user_id is a string
        });
        await plinkoData.save();
        io.emit('saveDataResponse', { status: 'success',data:dataObj });
        const user=await User.findOne({phone:dataObj.user_id});
        user.wallet+=dataObj.profit

        await user.save()
        res.status(200).json({msg:"data saved successfully",data:plinkoData});
    }
    catch(error){
        res.status(500).json({message:error.message});

    }

}
const getPlinkoEntry = async (req, res) => {
    const { page = 1, limit = 100 } = req.query; // Default to page 1, 10 entries per page
    try {
      const entries = await PlinkoEntry.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      const count = await PlinkoEntry.countDocuments();
  
      res.json({
        entries,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
const getSpinEntry = async (req, res) => {
    try {
        const phone = req.query.phone;
        const entry = await PlinkoEntry.findOne({ user_id: phone, game: "spin" })
            .sort({ createdAt: -1 })
            .limit(1); 
        res.json(entry.createdAt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    generateController,
    getPlinkoEntry,
    getSpinEntry,
    savePlinkoEntry
};
