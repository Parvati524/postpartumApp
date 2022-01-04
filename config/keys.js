// sets the logic for dev or prod keys
if (process.env.NODE_ENV === "production"){
  // return prod keys
  module.exports = require("./prod")
} else {
  // return dev keys
  module.exports = require("./dev")
}