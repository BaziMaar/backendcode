const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    phone: {
        type: Number,
        required: true
    },
    color: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const LuckyEntryTransaction = mongoose.model('LuckyEntryTransaction', transactionSchema);

module.exports = LuckyEntryTransaction;
