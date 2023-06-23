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

internationalNumberFormat = new Intl.NumberFormat('en-IN')

app.set("view engine", "hbs");
app.set("views", temppathviews);
hbs.registerPartials(temppathpartials);

hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifEqual', function (v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.use(session({
    secret: 'sc',
    resave: false,
    saveUninitialized: false,
}))

router.route('/')
.get(async (req, res) => {
    try {
        if (!req.session.cuser) {
            req.session.cuser = "userwho";
        }

        var cnoh;
        let myPortfolio_total_invested = 0;
        let myPortfolio_total_Current = 0;
        let myPortfolio_total_profit = 0;

        let C_myPortfolio_total_invested = 0;
        let C_myPortfolio_total_Current = 0;
        let C_myPortfolio_total_profit = 0;

        cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        const rrrr = await fetch(
            `https://api.coinpaprika.com/v1/tickers?quotes=INR`
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {

                let apiData = [];
                for (let i = 0; i < 300; i++) {
                    let n = data[i].quotes.INR.price.toFixed(2);

                    if (cnoh.contestHolding.length >= 1 && cnoh.contestHolding[0].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[0].coin_number).toFixed(2);
                        cnoh.contestHolding[0].coin_current = ccval1;
                        cnoh.contestHolding[0].coin_profit = (ccval1 - cnoh.contestHolding[0].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[0].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[0].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[0].coin_profit;
                    }

                    if (cnoh.contestHolding.length >= 2 && cnoh.contestHolding[1].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[1].coin_number).toFixed(2);
                        cnoh.contestHolding[1].coin_current = ccval1;
                        cnoh.contestHolding[1].coin_profit = (ccval1 - cnoh.contestHolding[1].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[1].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[1].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[1].coin_profit;
                    }
                    
                    if (cnoh.contestHolding.length >= 3 && cnoh.contestHolding[2].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[2].coin_number).toFixed(2);
                        cnoh.contestHolding[2].coin_current = ccval1;
                        cnoh.contestHolding[2].coin_profit = (ccval1 - cnoh.contestHolding[2].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[2].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[2].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[2].coin_profit;
                    }

                    if (cnoh.contestHolding.length >= 4 && cnoh.contestHolding[3].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[3].coin_number).toFixed(3);
                        cnoh.contestHolding[3].coin_current = ccval1;
                        cnoh.contestHolding[3].coin_profit = (ccval1 - cnoh.contestHolding[3].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[3].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[3].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[3].coin_profit;
                    }

                    if (cnoh.contestHolding.length >= 5 && cnoh.contestHolding[4].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[4].coin_number).toFixed(4);
                        cnoh.contestHolding[4].coin_current = ccval1;
                        cnoh.contestHolding[4].coin_profit = (ccval1 - cnoh.contestHolding[4].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[4].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[4].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[4].coin_profit;
                    }





                    /////  Holding Normal
                    if (cnoh.Holding.length >= 1 && cnoh.Holding[0].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[0].coin_number).toFixed(2);
                        cnoh.Holding[0].coin_current = ccval1;
                        cnoh.Holding[0].coin_profit = (ccval1 - cnoh.Holding[0].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[0].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[0].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[0].coin_profit;
                    }
                    if (cnoh.Holding.length >= 2 && cnoh.Holding[1].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[1].coin_number).toFixed(2);
                        cnoh.Holding[1].coin_current = ccval1;
                        cnoh.Holding[1].coin_profit = (ccval1 - cnoh.Holding[1].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[1].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[1].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[1].coin_profit;
                    }
                    if (cnoh.Holding.length >= 3 && cnoh.Holding[2].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[2].coin_number).toFixed(2);
                        cnoh.Holding[2].coin_current = ccval1;
                        cnoh.Holding[2].coin_profit = (ccval1 - cnoh.Holding[2].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[2].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[2].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[2].coin_profit;
                    }
                    if (cnoh.Holding.length >= 4 && cnoh.Holding[3].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[3].coin_number).toFixed(3);
                        cnoh.Holding[3].coin_current = ccval1;
                        cnoh.Holding[3].coin_profit = (ccval1 - cnoh.Holding[3].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[3].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[3].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[3].coin_profit;
                    }
                    if (cnoh.Holding.length >= 5 && cnoh.Holding[4].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[4].coin_number).toFixed(4);
                        cnoh.Holding[4].coin_current = ccval1;
                        cnoh.Holding[4].coin_profit = (ccval1 - cnoh.Holding[4].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[4].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[4].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[4].coin_profit;
                    }

                    // if (cnoh.coin_symbol1 == data[i].symbol) {
                    //     cnoh.coin_current1 = (n * cnoh.coin_number1).toFixed(2);
                    //     cval1 = cnoh.coin_current1;
                    //     cnoh.coin_profit1 = (cnoh.coin_current1 - cnoh.coin_invested_amount1).toFixed(2);
                    //     myPortfolio_total_invested += cnoh.coin_invested_amount1;
                    //     myPortfolio_total_Current += cnoh.coin_current1;
                    //     myPortfolio_total_profit += cnoh.coin_profit1;
                    // }
                    // else if (cnoh.coin_symbol2 == data[i].symbol) {
                    //     cnoh.coin_current2 = (n * cnoh.coin_number2).toFixed(2);
                    //     cval2 = cnoh.coin_current2;
                    //     cnoh.coin_profit2 = (cnoh.coin_current2 - cnoh.coin_invested_amount2).toFixed(2);

                    //     myPortfolio_total_invested += cnoh.coin_invested_amount2;
                    //     myPortfolio_total_Current += cnoh.coin_current2;
                    //     myPortfolio_total_profit += cnoh.coin_profit2;
                    // }


                    let p49 = internationalNumberFormat.format(n);
                    // `https://cdn.coinpaper.io/${data[i].id}/logo/${data[i].id}_logo@26x26.png`
                    let tempObj = {
                        id: `${data[i].id}`,
                        idx: i,
                        rank: `${data[i].rank}`,
                        symbol: `${data[i].symbol}`,
                        name: `${data[i].name}`,
                        currentPrice: `${n}`,
                        percent: `${data[i].quotes.INR.percent_change_24h}`,
                        coinImg: `https://static.coinpaprika.com/coin/${data[i].id}/logo.png?rev=10588339`
                    }
                    apiData.push(tempObj);
                }

                apidatas = apiData;
            })
            .catch((errr) => {
                console.log('API Error' + errr);
            });

        let market_cap_usd;
        let market_cap_change_24h;
        let bitcoin_dominance_percentage;
        let volume_24h_usd;
        const rrrrr = await fetch(
            `https://api.coinpaprika.com/v1/global`
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // market_cap_usd =  internationalNumberFormat.format(data.market_cap_usd);
                market_cap_usd = (((data.market_cap_usd) * 75) / 1000000000000).toFixed(2);
                bitcoin_dominance_percentage = internationalNumberFormat.format(data.bitcoin_dominance_percentage);
                volume_24h_usd = (((data.volume_24h_usd) * 75) / 1000000000000).toFixed(2);
                market_cap_change_24h = data.market_cap_change_24h;
                // market_cap_change_24h = 5.09;

            })
            .catch((errr) => {
                console.log('API Error' + errr);
            });
        r2 = (cnoh.available_balance).toFixed(2);
        r3 = (cnoh.total_profit).toFixed(2);

        rr2 = (cnoh.C_available_balance).toFixed(2);
        rr3 = (cnoh.C_total_profit).toFixed(2);

        cname = cnoh.fname + " " + cnoh.lname;


        const updating20 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
            
            $set: {
                contestHolding: cnoh.contestHolding
            },
            $set: {
                Holding: cnoh.Holding
            },
            C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
            C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
            C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),


        })

        if (req.session.cuser == "userwho") {
            cnoh = "user"
            res.render("index", {
                arra: apidatas,
                ls: cnoh,
                myPortfolio_total_invested: myPortfolio_total_invested.toFixed(2),
                myPortfolio_total_Current: myPortfolio_total_Current.toFixed(2),
                myPortfolio_total_profit: myPortfolio_total_profit.toFixed(2),

                C_myPortfolio_total_invested: C_myPortfolio_total_invested.toFixed(2),
                C_myPortfolio_total_Current: C_myPortfolio_total_Current.toFixed(2),
                C_myPortfolio_total_profit: C_myPortfolio_total_profit.toFixed(2),

                header_Username: "--",
                available_balance: 10000,
                total_profit: 0,
                current_username: "--",
                current_name: "--",
                market_cap_usd: market_cap_usd,
                market_cap_change_24h: market_cap_change_24h,
                bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                volume_24h_usd: volume_24h_usd

            });
        }
        else {
            res.render("index", {
                arra: apidatas,
                ls: cnoh.Holding,
                cls: cnoh.contestHolding,
                myPortfolio_total_invested: myPortfolio_total_invested.toFixed(2),
                myPortfolio_total_Current: myPortfolio_total_Current.toFixed(2),
                myPortfolio_total_profit: myPortfolio_total_profit.toFixed(2),

                C_myPortfolio_total_invested: C_myPortfolio_total_invested.toFixed(2),
                C_myPortfolio_total_Current: C_myPortfolio_total_Current.toFixed(2),
                C_myPortfolio_total_profit: C_myPortfolio_total_profit.toFixed(2),

                available_balance: r2,
                total_profit: r3,
                header_Username: req.session.cuser,
                current_username: req.session.cuser,
                current_name: cname,
                market_cap_usd: market_cap_usd,
                market_cap_change_24h: market_cap_change_24h,
                bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                volume_24h_usd: volume_24h_usd
            });
        }
        // res.render("index")
    }
    catch (err) {
        res.send(err);
    }
})








module.exports = router;