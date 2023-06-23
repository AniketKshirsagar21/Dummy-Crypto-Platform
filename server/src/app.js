const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const cryptoPortfolio = require("./models/registers")
const contetsCollection = require("./models/contestsModel")
const fetch = require('node-fetch');
const e = require('express');
const async = require('hbs/lib/async');
const { redirect } = require('express/lib/response');
const router = require('express').Router();

const jwt = require('jsonwebtoken');
require('dotenv').config()
require('./db/conn');
let name = process.env.NAME;
console.log("Env = ",process.env.NAME);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const temppathviews = path.join(__dirname, "../templates/views");
const temppathpartials = path.join(__dirname, "../templates/partials");
const swal = require('sweetalert');
// const nodemailer = require('nodemailer');
// const data = require('./api.json');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nodemailer = require('nodemailer');

var apidatas;
internationalNumberFormat = new Intl.NumberFormat('en-IN')


app.use(session({
    secret: 'sc',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false,
}))


// import verifyToken from './routes/auth'
const verifyToken = require('./routes/auth');



app.get("/", verifyToken, async (req, res) => {
    try {
        
        let apiData = [];
        const apiReq = await fetch(
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

        let market_cap_usd = 40;
        let market_cap_change_24h = 40;
        let bitcoin_dominance_percentage = 40;
        let volume_24h_usd = 40;
        // const apiReq2 = await fetch(
        //     `https://api.coinpaprika.com/v1/global`
        // )
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((data) => {
        //         market_cap_usd = (((data.market_cap_usd) * 75) / 1000000000000).toFixed(2);
        //         bitcoin_dominance_percentage = internationalNumberFormat.format(data.bitcoin_dominance_percentage);
        //         volume_24h_usd = (((data.volume_24h_usd) * 75) / 1000000000000).toFixed(2);
        //         market_cap_change_24h = data.market_cap_change_24h;
        //     })
        //     .catch((errr) => {
        //         console.log('API Error' + errr);
        //     });

        var userData = undefined;
        if (req.username && req.token != "expired") {
            userData =   await cryptoPortfolio.findOne({ username: req.username })
        }

        if (userData == undefined || !req.username || req.token == "expired") {
            console.log("In home :- User Not found/Expired");
            res.send({
                apidata: apidatas,
                token : "no",
                username: "--", //???????????????????????
                total_profit: 0, //???????????????????????
                marque_data: {
                    market_cap_usd: market_cap_usd,
                    market_cap_change_24h: market_cap_change_24h,
                    bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                    volume_24h_usd: volume_24h_usd,
                },
                dashboard_data: {
                    username: "--",
                    available_balance: 10000,
                    total_profit: 0.00,
                    current_name: "--"
                },
                emailStatus: "OFF",
                main_data: {
                    Holdings: [],
                    myPortfolio_total_invested: 0,
                    myPortfolio_total_Current: 0,
                    myPortfolio_total_profit: 0
                },
                contest_data: {
                    contestHoldings: [],
                    C_myPortfolio_total_invested: 0,
                    C_myPortfolio_total_Current: 0,
                    C_myPortfolio_total_profit: 0
                },
            })
        }
        else {
            let myPortfolio_total_invested = 0;
            let myPortfolio_total_Current = 0;
            let myPortfolio_total_profit = 0;

            let C_myPortfolio_total_invested = 0;
            let C_myPortfolio_total_Current = 0;
            let C_myPortfolio_total_profit = 0;
            let l = 300;
            if (apidatas.length < 300) l = apidatas.length
            for (let i = 0; i < l; i++) {
                let n = apidatas[i].currentPrice;
                for (let k = 0; k < userData.contestHolding.length; k++) {
                    if (userData.contestHolding[k].coin_symbol == apidatas[i].symbol) {
                        ccval1 = (n * userData.contestHolding[k].coin_number).toFixed(2);
                        userData.contestHolding[k].coin_current = ccval1;
                        userData.contestHolding[k].coin_profit = (ccval1 - userData.contestHolding[k].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += userData.contestHolding[k].coin_invested_amount;
                        C_myPortfolio_total_Current += userData.contestHolding[k].coin_current;
                        C_myPortfolio_total_profit += userData.contestHolding[k].coin_profit;
                    }
                }

                for (let k = 0; k < userData.Holding.length; k++) {
                    if (userData.Holding[k].coin_symbol == apidatas[i].symbol) {
                        ccval1 = (n * userData.Holding[k].coin_number).toFixed(2);
                        userData.Holding[k].coin_current = ccval1;
                        userData.Holding[k].coin_profit = (ccval1 - userData.Holding[k].coin_invested_amount).toFixed(2);

                        myPortfolio_total_invested += userData.Holding[k].coin_invested_amount;
                        myPortfolio_total_Current += userData.Holding[k].coin_current;
                        myPortfolio_total_profit += userData.Holding[k].coin_profit;
                    }
                }
            }
            r2 = (userData.available_balance).toFixed(2);
            r3 = (userData.total_profit).toFixed(2);
            rr2 = (userData.C_available_balance).toFixed(2);
            rr3 = (userData.C_total_profit).toFixed(2);

            cname = userData.fname + " " + userData.lname;
            // const updating_data_on_loading_home_page = await cryptoPortfolio.findOneAndUpdate({ username: req.username }, {
            //     $set: {
            //         contestHolding: userData.contestHolding,
            //         Holding: userData.Holding
            //     },
            //     C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
            //     C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
            //     C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

            //     total_invested_value: (myPortfolio_total_invested).toFixed(2),
            //     total_current_value: (myPortfolio_total_Current).toFixed(2),
            //     portfolio_total_profit: (myPortfolio_total_profit).toFixed(2),
            // })

            res.send({
                apidata: apidatas,
                token : req.token,
                main_data: {
                    Holdings: userData.Holding,
                    myPortfolio_total_invested: myPortfolio_total_invested.toFixed(2),
                    myPortfolio_total_Current: myPortfolio_total_Current.toFixed(2),
                    myPortfolio_total_profit: myPortfolio_total_profit.toFixed(2)
                },
                emailStatus: userData.emailOnOff,
                contest_data: {
                    contestHoldings: userData.contestHolding,
                    C_myPortfolio_total_invested: C_myPortfolio_total_invested.toFixed(2),
                    C_myPortfolio_total_Current: C_myPortfolio_total_Current.toFixed(2),
                    C_myPortfolio_total_profit: C_myPortfolio_total_profit.toFixed(2),
                },
                username: req.username,
                dashboard_data: {
                    username: req.username,
                    available_balance: r2,
                    total_profit: r3,
                    current_name: cname
                },
                marquee: {
                    market_cap_usd: market_cap_usd,
                    market_cap_change_24h: market_cap_change_24h,
                    bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                    volume_24h_usd: volume_24h_usd
                }
            });
        }
    }
    catch (err) {
        res.send(err);
    }
})


const contest = require('./routes/contest');
app.use('/contest', contest);

// app.get("/contest", verifyToken, async (req, res) => {
//     try {
//         let apiData = [];
//         const apiReq = await fetch(
//             `https://api.coinpaprika.com/v1/tickers?quotes=INR`
//         )
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 for (let i = 0; i < 300; i++) {
//                     let n = data[i].quotes.INR.price.toFixed(2);
//                     let tempObj = {
//                         id: `${data[i].id}`,
//                         idx: i,
//                         rank: `${data[i].rank}`,
//                         symbol: `${data[i].symbol}`,
//                         name: `${data[i].name}`,
//                         currentPrice: `${n}`,
//                         percent: `${data[i].quotes.INR.percent_change_24h}`,
//                         coinImg: `https://static.coinpaprika.com/coin/${data[i].id}/logo.png?rev=10588339`
//                     }
//                     apiData.push(tempObj);
//                 }
//                 apidatas = apiData;
//             })
//             .catch((errr) => {
//                 console.log('API Error' + errr);
//             });

//         const all_user_data = [];
//         const all = await cryptoPortfolio.find({}, { username: 1, C_total_profit: 1, fname: 1, lname: 1 }).toArray(function (err, docs) {
//             if (err) {
//                 console.log('Error retrieving documents:', err);
//                 return;
//             }
//             // Store the selected fields in the 'data' variable
//             all_user_data = docs.map(doc => ({
//                 username: doc.username,
//                 C_total_profit: doc.C_total_profit,
//                 name: doc.fname + " " + doc.lname
//             }));
//         })
//         console.log("all = ",all_user_data)

//         let market_cap_usd = 40;
//         let market_cap_change_24h = 40;
//         let bitcoin_dominance_percentage = 40;
//         let volume_24h_usd = 40;
//         // const apiReq2 = await fetch(
//         //     `https://api.coinpaprika.com/v1/global`
//         // )
//         //     .then((res) => {
//         //         return res.json();
//         //     })
//         //     .then((data) => {
//         //         market_cap_usd = (((data.market_cap_usd) * 75) / 1000000000000).toFixed(2);
//         //         bitcoin_dominance_percentage = internationalNumberFormat.format(data.bitcoin_dominance_percentage);
//         //         volume_24h_usd = (((data.volume_24h_usd) * 75) / 1000000000000).toFixed(2);
//         //         market_cap_change_24h = data.market_cap_change_24h;
//         //     })
//         //     .catch((errr) => {
//         //         console.log('API Error' + errr);
//         //     });

//         var userData = undefined;
//         if (req.username && req.token != "expired") {
//             userData = await cryptoPortfolio.findOne({ username: req.username })
//         }

//         if (userData == undefined || !req.username || req.token == "expired") {
//             console.log("In Contest :- User Not found/Expired");
//             res.send({
//                 token: "no",
//                 all_user_data : all_user_data,
//                 username: "--", //???????????????????????
//                 total_profit: 0, //???????????????????????
//                 marque_data: {
//                     market_cap_usd: market_cap_usd,
//                     market_cap_change_24h: market_cap_change_24h,
//                     bitcoin_dominance_percentage: bitcoin_dominance_percentage,
//                     volume_24h_usd: volume_24h_usd,
//                 },
//                 dashboard_data: {
//                     username: "--",
//                     available_balance: 10000,
//                     total_profit: 0.00,
//                     current_name: "--"
//                 },
//                 contest_data: {
//                     contestHoldings: [],
//                     C_myPortfolio_total_invested: 0,
//                     C_myPortfolio_total_Current: 0,
//                     C_myPortfolio_total_profit: 0
//                 },
//             })
//         }
//         else {
//             let C_myPortfolio_total_invested = 0;
//             let C_myPortfolio_total_Current = 0;
//             let C_myPortfolio_total_profit = 0;
//             let l = 300;
//             if (apidatas.length < 300) l = apidatas.length
//             for (let i = 0; i < l; i++) {
//                 let n = apidatas[i].currentPrice;
//                 for (let k = 0; k < userData.contestHolding.length; k++) {
//                     if (userData.contestHolding[k].coin_symbol == apidatas[i].symbol) {
//                         ccval1 = (n * userData.contestHolding[k].coin_number).toFixed(2);
//                         userData.contestHolding[k].coin_current = ccval1;
//                         userData.contestHolding[k].coin_profit = (ccval1 - userData.contestHolding[k].coin_invested_amount).toFixed(2);

//                         C_myPortfolio_total_invested += userData.contestHolding[k].coin_invested_amount;
//                         C_myPortfolio_total_Current += userData.contestHolding[k].coin_current;
//                         C_myPortfolio_total_profit += userData.contestHolding[k].coin_profit;
//                     }
//                 }
//             }

//             cname = userData.fname + " " + userData.lname;
//             res.send({
//                 // apidata: apidatas,
//                 all_user_data : all_user_data,
//                 token: req.token,
//                 username: req.username,
//                 total_profit: userData.C_total_profit, //???????????????????????
//                 contest_data: {
//                     contestHoldings: userData.contestHolding,
//                     C_myPortfolio_total_invested: C_myPortfolio_total_invested.toFixed(2),
//                     C_myPortfolio_total_Current: C_myPortfolio_total_Current.toFixed(2),
//                     C_myPortfolio_total_profit: C_myPortfolio_total_profit.toFixed(2),
//                 },
//                 dashboard_data: {
//                     username: req.username,
//                     available_balance: (userData.C_available_balance).toFixed(2),
//                     total_profit: (userData.C_total_profit).toFixed(2),
//                     current_name: cname
//                 },
//                 marquee: {
//                     market_cap_usd: market_cap_usd,
//                     market_cap_change_24h: market_cap_change_24h,
//                     bitcoin_dominance_percentage: bitcoin_dominance_percentage,
//                     volume_24h_usd: volume_24h_usd
//                 }
//             });
//         }
//     }
//     catch (err) {
//         res.send(err);
//     }
// })
// app.use(proxy('http://localhost:3000'));

const login = require('./routes/login');
app.use('/login', login);

const register = require('./routes/register');
app.use('/register', register);

const history = require('./routes/history');
app.use('/history', history);

const buyCoin = require('./routes/buyCoin');
app.use('/buyCoin', buyCoin);

const buyCoinContest = require('./routes/buyCoinContest');
app.use('/buyCoinContest', buyCoinContest);

// const buydatapage = require('./routes/buydatapage');
// app.use('/buydatapage', buydatapage);

const selling_coin = require('./routes/selling_coin');
app.use('/selling_coin', selling_coin);


const contest_selling_coin = require('./routes/contest_selling_coin');
app.use('/contest_selling_coin', contest_selling_coin);


// const defaultContest = require('./routes/defaultContest');
// const { spawn } = require('child_process');
// app.use('/defaultContest', defaultContest);

app.post("/buydatapage", verifyToken, async (req, res) => {
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
                    console.log("buydatapage Body = ", req.body);
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
                        // console.log("index = ", index)
                        res.send({
                            data: {
                                error: 0,
                                msg: "OK",
                                description : "You can buy this coin",
                                coin_data: index,
                                available_balance: userData.available_balance,
                                C_available_balance: userData.C_available_balance
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



app.post("/emailOnOff", async (req, res) => {
    try {
        const userData = await cryptoPortfolio.findOne({ username: req.session.cuser });
        if (userData.emailOnOff == "ON") {
            const updating12 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                emailOnOff: "OFF"
            });

        }
        else if (userData.emailOnOff == "OFF") {
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



// async function updating() {
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

//             let myPortfolio_total_invested = 0;
//             let myPortfolio_total_Current = 0;
//             let myPortfolio_total_profit = 0;

//             for (let i = 0; i < 300; i++) {
//                 let n = apdata[i].quotes.INR.price.toFixed(2);

//                 for (let k = 0; k < userData.contestHolding.length; k++) {
//                     if (userData.contestHolding[k].coin_symbol == data[i].symbol) {
//                         ccval1 = (n * userData.contestHolding[k].coin_number).toFixed(2);
//                         userData.contestHolding[k].coin_current = ccval1;
//                         userData.contestHolding[k].coin_profit = (ccval1 - userData.contestHolding[k].coin_invested_amount).toFixed(2);

//                         C_myPortfolio_total_invested += userData.contestHolding[k].coin_invested_amount;
//                         C_myPortfolio_total_Current += userData.contestHolding[k].coin_current;
//                         C_myPortfolio_total_profit += userData.contestHolding[k].coin_profit;
//                     }
//                 }

//                 for (let k = 0; k < userData.Holding.length; k++) {
//                     if (userData.Holding[k].coin_symbol == data[i].symbol) {
//                         ccval1 = (n * userData.Holding[k].coin_number).toFixed(2);
//                         userData.Holding[k].coin_current = ccval1;
//                         userData.Holding[k].coin_profit = (ccval1 - userData.Holding[k].coin_invested_amount).toFixed(2);

//                         myPortfolio_total_invested += userData.Holding[k].coin_invested_amount;
//                         myPortfolio_total_Current += userData.Holding[k].coin_current;
//                         myPortfolio_total_profit += userData.Holding[k].coin_profit;
//                     }
//                 }

//             }

//             const updating21 = await cryptoPortfolio.findOneAndUpdate({ username: all[j].username }, {
//                 $set: {
//                     contestHolding: all[j].contestHolding,
//                     Holding: all[j].Holding
//                 },
//                 C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
//                 C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
//                 C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

//                 total_invested_value: (myPortfolio_total_invested).toFixed(2),
//                 total_current_value: (myPortfolio_total_Current).toFixed(2),
//                 portfolio_total_profit: (myPortfolio_total_profit).toFixed(2),

//             })


//         }

//         const updating12 = await cryptoPortfolio.findOne({ username: "Aniket21" });
//         if (1 == 1) {
//             if (updating12.emailOnOff == "ON") {
//                 var transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         user: 'dummycrypto2@gmail.com',
//                         pass: 'emegjafppuucwhhj'
//                     }
//                 });
//                 var mailOptions = {
//                     from: 'dummycrypto2@gmail.com',
//                     // to: updating12.email,
//                     to: 'anujsherma21@gmail.com',
//                     subject: `Updated all`,
//                     text: `Updated all at ${new Date} `,

//                 };

//                 const as = await transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error.message);

//                     } else {
//                         console.log('VIP update Email sent: ' + info.response);
//                     }
//                 });
//             }
//         }

//         // console.log("updated All Data")
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

// async function dailyUpdateMail() {
//     try {
//         let reset = new Date();
//         reset.setHours(24, 0, 0, 0);
//         let t = reset.getTime() - Date.now();
//         // console.log(t);

//         setTimeout(async function () {

//             var all = await cryptoPortfolio.find();

//             var transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'dummycrypto2@gmail.com',
//                     pass: 'emegjafppuucwhhj'
//                 }
//             });

//             for (let i = 0; i < all.length; i++) {
//                 var transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         user: 'dummycrypto2@gmail.com',
//                         pass: 'emegjafppuucwhhj'
//                     }
//                 });

//                 let userData = all[i];

//                 let str = ` 
//                 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

//                 <h3 style="color:black;"> Dear <span style = "color: blue;">  ${userData.fname} ${userData.lname} </span>, Here is your portfolio </h3>
//                 <table class="table" style="border: 2px solid #4da4de;">
//                 <thead style="border: 1px solid #4da4de;">
//                   <tr>
//                     <th style="border: 1px solid #4da4de;" scope="col">Coin Name</th>
//                     <th style="border: 1px solid #4da4de;" scope="col">Invested Value</th>
//                     <th style="border: 1px solid #4da4de;" scope="col">Current Value</th>
//                     <th style="border: 1px solid #4da4de;" scope="col">Profit</th>
//                   </tr>
//                 </thead>
//                 <tbody>`;

//                 let ptp = 0;
//                 for (let i = 0; i < userData.Holding.length; i++) {
//                     ptp += userData.Holding[i].coin_profit;
//                     if (userData.Holding[i].coin_profit < 0) {
//                         str += `
//                     <tr style="color: red;">
//                     <th style="border: 1px solid #4da4de;"> ${userData.Holding[i].coin_name}</th>
//                     <th style="border: 1px solid #4da4de;">₹ ${userData.Holding[i].coin_invested_amount}</th>
//                     <th style="border: 1px solid #4da4de;">₹ ${userData.Holding[i].coin_current}</th>
//                     <th style="border: 1px solid #4da4de;">${userData.Holding[i].coin_profit} Rs</th>
//                   </tr>
//                   `
//                     }
//                     else {
//                         str += `
//                     <tr style="color: green;">
//                     <th style="border: 1px solid #4da4de;"> ${userData.Holding[i].coin_name}</th>
//                     <th style="border: 1px solid #4da4de;">₹ ${userData.Holding[i].coin_invested_amount}</th>
//                     <th style="border: 1px solid #4da4de;">₹ ${userData.Holding[i].coin_current}</th>
//                     <th style="border: 1px solid #4da4de;">${userData.Holding[i].coin_profit} Rs</th>
//                   </tr>
//                   `
//                     }
//                 }

//                 if (ptp < 0) {
//                     str += `
//                 <tr style="color: red;">
//                 <th style="border: 1px solid #4da4de;">Final</th>
//                 <th style="border: 1px solid #4da4de;">₹ ${userData.total_current_value}</th>
//                 <th style="border: 1px solid #4da4de;">₹ ${userData.total_invested_value}</th>
//                 <th style="border: 1px solid #4da4de;">₹${ptp.toFixed(2)} Rs</th>

//               </tr>
//               `
//                 }
//                 else {
//                     str += `
//                 <tr style="color: green;">
//                 <th style="border: 1px solid #4da4de;">Total</th>
//                 <th style="border: 1px solid #4da4de;">₹ ${userData.total_current_value}</th>
//                 <th style="border: 1px solid #4da4de;">₹ ${userData.total_invested_value}</th>
//                 <th style="border: 1px solid #4da4de;"> ${ptp.toFixed(2)} Rs</th>
//               </tr>
//               `
//                 }


//                 str += `You may turn off the notifications from the website.`

//                 if (userData.emailOnOff == "ON") {

//                     var mailOptions = {
//                         from: 'dummycrypto2@gmail.com',
//                         to: userData.email,
//                         // to: 'anujsherma21@gmail.com',
//                         subject: `Dummy Crypto Portfolio Update`,
//                         text: `Dear ${userData.fname} ${userData.lname} , Here is your portfolio `,
//                         html: str
//                     };

//                     const as = await transporter.sendMail(mailOptions, function (error, info) {
//                         if (error) {
//                             console.log('Daily Email Not sent: ');
//                             console.log(error.message);

//                         } else {
//                             console.log('Daily Email sent: ' + info.response);
//                         }
//                     });
//                 }
//             }
//             dailyUpdateMail();
//         }, t);
//     }
//     catch {

//     }
// }

// dailyUpdateMail();
// setInterval(updating, 300000);  // 5 min

const port = process.env.PORT || '8880';
app.listen(port, ["192.168.56.1", "localhost"], () => {
    console.log(("listened on port ", port));
})