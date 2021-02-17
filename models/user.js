var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = mongoose.Schema({
  name:String,
  username:String,
  password:String,
  accountNo:Number,
  ifsc:String,
  balance:Number,
  transactions:Array,
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);