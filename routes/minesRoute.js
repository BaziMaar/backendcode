const express = require("express");
const mines_route = express.Router(); // Use express.Router() to create a router instance
const bodyParser = require("body-parser");
mines_route.use(bodyParser.json());
mines_route.use(bodyParser.urlencoded({ extended: true }));
const minesController=require('../controllers/minesController.js');
const plinkoController=require('../controllers/plinkoController.js');
const sliceController=require('../controllers/sliceController.js')
const fruitController=require('../controllers/fruitController.js')
const { verifyDeviceId,getVerifyDeviceId } = require("../middlewares/verifyDeviceId.js");
mines_route.get('/getMines',getVerifyDeviceId, minesController.getMatrix);
mines_route.post('/sendMinesMoney',verifyDeviceId, minesController.sendMinesMoney);
mines_route.post('/receiveMinesMoney', verifyDeviceId,minesController.receiveMinesMoney);
mines_route.get(`/getReward`,minesController.getReward)
mines_route.get(`/getMinesEntry`,minesController.getMinesEntry)
mines_route.get(`/getMinesTrans`,minesController.getMinesTransactions)
mines_route.get('/getSpin',plinkoController.getSpinEntry)
mines_route.get('/getPlinkoEntry',plinkoController.getPlinkoEntry)
mines_route.post('/savePlinkoEntry',plinkoController.savePlinkoEntry)
mines_route.post('/saveSliceEntry',sliceController.saveSliceEntry);
mines_route.get('/getSliceEntry',sliceController.getSliceEntry);
mines_route.get('/getSliceEntryPar',sliceController.getSliceEntryPar);
mines_route.post('/saveFruitEntry',fruitController.saveFruitEntry);
mines_route.get('/getSliceEntry',fruitController.getFruitEntry);
mines_route.get('/getSliceEntryPar',fruitController.getFruitEntryPar);
module.exports = mines_route;
