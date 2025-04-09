require('dotenv').config()
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);
var jwt = require('jsonwebtoken');

const generateUniqueImageName=(image)=>{
    return Math.floor(Math.random()*10000)+new Date().getTime()+image
}

const encryptedPassword=(value)=> cryptr.encrypt(value);
const decryptedPassword=(value)=> cryptr.decrypt(value);

// create token
const Generatetoken =(user)=> {
    return jwt.sign(user,process.env.SECRET_KEY)
}
// create token

// verify token
const Verifytoken =(user)=> {
    return jwt.sign(user,process.env.SECRET_KEY)
}
// verify token

module.exports ={generateUniqueImageName,encryptedPassword,decryptedPassword,Generatetoken,Verifytoken}