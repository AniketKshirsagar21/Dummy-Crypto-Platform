const express = require('express');
const app = express();
const cryptoPortfolio = require("../models/registers")

const nodemailer = require('nodemailer');

const router = require('express').Router();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const verifyToken = require('./auth');
router.route('/')
    .post(verifyToken, async (req, res) => {
        try {
            // console.log("Here in sell coin")

            if (!req.username) {
                console.log("Unable to sell coin = unauthorised")
                res.send({
                    error: 1,
                    msg: "Invalid User"
                })
            }
            else {
                const userData = await cryptoPortfolio.findOne({ username: req.username })
                if (userData == null) {
                    console.log("Unable to sell coin User Not Found")
                    res.send({
                        error: 1,
                        msg: "User Not Found"
                    })
                }
                else {
                    let ch = [];
                    let var_available_balance = userData.available_balance;
                    let new_profit = userData.total_profit;
                    // console.log("old = ", var_available_balance, new_profit)
                    // console.log("After sell Holding := ", userData.Holding.length);

                    let var_invested_amount = 0;
                    let currentDate = new Date();

                    const historyData = {
                        symbol: "String",
                        name: "String",
                        coinImg: "String",
                        date: currentDate,
                        status: "Sell",

                        current_balance: 0,

                        sell_coin_price: 0, // price of bitcoin at time of sell
                        sell_amount: 0, // amount sold
                        sell_coin_invested_amount: 0, // amount sold
                        sell_profit_gain: 0,

                        buy_coin_Price: 0,  // price of bitcoin T TIME OF BUY
                        buy_amaount: 0,    // AMOUNT  bought
                    }
                    let isValid = 1;
                    for (let i = 0; i < userData.Holding.length; i++) {
                        if (userData.Holding[i].coin_symbol !== req.body.coin_symbol) {
                            ch.push(userData.Holding[i]);
                        }
                        else {
                            const targetDate = new Date(userData.Holding[i].date);
                            const diffInMinutes = Math.floor((currentDate - targetDate) / (1000 * 60));
                            console.log("time diff = ", diffInMinutes);
                            if (diffInMinutes <= 10) {
                                ch.push(userData.Holding[i]);
                                console.log("The difference is less than 10 minutes.");
                                isValid = 0;
                            } else {
                                console.log("The difference is greater than 10 minutes.");
                                var_available_balance += req.body.coin_current;
                                new_profit += req.body.coin_current - userData.Holding[i].coin_invested_amount;

                                historyData.symbol = userData.Holding[i].coin_symbol
                                historyData.name = userData.Holding[i].coin_name
                                historyData.sell_amount = req.body.coin_current
                                historyData.sell_coin_invested_amount = userData.Holding[i].coin_invested_amount
                                historyData.sell_profit_gain = parseInt(req.body.coin_current) - parseInt(userData.Holding[i].coin_invested_amount)
                            }
                            // break;
                        }
                    }
                    if (isValid == 0) {
                        res.send({
                            error: 1,
                            msg: "Cannot sell within 10 min of purchase"
                        })
                    }
                    else {

                        historyData.current_balance = var_available_balance;

                        console.log("After sell Holding := ", ch.length);
                        console.log("new = ", var_available_balance, new_profit)
                        const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username },
                            {
                                $set: {
                                    Holding: ch
                                },
                                $push: {
                                    History: historyData
                                },
                                available_balance: var_available_balance,
                                total_profit: new_profit
                            },
                            { returnOriginal: false }
                        )
                        console.log(req.body.coin_symbol, " SOLD , new Holding = ", updating12.Holding.length);
                        res.send({
                            error: 0,
                            msg: "success",
                            Holdings: updating12.Holding,
                            available_balance: var_available_balance,
                            total_profit: new_profit
                        })
                    }
                }
            }
        }
        catch (er) {
            res.send(er);
        }
    });

module.exports = router;

