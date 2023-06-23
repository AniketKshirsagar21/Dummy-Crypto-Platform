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
    .get(async (req, res) => {
        try {
            // console.log("very first " + req.session.cuser);
            var frnds;
            var cnoh;
            let r5 = req.session.cuser;
            if (req.session.cuser == "userwho") {
                r5 = "--";
                res.render("friends", {
                    header_Username: r5,
                    total_profit: r3,
                    // friendList: cnoh.friends,
                    // outgoing_req: cnoh.outgoing_req,
                    // incoming_req: cnoh.incoming_req
                })
            }
            else {
                cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
                res.render("friends", {
                    header_Username: r5,
                    total_profit: r3,
                    friendList: cnoh.friends,
                    outgoing_req: cnoh.outgoing_req,
                    incoming_req: cnoh.incoming_req
                })
            }
        }
        catch (err) {
            res.send(err);
        }
    });



router.route('/sendReq')
    .post(async (req, res) => {
        try {
            if (req.session.cuser == "userwho") {
                res.redirect("/myloginpage");
            }
            var cnoh;
            var required_user = req.body.searched_username;
            cnoh = await cryptoPortfolio.findOne({ username: required_user });
            if (req.body.searched_username == req.session.cuser) {

                res.send("You cant send request to your own");
            }
            if (cnoh == null) {
                res.send("user dont exist");
            }
            else {
                const updating1 = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
                    $addToSet: {
                        outgoing_req: required_user
                    }
                })
                const updating2 = await cryptoPortfolio.updateOne({ username: required_user }, {
                    $addToSet: {
                        incoming_req: req.session.cuser
                    }
                })
            }
            cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
            let r5 = req.session.cuser;
            if (req.session.cuser == "userwho") {
                r5 = "--"
            }
            res.render("friends", {
                header_Username: r5,
                total_profit: r3,
                friendList: cnoh.friends,
                outgoing_req: cnoh.outgoing_req,
                incoming_req: cnoh.incoming_req
            })

        }
        catch (err) {
            res.send("error in sending req");
        }
    })

router.route('/acceptIncomingReq').post(async (req, res) => {
    try {
        var cnoh;
        var required_user = req.body.incoming_req_username;
        cnoh = await cryptoPortfolio.findOne({ username: required_user });
        if (cnoh == null) {
            res.send("user dont exist");
        }
        else {
            const updating1 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
                $addToSet: {
                    friends: required_user
                },
                $pull: {
                    incoming_req: required_user
                }
            });

            const updating2 = await cryptoPortfolio.findOneAndUpdate({ username: required_user }, {
                $addToSet: {
                    friends: req.session.cuser
                },
                $pull: {
                    outgoing_req: req.session.cuser
                }
            })
        }
        cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        // res.render("friends", {
        //     friendList: cnoh.friends,
        //     outgoing_req: cnoh.outgoing_req,
        //     incoming_req: cnoh.incoming_req
        // })
        let r5 = req.session.cuser;
        if (req.session.cuser == "userwho") {
            r5 = "--"
        }
        res.render("friends", {
            header_Username: r5,
            total_profit: r3,
            friendList: cnoh.friends,
            outgoing_req: cnoh.outgoing_req,
            incoming_req: cnoh.incoming_req
        })

    }
    catch (err) {
        res.send("error in sending req");
    }
})


router.route('/declineIncomingReq').post(async (req, res) => {
    try {
        var cnoh;
        var required_user = req.body.incoming_req_username;
        cnoh = await cryptoPortfolio.findOne({ username: required_user });
        if (cnoh == null) {
            res.send("user dont exist");
        }
        else {
            const updating1 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {

                $pull: {
                    incoming_req: required_user
                }
            });

            const updating2 = await cryptoPortfolio.findOneAndUpdate({ username: required_user }, {

                $pull: {
                    outgoing_req: req.session.cuser
                }
            })
        }
        cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        // res.render("friends", {
        //     friendList: cnoh.friends,
        //     outgoing_req: cnoh.outgoing_req,
        //     incoming_req: cnoh.incoming_req
        // })
        let r5 = req.session.cuser;
        if (req.session.cuser == "userwho") {
            r5 = "--"
        }
        res.render("friends", {
            header_Username: r5,
            total_profit: r3,
            friendList: cnoh.friends,
            outgoing_req: cnoh.outgoing_req,
            incoming_req: cnoh.incoming_req
        })
    }
    catch (err) {
        res.send("error in sending req");
    }
})

router.route('/removeOutgoingReq')
    .post(async (req, res) => {
        try {
            var cnoh;
            var required_user = req.body.remove_username;
            cnoh = await cryptoPortfolio.findOne({ username: required_user });
            if (cnoh == null) {
                res.send("user dont exist");
            }
            else {
                const updating1 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {

                    $pull: {
                        outgoing_req: required_user
                    }
                });

                const updating2 = await cryptoPortfolio.findOneAndUpdate({ username: required_user }, {

                    $pull: {
                        incoming_req: req.session.cuser
                    }
                })
            }
            cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
            // res.render("friends", {
            //     friendList: cnoh.friends,
            //     outgoing_req: cnoh.outgoing_req,
            //     incoming_req: cnoh.incoming_req
            // })
            let r5 = req.session.cuser;
            if (req.session.cuser == "userwho") {
                r5 = "--"
            }
            res.render("friends", {
                header_Username: r5,
                total_profit: r3,
                friendList: cnoh.friends,
                outgoing_req: cnoh.outgoing_req,
                incoming_req: cnoh.incoming_req
            })

        }
        catch (err) {
            res.send("error in sending req");
        }
    })

router.route('/removeFriend').post(async (req, res) => {
    try {
        var cnoh;
        var required_user = req.body.friend_username_name;
        cnoh = await cryptoPortfolio.findOne({ username: required_user });
        if (cnoh == null) {
            res.send(required_user);
        }
        else {
            const updating1 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {

                $pull: {
                    friends: required_user
                }
            });

            const updating2 = await cryptoPortfolio.findOneAndUpdate({ username: required_user }, {

                $pull: {
                    friends: req.session.cuser
                }
            })
            cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
            // res.render("friends", {
            //     friendList: cnoh.friends,
            //     outgoing_req: cnoh.outgoing_req,
            //     incoming_req: cnoh.incoming_req
            // })
            let r5 = req.session.cuser;
            if (req.session.cuser == "userwho") {
                r5 = "--"
            }
            res.render("friends", {
                header_Username: r5,
                total_profit: r3,
                friendList: cnoh.friends,
                outgoing_req: cnoh.outgoing_req,
                incoming_req: cnoh.incoming_req
            })
        }
    }
    catch (err) {
        res.send("error in sending req");
    }
})


module.exports = router;