require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const encrypt = require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/Level-1-Security")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
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
                if (results.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})

app.listen(process.env.PORT || 3000)