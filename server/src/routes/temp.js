const express = require('express');
const app = express();
const cryptoPortfolio = require("../models/registers")

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const async = require('hbs/lib/async');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const updatePassword = async () =>{
    try{
        const data = await cryptoPortfolio.find();
        for(let i = 0;i<data.length;i++){
            let plain = data[i].password;
            const hashed = await hashPassword(plain);
            data[i].password = hashed;
        }
        const update = await cryptoPortfolio.upda
    }
    catch(e){

    }
}