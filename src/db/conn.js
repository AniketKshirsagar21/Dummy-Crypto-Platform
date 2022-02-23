

// const mongoose = require('mongoose');
// const url = "mongodb+srv://aniketk21:Aniket21@cluster0.gdtwc.mongodb.net/mydb?retryWrites=true&w=majority"
// mongoose.connect(url)
//     .then(() => console.log("Database connection successfull "))
//     .catch((err) => {
//         console.log("error in database connection");
//     })




// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test1')
//     .then(() => console.log("Database connection successfull "))
//     .catch((err) => {
//         console.log("error in database connection");
//     })




const mongoose = require('mongoose');
const url = "mongodb+srv://aniketk21:Aniket21@cluster0.gdtwc.mongodb.net/mydb2?retryWrites=true&w=majority"

mongoose.connect(url)
    .then(() => console.log("Database connection successfull "))
    .catch((err) => {
        console.log(err);
    })
