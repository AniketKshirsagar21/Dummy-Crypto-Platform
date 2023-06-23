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
    .get(verifyToken , async (req, res) => {
        try {
            console.log("history = " ,req.username)
            if (!req.username) {
                res.send({
                    error: 1,
                    msg: "Not Logged In",
                    History: []
                })
            }
            else {
                const userData =
                    await cryptoPortfolio.findOne({ username: req.username });
                if (userData == null) {
                    res.send({
                        error: 1,
                        msg: "Username Not valid",
                        History: [],
                        username : "--",
                        total_profit : 0
                    })
                }
                else if (userData.History == undefined) {
                    res.send({
                        error: 0,
                        msg: "Correct",
                        History: [],
                        username : userData.username,
                        total_profit : userData.total_profit
                    })
                }
                else {
                    res.send({
                        error: 0,
                        msg: "Correct",
                        History : userData.History,
                        username : userData.username,
                        total_profit : userData.total_profit
                    })
                }
            }
        }
        catch (er) {
            console.log("error in register :- ", er);
            res.send({
                error: 1,
                msg: "error",
                History: []
            });
        }
    })





module.exports = router;