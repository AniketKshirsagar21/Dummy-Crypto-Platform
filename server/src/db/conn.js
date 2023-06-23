// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test3')
//     .then(() => console.log("Database connection successfull "))
//     .catch((err) => {
//         console.log("error in database connection");
//     })
require('dotenv').config()
let DATABASE_URL = process.env.DATABASE_URL

const mongoose = require('mongoose');
const url = DATABASE_URL
const p = "ok";
mongoose.connect(url)
    .then(() => console.log("Database connection successfull "))
    .catch((err) => {
        console.log(err);
})









