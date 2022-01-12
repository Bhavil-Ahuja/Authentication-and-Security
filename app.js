require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const md5 = require("md5")
const bcrypt = require("bcrypt")
const saltRounds = 10

mongoose.connect("mongodb://localhost:27017/Level-1-Security")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets")
            }
            else {
                console.log(err)
            }
        })
    })
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            if (results) {
                bcrypt.compare(password, results.password, function (err, pwRes) {
                    if (pwRes === true) {
                        res.render("secrets")
                    }
                })
            }
        }
    })
})

app.listen(process.env.PORT || 3000)