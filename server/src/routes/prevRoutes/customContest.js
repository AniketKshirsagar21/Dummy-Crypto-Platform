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
.get( async (req, res) => {
    try {

        const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        var cclist = cnoh.users_contests;

        let cclist2 = [];
        let ccrequests = cnoh.incoming_contests_req;

        let n = cclist.length;
        let p = 0;
        for (let i = 0; i < n; i++) {
            const cnoh2 = await contetsCollection.findOne({ contestName: cclist[i] });
            if (cnoh2 != null) {
                // console.log(cnoh2);
                // let tem = {
                //     contestName: cnoh2.contestName,
                // }
                // let tem2 = JSON.parse(cnoh2);

                cclist2.push(cnoh2);
                // cclist2[p].push(cnoh2.participants);
                // p++;
            }
        }
        console.log(cclist2);
        if (req.session.cuser == "userwho") {
            res.render("competition", {
                cclist2: cclist2,
                ccrequests: ccrequests,
                header_Username: "--",
                total_profit: (cnoh.total_profit).toFixed(2)

            })
        }

        else {
            res.render("competition", {
                cclist2: cclist2,
                ccrequests: ccrequests,
                header_Username: req.session.cuser,
                total_profit: (cnoh.total_profit).toFixed(2)

            })
        }
    }
    catch (er) {
        res.send(er);
    }
})


router.route('/createcontest')
.post( async (req, res) => {
    try {
        var cnoh;
        var prof;
        var uname;
        var required_user = req.body.friend_username_name_showdata;
        cnoh = await contetsCollection.findOne({ contestName: req.body.contest_name });
        if (cnoh != null) {
            res.send("Already exist");
        }
        else {
            const cc = await new contetsCollection({
                contestName: req.body.contest_name,
                participants: [{
                    username: req.session.cuser,
                    invested_amount: 45,
                    available_amount: 32,
                    Profit: 32,
                    inProfit: 99,
                }],
                admin_username: req.session.cuser
            })

            const updating2 = await cc.save();

            const updating3 = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
                $addToSet: {
                    users_contests: req.body.contest_name
                }
            })
            res.redirect("back")
        }
    }
    catch (err) {
        res.send(err);
    }
})

//here
router.route('/sendContestReq')
.post( async (req, res) => {
    try {
        var cnoh;
        var required_user = req.body.searchUname;
        cnoh = await cryptoPortfolio.findOne({ username: required_user });
        if (req.body.searchUname == req.session.cuser) {

            res.send("You cant send request to your own");
        }
        if (cnoh == null) {
            console.log(required_user)
            res.send("user dont exist");
        }
        else {
            // const updating1 = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
            //     $addToSet: {
            //         incoming_contests_req: req.body.searched_username
            //     }
            // })
            const updating2 = await cryptoPortfolio.updateOne({ username: required_user }, {
                $addToSet: {
                    incoming_contests_req: req.body.cnameee
                }
            })
        }
        cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
        
        

        res.redirect("back")

        // const cnoh3 = await cryptoPortfolio.findOne({ username: req.session.cuser });
        // var cclist = cnoh3.users_contests;

        // let cclist2 = [];
        // let ccrequests = cnoh3.incoming_contests_req;

        // let n = cclist.length;
        // let p = 0;
        // for (let i = 0; i < n; i++) {
        //     const cnoh2 = await contetsCollection.findOne({ contestName: cclist[i] });
        //     if (cnoh2 != null) {
        //         // console.log(cnoh2);
        //         // let tem = {
        //         //     contestName: cnoh2.contestName,
        //         // }
        //         // let tem2 = JSON.parse(cnoh2);

        //         cclist2.push(cnoh2);
        //         // cclist2[p].push(cnoh2.participants);
        //         // p++;
        //     }
        // }
        // console.log(cclist2);
        // if (req.session.cuser == "userwho") {
        //     res.render("competition", {
        //         cclist2: cclist2,
        //         ccrequests: ccrequests,
        //         header_Username: "--",
        //         total_profit: (cnoh3.total_profit).toFixed(2)

        //     })
        // }

        // else {
        //     res.render("competition", {
        //         cclist2: cclist2,
        //         ccrequests: ccrequests,
        //         header_Username: req.session.cuser,
        //         total_profit: (cnoh3.total_profit).toFixed(2)

        //     })
        // }
    }
    catch (err) {
        res.send(err);
    }
})

router.route('/acceptContestReq')
.post( async (req, res) => {
    try {
        var cnoh;
        var contest_Name = req.body.incoming_req_contest_name;

        const updating2 = await contetsCollection.findOneAndUpdate({ contestName: contest_Name }, {
            $addToSet: {
                participants: {
                    username: req.session.cuser,
                    invested_amount: 45,
                    available_amount: 32,
                    Profit: 32,
                    inProfit: 99,
                }
            }
        });

        const updating4 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
            $addToSet: {
                users_contests: contest_Name
            },
            $pull: {
                incoming_contests_req: contest_Name,

            }
        });


        // }

      

        res.redirect("back")
    }
    catch (err) {
        res.send(err);
    }
})

router.route('/declineContestReq')
.post( async (req, res) => {
    try {
        var contest_Name = req.body.incoming_req_contest_name;

        const updating4 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {

            $pull: {
                incoming_contests_req: contest_Name,

            }
        });
        res.redirect("back")
    }
    catch (err) {
        res.send(err);
    }
})


module.exports = router;