const express = require('express');
const router = express.Router();
const { generateController } = require('../controllers/sliceController');

module.exports = (io) => {
    generateController(io);  // Initialize the controller with the io instance
    return router;
};