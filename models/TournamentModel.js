var mongoose = require('mongoose');

var tournamentSchema = mongoose.Schema({
    tournament_name: {
        type: String,
        required: true
    },
    short_description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    start_time:{
        type:String,
        required:true
    },
    end_time:{
        type:String,
        required:true
    },
    category_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    entry_fee:{
        type:Number,
        required:true
    },
    tournament_image:{
        type:String,
        required:true
    }
},
{ timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
