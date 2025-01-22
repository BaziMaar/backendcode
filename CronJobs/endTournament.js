const tournamentMoneyController=require("../controllers/tournamentMoneyController");
const moment = require('moment-timezone');
const Tournament=require('../models/TournamentModel');
const ScheduleEndTournament = async () => {
    try {
      const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      
      const tournamentsToEnd = await Tournament.find({ end_time: { $eq: currentTime }});
      
      
      for (let tournament of tournamentsToEnd) {
        console.log("cron isrunning for tournamentId is ", tournament._id);
        // Call the refactored function
        await tournamentMoneyController.endTournament({ body: { tournament_id: tournament._id } });
        await tournament.save();
      }
    } catch (error) {
      console.error('Error checking tournament end time:', error.message);
    }
  };
module.exports={
    ScheduleEndTournament
}