const LuckyTransaction = require("../models/ColorTransictionsModel.js");
const User = require("../models/userModel.js");  // Import the User model
const Ref=require('../models/referModel')
const Result=require('../models/resultModel.js')
const ColorEntryTransaction=require('../models/ColorTransactionsEntryModel.js')
const AutoModel=require('../models/AutoModel')
let firstBet = 0;
let secondBet = 0;
let thirdBet = 0;
let smallSizeBet=0;
let bigSizeBet=0;
let zeroNumberBet=0;
let oneNumberBet=0;
let twoNumberBet=0;
let threeNumberBet=0;
let fourNumberBet=0;
let fiveNumberBet=0;
let sixNumberBet=0;
let sevenNumberBet=0;
let eightNumberBet=0;
let nineNumberBet=0;
let allBet=[0,0,0,0,0,0,0,0,0,0];
let winner = null;
let count =0;
let globalNumber=666777;
let dtAuto;
const fetchAutoData = async () => {
  try {
    const latestEntry = await AutoModel.findOne()
    dtAuto=latestEntry.auto_color;
  } catch (error) {
    console.error('Error:', error.message);
  }
};
fetchAutoData()
function getWinner(arrOfAmounts) {
  const random = Math.floor(Math.random() * 10);
  if (random === 0 || random === 5) {
    const ans=getIndexFromZero(arrOfAmounts);
    return ans
  } else {
    const ans=getIndexFromNonZero(arrOfAmounts);
    return ans
  }
}
let lowCount = 0;
let highCount = 0;

function getRandomNumber() {
  let number;
  if (lowCount < 3 && highCount < 7) {
    // Generate a number based on remaining counts
    const isLowNumber = Math.random() < 0.3; // 3 out of 10 should be low numbers
    if (isLowNumber && lowCount < 3) {
      number = Math.floor(Math.random() * 3) + 1; // Generate a number between 1 and 3
      lowCount++;
    } else if (highCount < 7) {
      number = Math.floor(Math.random() * 7) + 4; // Generate a number between 4 and 10
      highCount++;
    } else {
      number = Math.floor(Math.random() * 3) + 1; // If highCount is full, generate low number
      lowCount++;
    }
  } else if (lowCount < 3) {
    number = Math.floor(Math.random() * 3) + 1; // Generate a number between 1 and 3
    lowCount++;
  } else {
    number = Math.floor(Math.random() * 7) + 4; // Generate a number between 4 and 10
    highCount++;
  }

  return number;
}

function getIndexFromNonZero(arr) {
  let minNonZeroValue = Infinity;
  let minNonZeroIdx = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0 && arr[i] < minNonZeroValue&&(i!==0&&i!==5)) {
      minNonZeroIdx = i;
      minNonZeroValue = arr[i];
    }
  }

  const minNonZeroValuesIdx = [];
  const otherIdx = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === minNonZeroValue&&(i!==0&&i!==5)) {
      minNonZeroValuesIdx.push(i);
    } else if((i!==0 && i!==5)&&arr[i]===0) {
      otherIdx.push(i);
    }
  }

  const isItTheOnlyPlacedBet = checkOnlyPlacedBet(arr, minNonZeroIdx);
  if (isItTheOnlyPlacedBet) {
    if (otherIdx.length === 0) {
      return Math.floor(Math.random() * 10);
    } 
    else {
      const randomIndex = otherIdx[Math.floor(Math.random() * otherIdx.length)];
      return randomIndex
    }
  } 
  else {
    const randomIndex = minNonZeroValuesIdx[Math.floor(Math.random() * minNonZeroValuesIdx.length)];
    return randomIndex
  }
}

function checkOnlyPlacedBet(arr, i) {
  for (let j = 0; j < arr.length; j++) {
    if (arr[j] !== 0 && arr[j] !== arr[i]&&(j!==0&&j!==5)) {
      return false; 
    }
  }
  return true;
}

function getIndexFromZero(arr) {
  const isZeroGood = checkIsIdxGoodToWin(arr, 0);
  const isFiveGood = checkIsIdxGoodToWin(arr, 5);

  if (isZeroGood && isFiveGood) {
    const result = Math.random() < 0.5 ? 0 : 5;
    return result
  } else if (isZeroGood && !isFiveGood) {
    return 0
  } else if (!isZeroGood && isFiveGood) {
    return 5
  } else {
    const ans = getIndexFromNonZero(arr);
    return ans
  }
}

function checkIsIdxGoodToWin(arr, i) {
  if (arr[i] === 0) {
    return true;
  } else {
    let min = arr[i];
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] > 0 && arr[j] <= arr[i]) {
        min = arr[j];
      }
    }
    return arr[i] === min;
  }
}

function findSpecialIndex(arr) {
  let nonZeroCount = 0; // Count of non-zero elements
  let zeroIndices = []; // Indices of zero elements
  let nonZeroIndices = []; // Indices of non-zero elements

  // First pass to count non-zero elements and collect zero and non-zero element indices
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      nonZeroCount++;
      nonZeroIndices.push(i);
    } else {
      zeroIndices.push(i);
    }
  }

  // If there is exactly one non-zero element, return a random index among the zero elements
  if (nonZeroCount === 1) {
    return zeroIndices[Math.floor(Math.random() * zeroIndices.length)];
  } 

  // If there are multiple non-zero elements, find the index of the smallest non-zero element
  let minIndex = nonZeroIndices[0];
  for (let i = 1; i < nonZeroIndices.length; i++) {
    if (arr[nonZeroIndices[i]] < arr[minIndex]) {
      minIndex = nonZeroIndices[i];
    }
  }

  return minIndex;
}
function findSpecialIndexOutZero(arr) {
  let nonZeroCount = 0;
  let zeroIndices = [];
  let nonZeroIndices = [];
  for (let i = 0; i < arr.length; i++) {
    if(i!==0 || i!==5){
      if (arr[i] !== 0) {
        nonZeroCount++;
        nonZeroIndices.push(i);
      } else {
        zeroIndices.push(i);
      }
    }
  }
  if (nonZeroCount === 1) {
    return zeroIndices[Math.floor(Math.random() * zeroIndices.length)];
  }
  let minIndex = nonZeroIndices[0];
  for (let i = 1; i < nonZeroIndices.length; i++) {
    if (arr[nonZeroIndices[i]] < arr[minIndex]) {
      minIndex = nonZeroIndices[i];
    }
  }

  return minIndex;
}


const setGlobalNumber = async () => {
  try {
    const lastEntry = await Result.findOne().sort({ createdAt: -1 });
    if (lastEntry) {
      globalNumber = lastEntry.globalNumber;
    }
  } catch (error) {
    console.error(error);
  }
};

const initializeGlobalNumber = async () => {
  await setGlobalNumber();
};

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}
const probabilitied = [0.1, 0.1, 0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1]; 

function generateRandomWithProbability(probabilities) {
  const rand = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      
      if (rand < cumulativeProbability) {
          return i;
      }
  }
}
function getRandomIndexExcluding(excludeIndex) {
  let randomIndex;
  do {
      randomIndex = Math.floor(Math.random() * 10);
  } while (randomIndex === excludeIndex);
  return randomIndex;
}
const generateAndBroadcastNumber = async(io) => {
  let lastNumbers=[0,0,0,0,0,0,0,0,0,0,0,0]
  let targetNumber = 0;
  let currentNumber = 0;
  let timeRemaining = 60;
  let intervalId = null;
  await initializeGlobalNumber()
  
  const generateAndBroadcast = () => {
    targetNumber = 0;
    currentNumber = 0;
    timeRemaining = 60;
    const currentDate=getCurrentDate()
    let finalNumber=number=String(currentDate)+String(globalNumber)
    let a=0,b=0,c=0;
    winner = '';
    let spin=false
    clearInterval(intervalId);
    intervalId = setInterval(async() => {
      if (timeRemaining > 5) {
        timeRemaining--;
        io.emit('colorPlaced',{voilet:firstBet,green:secondBet,red:thirdBet,zero:allBet[0],one:allBet[1],two:allBet[2],three:allBet[3],four:allBet[4],five:allBet[5],six:allBet[6],seven:allBet[7],eight:allBet[8],nine:allBet[9],small:smallSizeBet,big:bigSizeBet})
        io.emit('colorBet', { number: currentNumber, time: timeRemaining,spin:spin, result: winner,globalNumbers:finalNumber,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11]}); 
      }
      else if (timeRemaining>=0&&timeRemaining<5) {
        timeRemaining--;
        io.emit('colorPlaced',{voilet:firstBet,green:secondBet,red:thirdBet,zero:allBet[0],one:allBet[1],two:allBet[2],three:allBet[3],four:allBet[4],five:allBet[5],six:allBet[6],seven:allBet[7],eight:allBet[8],nine:allBet[9],small:smallSizeBet,big:bigSizeBet})
        io.emit('colorBet', { number: currentNumber, time: timeRemaining,spin:spin, result: winner,globalNumbers:finalNumber,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11]});       }
      else if(timeRemaining===5){
        globalNumber++;
        fetchAutoData();
        let randomNumber=Math.floor(Math.random()*5)+1
        timeRemaining--;
        io.emit('colorPlaced',{voilet:firstBet,green:secondBet,red:thirdBet,zero:allBet[0],one:allBet[1],two:allBet[2],three:allBet[3],four:allBet[4],five:allBet[5],six:allBet[6],seven:allBet[7],eight:allBet[8],nine:allBet[9],small:smallSizeBet,big:bigSizeBet})
        io.emit('colorBet', { number: currentNumber, time: timeRemaining,spin:spin, result: winner,globalNumbers:finalNumber,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11]});    
        spin=true
        
        if(dtAuto==1||(randomNumber<=2&&dtAuto==2)){
          winner=Math.floor(Math.random()*10)
          count=0
        }
        else if((firstBet===0&&secondBet===0&&thirdBet===0&&smallSizeBet===0&&bigSizeBet===0&&zeroNumberBet===0&&oneNumberBet===0&&twoNumberBet===0&&threeNumberBet===0&&fourNumberBet===0&&fiveNumberBet===0&&sixNumberBet===0&&sevenNumberBet===0&&eightNumberBet===0&&nineNumberBet===0)){
          winner=generateRandomWithProbability(probabilitied);
          count=0
        }
        else if(count===1){
          
          if(allBet[0]!==0&&allBet[2]!==0&&allBet[4]!=0&&allBet[6]!==0&&allBet[8]!==0){
            const y=((Math.floor(Math.random()*5))*2)+1
            winner=y
          }
          else if(allBet[1]!==0&&allBet[3]!==0&&allBet[5]!=0&&allBet[7]!=0&&allBet[9]!=0){
            const y=(Math.floor(Math.random()*5))*2
            winner=y
          }
          else if(allBet[0]!==0&&allBet[5]!==0){
            const y=Math.random()<0.5?2:7
            winner=y
          }
          else if(allBet[0]!==0&&allBet[1]!==0&&allBet[2]!==0&&allBet[3]!==0&&allBet[4]!==0){
            const y=Math.floor(Math.random()*5)+5
            winner=y
          }
          else if(allBet[5]!==0&&allBet[6]!==0&&allBet[7]!==0&&allBet[8]!=0&&allBet[9]!==0){
            const y=Math.floor(Math.random()*5)
            winner=y
          }
          else{
            for(let i=0;i<10;i++){
              if(allBet[i]!==0){
                let randomIndex = getRandomIndexExcluding(i);
                winner=randomIndex
            }
          }
        }
        count=0
    }
        else{
          winner=getWinner(allBet)
          count=0

        }
        lastNumbers.push(String(finalNumber)+String(winner))
        await storeCurrentData()
        if(lastNumbers.length>12){
          lastNumbers.shift();
        }
      }  
      else {
        firstBet = 0;
        secondBet = 0;
        thirdBet = 0;
        zeroNumberBet=0;
        oneNumberBet=0;
        twoNumberBet=0;
        threeNumberBet=0;
        fourNumberBet=0;
        fiveNumberBet=0
        sixNumberBet=0;
        sevenNumberBet=0;
        eightNumberBet=0;
        nineNumberBet=0;
        smallSizeBet=0;
        bigSizeBet=0;
        allBet=[0,0,0,0,0,0,0,0,0,0];
        clearInterval(intervalId);
        generateAndBroadcast();
        
       
      }
    }, 1000); // Reduced the interval to 1000ms (1 second)
  };
  // Call generateAndBroadcast to start the initial round
  generateAndBroadcast();
};
const storeCurrentData=async()=>{
  try{
    if(globalNumber===0){
      const resultEntry=new Result({
        globalNumber:globalNumber,
        result:winner,
        color:[0,1],
        size:0
      })
      await resultEntry.save()
    }
    else if(globalNumber===1||globalNumber===3||globalNumber===7||globalNumber===9){
      const resultEntry=new Result({
        globalNumber:globalNumber,
        result:winner,
        color:[1],
        size:globalNumber<5?0:1
      })
      await resultEntry.save()
    }
    else if(globalNumber===2||globalNumber===4||globalNumber===6||globalNumber===8){
      const resultEntry=new Result({
        globalNumber:globalNumber,
        result:winner,
        color:[2],
        size:globalNumber<5?0:1
      })
      await resultEntry.save()
    }
    else{
      const resultEntry=new Result({
        globalNumber:globalNumber,
        result:winner,
        color:[0,2],
        size:0
      })
      await resultEntry.save()
    }
  }
  catch(error){
  }
}
const sendColorMoney = async (io, phone, color, number, size, amount,globalNumber) => {
  try {
    count++;
    let userTransaction = await LuckyTransaction.findOne({ phone });
    const sender = await User.findOne({ phone });
    if (!sender) {
      throw new Error('Sender not found');
    }
    
    if (!userTransaction) {
      userTransaction = new LuckyTransaction({
        phone,
        transactions: [],
      });
    }

    
    if (sender.wallet < amount) {
      io.emit('walletColorUpdated', { phone: phone, error: 'Insufficient Funds' });
      return { success: false, message: 'Insufficient Funds' };
    }

    if (color === 0) {

      allBet[0]+=4.5*amount
      allBet[5]+=4.5*amount
      firstBet += 2 * amount; 
    } 
    else if (color === 1) {
      allBet[1]+=1.9*amount
      allBet[3]+=1.9*amount
      allBet[5]+=1.5*amount
      allBet[7]+=1.9*amount
      allBet[9]+=1.9*amount
      secondBet += 2 * amount; // Adjusted for the green
    } 
    else if (color === 2) {
      allBet[0]+=1.5*amount
      allBet[2]+=1.9*amount
      allBet[4]+=1.9*amount
      allBet[6]+=1.9*amount
      allBet[8]+=1.9*amount
      thirdBet += 2 * amount; // Adjusted for the red
    } 
    else if (size === 0) {
      allBet[0]+=1.9*amount
      allBet[1]+=1.9*amount
      allBet[2]+=1.9*amount
      allBet[3]+=1.9*amount
      allBet[4]+=1.9*amount
      smallSizeBet += 2 * amount;
    } 
    else if (size === 1) {
      allBet[5]+=1.9*amount
      allBet[6]+=1.9*amount
      allBet[7]+=1.9*amount
      allBet[8]+=1.9*amount
      allBet[9]+=1.9*amount
      bigSizeBet += 2 * amount;
    } 
    else if (number >= 0 && number <= 9) {
      allBet[number]+=9*amount
      switch (number) {
        case 0: zeroNumberBet += 9 * amount; break;
        case 1: oneNumberBet += 9 * amount; break;
        case 2: twoNumberBet += 9 * amount; break;
        case 3: threeNumberBet += 9 * amount; break;
        case 4: fourNumberBet += 9 * amount; break;
        case 5: fiveNumberBet += 9 * amount; break;
        case 6: sixNumberBet += 9 * amount; break;
        case 7: sevenNumberBet += 9 * amount; break;
        case 8: eightNumberBet += 9 * amount; break;
        case 9: nineNumberBet += 9 * amount; break;
      }
    } 
    else {
      return { success: false, message: 'Invalid color, size, or number' };
    }


    userTransaction.transactions.push({ color,number,size, amount: -amount,globalNumber:globalNumber,orignalNumber:winner,transactionUpdated:0});
    await userTransaction.save();
    const colorEntry = new ColorEntryTransaction({
      phone,
      color,
      number,
      size,
      amount: -amount,
      globalNumber,
      orignalNumber: winner,
      transactionUpdated: 0
    });
    await colorEntry.save();

    sender.withdrwarl_amount+=amount;
    sender.wallet -= amount;
    await sender.save();
    io.emit('walletColorUpdated', { phone, newBalance: sender.wallet, color, size, number,globalNumber });

    return { success: true, message: 'Money sent successfully', newBalance: sender.wallet, color, size, number,globalNumber };
    
  } catch (error) {
    io.emit('walletColorUpdated', { error: error.message });
    throw new Error('Failed to send money. Please try again.');
  }
};

  
const receiveMoney = async (io, phone, color, number, size, amount, globalNumber) => {
  let winning = 0;

  try {
    const [sender, userTransaction] = await Promise.all([
      User.findOne({ phone }),
      LuckyTransaction.findOne({ phone, 'transactions.globalNumber': globalNumber })
    ]);
    if (!sender) {
      throw new Error('Sender not found');
    }
    if (color === 0 && (winner === 0 || winner === 5)) {
      winning = amount * 4.5;
    } else if (color === 1 && winner % 2 === 1 && winner !== 5) {
      winning = amount * 1.9;
    } else if (color === 2 && winner % 2 === 0 && winner !== 0) {
      winning = amount * 1.9;
    } else if (color === 2 && winner === 0) {
      winning = amount * 1.5;
    } else if (color === 1 && winner === 5) {
      winning = amount * 1.5;
    } else if (size === 0 && winner < 5 ) {
      winning = amount * 1.9;
    } else if (size === 1 && winner >= 5) {
      winning = amount * 1.9;
    } else if (number === winner ) {
      winning = amount * 9;
    } else {
      winning = amount * 0;
    }

    // Update transaction if it exists
    let transactionUpdated = 0;
    if (userTransaction) {
      const transaction = userTransaction.transactions.find(t =>String(t.globalNumber).trim() === String(globalNumber).trim() && t.transactionUpdated==0);
      if (transaction) {
        transaction.orignalNumber = winner;
        transaction.amount = winning === 0 ? transaction.amount : winning; // Update the amount to the winning amount
        transaction.transactionUpdated = 1;
        transactionUpdated = true;
      }
    }
    if (transactionUpdated) {
      await ColorEntryTransaction.updateOne(
        { phone, globalNumber },
        {
          $set: {
            orignalNumber: winner,
            amount: winning === 0 ? -amount : winning,
            transactionUpdated: 1
          }
        }
      );
    }

    // Handle referral bonus if the referred user exists
    const referredUser = await User.findOne({ refer_id: { $in: sender.user_id } });
    if (referredUser) {
      let referralBonus=0;
      if(winning>=0){
        referralBonus = 0.005 * winning;
      }
      referredUser.referred_wallet += referralBonus;
      let ref = await Ref.findOne({ phone: referredUser.phone });

      if (ref) {
        ref.referred.push({
          user_id: sender.user_id,
          avatar: sender.avatar,
          amount: referralBonus
        });
      } else {
        ref = new Ref({
          phone: referredUser.phone,
          referred: [{
            user_id: sender.user_id,
            avatar: sender.avatar,
            amount: referralBonus
          }]
        });
      }

      await Promise.all([referredUser.save(), ref.save()]);
    }

    // Update sender's wallet
    
    sender.wallet += winning;
    sender.withdrwarl_amount += winning;
    if(winning>0){
      sender.withdrwarl_amount-=amount;
    }
    
    await sender.save();

    // Save user transaction if it was updated
    if (transactionUpdated) {
      await userTransaction.save();
    }

    // Emit socket event with updated wallet info
    io.emit('walletColorUpdated', {
      phone,
      newBalance: sender.wallet,
      color,
      size,
      number,
      amount: winning === 0 ? -amount : winning,
      transactionUpdated
    });

    return { newBalance: sender.wallet, amount: winning === 0 ? -amount : winning };
  } catch (error) {
    throw new Error('Server responded falsely');
  }
};
const receiveForMoney = async (io, phone, colors, numbers, sizes, amounts, globalNumber) => {
  let finalResBalance = 0;
  let finalResWinning = 0;
  // Handle colors
  for (let i = 0; i < amounts.length; i++) {
      const resultColor = await receiveMoney(io, phone, colors[i], numbers[i],sizes[i], amounts[i], globalNumber); 
      finalResBalance=resultColor.newBalance
      finalResWinning+=resultColor.amount   
  }


  return { newBalance:finalResBalance,amount:finalResWinning};
};

  
  const getResultTransactions = async (req, res) => {
    try {
      const resultTransactions = await Result.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(10); // Limit to the last 10 entries
  
      if (!resultTransactions || resultTransactions.length === 0) {
        return res.status(404).json({ error: 'No results found' });
      }
  
      const formattedTransactions = resultTransactions.map(transaction => {
        const date = new Date(transaction.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        return {
          ...transaction._doc,
          globalNumber: `${formattedDate}${transaction.globalNumber}`
        };
      });
  
      res.status(200).json({ transactions: formattedTransactions });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const getColorTransactions = async (req, res) => {
    const { phone } = req.query;
    const currentDate = getCurrentDate();
    const finalNumber = String(currentDate) + String(globalNumber);

    try {
        const userTransactions = await LuckyTransaction.findOne({ phone });

        if (!userTransactions) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transactions = userTransactions.transactions;
        if (transactions.length === 0) {
            return res.status(200).json({ transactions: [] });
        }

        const lastTransaction = transactions[transactions.length - 1];

        // Debugging log for lastTransaction.globalNumber
        console.log('>>> lastTransaction.globalNumber:', lastTransaction.globalNumber);
        console.log(`>>> isCheck (globalNumber === finalNumber):`, lastTransaction.globalNumber === finalNumber);

        // Ensure both values are strings before comparing
        const lastGlobalNumberStr = String(lastTransaction.globalNumber);

        console.log('>>> Comparing:', finalNumber, 'with', lastGlobalNumberStr);
        const isCheck = finalNumber !== lastGlobalNumberStr;
        console.log('>>> isCheck:', isCheck);

        if (isCheck) {
            // Update all transactions except the last one
            for (let i = 0; i < transactions.length ; i++) {
                transactions[i].transactionUpdated = 1;
            }
            await userTransactions.save(); // Save the updated document
        }

        res.status(200).json({ transactions });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getColorEntry=async (req, res) => {
  try {
      const entries = await ColorEntryTransaction.find();
      res.json(entries);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
}


  
  module.exports = {
    generateAndBroadcastNumber,
    sendColorMoney,
    receiveMoney,
    getResultTransactions,
    initializeGlobalNumber,
    getColorTransactions,
    receiveForMoney,
    getColorEntry
  };
  