const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const keys = require("./config/keys");
const fetch = require('node-fetch')
const mongoose = require('mongoose');
const yelpApiKey = keys.yelpApiKey;
const youtubeApiKey = keys.youtubeApiKey;
const client = yelp.client(yelpApiKey);
const flash = require("connect-flash");


const mongoURIKey = keys.mongoURIKey;
app.use(express.json());//getting information through body
app.use(express.urlencoded({ extended: false }));
//sending information through the url 
// Build our blueprints:
const User = require("./models/user.js");
// Requiring the passport & passport-local modules:
const passport = require('passport');
const LocalStrategy = require("passport-local");
// More configuration to setup:
// it is a code that happens bewteen the request and the response 
app.use(require('express-session')({
    secret: "It can be any kind of string",  // used to encrypt the user info before saving to db 
    resave: false,             // save the session obj even if not changed 
    saveUninitialized: false   // save the session obj even if not initialized
}));  // here we are creating the information that will verify whether or not we are who we say we are 

app.use(flash());
app.use(function (req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  // we are starting the session
passport.deserializeUser(User.deserializeUser()); // we are getting that information from the database

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

app.post('/signup', (req, res) => {
    let { location, password, username, ppd, ppa, pregnancyTrauma, birthTrauma, abdominalPain, pelvicPain, backPain } = req.body
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

    let newUser = new User({ username: username, location: location, postpartum_depression: ppd, postpartum_anxiety: ppa, trauma_in_pregnancy: pregnancyTrauma, trauma_in_birth: birthTrauma, back_pain: backPain, pelvic_pain: pelvicPain, abdominal_pain: abdominalPain });
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("signup");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/userpage");
            })
        }
    })
});

// Route handler for POST - login - checking whether the user exist in the database - if it exist - it will redire
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/userpage',
        failureRedirect: '/login',
        failureFlash: true
    }
    //way to add error message

), (req, res) => {
    // We don’t need anything in our callback function
});

// Route for logout: /logout
app.get('/logout', (req, res) => {
    req.logout();  // we run a method called logout
    res.redirect('/');
});
// When logout, passport destroys all the user data in the session
// And then, we redirect them to the home page

// Creating the middleware function:
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { //
        // console.log(isLoggedIn)
        return next();
    }
    res.redirect('/')
}
app.get('/userpage', isLoggedIn, (req, res) => {
    // console.log(req.user)
    const { username, location, postpartum_depression, postpartum_anxiety, trauma_in_pregnancy, trauma_in_birth, back_pain, pelvic_pain, abdominal_pain } = req.user
    function yelp(category, location, limit){
        const reqObject = {
            categories: category,
            location: location,
            limit:limit}
        return client.search(reqObject)
        }
        function getData() {
            Promise.all([yelp("physicaltherapy", location, 10),  yelp("midwives", location, 10), yelp("psychologists", location, 10)])
                .then(values =>
                    Promise.all(values.map(value => JSON.stringify(value))))
                .then(finalVals => {
                    //this is how I access each item in the array.
                    let phystherapists = finalVals[0];
                    phystherapists = JSON.parse(phystherapists)
                    console.log(phystherapists)
                    phystherapists = phystherapists.jsonBody.businesses;
                    //doing same for midwives
                    let midwives = finalVals[1];
                    midwives = JSON.parse(midwives)
                    console.log(midwives)
                    midwives = midwives.jsonBody.businesses;
                    //doing same for psychologists
                    let psychologists = finalVals[2];
                    psychologists= JSON.parse(psychologists);
                    console.log(psychologists);
                    psychologists=psychologists.jsonBody.businesses
                    res.render("userpage", { username: username, phystherapists:phystherapists, midwives:midwives, psychologists:psychologists }); 
                });
                  
        }
        getData()
    //order youtube by view count, 
    //subtract second by first
    //send first of each back.
    // let difference = arr1.filter(x => !arr2.includes(x));
    //yelp name, phone number, rating, url 
    //youtube: title, videoId, description, channelTitle
    
})

app.get('/username', (req, res) => {

    //get USERS data back from DB
    //render the users data on an ejs page with a submit button
    //form has a put route to /user to update
});

app.put('/:username/videosWatched', (req, res) => {
    let username = req.params.username;
    let video = req.body.video;
    User.findOneAndUpdate(
        { username: username },
        { $push: { videosWatched: video } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });


    console.log(`${username}, it worked!`)
});

app.put('/:username/videosSaved', (req, res) => {

    let username = req.params.username;
    let savedVideo = req.body.video;
    User.findOneAndUpdate(
        { username: username },
        { $push: { videosSaved: savedVideo } },
        function (error, success) {
            if (error) {
                console.log(error);
                res.status(400).json("Error updating document")
            } else {
                console.log(success);
                console.log(`${username}, it worked!`)
                res.status(201).json(success)
               
            }
        });
        console.log(`${username}, it worked!`)
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
});