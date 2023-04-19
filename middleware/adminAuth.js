const { response } = require("../routes/adminRoute");

const isLogin= async(req,res,next) =>{                //if authorization is correct then move next

    try{

        if(req.session.user_id){}                    
       
        else{
            response.redirect('/admin');     //if user_id is not  stored in session             
                                                       //if no authorization goto home
        }
        next();

    }catch(error){
        console.log(error.message);
    }

}


const isLogout= async(req,res,next) =>{                //if authorization is correct then move next

    try{

        if(req.session.user_id){                        //if user _id is set then redirect to admin_
            res.redirect('/admin_house');
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