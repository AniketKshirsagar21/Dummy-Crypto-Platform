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
                    let var_available_balance = userData.C_available_balance;
                    let new_profit = userData.C_total_profit;
                    // console.log("old = ", var_available_balance, new_profit)
                    // console.log("After sell contestHolding := ", userData.contestHolding.length);

                    let var_invested_amount = 0;
                    let currentDate = new Date();

                    let isValid = 1;
                    for (let i = 0; i < userData.contestHolding.length; i++) {
                        if (userData.contestHolding[i].coin_symbol !== req.body.coin_symbol) {
                            ch.push(userData.contestHolding[i]);
                        }
                        else {
                            const targetDate = new Date(userData.contestHolding[i].date);
                            const diffInMinutes = Math.floor((currentDate - targetDate) / (1000 * 60));
                            console.log("time diff = ", diffInMinutes);
                            if (diffInMinutes <= 10) {
                                ch.push(userData.contestHolding[i]);
                                console.log("The difference is less than 10 minutes.");
                                isValid = 0;
                            } else {
                                console.log("The difference is greater than 10 minutes.");
                                var_available_balance += req.body.coin_current;
                                new_profit += req.body.coin_current - userData.contestHolding[i].coin_invested_amount;

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

                        console.log("After sell contestHolding := ", ch.length);
                        console.log("new = ", var_available_balance, new_profit)
                        const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username },
                            {
                                $set: {
                                    contestHolding: ch
                                },

                                C_available_balance: var_available_balance,
                                C_total_profit: new_profit
                            },
                            { returnOriginal: false }
                        )
                        console.log(req.body.coin_symbol, " SOLD , new contestHolding = ", updating12.contestHolding.length);
                        res.send({
                            error: 0,
                            msg: "success",
                            contestHolding: updating12.contestHolding,
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

