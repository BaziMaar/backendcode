var mongoose = require('mongoose');

var tournamentEntrySchema = mongoose.Schema({
    tournament_id: {
        type: String,
        required: true
    },
    phone:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    score:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        required:true
    },
    player_name:{
        type:String,
        required:true
    }
},
{ timestamps: true });

module.exports = mongoose.model('TournamentEntry', tournamentEntrySchema);
