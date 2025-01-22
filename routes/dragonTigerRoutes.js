// generateRoutes.js
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const { generateAndBroadcastNumber, sendDragonMoney ,receiveForMoney,getDragonTransactions, getDragonEntry} = require('../controllers/dragonTigerController');
const { verifyDeviceId } = require('../middlewares/verifyDeviceId');

module.exports = (io) => {
  router.get('/currentDragon', (req, res) => {
    generateAndBroadcastNumber(io);
    res.send('Generate Lucky route');
  });
  router.get('/getDragonTrans',getDragonTransactions)
  router.get('/getDragonEntry',getDragonEntry)
  // Route to handle sending money
  router.post('/sendDragonMoney',verifyDeviceId, async (req, res) => {
    const { phone, color, amount,avatar } = req.body;

    try {
      const response=await sendDragonMoney(io, phone,color, amount);
      res.status(200).json({ response:response });
    } catch (error) {
      console.error('Error sending money:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.post('/receiveMoney',verifyDeviceId, async (req, res) => {
    const { phone, color, amount } = req.body;

    try {
      const response=await receiveForMoney(io, phone,color, amount);
      res.status(200).json({ response:response });
    } catch (error) {
      console.error('Error sending money:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  return router;
};
