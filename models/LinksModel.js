const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    wa_link: {
        type: String,
        required:true
    },
    yt_link:{
        type:String,
        require:true
    },
    tl_link:{
        type:String,
        required:true
    },
    game_code:{
        type:Number,
        required:true
    }
});

const Auto = mongoose.model('Links', autoSchema);

module.exports = Auto