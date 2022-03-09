//  require('dotenv').config();
const dotenv = require('dotenv');
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express(); const cors = require ("cors")



//connect to db
// const db= process.env.DATABASE; 
// mongoose.connect(db, { 
//     useNewUrlParser : true, 
//     useUnifiedTopology : true
// }, err => {
//     if(err) throw err;
//     console.log("database connected successfully")
// })


//alow for API
app.use(cors({ 
    origin: "*"   
}))

dotenv.config({ path: './config.env' })
require('./db/conn')

const port = process.env.PORT;


// require model
const Users = require('./models/userSchema');
const Message = require('./models/msgSchema');
const authenticate= require('./middleware/authenticate');


// These method is used to Get data and Cookies from Frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("Hello World");
})

//Registration

app.post('/register', async (req, res) => {
    try {
        //Get body or data
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username: username,
            email: email,
            password: password
        });

        //Save method is used to Create User or Insert User
        // But Before Saving or Inserting, pasword will Hash
        // Because  of Hashing.After Hash, It will save to DB

        const created = await createUser.save();
        console.log(created)
        res.status(200).send("Registered")
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// login 
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // find user if Exist
        const user = await Users.findOne({ email: email });

        if (user) {
            // verify password
            const isMatch = await bcryptjs.compare(password, user.password);
            if (isMatch) {
                //Generate token Which is define in user Schema
                const token = await user.generateToken();

                res.cookie('jwt', token, {
                    // Expires Token in 24Hr
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                })
                res.status(200).send("LoggedIn")
            }
            else {
                res.status(400).send("Invalid Credential")
            }
        }
        else { 
            res.status(400).send("Invalid Credential")
        }
    }
    catch (error) { 
        res.status(400).send(error)
    }
}) 

// Message

app.post('/message', async (req, res) => {
    try {
        //Get body or data
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        const sendMsg = new Message({
            name: name,
            email: email,
            message: message
        });

        //Save method is used to Create User or Insert User
        // But Before Saving or Inserting, pasword will Hash
        // Because  of Hashing.After Hash, It will save to DB

        const created = await sendMsg.save();
        console.log(created)
        res.status(200).send("Sent")
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Logout page
app.get('/logout',(req,res)=>{
    res.clearCookie("jwt",{path: '/'})
    res.status(200).send("User Logged Out")
})  

// authentication

app.get('/auth',authenticate,(req,res)=>{

})
  
// Run server 
app.listen(port, () => {
    console.log("Server is listening")  
})


 