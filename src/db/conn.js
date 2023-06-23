

// const mongoose = require('mongoose');
// const url = "mongodb+srv://aniketk21:Aniket21@cluster0.gdtwc.mongodb.net/dummyCrypto3?retryWrites=true&w=majority"
// mongoose.connect(url)
//     .then(() => console.log("Database connection successfull "))
//     .catch((err) => {
//         console.log("error in database connection");
//     })




// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test3')
//     .then(() => console.log("Database connection successfull "))
//     .catch((err) => {
//         console.log("error in database connection");
//     })



const mongoose = require('mongoose');
const url = "mongodb+srv://aniketkk21:aniketkk21@cluster0.gdtwc.mongodb.net/mydb3?retryWrites=true&w=majority"

mongoose.connect(url)
    .then(() => console.log("Database connection successfull "))
    .catch((err) => {
        console.log(err);
})









