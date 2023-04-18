const mongoose = require('mongoose');



// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },


password:{
    type:String,
    required:true
},

is_admin: {
    type: Number,
    required:true
  },

  is_verified: {
    type: Number,
    default:0
  },

  token:{
    type:String,
    default:''
}


});

// Create the User model
const User = mongoose.model('User', userSchema); //give singular name,in DB it becomes plural

// Export the User model
module.exports = User;
