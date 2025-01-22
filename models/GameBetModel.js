const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    phone: {
        type: Number,
        required: true
    },
    avatar:{
        type:String,
        required:true
    },
    score:{
        type:Number
    },
    amount: {
        type: Number,
        required: true
    },
    game_name:{
        type:String,
        required:true
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields to the schema
});

const GameBetEntry = mongoose.model('GameBetEntry', transactionSchema);

module.exports = GameBetEntry;
