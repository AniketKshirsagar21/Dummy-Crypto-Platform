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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
async function verifyPassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
const router = require('express').Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const temppathviews = path.join(__dirname, "../../templates/views");
const temppathpartials = path.join(__dirname, "../../templates/partials");

var r3 = 0;

router.route('/')

    .get((req, res) => {
        console.log("Login")
        let r5 = req.session.cuser;
        if (req.session.cuser == "userwho") {
            r5 = "--"
        }

        res.send({
            header_Username: r5,
            total_profit: r3,
        });

    })
    .post(async (req, res) => {
        try {

            const check_Username_available =
                await cryptoPortfolio.findOne({ username: req.body.entered_username });
            if (check_Username_available == null) {
                // invalid
                res.send({
                    invalid_msg: "Invalid Username",
                    token: "no"
                })
            }
            else {
                let isMatching = await verifyPassword(req.body.entered_password,check_Username_available.password)
                if (isMatching == 0) {
                    res.send({
                        invalid_msg: "Invalid Password",
                        token: "no"
                    })
                }
                else {
                    console.log("Correct log in");
                    let username1 = req.body.entered_username;
                    const token = jwt.sign({ username1 }, 'secret-key', { expiresIn: '1h' });
                    res.send({
                        invalid_msg: "Correct",
                        token: token
                    })
                }
            }
        }
        catch (er) {
            console.log("error = ", er)
            res.send("error in login ");
        }
    })


module.exports = router;