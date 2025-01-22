const express = require("express");
const user_route = express.Router(); // Use express.Router() to create a router instance
const bodyParser = require("body-parser");
const user_controller = require('../controllers/userController');
const {verifyDeviceId} = require('../middlewares/verifyDeviceId');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.post('/login', user_controller.userLogin);
user_route.post('/update',verifyDeviceId,user_controller.updateProfile)
user_route.get('/getUser',user_controller.getUser)
user_route.get('/getUpi',user_controller.getUpi)
user_route.get('/getBanner',user_controller.getBanner)
user_route.post('/postBanner',user_controller.postBanner)
user_route.post('/removeBanner',user_controller.deleteBanner)
user_route.post('/postUpi',user_controller.postUpi)
user_route.post('/removeUpi',user_controller.deleteUpi)
user_route.post('/App',user_controller.updateApp)
user_route.get('/getVersion',user_controller.getVersion)
user_route.post('/refreshToken',user_controller.refreshToken)
user_route.post('/blockUser',user_controller.blockUser)
user_route.post('/unBlockUser',user_controller.unBlockUser)

module.exports = user_route;