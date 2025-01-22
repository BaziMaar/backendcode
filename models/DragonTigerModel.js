const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    phone: {
        type: Number,
        required: true
    },
    transactions: [{
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
    }]
}, {
    timestamps: true
});

const LuckyTransaction = mongoose.model('DragonTigerTransaction', transactionSchema);

module.exports = LuckyTransaction;
