const User=require('../models/user');
const bcrypt=require('bcrypt');  //decrypt hashed passwords
const nodemailer=require('nodemailer');
const  config=require('../config/config');
const randomstring=require('randomstring');
const { findById } = require('../models/user');



const securedPassword= async(password) =>{

    try{
         const passwordHash =await bcrypt.hash(password,10);
         return passwordHash;
       }catch(error){
         console.log(error.message);
            }
 }


 const loadLogin= async(req,res) =>{
    try{

        res.render('admin_login.ejs');

    }catch(error){
        console.log(error.message);
    }
    }



    module.exports={
        loadLogin
    }