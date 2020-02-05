/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;
 
//Handles passwords and hashing
const passportLocalMongoose = require('passport-local-mongoose');

/* Create your schema */
var userSchema = new Schema({
	username: { type: String, required: true, unique: true},
	email : String,
    email_verified : Boolean,
	created_at: Date,
	updated_at: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

