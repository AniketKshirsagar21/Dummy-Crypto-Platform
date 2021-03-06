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
const nodemailer = require('nodemailer');


const router = require('express').Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const temppathviews = path.join(__dirname, "../../templates/views");
const temppathpartials = path.join(__dirname, "../../templates/partials");

var r3 = 0;

router.route('/')
.get( (req, res) => {
    let r5 = req.session.cuser;
    if (req.session.cuser == "userwho") {
        r5 = "--"
    }
    res.render("myregisterpage", {
        header_Username: r5,
        total_profit: r3,
    });
})

.post( async (req, res) => {
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

            
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dummycrypto2@gmail.com',
                    pass: 'Dummy@123'
                }
            });


            var mailOptions = {
                from: 'dummycrypto2@gmail.com',
                to: req.body.myemail,
                // to: 'anujsherma21@gmail.com',
                subject: `Successful registration on Dummy Crypto`,
                html: `Dear <strong style="color: blue;">${ req.body.fname} ${ req.body.lname} </strong> , you have successfully registered on Dummy Crypto platform.
                <br>
            
                Login Credentials are
                <br>
                Username :- <strong style="color: red;">${ req.body.Choosen_username}</strong>
                <br>
                Password :- <strong style="color: green;">${ req.body.Choosen_password}</strong>
                <br>
                <br>
                Information you submitted
                <br>
                Name :-${ req.body.fname} ${ req.body.lname} 
                <br>
                Email :- ${req.body.myemail}
                
                <br>
                <br>
            
                <span style="color: red;">
                    Website Link
                </span>
                :-https://dummy-crypto-11.herokuapp.com/
                <br>
                <br>
            
                <p>
                    You have given some dummy balance which can be used to Buy Multiple Cryptocoins.
                    There are 2 types of portfolios. One is Regular portfolio and other one is Global portfolio.
                    <br>
                    <span style="color: blue;">
                        Regular portfolio
                    </span> :- Available Balance = ??? 10,000
                    This portfolio is visible to you only.
                    <br>
                    <br>
            
                    <span style="color: blue;">
                        Global portfolio
                    </span>:- Available Balance = ??? 5,000
                    This portfolio is visible to others also.
                    <br>
                    You can hold at max 5 coins at a time in your portfolio.
                    You will get daily update sof your portfolio at 10:00 AM everyday.
            
                    <br>
                    Keep visiting the Website
                    <br><br>
                    <span style="color: red;">
            
                        Thanks <br>
                        Dummy Crypto
                    </span>
                </p>
             `,
              
            };
    
            const as = await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error.message);
    
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            const ppp = new cryptoPortfolio({
                username: req.body.Choosen_username,
                password: req.body.Choosen_password,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.myemail,

                no_of_holdings: 0,
                available_balance: 10000,
                total_profit: 0,

                total_invested_value: 0,
                total_current_value: 0,
                portfolio_total_profit : 0,

                emailOnOff: "On",

                C_total_invested_value: 0,
                C_total_current_value: 0,
                C_portfolio_total_profit: 0,

                Holding: [],

                C_available_balance: 5000,
                C_total_profit: 0,
                C_no_of_holdings: 0,

                contestHolding: [],
            })
            const updating2 = ppp.save();

            // cuser = req.body.Choosen_username;
            req.session.cuser = req.body.Choosen_username;
            res.redirect("/");
        }
    }
    catch (er) {
        res.send("er in register post");
    }
})





module.exports = router;