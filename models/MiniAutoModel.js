const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    auto_dt: {
        type: Number,
        required: true
    },
    auto_color: {
        type: Number,
        required:true
    },
    auto_spin:{
        type:Number,
        require:true
    }
},{
    timestamps: true
});

const Auto = mongoose.model('MiniAuto', autoSchema);

module.exports = Auto