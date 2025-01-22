const express = require("express");
const user_route = express.Router(); // Use express.Router() to create a router instance
const bodyParser = require("body-parser");
const user_controller = require('../controllers/autoController');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.post('/update',user_controller.updateAuto)
user_route.get('/get',user_controller.getAuto)

module.exports = user_route;