require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const session=require("express-session");
const multer=require('multer');//to store files,images in server
const path=require('path');
const userController= require('../controllers/userController.js');
const config=require('../config/config.js');
const auth=require('../middleware/auth.js');



const user_route=express();

user_route.set('view engine','ejs');
user_route.set('views','./views/users');


user_route.use(bodyParser.json());              //  use the data frm bodyParser
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.use(session({secret:config.sessionSecret}));

user_route.use(express.static('public'));

//IMAGES
/*const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});*/
//const upload=multer({storage:storage});

user_route.get('/', (req, res) => {
    res.render('home.ejs');
  });

user_route.get('/register',auth.isLogout,userController.loadRegister); //only if user is logged out ,go to register page

user_route.post('/register',userController.insertUser);
//user_route.post('/',upload.single('image'),userController.insertUser);

user_route.get('/verify',userController.verifyMail);

user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/house',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',auth.isLogout,userController.forgetVerify);

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);

user_route.post('/forget-password',userController.resetPassword);

user_route.get('/edit',auth.isLogin,userController.editLoad);

//user_route.post('/edit',upload.single('image'),userController.updateProfile);

user_route.post('/edit',userController.updateProfile);







module.exports=user_route;