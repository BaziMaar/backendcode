const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
    upi: {
        type: Array
    },
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant
