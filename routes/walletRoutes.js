const express = require("express");
const user_route = express.Router(); // Use express.Router() to create a router instance
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
const walletController = require('../controllers/walletController');
const referController=require('../controllers/referrdController');
const { verifyDeviceId,getVerifyDeviceId } = require("../middlewares/verifyDeviceId");

user_route.post('/deposit',verifyDeviceId, walletController.depositFunds);
user_route.post('/adminDeposit', walletController.depositFunds);
user_route.post('/withdraw',verifyDeviceId, walletController.withdrawFunds);
user_route.post('/adminWithdraw', walletController.withdrawFunds);
user_route.get('/getWallet',getVerifyDeviceId,walletController.getWallet);
user_route.get('/getAdminWallet',walletController.getWallet);
user_route.get('/getTrans',walletController.getWalletTrans);
user_route.post('/updateStatus', walletController.updateStatus);
user_route.get('/getTransiction',walletController.getWalletTransinction);
user_route.get('/getReferred',referController.getReferredAmount);
user_route.get('/convert',walletController.convertAmount);
user_route.get('/approvedTrans',walletController.getWalletApprovedTrans);
user_route.get('/pendingTrans',walletController.getWalletPendingTrans);
module.exports = user_route;
