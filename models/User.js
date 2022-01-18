const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

let userSchema = mongoose.Schema ({
username: {
    type: String, 
    required: [true, "You must enter a username"]
},
password: {
    type: String, 
    required: true},
location: {
    type: String, 
    required: true
},
postpartum_depression: {
    type: Boolean,
    required: true},
postpartum_anxiety: {
    type: Boolean, 
    required: true},
trauma_in_pregnancy: {
    type: Boolean,
    required: true},
trauma_in_birth: {
    type: Boolean, 
    required: true},
physical_pain: {
    required: true,
    back: Boolean, 
    pelvis: Boolean, 
    abdominal: Boolean
}
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("users", userSchema); 


