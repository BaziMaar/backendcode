// walletService.js
const User = require('../models/userModel');
const Ref=require(`../models/referModel`);

const Wallet=require('../models/walletModel');
const Utr=require('../models/UtrModel');
const addFunds = async (phone, amount, utr) => {
  try {
    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the UTR is already used
    if (utr) {
      const existingUtr = await Utr.findOne({ utr });
      if (existingUtr) {
        throw new Error('UTR already used');
      }
    }

    // If UTR is empty or not provided, update wallet immediately
    if (!utr) {
      user.wallet += amount;
      const referredUser = await User.findOne({ refer_id: user.user_id });
      if (referredUser) {
        const referralBonus = 0.02 * amount;
        referredUser.referred_wallet += referralBonus;
        await referredUser.save();

        // Handle referral transaction in the `Ref` collection
        let ref = await Ref.findOne({ phone: referredUser.phone });
        const referralTransaction = {
          user_id: user.user_id,
          avatar: user.avatar || 1,
          amount: referralBonus,
          deposit_amount: amount,
          withdraw_amount: 0
        };

        if (ref) {
          ref.referred.push(referralTransaction);
        } else {
          ref = new Ref({
            phone: referredUser.phone,
            referred: [referralTransaction]
          });
        }

        await ref.save();
      }
    }

    await user.save();

    // Find or create a wallet for the user
    let wallet = await Wallet.findOne({ phone });

    if (!wallet) {
      wallet = new Wallet({
        phone,
        walletTrans: []
      });
    }

    // Add transaction
    if (utr) {
      wallet.walletTrans.push({ time: new Date(), amount, status: 0, utr });

      // Store UTR to prevent duplicate use
      const newUtr = new Utr({
        utr,
        phone
      });
      await newUtr.save();
    } else {
      wallet.walletTrans.push({ time: new Date(), amount, status: 1 });
    }

    console.log(`>>>>>>>`, { time: new Date(), amount, status: 0, utr });

    await wallet.save();

    return user.wallet;

  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
};

const addTournamentFunds = async (phone, amount,status) => {
  try {
    // Find user by phone
    const user = await User.findOne({ phone });

    // If user not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }
      user.wallet += amount;
      const referredUser = await User.findOne({ refer_id: user.user_id });
      if (referredUser) {
        const referralBonus = 0.02 * amount;
        referredUser.referred_wallet += referralBonus;
        await referredUser.save();
        let ref = await Ref.findOne({ phone: referredUser.phone });
        const referralTransaction = {
          user_id: user.user_id,
          avatar: user.avatar || 1,
          amount: referralBonus,
          deposit_amount: amount,
          withdraw_amount: 0
        };

        if (ref) {
          ref.referred.push(referralTransaction);
        } else {
          ref = new Ref({
            phone: referredUser.phone,
            referred: [referralTransaction]
          });
        }

        await ref.save();
      }

    // Handle referral bonus logic if there is a referred user
    

    // Save the updated user
    await user.save();

    // Find or create a wallet for the user
    let wallet = await Wallet.findOne({ phone });

    if (!wallet) {
      wallet = new Wallet({
        phone,
        walletTrans: []
      });
    }

    // Add the transactions based on `utr`

      wallet.walletTrans.push({ time: new Date(), amount, status: 5 });
    // Add the final confirmed transaction
    

    // Save the updated wallet
    await wallet.save();

    // Return the updated wallet balance
    return user.wallet;

  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
};

  

const deductFunds = async (phone, amount,paymentId,bankId=0,ifscCode=0) => {
  try {
    const user = await User.findOne({ phone: phone });
    let wallet = await Wallet.findOne({ phone: phone });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.withdrwarl_amount <= amount || user.wallet <= amount) {
      throw new Error('Insufficient funds');
    }
    user.wallet -= amount;
    user.withdrwarl_amount-=amount
    await user.save();
    if (!wallet) {
      wallet = new Wallet({
        phone,
        walletTrans: []
      });
    }
    wallet.walletTrans.push({ time: new Date(), amount: -amount, status: 0,paymentId,bankId,ifscCode });
    await wallet.save();
    return user.wallet;
  } catch (error) {
    console.error('Error deducting funds:', error);
    throw error;
  }
};
module.exports = {
  addFunds,
  addTournamentFunds,
  deductFunds,
};
