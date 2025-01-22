const admin = require('../firebase');
const Auto=require('../models/NotificationModel')
const sendNotification = async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).send({
            success: false,
            msg: 'Token, title, and body are required'
        });
    }

    const messagePayload = {
        notification: {
            title: title,
            body: body
        }
    };

    try {
        const response = await admin.messaging().sendToDevice(token, messagePayload);
        return res.status(200).send({
            success: true,
            msg: 'Successfully sent message',
            response
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            msg: 'Error sending message',
            error: error.message
        });
    }
};
const postNotification=async (req, res) => {
    try {
        const { image, title, description } = req.body;
        const notification = new Auto({ image, title, description });
        await notification.save();
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
const getNotification=async(req, res) => {
    try {
        const notifications = await Auto.find();
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}



module.exports = { sendNotification,postNotification,getNotification };
