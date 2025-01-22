const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    banner: {
        type: Array
    },
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner
