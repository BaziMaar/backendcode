const express = require("express");
const userRoute = express.Router(); // Use camelCase for variable names
const bodyParser = require("body-parser");

// Import controllers
const gameController = require('../controllers/homeController');
const tournamentController = require('../controllers/tournamentController');
const sendController = require('../controllers/GameBetController');
const tournamentEntryController = require('../controllers/tournamentMoneyController');
const {verifyDeviceId} = require('../middlewares/verifyDeviceId');
// Middleware
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

// Routes for game-related actions
userRoute.post('/addGame', gameController.addGame);
userRoute.get('/getGame', gameController.getGame);
userRoute.post('/addTournament', tournamentController.addTournament);
userRoute.get('/getTournament', tournamentController.getTodayTournaments);
userRoute.post('/addTournamentEntry', tournamentEntryController.addTournamentEntry);
userRoute.put('/updateScoreTournament', tournamentEntryController.updateScoreByTransactionAndPhone); 
userRoute.post('/send_money', sendController.sendMoney);
userRoute.post('/receive_money', sendController.receiveMoney);
userRoute.get('/getLeaderboard',tournamentEntryController.getLeaderboard)
userRoute.post('/endTournament',tournamentEntryController.endTournament)
module.exports = userRoute;
