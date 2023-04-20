require('dotenv').config();
const User=require('../models/user');
const bcrypt=require('bcrypt');
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

 //for send mail
 const sendVerifyMail=async(name,email,user_id) => {
    try{

        const transporter=nodemailer.createTransport({       //give ur host we will provide authenticatio
            host:'smtp.gmail.com',
            port:587,
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
             subject:'For verifiction mail',
             html:'<p>Hi '+name+' please click here to <a href="http://127.0.0.1:3000/register/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("emailhas been sent:- ",info.response);
                }

            })
            

     }catch(error){
        console.log(error.message);
    }

    }

    //for reset password send mail 


    const sendResetPasswordMail=async(name,email,token) => {
        try{
    
            const transporter=nodemailer.createTransport({       //give ur host we will provide authenticatio
                host:'smtp.gmail.com',
                port:587,
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
                 html:'<p>Hi '+name+', please click here to <a href="http://127.0.0.1:3000/forget-password?token='+token+'"> Reset </a> your Password.</p>'
            }
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log("emailhas been sent:- ",info.response);
                    }
    
                })
                
    
         }catch(error){
            console.log(error.message);
        }
    
        }

////
 const loadRegister =async(req,res) => {
     try{
        res.render('registration.ejs');

     }catch(error){
        console.log(error.message);
     }
}


//////
const insertUser=async(req,res) =>{           //pass User from user.js model as an obj and keepit user variable


    try{
        const spassword= await securedPassword(req.body.passwordd);
        const user=new User({  
            
          name:req.body.namee,  
          phoneNo:req.body.phoneNoo, 
          course:req.body.coursee, 
          email:req.body.emaill,
          //image:req.file.filename,
          password:spassword, 
          is_admin:0
        });  
        
        const userData=await user.save();   

      

        if(userData){                        // if a data comes to userData ,send response,render,se
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration.ejs',{message:"Your Registration is Successful,Plz verify ur mail"});
        }

        else{
            res.render('registration.ejs',{message:"Your Registration is Unsuccessful"});
        }

    }catch(error){
        console.log(error.message);
    }
}

///////
const verifyMail=async(req,res) =>{

    try{

     const updateinfo=  await  User.updateOne({_id:req.query.id},{$set:{is_verified:1}});
     console.log(updateInfo);
     res.render("email-verfied");

    }catch(error){
        console.log(error.message);
    }
}

//login user methods started

const loginLoad= async(req,res) =>{
    try{

        res.render('login.ejs');

    }catch(error){
        console.log(error.message);
    }
    }

const verifyLogin= async (req,res) =>{
    
    try{

        const email=req.body.email;
        const password=req.body.password;

       const userData= await User.findOne({email:email})

       if(userData){
           const passwordMatch= await bcrypt.compare(password,userData.password);
             if(passwordMatch){
                  
                 if(userData.is_verified === 0){
                    res.render('login.ejs',{message:"Please verify your mail"});
                  }
                   else{
                    req.session.user_id= userData._id;    //send this user_id to auth.js
                    res.redirect('/house');
                   }
             }
             
             else{
                res.render('login.ejs',{message:"Email and password are incorrect"});
             }

         }

       else{    //if u cant find the userData or email in DB
        res.render('login.ejs',{message:"Email and password are incorrect"});
       }

    }catch(error){
        console.log("error.message");
    }



}

const loadHome= async(req,res) =>{
    try{
        const userData=await User.findById({_id:req.session.user_id})      //as wehad stored our  user_id in session
        res.render('house.ejs',{user:userData});

    }catch(error){
        console.log(error.message);
    }
    }



    const userLogout= async(req,res) =>{
        try{

            req.session.destroy();
            res.redirect('login')
            
    
        }catch(error){
            console.log(error.message);
        }
        }
    
    
///////forget password code

const forgetLoad =async(req,res) => {

    try{
        res.render('forget.ejs');
    
    }catch(error){
        console.log(error.message);
    }
}

const forgetVerify =async(req,res) => {

    try{
        
        const email=req.body.email;
        const userData= await User.findOne({email:email});
        if(userData){
            
              if(userData.is_verified === 0){
                res.render('forget.ejs',{message: "Please Verify your Mail"})
              
              }
               else{
                 const randomString=randomstring.generate();
                 const updatedData=  await User.updateOne({email:email},{$set:{token:randomString}});
                 sendResetPasswordMail(userData.name,userData.email,randomString);
                 res.render('forget.ejs',{message: "Check ur mail to reset password"});
                 
               }
             
        }
        else{
            res.render('forget.ejs',{message: "User Mail is incorrect"});
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
            res.render('forget-password.ejs',{user_id:tokenData._id});
        }
        else{
            res.render('404.ejs',{message:"Token is invalid"});
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

        const updatedData=await User.findByIdAndUpdate({_id:user_id},{ $set:{password:secure_password,token:''}});

        res.redirect("/login");

    
    }catch(error){
        console.log(error.message);
    }
}


////user profie edit update


const editLoad= async(req,res) => {

    try{
    
        const id=req.query.id;          //if u r geeting data frm url use query
        
   

        const userData=await User.findById({_id:id});
        
        if(userData){
        res.render('edit.ejs',{user:userData});
        }

        else {
            res.redirect("/house"); 
        }

    
    }catch(error){
        console.log(error.message);
    }
}


const updateProfile= async(req,res) => {

    try{
    
                
        if(req.file){   //to update the image
            const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{ $set:{name:req.body.name, email:req.body.email, phoneNo:req.body.phNo, image:req.file.filename }});
        }

        else {
           const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{ $set:{name:req.body.name, email:req.body.email, phoneNo:req.body.phNo, }});
        }
res.redirect('/house');
    
    }catch(error){
        console.log(error.message);
    }
}




module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    editLoad,
    updateProfile
}