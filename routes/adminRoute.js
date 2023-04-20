require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');//to encode the incoming data
const session=require("express-session"); //for user login logout
const multer=require('multer');//to store files,images in server
const path=require('path');
const adminController= require('../controllers/adminController');
const config=require('../config/config.js');
const auth=require('../middleware/adminAuth.js');



const admin_route=express();

admin_route.set('view engine','ejs');         //tell admin_route which view engine u r using
admin_route.set('views','./views/admin');     //and tell where views r 


admin_route.use(bodyParser.json());              //  use the data frm bodyParser
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.use(session({secret:config.sessionSecret}));

admin_route.use(express.static('public'));




admin_route.get('/admin',auth.isLogout,adminController.loadLogin);
admin_route.post('/admin',adminController.verifyLogin);
admin_route.get('/admin_house',auth.isLogin,adminController.loadDashboard);
admin_route.get('/admin_logout',auth.isLogin,adminController.adminLogout);
admin_route.get('/admin_forget',auth.isLogout,adminController.forgetLoad);
admin_route.post('/admin_forget',auth.isLogout,adminController.forgetVerify);
admin_route.get('/admin_forget-password',auth.isLogout,adminController.forgetPasswordLoad);
admin_route.post('/admin_forget-password',adminController.resetPassword);

admin_route.get('/admin_dashboard',auth.isLogin,adminController.adminDashboard);





admin_route.get('*',function(req,res){

    res.redirect('/admin');
})



module.exports= admin_route;