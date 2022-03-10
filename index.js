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
const {yelpCall, youtube, getData} = require("./helpers/apiHelpers")
const {filterArr} = require("./helpers/dataOperations")

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

// Creating the middleware function:
const isLoggedIn = (req, res, next) => {
        res.locals.isAuthenticated = req.isAuthenticated()
    if (req.url.includes('userpage') && !req.isAuthenticated()) {
        res.redirect('/login')
    } else {
        next();
    }
}
app.use(isLoggedIn)

//root route
app.get('/', (req, res) => {
    console.log('get', res.locals)
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
    let { location, password, username, ppd, ppa, highRiskPregnancy, birthTrauma, abdominalPain, pelvicPain, backPain } = req.body
    let booleanArray = [];


    booleanArray.push(ppd, ppa, highRiskPregnancy, birthTrauma, abdominalPain, pelvicPain, backPain)
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
    highRiskPregnancy = booleanArray[2];
    birthTrauma = booleanArray[3];
    abdominalPain = booleanArray[4];
    pelvicPain = booleanArray[5];
    backPain = booleanArray[6];
    //makes a new user according to our model
    let newUser = new User({ username: username, location: location, postpartum_depression: ppd, postpartum_anxiety: ppa, high_risk_pregnancy: highRiskPregnancy, trauma_in_birth: birthTrauma, back_pain: backPain, pelvic_pain: pelvicPain, abdominal_pain: abdominalPain });
    //registers this user with passport along with a password.
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

// Route handler for POST login, this will check if the user is in our DB. if so it redirects us to the userpage.
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/userpage',
        failureRedirect: '/login',
        failureFlash: true
    }
    //flash is a way to add error message

), (req, res) => {
    // We don’t need anything in our callback function
});

// Route for logout: /logout
app.get('/logout', (req, res) => {
    req.logout();  // we run a method called logout
    res.redirect('/');
});
// When logging out, passport destroys all the user data in the session
// And then, we redirect them to the home page




app.get('/userpage', async (req, res) => {
    const { username, location, videosWatched, videosSaved, postpartum_depression, postpartum_anxiety, high_risk_pregnancy, trauma_in_birth, back_pain, pelvic_pain, abdominal_pain } = req.user
   
    const videos = await getData(location, videosWatched, videosSaved)

    console.log(videos)
    res.render("userpage", {
        username,
        ...videos,
        videosSaved,
        videosWatched,
        high_risk_pregnancy,
        trauma_in_birth,
        pelvic_pain,
        postpartum_anxiety,
        postpartum_depression,
        back_pain,
        abdominal_pain,
      });
    //order youtube by view count, 
    //yelp name, phone number, rating, url 
    //youtube: title, videoId, description, channelTitle

})

app.get('/perinatal', (req, res) => {
    let location = req.query.location;
    yelpCall("prenatal", location, 10)
    .then(response => {
        let businesses = response.jsonBody.businesses;
        res.send(businesses) 
      }).catch(e => {
        console.log(e);
        res.status(400).json(`Error, ${e}`)
      });
    })


//delete route
app.get('/delete', function(req, res){
    let requestedUser = req.user.username; 
    User.findOneAndDelete({username: requestedUser}, (error, result)=>{ 
        if(error){
            console.log("Error deleting user from db", error)
            res.status(400).json("Error deleting data from db")
        } else {
            console.log("Result, deleted from db: ", result)
            res.redirect('/')
           
        }
    })
})

app.get('/user', (req, res) => {
    res.status(200).json({ user: req.user })
})

app.get('/about', (req, res) => {
    res.render('about.ejs')
});


app.get('/:username', function (req, res) {
    let requestedUser = req.params.username;
    res.render("profile.ejs", { requestedUser });
});


app.put('/update', function (req, res) {
    let username = req.user.username;
    let myArray = Object.keys(req.body)
    //made this array to check what the keys are.
    console.log(myArray)
    if (myArray.indexOf("back_pain") === -1) {
        let back_pain = "back_pain"
        req.body[back_pain] = false;
        //this console.logs false
        console.log(req.body[back_pain])
    }
    if (myArray.indexOf("abdominal_pain") === -1) {
        let abdominal_pain = "abdominal_pain"
        req.body[abdominal_pain] = false;
        //this console.logs false
        console.log(req.body[abdominal_pain])
    }
    if (myArray.indexOf("pelvic_pain") === -1) {
        let pelvic_pain = "pelvic_pain"
        req.body[pelvic_pain] = false;
        //this console.logs false
        console.log(req.body[pelvic_pain])
    }
    // this code checks if the values are string true or string false, converts them to booleans which is what we need in our DB.
    for (let x in req.body) {
        if (req.body[x] === "true") {
            req.body[x] = true;
        }
        if (req.body[x] === "false") {
            req.body[x] = false;
        }
    }
  
    User.findOneAndUpdate(
        { username: username },
        req.body,
        { upsert: true, new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
                res.send(err)
            }
            res.send(doc)
        });
})


app.put('/:username/videosWatched', (req, res) => {
    let username = req.params.username;
    let videoWatched = req.body.video;
    User.find(
        { username: username },
        function (error, user) {
            if (error) { res.status(400).json("Error updating document") }
            else {
                console.log("Success", user)
                if (user[0].videosWatched.includes(videoWatched)) {
                    console.log('Video already saved to watched')
                    res.status(400).json('Video already saved to watched')
                } else {
                    User.findOneAndUpdate(
                        { username: username },
                        { $push: { videosWatched: videoWatched } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                res.status(400).json("Error updating document")
                            } else {
                                console.log(success);
                                res.status(201).json(success)
                            }
                        });
                }
            }
        })
});

app.put('/:username/videosSaved', (req, res) => {
    let username = req.params.username;
    let videoSaved = req.body.video;
    User.find(
        { username: username },
        function (error, user) {
            if (error) { res.status(400).json("Error updating document") }
            else {
                console.log("Success", user)
                if (user[0].videosSaved.includes(videoSaved)) {
                    console.log('Video already saved')
                    res.status(201).json('Video already saved')
                } else {
                    User.findOneAndUpdate(
                        { username: username },
                        { $push: { videosSaved: videoSaved } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                res.status(400).json("Error updating document")
                            } else {
                                console.log(`${username}, it worked!`)
                                res.status(201).json(success)
                            }
                        });

                }
            }
        })
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
});