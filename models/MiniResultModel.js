const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    globalNumber: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    result:{
        type:Number,
        require:true
    },
    size:{
        type:Number,
        required:true
    },
    color:{
        type:Array,
        required:true
    }
});

const Result = mongoose.model('MiniResult', resultSchema);

module.exports = Result