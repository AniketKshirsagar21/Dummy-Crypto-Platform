
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const mySchema = new mongoose.Schema({

    participants: [{
        username : String,
        invested_amount : Number,
        available_amount : Number,
        Profit : Number,
        inProfit : Number,
    }],

    contestName: {
        type: String
    },
    admin_username: {
        type: String
    },
})

const contetsCollection = new mongoose.model("contetsCollection", mySchema);

const ppp = new contetsCollection({
    contestName: "some",
    participants: [{
        username : "tt",
        invested_amount : 45,
        available_amount : 32,
        Profit : 32,
        inProfit : 99,
    }],

    admin_username: "edd"
    
})

// const updating2 =  ppp.save();



// const savedornot = await updating.save();

module.exports = contetsCollection;