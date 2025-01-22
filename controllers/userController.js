const User = require("../models/userModel");
const Ref=require("../models/referModel.js");
const Merchant=require("../models/merchantModel.js");
const App = require("../models/AppModel");
const Banner=require("../models/BannerModel.js")
const moment=require('moment')

const userLogin = async (req, res) => {
    try {
      const phone = req.body.phone;
      const userData = await User.findOne({ phone: phone });
      const deviceId=req.body.deviceId
      const token=req.body.token
  
      if (userData) {
        if(token){
          userData.token=token 
          await userData.save()
        }
        if(!userData.is_blocked){
          userData.is_blocked=0
          await userData.save()
        }
        if(userData.is_blocked===1){
          return res.status(403).send({
                  success: false,
                  msg: "User has been blocked",
              });
        }
        if (deviceId) {
          const prefix = "APIKEY_";
          const suffix = "JaiShreeRam";
      
          // Check if the device ID has the correct prefix and suffix
          const hasCorrectPrefix = deviceId.startsWith(prefix);
          const hasCorrectSuffix = deviceId.endsWith(suffix);
      
          if (hasCorrectPrefix && hasCorrectSuffix) {
              // Remove previous device ID if exists and add the new one
              userData.deviceId = deviceId;
              await userData.save();
          } else {
              // Handle the case where the device ID does not have the correct prefix and suffix
              return res.status(403).send({
                  success: false,
                  msg: "Device ID must have the correct prefix and suffix",
              });
          }
        }

      
        // User exists, send user details
        const userResult = {
          _id: userData._id,
          name: userData.name,
          phone: userData.phone,
          email:userData.email,
          wallet:userData.wallet,
          avatar:userData.avatar,
          user_id:userData.user_id,
          refer_id:userData.refer_id,
          deviceIds: userData.deviceId,
          withdrwarl_amount:userData.withdrwarl_amount,
          token:userData?.token,
          is_blocked:userData.is_blocked
        };
  
        const response = {
          success: true,
          msg: "UserDetail",
          data: userResult,
        };
        res.status(200).send(response);
      } 
      else {
        // User does not exist, signup the user
        if(!req.body.email&&!req.body.name){
          return res.status(400).send({ success: false, msg: "user not found" });
        }
        else{
          var min = 100000; // Minimum 6-digit number
          var max = 999999; // Maximum 6-digit numbers

        let userID=await generateUniqueUserID()
        const referId = req.body.referId || req.body.refer_id
        let referAmount=41;
        if(referId){
        const referedUser = await User.findOne({ user_id: referId });
        
        if (referedUser) {
          // Check if referId is not already in the array
          if (!referedUser.refer_id.includes(userID)) {
            referedUser.refer_id.push(userID);
            // Save the updated user
            await referedUser.save();
          }
        }
      }
          const newUser = new User({
            phone: phone,
            email:req.body.email,
            name:req.body.name,
            refer_id:[],
            avatar:req.body.avatar,
            user_id:userID,
            withdrwarl_amount:0,
            deviceId: deviceId,
            wallet:referAmount,
            token:req.body.token,
            is_blocked:0

            // Add any other required fields for signup
          });
    
          const savedUser = await newUser.save();
          const userResult = {
            _id: savedUser._id,
            name: savedUser.name,
            phone: savedUser.phone,
            email:savedUser.email,
            avatar:savedUser.avatar,
            user_id:savedUser.user_id,
            withdrwarl_amount:savedUser.withdrwarl_amount,
            refer_id:savedUser.refer_id,
            deviceIds: savedUser.deviceId,
            wallet:savedUser.wallet,
            token:savedUser.token,
            is_blocked:savedUser.is_blocked
          };
    
          const response = {
            success: true,
            msg: "User created successfully",
            data: userResult,
          };
          res.status(200).send(response);
        }
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  const blockUser=async(req,res)=>{
    const phone=req.body.phone
    const existingUser = await User.findOne({ phone: phone });
    existingUser.is_blocked=1
    const savedUser=existingUser.save()
    const userResult = {
      _id: savedUser._id,
      name: savedUser.name,
      phone: savedUser.phone,
      email:savedUser.email,
      avatar:savedUser.avatar,
      user_id:savedUser.user_id,
      withdrwarl_amount:savedUser.withdrwarl_amount,
      refer_id:savedUser.refer_id,
      deviceIds: savedUser.deviceId,
      wallet:savedUser.wallet,
      token:savedUser.token,
      is_block:(await savedUser).is_blocked
    };
    res.status(200).send(userResult);
  }
  const unBlockUser=async(req,res)=>{
    const phone=req.body.phone
    const existingUser = await User.findOne({ phone: phone });
    existingUser.is_blocked=0
    const savedUser=existingUser.save()
    const userResult = {
      _id: savedUser._id,
      name: savedUser.name,
      phone: savedUser.phone,
      email:savedUser.email,
      avatar:savedUser.avatar,
      user_id:savedUser.user_id,
      withdrwarl_amount:savedUser.withdrwarl_amount,
      refer_id:savedUser.refer_id,
      deviceIds: savedUser.deviceId,
      wallet:savedUser.wallet,
      token:savedUser.token,
      is_block:(await savedUser).is_blocked
    };
    res.status(200).send(userResult);
  }
  const getUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, timePeriod } = req.query; // Default to page 1, limit 10, and no search term
    let query = {};

    // Calculate date ranges based on timePeriod
    let startDate, endDate;
    const now = moment();
    
    if (timePeriod === 'today') {
      startDate = now.startOf('day').toDate();
      endDate = now.endOf('day').toDate();
    } else if (timePeriod === 'week') {
      startDate = now.startOf('week').toDate();
      endDate = now.endOf('week').toDate();
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },  // Case-insensitive search for 'name'
        { email: { $regex: search, $options: 'i' } },  // Case-insensitive search for 'email'
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Main query for users
    const users = await User.find(query)
                            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                            .skip((page - 1) * limit)
                            .limit(limit);

    const totalUsers = await User.countDocuments(query);

    if (!users || users.length === 0) {
      return res.status(404).send({ error: 'user not found' });
    }

    // Calculate today's and this week's user counts
    const todayStart = now.startOf('day').toDate();
    const todayEnd = now.endOf('day').toDate();
    const weekStart = now.startOf('week').toDate();
    const weekEnd = now.endOf('week').toDate();

    const todayUserCount = await User.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    const weekUserCount = await User.countDocuments({
      createdAt: {
        $gte: weekStart,
        $lte: weekEnd
      }
    });

    const response = {
      success: true,
      data: users,
      total: totalUsers,
      page: page,
      totalPages: Math.ceil(totalUsers / limit),
      todayUserCount: todayUserCount,
      weekUserCount: weekUserCount
    };

    res.status(200).send(response);
  }
  catch (error) {
    console.error('Error getting user :', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
  
  
  async function generateUniqueUserID() {
    while (true) {
      var userID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  
      // Check if the generated user ID already exists
      const existingUser = await User.findOne({ user_id: userID });
  
      if (!existingUser) {
        // If the user ID is unique, return it
        return userID;
      }
      // If the user ID already exists, generate a new one in the next iteration
    }
  }
  const refreshToken=async(req,res)=>{
    const phone=req.body.phone
    const existingUser = await User.findOne({ phone: phone });
    const token=req.body.token
    if(token){
      existingUser.token=token
    }
    const savedUser=existingUser.save()
    const userResult = {
      _id: savedUser._id,
      name: savedUser.name,
      phone: savedUser.phone,
      email:savedUser.email,
      avatar:savedUser.avatar,
      user_id:savedUser.user_id,
      withdrwarl_amount:savedUser.withdrwarl_amount,
      refer_id:savedUser.refer_id,
      deviceIds: savedUser.deviceId,
      wallet:savedUser.wallet,
      token:savedUser.token
    };
    res.status(200).send(userResult);
  }
  const updateProfile=async (req,res)=>{
    const phone = req.body.phone;
    const existingUser = await User.findOne({ phone: phone });

    if (existingUser) {
      // User exists, update user details
      existingUser.name = req.body.name || existingUser.name;
      existingUser.email = req.body.email || existingUser.email;
      existingUser.avatar = req.body.avatar || existingUser.avatar;

      const updatedUser = await existingUser.save();

      const userResult = {
        _id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        wallet: updatedUser.wallet,
        avatar: updatedUser.avatar,
      };

      const response = {
        success: true,
        msg: "User details updated successfully",
        data: userResult,
      };

      res.status(200).send(response);
    }
  }
  const updateApp=async(req,res)=>{
    const version=req.body.version;
    const link=req.body.link;
    const updateApp=new App({version:version,link:link})
    updateApp.save();
    res.status(200).send({success:true})

  }
  const getVersion = async (req, res) => {
    try {
      const latestEntry = await App.findOne().sort({ createdAt: -1 }).exec();
      res.status(200).send({ latestEntry });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  };
  const postUpi=async (req, res) => {
    const { upi } = req.body;

    if (!upi) {
        return res.status(400).send('UPI ID is required');
    }

    try {
        let merchant = await Merchant.findOne();

        if (!merchant) {
            merchant = new Merchant({ upi: [] });
        }

        merchant.upi.push(upi);
        await merchant.save();

        res.status(200).send(merchant);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const deleteUpi = async (req, res) => {
  const { upi } = req.body;

  if (!upi) {
      return res.status(400).send('UPI ID is required');
  }

  try {
      let merchant = await Merchant.findOne();

      if (!merchant) {
          return res.status(404).send('Merchant not found');
      }

      const upiIndex = merchant.upi.indexOf(upi);
      if (upiIndex === -1) {
          return res.status(404).send('UPI ID not found');
      }

      merchant.upi.splice(upiIndex, 1);
      await merchant.save();

      res.status(200).send(merchant);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const getUpi=async (req, res) => {
  try {
      const merchant = await Merchant.findOne();

      if (!merchant) {
          return res.status(404).send('Merchant not found');
      }

      res.status(200).send(merchant.upi);
  } catch (error) {
      res.status(500).send(error.message);
  }
}
const getBanner=async (req, res) => {
  try {
      const merchant = await Banner.findOne();

      if (!merchant) {
          return res.status(404).send('Banner not found');
      }

      res.status(200).send(merchant.banner);
  } catch (error) {
      res.status(500).send(error.message);
  }
}
const postBanner=async (req, res) => {
  const { banner } = req.body;

  if (!banner) {
      return res.status(400).send('Banner ID is required');
  }

  try {
      let merchant = await Banner.findOne();

      if (!merchant) {
          merchant = new Banner({ banner: [] });
      }

      merchant.banner.push(banner);
      await merchant.save();

      res.status(200).send(merchant);
  } catch (error) {
      res.status(500).send(error.message);
  }
}
const deleteBanner = async (req, res) => {
const { banner } = req.body;

if (!banner) {
    return res.status(400).send('Banner ID is required');
}

try {
    let merchant = await Banner.findOne();

    if (!merchant) {
        return res.status(404).send('Banner not found');
    }

    const upiIndex = merchant.banner.indexOf(banner);
    if (upiIndex === -1) {
        return res.status(404).send('banner ID not found');
    }

    merchant.banner.splice(upiIndex, 1);
    await merchant.save();

    res.status(200).send(merchant);
} catch (error) {
    res.status(500).send(error.message);
}
}

  
  module.exports={
    userLogin,
    updateProfile,
    getUser,
    updateApp,
    getVersion,
    postUpi,
    getUpi,
    deleteUpi,
    getBanner,
    postBanner,
    deleteBanner,
    refreshToken,
    blockUser,
    unBlockUser
  };
