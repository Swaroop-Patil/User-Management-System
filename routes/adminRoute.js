const express=require('express');
const bodyParser=require('body-parser');//to encode the incoming data
const session=require("express-session"); //for user login logout
const multer=require('multer');//to store files,images in server
const path=require('path');
const adminController= require('../controllers/adminController');
const config=require('../config/config.js');
const auth=require('../middleware/auth.js');



const admin_route=express();

admin_route.set('view engine','ejs');         //tell admin_route which view engine u r using
admin_route.set('views','./views/admin');     //and tell where views r 


admin_route.use(bodyParser.json());              //  use the data frm bodyParser
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.use(session({secret:config.sessionSecret}));

admin_route.use(express.static('public'));




admin_route.get('/admin',adminController.loadLogin);
admin_route.get('*',function(req,res){

    res.redirect('/admin');
})

module.exports= admin_route;