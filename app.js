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
//mongo Connect to DB function
mongoose.connect(mongoURIKey)
.then(()=> {
    console.log(`you are connected!`)
})
.catch(err => {
    console.log(`Error connecting ${err}`)
})



//root route
app.get('/', (req, res) => {
    res.render('home.ejs')
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
})