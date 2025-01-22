const express = require("express");
const notification_route = express.Router(); // Use express.Router() to create a router instance
const bodyParser = require("body-parser");
notification_route.use(bodyParser.json());
notification_route.use(bodyParser.urlencoded({ extended: true }));
const notificationController=require('../controllers/notificationController.js');
notification_route.post('/send',notificationController.sendNotification);
notification_route.post('/postNotification',notificationController.postNotification)
notification_route.get('/getNotification',notificationController.getNotification)
module.exports = notification_route;
