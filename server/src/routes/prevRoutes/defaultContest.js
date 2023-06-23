const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cryptoPortfolio = require("../../models/registers")
const contetsCollection = require("../../models/contestsModel")
const fetch = require('node-fetch');
const e = require('express');
const async = require('hbs/lib/async');
const { redirect } = require('express/lib/response');


const router = require('express').Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const temppathviews = path.join(__dirname, "../../templates/views");
const temppathpartials = path.join(__dirname, "../../templates/partials");



router.route('/')
.get( async (req, res) => {
    try {
        const cnoh4 = await cryptoPortfolio.find().sort({ "C_total_profit": -1 });
        const updating14 = await cryptoPortfolio.findOne({ username: req.session.cuser });

        let cu = req.session.cuser
        if (cu == "userwho") {
            cu = "--";

            res.render("defaultContest", {
                userlist: cnoh4,
                cls: "user",
                C_myPortfolio_total_invested: 0,
                C_myPortfolio_total_Current: 0,
                C_myPortfolio_total_profit: 0,
                total_profit: 0.00,
                available_balance: 0.00,
                current_name: "--",
                current_username: "--",
                header_Username: cu,
            });
        }

        else {


            res.render("defaultContest", {
                userlist: cnoh4,
                cls: updating14.contestHolding,
                C_myPortfolio_total_invested: (updating14.C_total_invested_value).toFixed(2),
                C_myPortfolio_total_Current: (updating14.C_total_current_value).toFixed(2),
                C_myPortfolio_total_profit: (updating14.C_portfolio_total_profit).toFixed(2),
                total_profit: (updating14.C_total_profit).toFixed(2),
                available_balance: (updating14.C_available_balance).toFixed(2),
                current_name: updating14.fname + " " + updating14.lname,
                current_username: updating14.username,
                header_Username: cu,
            });
        }
    }
    catch (err) {
        res.send(err);
    }
})

router.route('/C_buy_coin')
.post(async (req, res) => {
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        // gfg
        if (cnoh.contestHolding.length >= 5) {
            res.render('BuyDataPage', {
                suc1: "You have reached the maximum limit of holding coins at a time in your portfolio  !",
                suc2: "Please Sell some coins and try again"
            });
        }
        else {
            // console.log(req.body.buyAmm)
            var current_no_of_holdings = cnoh.C_no_of_holdings;
            current_no_of_holdings = current_no_of_holdings + 1;

            if (cnoh.C_available_balance < req.body.buyAmm) {
                res.send("Not enough ammount to buy");
            }
            else {
                var rr1 = cnoh.C_available_balance;
                rr1 = rr1 - req.body.buyAmm;
                let no_of_coinss = (req.body.buyAmm / req.body.bp).toFixed(9);
                const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                    $push: {
                        contestHolding: {
                            coin_no: 78,  //change
                            coin_symbol: req.body.bcs,
                            coin_name: req.body.bcn,
                            coin_buy_price: req.body.bp,
                            coin_number: no_of_coinss,
                            coin_current: 404,  //change
                            coin_invested_amount: req.body.buyAmm,
                            coin_profit: 21,       //change                  
                        }
                    },
                    C_available_balance: cnoh.C_available_balance - req.body.buyAmm
                });

                const cnoh4 = await cryptoPortfolio.find();
                const updating14 = await cryptoPortfolio.findOne({ username: req.session.cuser });

                // res.render("defaultContest", {
                //     userlist: cnoh4,
                //     cls: updating14.contestHolding
                // });

                res.redirect("/");
            }
        }
    }
    catch (err) {
        res.send("error in cbuy");
    }
})

router.route('/C_selling_coin')
.post( async (req, res) => {
    try {
        const cnoh8 = await cryptoPortfolio.findOne({ username: req.session.cuser })
        const arrayIndex = req.body.arrayIndex;
        // console.log(arrayIndex)
        let ch = [];
        let cvalll = cnoh8.C_available_balance;
        let new_profit = cnoh8.C_total_profit;
        for (let i = 0; i < cnoh8.contestHolding.length; i++) {
            if (i != arrayIndex) {
                ch.push(cnoh8.contestHolding[i]);
            }
            else {
                cvalll += cnoh8.contestHolding[i].coin_current;
                new_profit += cnoh8.contestHolding[i].coin_profit;
            }
        }
        // console.log(ch)
        const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser },
            {
                $set: {
                    contestHolding: ch
                },
                C_available_balance: cvalll,
                C_total_profit: new_profit

            }
        )
        res.redirect("/defaultContest");
    }
    catch (er) {
        res.send("e44r");
    }
});


module.exports = router;