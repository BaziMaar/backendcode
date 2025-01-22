const axios = require('axios');
const Subscribe=require('../models/SubscribeModel')
const HackUser=require('../models/HackLoginModel')
const Auto=require('../models/LinksModel')
exports.createOrder = async (req, res) => {
    try {
        console.log(req.body)
        const response = await axios.post(`https://allapi.in/order/create`, req.body, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
        console.log(response)
        res.status(200).send(response.data)
    } catch (error) {
        console.log('Error:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || 'Internal Server Error',
        });
    }
};
exports.checkOrder = async (req, res) => {
    try {
        console.log('>>>>>>>',req)
        const response = await axios.post(`https://allapi.in/order/status`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                // Add additional headers if needed
            },
        })
        console.log(response)
        res.status(200).send(response.data)
    } catch (error) {
        console.log('Error:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || 'Internal Server Error',
        });
    }
};
exports.subscribe=async (req, res) => {
    const { order_id, customer_email, txn_date, txn_amount,txn_note } = req.body;

    // Validate input
    if (!order_id || !customer_email || !txn_date || !txn_amount) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Check if a subscription exists within the past 30 days for the same email
        const existingSubscription = await Subscribe.findOne({
            customer_email: customer_email,
            createdAt: { $gte: thirtyDaysAgo }, // Check if createdAt is within the last 30 days
            txn_note:txn_note
        });

        if (existingSubscription) {
            return res.status(400).json({
                error: 'A subscription already exists within the last 30 days.',
            });
        }

        // Create a new subscription
        const subscription = new Subscribe({
            order_id,
            customer_email,
            txn_date,
            txn_amount,
            txn_note
        });

        // Save to the database
        const savedSubscription = await subscription.save();

        res.status(201).json({
            message: 'Subscription created successfully!',
            subscription: savedSubscription,
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getDateSubscribe=async (req, res) => {
    try {
        // Fetch all subscriptions
        const subscriptions = await Subscribe.find();

        // Format response to include timestamps
        const formattedSubscriptions = subscriptions.map((sub) => ({
            order_id: sub.order_id,
            customer_email: sub.customer_email,
            txn_date: sub.txn_date,
            txn_amount: sub.txn_amount,
            created_at: sub.createdAt,
            updated_at: sub.updatedAt,
        }));

        res.status(200).json({
            message: 'Subscriptions retrieved successfully!',
            subscriptions: formattedSubscriptions,
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.checkSubscribe=async (req, res) => {
    const { email,txn_note } = req.query;

    // Validate input
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Check if a subscription exists for the email within the last 30 days
        const validSubscription = await Subscribe.findOne({
            customer_email: email,
            createdAt: { $gte: thirtyDaysAgo }, // Check if createdAt is within the last 30 days
            txn_note:txn_note
        });

        if (validSubscription) {
            return res.status(200).json({
                message: 'Valid subscription found.',
                subscription: {
                    order_id: validSubscription.order_id,
                    customer_email: validSubscription.customer_email,
                    txn_date: validSubscription.txn_date,
                    txn_amount: validSubscription.txn_amount,
                    created_at: validSubscription.createdAt,
                    txn_note: validSubscription.txn_note
                },
            });
        } else {
            return res.status(404).json({ message: 'No valid subscription found.' });
        }
    } catch (error) {
        console.error('Error checking subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.Signup=async (req, res) => {
    const { name, email, password, app_name } = req.body;
  
    try {
      // Check if the email is already registered
      const existingUser = await HackUser.findOne({ email:email,app_name:app_name });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      // Create a new user (no password hashing)
      const newUser = new HackUser({
        name,
        email,
        password, // Store password as plain text (not recommended)
        app_name,
      });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  }
  exports.Login=async (req, res) => {
    const { email, password,app_name } = req.body;
  
    try {
      // Find the user by email
      const user = await HackUser.findOne({ email:email,app_name:app_name });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Respond with success
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  }
  exports.PostLink=async (req, res) => {
    const { game_code } = req.body;

    if (!game_code) {
        return res.status(400).json({ error: "game_code is required." });
    }

    try {
        // Check if a document with the same game_code exists
        const existingDocument = await Auto.findOne({ game_code });

        if (existingDocument) {
            // Delete the existing document
            await Auto.deleteOne({ game_code });
            console.log(`Deleted document with game_code: ${game_code}`);
        }

        // Create and save the new document
        const auto = new Auto(req.body);
        const savedAuto = await auto.save();

        res.status(201).json(savedAuto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
  exports.GetLink=async (req, res) => {
    try {
        const autos = await Auto.find();
        res.status(200).json(autos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}