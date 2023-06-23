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
        try {
            if (req.token == "expired" || req.username == undefined) {
                res.send({
                    data: {
                        error: 1,
                        msg: "Invalid User",
                        description : "Please Login to buy the coin",
                    }
                })
            }
            else {

                // console.log("in buy data ")
                const userData = await cryptoPortfolio.findOne({ username: req.username });
                if (userData == null) {
                    res.send({
                        data: {
                            error: 1,
                            msg: "User Not Found",
                            description : "Please Login to buy the coin",
                        }
                    })
                }
                else {
                    const current_no_of_holdings = userData.Holding.length;
                    if (current_no_of_holdings >= 16) {
                        res.send({
                            data: {
                                error: 1,
                                msg: "Sell Some coins and try again",
                                description : "You Cannot hold more than 5 coins at a time",
                            }
                        })
                    }
                    else {
                        console.log("res = ", req.body);
                        let index = apidatas.find(item => {
                            return item.symbol == req.body.coin_name
                        })
                        if (index == undefined) {
                            res.send({
                                data: {
                                    error: 1,
                                    msg: "Coin Not Available",
                                    description : "The coin you trying to buy is not available currently.",
                                }
                            })
                        }
                        else {
                            console.log("index = ", index)
                            res.send({
                                data: {
                                    error: 0,
                                    msg: "OK",
                                    description : "You can buy this coin",
                                    coin_data: index,
                                    available_balance: userData.available_balance
                                }
                            })
                        }
                    }
                }
            }
        }
        catch (err) {
            res.send(err);
        }
    });

module.exports = router;
