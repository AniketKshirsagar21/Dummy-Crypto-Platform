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
                let p = userData.C_available_balance - req.body.Amount;
                let found = 0;
                for (let i = 0; i < userData.contestHolding.length; i++) {
                    // console("****** " ,userData.contestHolding[i].symbol)
                    if (userData.contestHolding[i].coin_symbol == req.body.coin_data.symbol) {
                        userData.contestHolding[i].coin_number = parseFloat(userData.contestHolding[i].coin_number) + parseFloat(no_of_coinss)
                        userData.contestHolding[i].coin_invested_amount = parseInt(userData.contestHolding[i].coin_invested_amount) + parseInt(req.body.Amount)
                        userData.contestHolding[i].coin_buy_price = parseInt(req.body.coin_data.currentPrice)
                        userData.contestHolding[i].date = currentDate
                        found = 1;
                    }
                }
                if (found == 1) {
                    const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username }, {
                        $set: {
                            contestHolding: userData.contestHolding,
                        },
                        
                        C_available_balance: p
                    }
                        ,
                        { returnOriginal: false },
                    );
                    console.log("Bought = ", req.body.coin_data.symbol, updating12.contestHolding.length)
                    console.log("Updated ")
                }
                else {
                    console.log("Inserted ")
                    const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.username }, {
                        $push: {
                            contestHolding: {
                                coin_symbol: req.body.coin_data.symbol,
                                coin_name: req.body.coin_data.name,
                                coin_buy_price: req.body.coin_data.currentPrice,
                                coin_number: no_of_coinss,
                                coin_invested_amount: req.body.Amount,
                                date: currentDate
                            }
                        },
                        C_available_balance: p
                    },
                        { returnOriginal: false },
                    );
                    console.log("Bought = ", req.body.coin_data.symbol, updating12.contestHolding.length)
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
