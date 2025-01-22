const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required:true
    },
    description:{
        type:String,
        require:true
    }
},{
    timestamps: true
});

const Auto = mongoose.model('NotificationNewApp', autoSchema);

module.exports = Auto