const express = require('express');
const { savePlinkoEntry } = require('../controllers/plinkoController');

const router = express.Router();

module.exports = (io) => {
    // Define the route and pass `io` to the handler
    router.post('/savePlinkoEntry', savePlinkoEntry(io));

    return router;
};
