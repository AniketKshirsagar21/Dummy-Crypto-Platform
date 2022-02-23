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
    available_balance: {
        type: Number
    },
    no_of_holdings: {
        type: Number
    },
    friends: [String],
    incoming_req: [String],
    outgoing_req: [String],

    users_contests: [String],
    incoming_contests_req: [String],

    total_invested_value: {
        type: Number
    },
    total_current_value: {
        type: Number
    },
    total_profit: {
        type: Number
    },

    C_available_balance: {
        type: Number
    },
    C_total_profit: {
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
        coin_current: Number,
        coin_number: Number,
        coin_invested_amount: Number,
        coin_profit: Number
    }],

    coin_no1: {
        type: Number
    },
    coin_symbol1: {
        type: String
    },
    coin_name1: {
        type: String
    },
    coin_buy_price1: {
        type: Number
    },

    coin_current1: {
        type: Number
    },
    coin_number1: {
        type: Number
    },
    coin_invested_amount1: {
        type: Number
    },
    coin_profit1: {
        type: Number
    },


    coin_no2: {
        type: Number
    },
    coin_symbol2: {
        type: String
    },
    coin_name2: {
        type: String
    },
    coin_buy_price2: {
        type: Number
    },
    coin_current2: {
        type: Number
    },
    coin_number2: {
        type: Number
    },
    coin_invested_amount2: {
        type: Number
    },
    coin_profit2: {
        type: Number
    }
})

const cryptoPortfolio = new mongoose.model("updatedportfolios", mySchema);

const ppp = new cryptoPortfolio({
    username: "userwho",
    no_of_holdings: 0,

    available_balance: 10000,

    total_invested_value: 5,
    total_current_value: 5,
    total_profit: 4,

    friends: [],
    incoming_req: [],
    outgoing_req: [],
    users_contests: [],
    incoming_contests_req: [],

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




    C_available_balance: 560,
    C_total_profit: 90,
    C_no_of_holdings: 1,
    
    contestHolding: [{
        coin_no: 21,
        coin_symbol: "String",
        coin_name: "String",
        coin_buy_price: 21,
        coin_current: 21,
        coin_number: 21,
        coin_invested_amount: 21,
        coin_profit: 21
    }],
})
// const updating2 =  ppp.save();



// const savedornot = await updating.save();

module.exports = cryptoPortfolio;
