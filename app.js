const express = require('express');
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


//import css
app.use(express.static('public'));
app.set("view engine", "ejs");

//mongo Connect to DB function
mongoose.connect(mongoURIKey)
    .then(() => {
        console.log(`you are connected!`)
    })
    .catch(err => {
        console.log(`Error connecting to DB: ${err}`)
    })


// Build our blueprints:
const User = require("./models/user.js");

//root route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.get('/resources', (req, res) => {
    res.render('resources.ejs');
});

app.get('/signs', (req, res) => {
    res.render('signssymptoms.ejs');
});

// Route for logout: /logout
app.get('/logout', (req, res) => {
    // req.logout();
    res.redirect('/');
})

app.post('/signup', (req, res) => {
    
    let { location, username, password, ppd, ppa, pregnancyTrauma, birthTrauma, abdominalPain, pelvicPain, backPain } = req.body
    let booleanArray = [];
    booleanArray.push(ppd, ppa, pregnancyTrauma, birthTrauma, abdominalPain, pelvicPain, backPain)
    for (let i = 0; i < booleanArray.length; i++) {
        //checks if any of the physical pain areas were unchecked (thus undefined) and converts them to false
        if (booleanArray[i] === undefined) {
            booleanArray[i] = false;
        }
        //converts all that are strings "true" or "false" to the boolean true or false
        if (booleanArray[i] === "true") {
            booleanArray[i] = true;
        }

        if (booleanArray[i] === "false") {
            booleanArray[i] = false;
        }
    }
    ppd = booleanArray[0];
    ppa = booleanArray[1];
    pregnancyTrauma = booleanArray[2];
    birthTrauma = booleanArray[3];
    abdominalPain = booleanArray[4];
    pelvicPain = booleanArray[5];
    backPain = booleanArray[6];
    console.log(ppd, ppa, pregnancyTrauma, birthTrauma, backPain, pelvicPain, abdominalPain)
     let newUser = new User({username: username, password:password,location: location, postpartum_depression:ppd, postpartum_anxiety:ppa, trauma_in_pregnancy: pregnancyTrauma, trauma_in_birth:birthTrauma, back_pain:backPain, pelvic_pain:pelvicPain, abdominal_pain:abdominalPain});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render("signup");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/user"); 
            })
        }
    })
});

app.get('/home', (req, res) => {
    //MAKE API calls
    //send variables to this ejs page
    res.render("userpage");
})

app.get('/user', (req, res) => {
    //get USERS data back from DB
    //render the users data on an ejs page with a submit button
 
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
});