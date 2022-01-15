const express = require ('express');
const app = express();
const yelp = require('yelp-fusion');
const keys = require("./config/keys");
const fetch = require('node-fetch')
const mongoose = require('mongoose');
const yelpApiKey = keys.yelpApiKey;
const youtubeApiKey = keys.youtubeApiKey;
const client = yelp.client(yelpApiKey);
const mongoURIKey = keys.mongoURIKey;
app.use(express.json());//getting information through body
app.use(express.urlencoded({ extended: false }));
//sending information through the url 

// Requiring the passport & passport-local modules:
const passport = require('passport');
const LocalStrategy = require("passport-local");

// The following will parse the data:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//import css
app.use(express.static('public'));

//
app.set("view engine", "ejs");

//mongo Connect to DB function
mongoose.connect(mongoURIKey)
.then(()=> {
    console.log(`you are connected!`)
})
.catch(err => {
    console.log(`Error connecting to DB: ${err}`)
})


// Build our blueprints:
const User = require("./models/User");

//root route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/login', (req, res)=>{
    res.render('login.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.get('/resources', (req, res) => {
    res.render('resources.ejs');
});

app.get('/signs', (req, res)=> {
    res.render('signssymptoms.ejs');
});

app.post('/signup', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render("signup");
        } else {
            passport.authenticate("local"(req, res, () => {
                res.redirect("/login"); // or do we want to redirect to the personal userpage. *** check on this one with the team
            }))
        }
    })
})


// Route for logout: /logout
app.get('/logout', (req, res) => {
    // req.logout();
    res.redirect('/');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
});