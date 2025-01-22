const express = require('express');
const router=express.Router();
const { createOrder, checkOrder, getDateSubscribe,subscribe, checkSubscribe, Signup,Login,GetLink,PostLink } = require('../controllers/paymentHackAppController.js');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
// Route for creating an order
router.post('/order/create', createOrder);
router.post('/order/status',checkOrder)
router.post('/subscribe',subscribe)
router.get('/getDateSubscribe',getDateSubscribe)
router.get('/subscription/check',checkSubscribe)
router.post('/signup',Signup)
router.post('/login',Login)
router.get('/get_links',GetLink)
router.post('/post_links',PostLink)

module.exports = router;
