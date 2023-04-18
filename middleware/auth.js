const { response } = require("../routes/userRoute");

const isLogin= async(req,res,next) =>{                //if authorization is correct then move next

    try{

        if(req.session.user_id){}

        else{
            response.redirect('/house.ejs');                //if no authorization goto home
        }
        next();

    }catch(error){
        console.log(error.message);
    }

}


const isLogout= async(req,res,next) =>{                //if authorization is correct then move next

    try{

        if(req.session.user_id){
            res.redirect('/house.ejs');
        }

        next();

    }catch(error){
        console.log(error.message);
    }

}

module.exports={
    isLogin,
    isLogout
}