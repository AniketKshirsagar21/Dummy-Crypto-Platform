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

require('./db/conn');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const temppathviews = path.join(__dirname, "../templates/views");
const temppathpartials = path.join(__dirname, "../templates/partials");
const swal = require('sweetalert');

var apidatas;
var cval1;
var cval2;
var cprof1 = 0;
var cprof2 = 0;
var r2 = 0;
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

app.get("/", async (req, res) => {
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


					if (cnoh.coin_symbol1 == data[i].symbol) {
						cnoh.coin_current1 = (n * cnoh.coin_number1).toFixed(2);
						cval1 = cnoh.coin_current1;
						cnoh.coin_profit1 = (cnoh.coin_current1 - cnoh.coin_invested_amount1).toFixed(2);
						myPortfolio_total_invested += cnoh.coin_invested_amount1;
						myPortfolio_total_Current += cnoh.coin_current1;
						myPortfolio_total_profit += cnoh.coin_profit1;
					}
					else if (cnoh.coin_symbol2 == data[i].symbol) {
						cnoh.coin_current2 = (n * cnoh.coin_number2).toFixed(2);
						cval2 = cnoh.coin_current2;
						cnoh.coin_profit2 = (cnoh.coin_current2 - cnoh.coin_invested_amount2).toFixed(2);

						myPortfolio_total_invested += cnoh.coin_invested_amount2;
						myPortfolio_total_Current += cnoh.coin_current2;
						myPortfolio_total_profit += cnoh.coin_profit2;
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
		cname = cnoh.fname + " " + cnoh.lname;


		const updating20 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {
			coin_current2: cnoh.coin_current2,
			coin_profit2: cnoh.coin_profit2,
			$set: {
				contestHolding: cnoh.contestHolding
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
				myPortfolio_total_invested: myPortfolio_total_invested,
				myPortfolio_total_Current: myPortfolio_total_Current,
				myPortfolio_total_profit: myPortfolio_total_profit,

				C_myPortfolio_total_invested: C_myPortfolio_total_invested,
				C_myPortfolio_total_Current: C_myPortfolio_total_Current,
				C_myPortfolio_total_profit: C_myPortfolio_total_profit,

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
				ls: cnoh,
				cls: cnoh.contestHolding,
				myPortfolio_total_invested: myPortfolio_total_invested,
				myPortfolio_total_Current: myPortfolio_total_Current,
				myPortfolio_total_profit: myPortfolio_total_profit,

				C_myPortfolio_total_invested: C_myPortfolio_total_invested,
				C_myPortfolio_total_Current: C_myPortfolio_total_Current,
				C_myPortfolio_total_profit: C_myPortfolio_total_profit,

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

app.get("/friends", async (req, res) => {
	try {

		// console.log("very first " + req.session.cuser);
		var frnds;
		var cnoh;
		let r5 = req.session.cuser;
		if (req.session.cuser == "userwho") {
			r5 = "--"
		}
		cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });

		res.render("friends", {
			header_Username: r5,
			total_profit: r3,
			friendList: cnoh.friends,
			outgoing_req: cnoh.outgoing_req,
			incoming_req: cnoh.incoming_req
		})


	}
	catch (err) {
		res.send(err);
	}
});

app.post("/selling_coin", async (req, res) => {
	///// SELL
	try {
		const coin_no = req.body.sl;
		const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });

		var current_no_of_holdings = cnoh.no_of_holdings;
		current_no_of_holdings = current_no_of_holdings - 1;

		if (coin_no == 1) {
			var new_bal = cval1;
			new_bal = new_bal + cnoh.available_balance;
			var new_profit = cnoh.total_profit;
			cprof1 = cval1 - cnoh.coin_invested_amount1;
			new_profit = new_profit + cprof1;
			cprof2 = 0; cprof1 = 0;

			const updating = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
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

			const updating = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
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
	let r5 = req.session.cuser;
	if (req.session.cuser == "userwho") {
		r5 = "--"
	}
	res.render("myloginpage", {
		header_Username: r5,
		total_profit: r3,
	});

})

app.post("/logout", async (req, res) => {
	req.session.cuser = "userwho";
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

app.get("/myregisterpage", (req, res) => {
	let r5 = req.session.cuser;
	if (req.session.cuser == "userwho") {
		r5 = "--"
	}
	res.render("myregisterpage", {
		header_Username: r5,
		total_profit: r3,
	});
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

				C_total_invested_value: 0,
				C_total_current_value: 0,
				C_portfolio_total_profit: 0,

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

app.post("/BuyDataPage", async (req, res) => {
	try {
		const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
		const current_no_of_holdings = cnoh.no_of_holdings;
		if (req.session.cuser == "userwho") { res.redirect("/myloginpage"); }

		else {
			const index = req.body.sellCoin
			res.render("BuyDataPage", {
				header_Username: req.session.cuser,
				total_profit: r3,
				buyCoinName: apidatas[index].name,
				buyCoinSymboll: apidatas[index].symbol,
				BuyPrice: apidatas[index].currentPrice,
				avbal: r2,
				coinImg2: apidatas[index].coinImg
			});
		}
	}
	catch (err) {
		res.send(err);
	}
})

app.post("/buy_coin", async (req, res) => {
	/// after clicking buy button on buyDataPage
	/// req.body  coming from BuyDataPage
	try {
		const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
		var current_no_of_holdings = cnoh.no_of_holdings;
		if (current_no_of_holdings >= 2) {
			res.render('BuyDataPage', {
				suc1: "You have reached the maximum limit of holding coins at a time in your portfolio  !",
				suc2: "Please Sell some coins and try again"
			});
		}
		else {
			current_no_of_holdings = current_no_of_holdings + 1;

			if (cnoh.available_balance < req.body.buyAmm) {
				res.send("Not enough ammount to buy");
			}
			else {
				if (cnoh.coin_symbol1 == "Not") {
					var r1 = cnoh.available_balance;
					r1 = r1 - req.body.buyAmm;
					let no_of_coins = (req.body.buyAmm / req.body.bp).toFixed(9);
					const updating = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
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
					const updating = await cryptoPortfolio.updateOne({ username: req.session.cuser }, {
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
	}
	catch (err) {
		res.send("err");
	}
})

///// Friends
app.post("/sendReq", async (req, res) => {
	try {
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
		res.render("friends", {
			friendList: cnoh.friends,
			outgoing_req: cnoh.outgoing_req,
			incoming_req: cnoh.incoming_req
		})

	}
	catch (err) {
		res.send("error in sending req");
	}
})

app.post("/acceptIncomingReq", async (req, res) => {
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
		res.render("friends", {
			friendList: cnoh.friends,
			outgoing_req: cnoh.outgoing_req,
			incoming_req: cnoh.incoming_req
		})

	}
	catch (err) {
		res.send("error in sending req");
	}
})

app.post("/declineIncomingReq", async (req, res) => {
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
		res.render("friends", {
			friendList: cnoh.friends,
			outgoing_req: cnoh.outgoing_req,
			incoming_req: cnoh.incoming_req
		})

	}
	catch (err) {
		res.send("error in sending req");
	}
})

app.post("/removeOutgoingReq", async (req, res) => {
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
		res.render("friends", {
			friendList: cnoh.friends,
			outgoing_req: cnoh.outgoing_req,
			incoming_req: cnoh.incoming_req
		})

	}
	catch (err) {
		res.send("error in sending req");
	}
})

app.post("/removeFriend", async (req, res) => {
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
			res.render("friends", {
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

///// Contests
app.get("/competition", async (req, res) => {
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
		res.render("competition", {
			cclist2: cclist2,
			ccrequests: ccrequests
		})
	}
	catch (er) {
		res.send(er);
	}
})

app.post("/createcontest", async (req, res) => {
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

			res.redirect("competition")

		}
		// cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });

		// res.render("friends", {
		//     friendList: cnoh.friends,
		//     outgoing_req: cnoh.outgoing_req,
		//     incoming_req: cnoh.incoming_req,
		//     friendProfit: prof,
		//     frienduname: uname
		// })

	}
	catch (err) {
		res.send(err);
	}
})

app.post("/sendContestReq", async (req, res) => {
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
		res.redirect("competition")
	}
	catch (err) {
		res.send(err);
	}
})

app.post("/acceptContestReq", async (req, res) => {
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

		res.redirect("competition")
	}
	catch (err) {
		res.send(err);
	}
})

app.post("/declineContestReq", async (req, res) => {
	try {
		var contest_Name = req.body.incoming_req_contest_name;

		const updating4 = await cryptoPortfolio.findOneAndUpdate({ username: req.session.cuser }, {

			$pull: {
				incoming_contests_req: contest_Name,

			}
		});



		res.redirect("competition")
	}
	catch (err) {
		res.send(err);
	}
})



//default Contest
app.get("/defaultContest", async (req, res) => {
	try {
		const cnoh4 = await cryptoPortfolio.find();
		const updating14 = await cryptoPortfolio.findOne({ username: req.session.cuser });

		res.render("defaultContest", {
			userlist: cnoh4,
			cls: updating14.contestHolding,
			C_myPortfolio_total_invested: (updating14.C_total_invested_value).toFixed(2),
			C_myPortfolio_total_Current: (updating14.C_total_current_value).toFixed(2),
			C_myPortfolio_total_profit: (updating14.C_portfolio_total_profit).toFixed(2)
		});
	}
	catch (err) {
		res.send(err);
	}
})

app.post("/C_buy_coin", async (req, res) => {
	try {
		const cnoh = await cryptoPortfolio.findOne({ username: req.session.cuser });
		// gfg
		if (cnoh.contestHolding.length >= 2) {
			res.render('BuyDataPage', {
				suc1: "You have reached the maximum limit of holding coins at a time in your portfolio  !",
				suc2: "Please Sell some coins and try again"
			});
		}
		else {
			console.log(req.body.buyAmm)
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


app.post("/C_selling_coin", async (req, res) => {
	try {
		const cnoh8 = await cryptoPortfolio.findOne({ username: req.session.cuser })
		const arrayIndex = req.body.arrayIndex;
		console.log(arrayIndex)
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


app.get("/updateAll", async (req, res) => {
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
            for (let i = 0; i < 300; i++) {
                let n = apdata[i].quotes.INR.price.toFixed(2);

                if (all[j].contestHolding.length >= 1 &&
                    all[j].contestHolding[0].coin_symbol == apdata[i].symbol) {

                    let ccval1 = (n * all[j].contestHolding[0].coin_number).toFixed(2);

                    all[j].contestHolding[0].coin_current = ccval1;

                    all[j].contestHolding[0].coin_profit = (ccval1 - all[j].contestHolding[0].coin_invested_amount).toFixed(2);

                    C_myPortfolio_total_invested += all[j].contestHolding[0].coin_invested_amount;
                    C_myPortfolio_total_Current += all[j].contestHolding[0].coin_current;
                    C_myPortfolio_total_profit += all[j].contestHolding[0].coin_profit;
                }


                if (all[j].contestHolding.length >= 2 &&
                    all[j].contestHolding[1].coin_symbol == apdata[i].symbol) {

                    let ccval12 = (n * all[j].contestHolding[1].coin_number).toFixed(2);

                    all[j].contestHolding[1].coin_current = ccval12;

                    all[j].contestHolding[1].coin_profit = (ccval12 - all[j].contestHolding[1].coin_invested_amount).toFixed(2);

                    C_myPortfolio_total_invested += all[j].contestHolding[1].coin_invested_amount;
                    C_myPortfolio_total_Current += all[j].contestHolding[1].coin_current;
                    C_myPortfolio_total_profit += all[j].contestHolding[1].coin_profit;
                }
                // console.log(C_myPortfolio_total_invested);
                // console.log(C_myPortfolio_total_Current);


                const updating21 = await cryptoPortfolio.findOneAndUpdate({ username: all[j].username }, {
                    $set: {
                        contestHolding: all[j].contestHolding
                    },
                    C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
                    C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
                    C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),

                })
            }
        }

        res.send("updated all");
    }
    catch (err) {
        res.send(err);
    }
})


async function updating (){
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
				for (let i = 0; i < 300; i++) {
					let n = apdata[i].quotes.INR.price.toFixed(2);
	
					if (all[j].contestHolding.length >= 1 &&
						all[j].contestHolding[0].coin_symbol == apdata[i].symbol) {
	
						let ccval1 = (n * all[j].contestHolding[0].coin_number).toFixed(2);
	
						all[j].contestHolding[0].coin_current = ccval1;
	
						all[j].contestHolding[0].coin_profit = (ccval1 - all[j].contestHolding[0].coin_invested_amount).toFixed(2);
	
						C_myPortfolio_total_invested += all[j].contestHolding[0].coin_invested_amount;
						C_myPortfolio_total_Current += all[j].contestHolding[0].coin_current;
						C_myPortfolio_total_profit += all[j].contestHolding[0].coin_profit;
					}
	
	
					if (all[j].contestHolding.length >= 2 &&
						all[j].contestHolding[1].coin_symbol == apdata[i].symbol) {
	
						let ccval12 = (n * all[j].contestHolding[1].coin_number).toFixed(2);
	
						all[j].contestHolding[1].coin_current = ccval12;
	
						all[j].contestHolding[1].coin_profit = (ccval12 - all[j].contestHolding[1].coin_invested_amount).toFixed(2);
	
						C_myPortfolio_total_invested += all[j].contestHolding[1].coin_invested_amount;
						C_myPortfolio_total_Current += all[j].contestHolding[1].coin_current;
						C_myPortfolio_total_profit += all[j].contestHolding[1].coin_profit;
					}
					// console.log(C_myPortfolio_total_invested);
					// console.log(C_myPortfolio_total_Current);
	
	
					const updating21 = await cryptoPortfolio.findOneAndUpdate({ username: all[j].username }, {
						$set: {
							contestHolding: all[j].contestHolding
						},
						C_total_invested_value: (C_myPortfolio_total_invested).toFixed(2),
						C_total_current_value: (C_myPortfolio_total_Current).toFixed(2),
						C_portfolio_total_profit: (C_myPortfolio_total_profit).toFixed(2),
	
					})
				}
			}
	
			res.send("updated all");
		}
		catch (err) {
			res.send(err);
		}
}

setInterval(updating, 120000);

const port = process.env.PORT || '8800';
app.listen(port, () => {
	console.log(("listened on port ", port));
})