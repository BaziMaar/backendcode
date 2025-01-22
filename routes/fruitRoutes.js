const express = require('express');
const router = express.Router();
const { generateController } = require('../controllers/fruitController');

module.exports = (io) => {
    generateController(io);
    return router;
};