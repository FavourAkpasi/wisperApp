require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)




app.get("/", (req, res)=>{
    res.render("home")
})


app.route("/login")

    .get((req, res)=>{
        res.render("login")
    })

    // .post((req, res)=>{
    //     User.find({}, (err, users)=>{
    //         users.forEach(user => {
    //             if ((user.email==req.body.username) && (user.password==req.body.password)) {
    //                 res.render("secrets")
    //             } else {console.log("no match");}
    //         });
    //     })
    // })

    .post((req, res)=>{
        User.findOne({email:req.body.username}, (err, user)=>{
            if (user.password === req.body.password) {
                res.render("secrets")
            } else {console.log(err, "not a match");}
        })
    })
;

app.route("/register")

    .get((req, res)=>{
        res.render("register")
    })

    .post((req, res)=>{
        if (req.body.username && req.body.password != "") {
            const user = new User({
                email: req.body.username,
                password: req.body.password
            })
            user.save((err)=>{
                if(!err){
                    res.render("secrets")
                } else {console.log(err);}
            })
        } else {
            console.log("empty fields");
        }
    })
;



app.get('/logout', (req, res)=>{
    res.render("home")
})







app.listen(7000, function () {
    console.log("Server's Dick cuurently all up in port 7000");
});
  