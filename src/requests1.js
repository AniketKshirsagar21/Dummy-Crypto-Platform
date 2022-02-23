const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cryptoPortfolio = require("./models/registers")
const fetch = require('node-fetch');
const e = require('express');
const async = require('hbs/lib/async');
const { redirect } = require('express/lib/response');

require('./db/conn');
require('./requests1.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const temppathviews = path.join(__dirname, "../templates/views");
const temppathpartials = path.join(__dirname, "../templates/partials");

var apidatas;
var cval1;
var cval2;
var cprof1 = 0;
var cprof2 = 0;
var cuser = "userwho";
var cname;


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




app.get("/", async (req, res) => {
    try {
        var cnoh;
        cnoh = await cryptoPortfolio.findOne({ username: cuser });
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
                    if (cnoh.coin_symbol1 == data[i].symbol) {
                        cnoh.coin_current1 = (n * cnoh.coin_number1).toFixed(2);
                        cval1 = cnoh.coin_current1;
                        cnoh.coin_profit1 = (cnoh.coin_current1 - cnoh.coin_invested_amount1).toFixed(2);
                    }
                    else if (cnoh.coin_symbol2 == data[i].symbol) {
                        cnoh.coin_current2 = (n * cnoh.coin_number2).toFixed(2);
                        cval2 = cnoh.coin_current2;
                        cnoh.coin_profit2 = (cnoh.coin_current2 - cnoh.coin_invested_amount2).toFixed(2);
                    }
                    let p49 = internationalNumberFormat.format(n);
                    let tempObj = {
                        idx: i,
                        rank: `${data[i].rank}`,
                        symbol: `${data[i].symbol}`,
                        name: `${data[i].name}`,
                        currentPrice: `${n}`,
                        percent: `${data[i].quotes.INR.percent_change_24h}`
                    }
                    apiData.push(tempObj);
                }
                apidatas = apiData;
            })
            .catch((errr) => {
                console.log('API Error' + errr);
            });

        var r2 = (cnoh.available_balance).toFixed(2);
        var r3 = (cnoh.total_profit).toFixed(2);
        cname = cnoh.fname + " " + cnoh.lname;

        if (cuser == "userwho") {
            cnoh = "user"
            res.render("index", {
                arra: apidatas,
                ls: cnoh,
                available_balance: 10000,
                total_profit: 0,
                current_username: "--",
                current_name: "--"
            });
        }
        else {
            res.render("index", {
                arra: apidatas,
                ls: cnoh,
                available_balance: r2,
                total_profit: r3,
                current_username: cuser,
                current_name: cname,
            });
        }
    }
    catch (err) {
        res.send("bruh ! error");
    }
})



app.post("/index", async (req, res) => {
    ///// SELL
    try {
        const coin_no = req.body.sl;
        const cnoh = await cryptoPortfolio.findOne({ username: cuser });

        var current_no_of_holdings = cnoh.no_of_holdings;
        current_no_of_holdings = current_no_of_holdings - 1;
      
        if (coin_no == 1) {
            var new_bal = cval1;
            new_bal = new_bal + cnoh.available_balance;
            var new_profit = cnoh.total_profit;
            cprof1 = cval1 - cnoh.coin_invested_amount1;
            new_profit = new_profit + cprof1;
            cprof2 = 0; cprof1 = 0;

            const updating = await cryptoPortfolio.updateOne({ username: cuser }, {
                coin_symbol1: "Not",
                coin_name1: "Not",
                coin_buy_price1: 0,
                coin_invested_amount1: 0,
                no_of_holdings: current_no_of_holdings,
                coin_number1: 0,
                available_balance: new_bal,
                total_profit: new_profit
            })
        }
        else if (coin_no == 2) {
            var new_bal = cval2;
            new_bal = new_bal + cnoh.available_balance;
            var new_profit = cnoh.total_profit;
            cprof2 = cval2 - cnoh.coin_invested_amount2;
            cprof1 = 0;
            new_profit = new_profit + cprof2;
            cprof2 = 0;

            const updating = await cryptoPortfolio.updateOne({ username: cuser }, {
                coin_symbol2: "Not",
                coin_name2: "Not",
                coin_buy_price2: 0,
                coin_invested_amount2: 0,
                no_of_holdings: current_no_of_holdings,
                coin_number2: 0,
                available_balance: new_bal,
                total_profit: new_profit
            })
        }
        res.redirect("/");
    }
    catch (er) {
        res.send("e44r");
    }
});

app.get("/myloginpage", (req, res) => {
    res.render("myloginpage");
})

app.post("/logout", async (req, res) => {
    cuser = "userwho";
    res.redirect("/");
})

app.post("/myloginpage", async (req, res) => {
    try {
        const check_Username_available =
            await cryptoPortfolio.findOne({ username: req.body.entered_username });
        if (check_Username_available == null) {
            // already tacken
            res.render("myloginpage", {
                invalid_msg: "Invalid Username"
            })
        }
        else if (check_Username_available.password != req.body.entered_password) {
            res.render("myloginpage", {
                invalid_msg: "Invalid Password"
            })
        }
        else {
            cuser = req.body.entered_username;
            res.redirect("/");
        }
    }
    catch (er) {
        res.send("error in login ");
    }
})

app.get("/myregisterpage", (req, res) => {
    res.render("myregisterpage");
})

app.post("/myregisterpage", async (req, res) => {
    try {
        const check_Username_available =
            await cryptoPortfolio.findOne({ username: req.body.Choosen_username });
        if (check_Username_available != null) {
            // already tacken
            res.render("myregisterpage", {
                notavailable: "Username not available",
                updateFname: req.body.fname,
                updateLname: req.body.lname,
                updateusername: req.body.Choosen_username,
                updatepassword: req.body.Choosen_password,
                updateemail: req.body.myemail
            })
        }
        else if (req.body.Choosen_username == "") {
            // already tacken
            res.send("username not valid ");
        }
        else {
            // available
            // save to database and update current username

            const ppp = new cryptoPortfolio({
                username: req.body.Choosen_username,
                password: req.body.Choosen_password,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.myemail,

                no_of_holdings: 0,
                available_balance: 10000,

                total_invested_value: 0,
                total_current_value: 0,
                total_profit: 0,

                coin_no1: 1,
                coin_symbol1: "Not",
                coin_name1: 0,
                coin_buy_price1: 0,
                coin_invested_amount1: 0,
                coin_number1: 0,
                coin_profit1: 0,
                coin_current1: 0,

                coin_no2: 2,
                coin_symbol2: "Not",
                coin_name2: 0,
                coin_buy_price2: 0,
                coin_invested_amount2: 0,
                coin_number2: 0,
                coin_profit2: 0,
                coin_current2: 0,
            })
            const updating2 = ppp.save();

            cuser = req.body.Choosen_username;
            res.redirect("/");
        }
    }
    catch (er) {
        res.send("er in register post");
    }
})


app.post("/login", async (req, res) => {
    /// after clicking buy button on buyDataPage
    /// req.body  coming from BuyDataPage
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: cuser });
        var current_no_of_holdings = cnoh.no_of_holdings;
        current_no_of_holdings = current_no_of_holdings + 1;

        if (cnoh.available_balance < req.body.buyAmm) {
            res.send("Not enough ammount to buy");
        }
        else {
            if (cnoh.coin_symbol1 == "Not") {
                var r1 = cnoh.available_balance;
                r1 = r1 - req.body.buyAmm;
                let no_of_coins = (req.body.buyAmm / req.body.bp).toFixed(9);
                const updating = await cryptoPortfolio.updateOne({ username: cuser }, {
                    coin_symbol1: req.body.bcs,
                    coin_name1: req.body.bcn,
                    coin_buy_price1: req.body.bp,
                    coin_invested_amount1: req.body.buyAmm,
                    no_of_holdings: current_no_of_holdings,
                    coin_number1: no_of_coins,
                    available_balance: r1
                })
                res.redirect("/");
            }
            else if (cnoh.coin_symbol2 == "Not") {
                var r1 = cnoh.available_balance;
                r1 = r1 - req.body.buyAmm;

                let no_of_coins = (req.body.buyAmm / req.body.bp).toFixed(9);
                const updating = await cryptoPortfolio.updateOne({ username: cuser }, {
                    coin_symbol2: req.body.bcs,
                    coin_name2: req.body.bcn,
                    coin_buy_price2: req.body.bp,
                    coin_invested_amount2: req.body.buyAmm,
                    no_of_holdings: current_no_of_holdings,
                    coin_number2: no_of_coins,
                    available_balance: r1
                })
            res.redirect("/");
            }
            else {
                res.send("current_no_of_holdings");
            }
        }
    }
    catch (err) {
        res.send("err");
    }
})
app.post("/BuyDataPage", async (req, res) => {
    try {
        const cnoh = await cryptoPortfolio.findOne({ username: cuser });
        const current_no_of_holdings = cnoh.no_of_holdings;
        if (cuser == "userwho") {
            res.redirect("/myloginpage");
        }
        else if (current_no_of_holdings >= 2) {
            res.render('BuyDataPage', {
                suc1: "You have reached the maximum limit of holding coins at a time in your portfolio  !",
                suc2: "Please Sell some coins and try again"
            });
        }
        else {
            const index = req.body.sellCoin
            res.render("BuyDataPage", {
                buyCoinName: apidatas[index].name,
                buyCoinSymboll: apidatas[index].symbol,
                BuyPrice: apidatas[index].currentPrice,
            });
        }
    }
    catch (err) {
        res.send(err);
    }
})

app.post("/some", async (req, res) => {
    try {
        res.send(`
       <button type="button" class="btn btn-primary" style="margin: 0px 10px;  padding: 2px; ">
       <a class="nav-link active" aria-current="page" href="/">Home</a>
       </button>`)
    }
    catch (err) {
        res.send(err);
    }
})

app.listen(8800, () => {
    console.log(("listened on port 8800"));
})