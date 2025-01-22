
const User = require('../models/userModel');
const verifyDeviceId = async (req, res, next) => {
    try {
        const { phone, deviceId } = req.body;
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                msg: "User not found",
            });
        }
        if (existingUser.deviceId !== deviceId) {
            return res.status(403).send({
                success: false,
                msg: "Device ID does not match",
            });
        }
        next();
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message,
        });
    }
};
const getVerifyDeviceId = async (req, res, next) => {
    try {
        const { phone, deviceId } = req.query;
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                msg: "User not found",
            });
        }
        if(existingUser.is_blocked===1){
            return res.status(403).send({
                success: false,
                msg: "User got blocked",
            });            
        }
        if (existingUser.deviceId !== deviceId) {
            return res.status(403).send({
                success: false,
                msg: "Device ID does not match",
            });
        }
        next();
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message,
        });
    }
};
module.exports = {verifyDeviceId,getVerifyDeviceId};
