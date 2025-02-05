const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    utr: {
        type: String,
        required:true
    }
},{
    timestamps: true
});

const Utr = mongoose.model('Utr', autoSchema);

module.exports = Utr