require('dotenv').config();
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


 const sendResetPasswordMail=async(name,email,token) => {    //token generated frm randomstring
    try{

        const transporter=nodemailer.createTransport({       //give ur host we will provide authenticatio
            host:config.smtp,
            port:config.port,
            secure:false,
            reqireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        
        const mailOptions={
            from:config.emailUser,
            to:email,                                  //from sbpatil to user's email
             subject:'For Reset Password',
             html:'<p>Hi '+name+', please click here to <a href="http://127.0.0.1:3000/admin_forget-password?token='+token+'"> Reset </a> your Password.</p>'
        }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("email has been sent:- ",info.response);
                }

            })
            

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
        
            const forgetLoad =async(req,res) => {

                try{
                    res.render('admin_forget.ejs');
                
                }catch(error){7
                    console.log(error.message);
                }
            }
          
            const forgetVerify =async(req,res) => {

                try{
                    
                    const email=req.body.email;
                    const userData= await User.findOne({email:email});
                    if(userData){
                        
                          if(userData.is_admin === 0){    //if its a user 
                            res.render('admin_forget.ejs',{message: "Please Verify your Mail"})
                          
                          }
                           else{
                             const randomString=randomstring.generate();
                             const updatedData=  await User.updateOne({email:email},{$set:{token:randomString}}); //update token in DB
                             sendResetPasswordMail(userData.name,userData.email,randomString);
                             res.render('admin_forget.ejs',{message: "Check ur mail to reset password"});
                             
                           }
                         
                    }
                    else{
                        res.render('admin_forget.ejs',{message: "User Mail is incorrect"});
                    }
                
                }catch(error){
                    console.log(error.message);
                }
            }
            
            
            const forgetPasswordLoad =async(req,res) => {
            
                try{
                    const token= req.query.token;
                    const tokenData=await User.findOne({token:token});
                    if(tokenData){
                        res.render('admin_forget-password.ejs',{user_id:tokenData._id});
                    }
                    else{
                        res.render('admin_404.ejs',{message:"Token is invalid"});
                    }
                
                }catch(error){
                    console.log(error.message);
                }
            }



            const resetPassword =async(req,res) => {

                try{
                    const password= req.body.password;
                    const user_id=req.body.user_id;
                    
                    const secure_password=await securedPassword(password);
            
                    const updatedData=await User.findByIdAndUpdate({_id:user_id},{ $set:{password:secure_password,token:''}});//after settting the password make token:"" empty so that no one opens this link again
            
                    res.redirect("/admin");
            
                
                }catch(error){
                    console.log(error.message);
                }
            }
            
    const adminDashboard = async(req,res) => {

        try{
              const usersData= await User.find({is_admin: 0});
             res.render('admin_dashboard.ejs',{users:usersData});
        
        }catch (error){
            console.log(error.message);
        }
    }


    module.exports={
        loadLogin,
        verifyLogin,
        loadDashboard,
        adminLogout,
        forgetLoad,
        forgetVerify,
        forgetPasswordLoad,
        resetPassword,
        adminDashboard
    }