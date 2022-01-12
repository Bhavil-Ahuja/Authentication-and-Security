require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
    secret: 'My secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/Security")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets")
    }
    else {
        res.redirect("/login")
    }
})

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            res.redirect("/register")
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, function(err) {
        if (err) {
            console.log(err)
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })
})

app.listen(process.env.PORT || 3000)