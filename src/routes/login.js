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

// app.set("view engine", "hbs");
// app.set("views", temppathviews);
// hbs.registerPartials(temppathpartials);

// hbs.registerHelper('ifCond', function (v1, v2, options) {
//     if (v1 < v2) {
//         return options.fn(this);
//     }
//     return options.inverse(this);
// });

// hbs.registerHelper('ifEqual', function (v1, v2, options) {
//     if (v1 == v2) {
//         return options.fn(this);
//     }
//     return options.inverse(this);
// });

// app.use(session({
//     secret: 'sc',
//     resave: false,
//     saveUninitialized: false,
// }))


router.route('/')

.get( (req, res) => {
    let r5 = req.session.cuser;
    if (req.session.cuser == "userwho") {
        r5 = "--"
    }
    res.render("myloginpage", {
        header_Username: r5,
        total_profit: r3,
    });

})
.post(async (req, res) => {
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
            // cuser = req.body.entered_username;
            req.session.cuser = req.body.entered_username;
            // console.log("after logining  " + req.session.cuser);

            res.redirect("/");
        }
    }
    catch (er) {
        res.send("error in login ");
    }
})


module.exports = router;