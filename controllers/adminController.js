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

    
    const verifyLogin= async(req,res) =>
    {
        try{

            const email=req.body.email;
            const password=req.body.password;

            const userData= await User.findOne({email:email});
            if(userData){
                   
              const passwordMatch= await  bcrypt.compare(password,userData.password);   //password => req.body.password,    userData.password => Hashed Password

                  if(passwordMatch){

                    if(userData.is_admin === 0){
                        res.render("admin_login",{message:"Email and password is incorrect"});
                    }  
                       //if mail and password matches
                       else{
                          req.session.user_id= userData._id;  //setting session
                          res.redirect('/admin_house');
                       }
                  }

                    else{
                      res.render("admin_login",{message:"Email and password is incorrect"});
                    }
            }

            else{
                res.render("admin_login",{message:"Email and password is incorrect"});
            }

        }catch(error){
            console.log(error.message);
        }
    }


    const loadDashboard= async(req,res) =>{
        try{
            const userData=await User.findById({_id:req.session.user_id})      //as we had stored our  user_id in session
            res.render('admin_house.ejs',{user:userData});
    
        }catch(error){
            console.log(error.message);
        }
        }

        const adminLogout= async(req,res) =>{
            try{
    
                req.session.destroy();
                res.redirect('/admin')
                
        
            }catch(error){
                console.log(error.message);
            }
            }
        
        

    module.exports={
        loadLogin,
        verifyLogin,
        loadDashboard,
        adminLogout
    }