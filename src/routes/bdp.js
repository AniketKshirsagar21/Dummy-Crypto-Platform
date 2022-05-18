const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cryptoPortfolio = require("../models/registers")
const contetsCollection = require("../models/contestsModel")
const fetch = require('node-fetch');
const e = require('express');
const async = require('hbs/lib/async');
const { redirect } = require('express/lib/response');


const router = require('express').Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const temppathviews = path.join(__dirname, "../../templates/views");
const temppathpartials = path.join(__dirname, "../../templates/partials");

var r3 = 0;
var apidatas;
var cval1;
var cval2;
var cprof1 = 0;
var cprof2 = 0;
var r2 = 0;
var rr2 = 0;
var cname;
var r3 = 0;

var ccval1;
var ccval2;
var ccprof1 = 0;
var ccprof2 = 0;


router.route('/')
.post( async (req, res) => {
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        const current_no_of_holdings = cnoh.no_of_holdings;
        if (req.session.cuser == "userwho") { res.redirect("/myloginpage"); }

        else {
            const index = req.body.sellCoin
            res.render("BuyDataPage", {
                header_Username: req.session.cuser,
                buyCoinName: apidatas[index].name,
                buyCoinSymboll: apidatas[index].symbol,
                BuyPrice: apidatas[index].currentPrice,
                total_profit: r3,
                coinImg2: apidatas[index].coinImg,
                avbal: r2,
                avbal2: rr2
            });
            // res.send("hi");
        }
    }
    catch (err) {
        res.send(err);
    }
})







module.exports = router;