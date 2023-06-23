const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const mySchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String
    },
    number: {
        type: Number
    },




    total_invested_value: {
        type: Number
    },
    total_current_value: {
        type: Number
    },
    portfolio_total_profit: {
        type: Number
    },

    emailOnOff: {
        type: String
    },


    total_profit: {
        type: Number
    },
    available_balance: {
        type: Number
    },
    no_of_holdings: {
        type: Number
    },
    Holding: [{
        coin_no: Number,
        coin_symbol: String,
        coin_name: String,
        coin_buy_price: Number,
        coin_number: Number,
        coin_invested_amount: Number,

        coin_current: Number,
        coin_profit: Number,

        date : Date
    }],
    History: [{
        symbol: String,
        name: String,
        coinImg: String,
        date : Date,
        status: String,

        current_balance: Number,

        sell_coin_price : Number, // price of bitcoin at time of sell
        sell_amount : Number, // amount sold
        sell_coin_invested_amount : Number, // amount sold
        sell_profit_gain : Number,

        buy_coin_Price: Number,  // price of bitcoin T TIME OF BUY
        buy_amaount: Number,    // AMOUNT  bought
    }],

    friends: [String],
    incoming_req: [String],
    outgoing_req: [String],
    users_contests: [String],
    incoming_contests_req: [String],




    C_total_invested_value: {
        type: Number
    },
    C_total_current_value: {
        type: Number
    },
    C_total_profit: {
        type: Number
    },
    C_available_balance: {
        type: Number
    },
    C_portfolio_total_profit: {
        type: Number
    },
    C_no_of_holdings: {
        type: Number
    },
    contestHolding: [{
        coin_no: Number,
        coin_symbol: String,
        coin_name: String,
        coin_buy_price: Number,
        coin_number: Number,
        coin_invested_amount: Number,

        coin_current: Number,
        coin_profit: Number,

        date : Date
    }],


})

const cryptoPortfolio = new mongoose.model("updatedportfolios", mySchema);

const ppp = new cryptoPortfolio({
    username: "userwho",
    no_of_holdings: 0,

    available_balance: 10000,
    total_profit: 0,

    total_invested_value: 0,
    total_current_value: 0,
    portfolio_total_profit: 0,

    friends: [],
    incoming_req: [],
    outgoing_req: [],
    users_contests: [],
    incoming_contests_req: [],

    Holding: [{
        coin_no: 0,
        coin_symbol: "-",
        coin_name: "-",
        coin_buy_price: 0,
        coin_current: 0,
        coin_number: 0,
        coin_invested_amount: 0,
        coin_profit: 0
    }],




    C_available_balance: 0,
    C_total_profit: 0,
    C_no_of_holdings: 0,

    C_total_invested_value: 0,
    C_total_current_value: 0,
    C_portfolio_total_profit: 0,

    contestHolding: [{
        coin_no: 0,
        coin_symbol: "-",
        coin_name: "-",
        coin_buy_price: 0,
        coin_current: 0,
        coin_number: 0,
        coin_invested_amount: 0,
        coin_profit: 0
    }],
})
// const updating2 =  ppp.save();



// const savedornot = await updating.save();

module.exports = cryptoPortfolio;
