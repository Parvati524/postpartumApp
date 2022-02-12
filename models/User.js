const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "You must enter a username"]
    },
    password: {
        type: String
    },
videosWatched: {
    type:[String]
},
    videosSaved: {           
        type:[String]
    },
    location: {
        type: String,
        required: true
    },
    postpartum_depression: {
        type: Boolean,
        required: true
    },
    postpartum_anxiety: {
        type: Boolean,
        required: true
    },
    high_risk_pregnancy: {
        type: Boolean,
        required: true
    },
    trauma_in_birth: {
        type: Boolean,
        required: true
    },
    back_pain: {
        type: Boolean,
        required: true
    },
    pelvic_pain: {
        type: Boolean,
        required: true
    },
    abdominal_pain: { 
        type: Boolean,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", userSchema)
