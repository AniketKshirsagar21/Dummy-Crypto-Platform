const express = require('express');
const app = express();
const cryptoPortfolio = require("../models/registers")

const nodemailer = require('nodemailer');

const router = require('express').Router();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const verifyToken = require('./auth');
console.log(typeof (verifyToken));
router.route('/')

    .post(verifyToken, async (req, res) => {
        /// after clicking buy button on buyDataPage
        /// req.body  coming from BuyDataPage
        // console.log("here buy coin ", req.body)
        console.log("In buy coin ", req.username)
        try {
            if (!req.username) {
                req.username = "userwho"
            }
            const userData = await cryptoPortfolio.findOne({ username: req.username });
            if (userData == undefined || req.token == "expired") {
                console.log("Invalid user buying coin")
                res.send({
                    data: {
                        error: 1,
                        msg: "Invalid user"
                    }
                })

            }
            else {
                console.log(req.body)
                let no_of_coinss = (parseInt(req.body.Amount) / parseInt(req.body.coin_data.currentPrice)).toFixed(9);
                const currentDate = new Date();
                console.log("Current date = ", currentDate);
                let p = userData.available_balance - req.body.Amount;
                const historyData = {
                    symbol: req.body.coin_data.symbol,
                    name: req.body.coin_data.name,
                    buy_coin_Price: req.body.coin_data.currentPrice,
                    buy_amaount: req.body.Amount,
                    coinImg: req.body.coin_data.coinImg,
                    current_balance: p,
                    coinImg: req.body.coin_data.coinImg,
                    status: "Buy",
                    date: currentDate
                    // date
                }
                console.log("History : ", historyData);
                let found = 0;
                for (let i = 0; i < userData.Holding.length; i++) {
                    // console("****** " ,userData.Holding[i].symbol)
                    if (userData.Holding[i].coin_symbol == req.body.coin_data.symbol) {
                        userData.Holding[i].coin_number = parseFloat(userData.Holding[i].coin_number) + parseFloat(no_of_coinss)
                        userData.Holding[i].coin_invested_amount = parseInt(userData.Holding[i].coin_invested_amount) + parseInt(req.body.Amount)
                        userData.Holding[i].coin_buy_price = parseInt(req.body.coin_data.currentPrice)
                        userData.Holding[i].date = currentDate
                        found = 1;
                    }
                }
                if (found == 1) {
                    const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username }, {
                        $set: {
                            Holding: userData.Holding,
                        },
                        $push: {
                            History: historyData
                        },
                        available_balance: p
                    }
                        ,
                        { returnOriginal: false },
                    );
                    console.log("Bought = ", req.body.coin_data.symbol, updating12.Holding.length)
                    console.log("Updated ")
                }
                else {
                    console.log("Inserted ")
                    const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username }, {
                        $push: {
                            Holding: {
                                coin_no: 78,  //change
                                coin_symbol: req.body.coin_data.symbol,
                                coin_name: req.body.coin_data.name,
                                coin_buy_price: req.body.coin_data.currentPrice,
                                coin_number: no_of_coinss,
                                coin_current: 404,  //change
                                coin_invested_amount: req.body.Amount,
                                coin_profit: 21,       //change     
                                date: currentDate
                            },
                            History: historyData
                        },
                        available_balance: p
                    },
                        { returnOriginal: false },
                    );
                    console.log("Bought = ", req.body.coin_data.symbol, updating12.Holding.length)
                }
                console.log("succedd")
                res.send({
                    data: {
                        error: 0,
                        msg: " success"
                    }
                })

            }
        }
        catch (err) {
            res.send("err");
        }
    });


module.exports = router;
