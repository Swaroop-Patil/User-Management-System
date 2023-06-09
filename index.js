require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const User = require('./models/user');
const configure= require('./config/config');

const app = express();
const PORT =  process.env.PORT || 3000;

mongoose.set('strictQuery',false); //to avoid warnings
/*mongoose.connect('mongodb+srv://swaroop:ninjah2r@cluster0.han8srw.mongodb.net/REGISTRATIONS_JN?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch(err => {
  console.error(err);
});*/

const connectDB = async ()=> {
  try {
    const conn = await mongoose.connect(configure.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch(error) {
    console.log(error);
    process.exit(1);
    }
}

//for user routes

const userRoutes=require('./routes/userRoute');
app.get('/',userRoutes);
app.get('/register',userRoutes);
app.get('/login',userRoutes);
app.post('/register',userRoutes);
app.post('/login',userRoutes);
app.get('/house',userRoutes);
app.get('/logout',userRoutes);
app.get('/forget',userRoutes);
app.post('/forget',userRoutes);
app.get('/forget-password',userRoutes);
app.post('/forget-password',userRoutes);
app.get('/edit',userRoutes);
app.post('/edit',userRoutes);


const adminRoutes=require('./routes/adminRoute');
app.get('/admin',adminRoutes);
app.post('/admin',adminRoutes);
app.get('/admin_house',adminRoutes);
app.get('/admin_logout',adminRoutes);
app.get('/admin_forget',adminRoutes);
app.post('/admin_forget',adminRoutes);
app.get('/admin_forget-password',adminRoutes);
app.post('/admin_forget-password',adminRoutes);
app.get('/admin_dashboard',adminRoutes);





connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
  });
  
  