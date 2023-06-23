const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cryptoPortfolio = require("./models/registers")
const contetsCollection = require("./models/contestsModel")
const fetch = require('node-fetch');
const e = require('express');
const async = require('hbs/lib/async');
const { redirect } = require('express/lib/response');
const router = require('express').Router();
require('./db/conn');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const temppathviews = path.join(__dirname, "../templates/views");
const temppathpartials = path.join(__dirname, "../templates/partials");
const swal = require('sweetalert');
const nodemailer = require('nodemailer');

var apidatas;
var r2 = 0;
var rr2 = 0;
var cname;
var r3 = 0;

var ccval1;


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

app.get("/", async (req, res) => {
    try {
        var cnoh = await cryptoPortfolio.find()
        console.log("db = ",cnoh);
        // console.log("ani = ",cryptoPortfolio.find())
        if (!req.session.cuser) {
            req.session.cuser = "userwho";
        }

        if (req.session.cuser == "userwho") {
            let apiData = [];

            const rrrr = await fetch(
                `https://api.coinpaprika.com/v1/tickers?quotes=INR`
            )
                .then((res) => {
                    return res.json();
                })
                .then((data) => {


                    for (let i = 0; i < 300; i++) {
                        let n = data[i].quotes.INR.price.toFixed(2);

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



            res.render("index", {
                arra: apidatas,
                ls: "user",
                myPortfolio_total_invested: 0.00,
                myPortfolio_total_Current: 0.00,
                myPortfolio_total_profit: 0.00,

                C_myPortfolio_total_invested: 0.00,
                C_myPortfolio_total_Current: 0.00,
                C_myPortfolio_total_profit: 0.00,

                header_Username: "--",
                available_balance: 10000,
                total_profit: 0,
                current_username: "--",
                current_name: "--",
                market_cap_usd: market_cap_usd,
                market_cap_change_24h: market_cap_change_24h,
                bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                volume_24h_usd: volume_24h_usd,
                emailStatus: "OFF",

            });
        }

        else {


            var cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser })

            let myPortfolio_total_invested = 0;
            let myPortfolio_total_Current = 0;
            let myPortfolio_total_profit = 0;

            let C_myPortfolio_total_invested = 0;
            let C_myPortfolio_total_Current = 0;
            let C_myPortfolio_total_profit = 0;

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

                        for(let k = 0;k<cnoh.contestHolding.length;k++){
                            if ( cnoh.contestHolding[k].coin_symbol == data[i].symbol) {
                                ccval1 = (n * cnoh.contestHolding[k].coin_number).toFixed(2);
                                cnoh.contestHolding[k].coin_current = ccval1;
                                cnoh.contestHolding[k].coin_profit = (ccval1 - cnoh.contestHolding[k].coin_invested_amount).toFixed(2);
    
                                C_myPortfolio_total_invested += cnoh.contestHolding[k].coin_invested_amount;
                                C_myPortfolio_total_Current += cnoh.contestHolding[k].coin_current;
                                C_myPortfolio_total_profit += cnoh.contestHolding[k].coin_profit;
                            }
                        }

                        for(let k = 0;k<cnoh.Holding.length;k++){
                            if ( cnoh.Holding[k].coin_symbol == data[i].symbol) {
                                ccval1 = (n * cnoh.Holding[k].coin_number).toFixed(2);
                                cnoh.Holding[k].coin_current = ccval1;
                                cnoh.Holding[k].coin_profit = (ccval1 - cnoh.Holding[k].coin_invested_amount).toFixed(2);
    
                                myPortfolio_total_invested += cnoh.Holding[k].coin_invested_amount;
                                myPortfolio_total_Current += cnoh.Holding[k].coin_current;
                                myPortfolio_total_profit += cnoh.Holding[k].coin_profit;
                            }
                        }

                
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
            const updating_data_on_loading_home_page = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                $set: {
                    contestHolding: cnoh.contestHolding,
                    Holding: cnoh.Holding
                },
                C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
                C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
                C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

                total_invested_value: (myPortfolio_total_invested).toFixed(2),
                total_current_value: (myPortfolio_total_Current).toFixed(2),
                portfolio_total_profit: (myPortfolio_total_profit).toFixed(2),

            })

            res.render("index", {
                arra: apidatas,
                ls: cnoh.Holding,
                cls: cnoh.contestHolding,
                myPortfolio_total_invested: myPortfolio_total_invested.toFixed(2),
                myPortfolio_total_Current: myPortfolio_total_Current.toFixed(2),
                myPortfolio_total_profit: myPortfolio_total_profit.toFixed(2),

                emailStatus: cnoh.emailOnOff,

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

app.post("/selling_coin", async (req, res) => {
    try {

        const cnoh8 = await cryptoPortfolio.findOne({ username: req.session.cuser })
        const arrayIndex = req.body.arrayIndex;
        // console.log(arrayIndex)
        let ch = [];
        let cvalll = cnoh8.available_balance;
        let new_profit = cnoh8.total_profit;
        for (let i = 0; i < cnoh8.Holding.length; i++) {
            if (i != arrayIndex) {
                ch.push(cnoh8.Holding[i]);
            }
            else {
                cvalll += cnoh8.Holding[i].coin_current;
                new_profit += cnoh8.Holding[i].coin_profit;
            }
        }
        // console.log(ch)
        const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser },
            {
                $set: {
                    Holding: ch
                },
                available_balance: cvalll,
                total_profit: new_profit
            }
        )

        res.redirect("/");
    }
    catch (er) {
        res.send(er);
    }
});

app.post("/logout", async (req, res) => {
    req.session.cuser = "userwho";
    res.redirect("/");
});

app.post("/BuyDataPage", async (req, res) => {
    try {
        if (req.session.cuser == "userwho") { res.redirect("/myloginpage"); }
        else {
            const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
            const current_no_of_holdings = cnoh.no_of_holdings;


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
        }
    }
    catch (err) {
        res.send(err);
    }
});


app.post("/buy_coin", async (req, res) => {
    /// after clicking buy button on buyDataPage
    /// req.body  coming from BuyDataPage
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        var current_no_of_holdings = cnoh.no_of_holdings;
        if (cnoh.Holding.length >= 5) {
            res.render('BuyDataPage', {
                suc1: "You have reached the maximum limit of holding coins at a time in your portfolio  !",
                suc2: "Please Sell some coins and try again"
            });
        }
        else {
            // console.log(req.body.buyAmm)
            var current_no_of_holdings = cnoh.no_of_holdings;
            current_no_of_holdings = current_no_of_holdings + 1;

            if (cnoh.available_balance < req.body.buyAmm) {
                // res.send("Not enough amount to buy");
                res.render('BuyDataPage', {
                    suc1: "Not enough amount to buy !",
                    suc2: "Please Sell some coins and try again"
                });

            }
            else {


                var rr1 = cnoh.available_balance;
                rr1 = rr1 - req.body.buyAmm;
                let no_of_coinss = (req.body.buyAmm / req.body.bp).toFixed(9);
                const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                    $push: {
                        Holding: {
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
                    available_balance: cnoh.available_balance - req.body.buyAmm
                });

                res.redirect("/");
            }
        }
    }
    catch (err) {
        res.send("err");
    }
});



app.post("/emailOnOff", async (req, res) => {
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        if (cnoh.emailOnOff == "ON") {
            const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                emailOnOff: "OFF"
            });

        }
        else if (cnoh.emailOnOff == "OFF") {
            const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                emailOnOff: "ON"
            });

        }
        res.redirect("/");
    }
    catch (err) {
        res.send("error in email notification status " + err);
    }
});


const login = require('./routes/login');
app.use('/myloginpage', login);

const register = require('./routes/register');
app.use('/myregisterpage', register);

const friendsfile = require('./routes/friends');
app.use('/friends', friendsfile);

const customContest = require('./routes/customContest');
app.use('/competition', customContest);

const defaultContest = require('./routes/defaultContest');
const { spawn } = require('child_process');
app.use('/defaultContest', defaultContest);


// app.get("/updateAll", async (req, res) => {
//     try {

//         var all = await cryptoPortfolio.find();
//         var apdata;

//         const rrrr = await fetch(
//             `https://api.coinpaprika.com/v1/tickers?quotes=INR`
//         )
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 apdata = data;
//             })
//             .catch((errr) => {
//                 console.log('API Error' + errr);
//             });



//         for (let j = 0; j < all.length; j++) {
//             let C_myPortfolio_total_invested = 0;
//             let C_myPortfolio_total_Current = 0;
//             let C_myPortfolio_total_profit = 0;
//             for (let i = 0; i < 300; i++) {
//                 let n = apdata[i].quotes.INR.price.toFixed(2);

//                 if (all[j].contestHolding.length >= 1 &&
//                     all[j].contestHolding[0].coin_symbol == apdata[i].symbol) {

//                     let ccval1 = (n * all[j].contestHolding[0].coin_number).toFixed(2);

//                     all[j].contestHolding[0].coin_current = ccval1;

//                     all[j].contestHolding[0].coin_profit = (ccval1 - all[j].contestHolding[0].coin_invested_amount).toFixed(2);

//                     C_myPortfolio_total_invested += all[j].contestHolding[0].coin_invested_amount;
//                     C_myPortfolio_total_Current += all[j].contestHolding[0].coin_current;
//                     C_myPortfolio_total_profit += all[j].contestHolding[0].coin_profit;
//                 }


//                 if (all[j].contestHolding.length >= 2 &&
//                     all[j].contestHolding[1].coin_symbol == apdata[i].symbol) {

//                     let ccval12 = (n * all[j].contestHolding[1].coin_number).toFixed(2);

//                     all[j].contestHolding[1].coin_current = ccval12;

//                     all[j].contestHolding[1].coin_profit = (ccval12 - all[j].contestHolding[1].coin_invested_amount).toFixed(2);

//                     C_myPortfolio_total_invested += all[j].contestHolding[1].coin_invested_amount;
//                     C_myPortfolio_total_Current += all[j].contestHolding[1].coin_current;
//                     C_myPortfolio_total_profit += all[j].contestHolding[1].coin_profit;
//                 }
//                 // console.log(C_myPortfolio_total_invested);
//                 // console.log(C_myPortfolio_total_Current);


//                 const updating21 = await cryptoPortfolio.findOneAndUpdate({ username: all[j].username }, {
//                     $set: {
//                         contestHolding: all[j].contestHolding
//                     },
//                     C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
//                     C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
//                     C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

//                 })
//             }
//         }

//         res.send("updated all");
//     }
//     catch (err) {
//         res.send(err);
//     }
// })

async function updating() {
    try {
        var all = await cryptoPortfolio.find();
        var apdata;

        const rrrr = await fetch(
            `https://api.coinpaprika.com/v1/tickers?quotes=INR`
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                apdata = data;
            })
            .catch((errr) => {
                console.log('API Error' + errr);
            });

        for (let j = 0; j < all.length; j++) {
            let C_myPortfolio_total_invested = 0;
            let C_myPortfolio_total_Current = 0;
            let C_myPortfolio_total_profit = 0;

            let myPortfolio_total_invested = 0;
            let myPortfolio_total_Current = 0;
            let myPortfolio_total_profit = 0;

            for (let i = 0; i < 300; i++) {
                let n = apdata[i].quotes.INR.price.toFixed(2);
                
                for(let k = 0;k<cnoh.contestHolding.length;k++){
                    if ( cnoh.contestHolding[k].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.contestHolding[k].coin_number).toFixed(2);
                        cnoh.contestHolding[k].coin_current = ccval1;
                        cnoh.contestHolding[k].coin_profit = (ccval1 - cnoh.contestHolding[k].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += cnoh.contestHolding[k].coin_invested_amount;
                        C_myPortfolio_total_Current += cnoh.contestHolding[k].coin_current;
                        C_myPortfolio_total_profit += cnoh.contestHolding[k].coin_profit;
                    }
                }

                for(let k = 0;k<cnoh.Holding.length;k++){
                    if ( cnoh.Holding[k].coin_symbol == data[i].symbol) {
                        ccval1 = (n * cnoh.Holding[k].coin_number).toFixed(2);
                        cnoh.Holding[k].coin_current = ccval1;
                        cnoh.Holding[k].coin_profit = (ccval1 - cnoh.Holding[k].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += cnoh.Holding[k].coin_invested_amount;
                        myPortfolio_total_Current += cnoh.Holding[k].coin_current;
                        myPortfolio_total_profit += cnoh.Holding[k].coin_profit;
                    }
                }

            }

            const updating21 = await cryptoPortfolio.findOneAndUpdate({ username: all[j].username }, {
                $set: {
                    contestHolding: all[j].contestHolding,
                    Holding: all[j].Holding
                },
                C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
                C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
                C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

                total_invested_value: (myPortfolio_total_invested).toFixed(2),
                total_current_value: (myPortfolio_total_Current).toFixed(2),
                portfolio_total_profit: (myPortfolio_total_profit).toFixed(2),

            })


        }

        const updating12 = await cryptoPortfolio.findOne({ username: "Aniket21" });
        if (1==1) {
            if (updating12.emailOnOff == "ON") {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dummycrypto2@gmail.com',
                        pass: 'emegjafppuucwhhj'
                    }
                });
                var mailOptions = {
                    from: 'dummycrypto2@gmail.com',
                    // to: updating12.email,
                    to: 'anujsherma21@gmail.com',
                    subject: `Updated all`,
                    text: `Updated all at ${new Date} `,

                };

                const as = await transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error.message);

                    } else {
                        console.log('VIP update Email sent: ' + info.response);
                    }
                });
            }
        }

        // console.log("updated All Data")
    }
    catch (err) {
        console.log(err)
    }
}

async function dailyUpdateMail() {
    try {
        let reset = new Date();
        reset.setHours(24, 0, 0, 0);
        let t = reset.getTime() - Date.now();
        // console.log(t);

        setTimeout(async function () {

            var all = await cryptoPortfolio.find();

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dummycrypto2@gmail.com',
                    pass: 'emegjafppuucwhhj'
                }
            });

            for (let i = 0; i < all.length; i++) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dummycrypto2@gmail.com',
                        pass: 'emegjafppuucwhhj'
                    }
                });

                let cnoh = all[i];

                let str = ` 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                
                <h3 style="color:black;"> Dear <span style = "color: blue;">  ${cnoh.fname} ${cnoh.lname} </span>, Here is your portfolio </h3>
                <table class="table" style="border: 2px solid #4da4de;">
                <thead style="border: 1px solid #4da4de;">
                  <tr>
                    <th style="border: 1px solid #4da4de;" scope="col">Coin Name</th>
                    <th style="border: 1px solid #4da4de;" scope="col">Invested Value</th>
                    <th style="border: 1px solid #4da4de;" scope="col">Current Value</th>
                    <th style="border: 1px solid #4da4de;" scope="col">Profit</th>
                  </tr>
                </thead>
                <tbody>`;

                let ptp = 0;
                for (let i = 0; i < cnoh.Holding.length; i++) {
                    ptp += cnoh.Holding[i].coin_profit;
                    if (cnoh.Holding[i].coin_profit < 0) {
                        str += `
                    <tr style="color: red;">
                    <th style="border: 1px solid #4da4de;"> ${cnoh.Holding[i].coin_name}</th>
                    <th style="border: 1px solid #4da4de;">₹ ${cnoh.Holding[i].coin_invested_amount}</th>
                    <th style="border: 1px solid #4da4de;">₹ ${cnoh.Holding[i].coin_current}</th>
                    <th style="border: 1px solid #4da4de;">${cnoh.Holding[i].coin_profit} Rs</th>
                  </tr>
                  `
                    }
                    else {
                        str += `
                    <tr style="color: green;">
                    <th style="border: 1px solid #4da4de;"> ${cnoh.Holding[i].coin_name}</th>
                    <th style="border: 1px solid #4da4de;">₹ ${cnoh.Holding[i].coin_invested_amount}</th>
                    <th style="border: 1px solid #4da4de;">₹ ${cnoh.Holding[i].coin_current}</th>
                    <th style="border: 1px solid #4da4de;">${cnoh.Holding[i].coin_profit} Rs</th>
                  </tr>
                  `
                    }
                }

                if (ptp < 0) {
                    str += `
                <tr style="color: red;">
                <th style="border: 1px solid #4da4de;">Final</th>
                <th style="border: 1px solid #4da4de;">₹ ${cnoh.total_current_value}</th>
                <th style="border: 1px solid #4da4de;">₹ ${cnoh.total_invested_value}</th>
                <th style="border: 1px solid #4da4de;">₹${ptp.toFixed(2)} Rs</th>
        
              </tr>
              `
                }
                else {
                    str += `
                <tr style="color: green;">
                <th style="border: 1px solid #4da4de;">Total</th>
                <th style="border: 1px solid #4da4de;">₹ ${cnoh.total_current_value}</th>
                <th style="border: 1px solid #4da4de;">₹ ${cnoh.total_invested_value}</th>
                <th style="border: 1px solid #4da4de;"> ${ptp.toFixed(2)} Rs</th>
              </tr>
              `
                }


                str += `You may turn off the notifications from the website.`

                if (cnoh.emailOnOff == "ON") {

                    var mailOptions = {
                        from: 'dummycrypto2@gmail.com',
                        to: cnoh.email,
                        // to: 'anujsherma21@gmail.com',
                        subject: `Dummy Crypto Portfolio Update`,
                        text: `Dear ${cnoh.fname} ${cnoh.lname} , Here is your portfolio `,
                        html: str
                    };

                    const as = await transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log('Daily Email Not sent: ');
                            console.log(error.message);

                        } else {
                            console.log('Daily Email sent: ' + info.response);
                        }
                    });
                }
            }
            dailyUpdateMail();
        }, t);
    }
    catch {

    }
}

dailyUpdateMail();
setInterval(updating, 300000);  // 5 min

const port = process.env.PORT || '7000';
app.listen(port, ["192.168.56.1", "localhost"], () => {
    console.log(("listened on port ", port));
})