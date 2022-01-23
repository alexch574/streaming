const mongoose = require('mongoose');
var shortid = require('shortid');
const UserSchema  = new mongoose.Schema({
    name :{
      type  : String,
      required : true
    }, email :{
    type  : String,
    required : true
    }, password :{
    type  : String,
    required : true
    }, date :{
    type : Date,
    default : Date.now
    }, stream_key : {
        type : String, 
        required : false
    }, stream_code : {
        type: String,
        required : false
    }, stream_name: {
        type: String,
        required : false
    }
});
UserSchema.methods.generateStreamKey = () => {
    return shortid.generate();
}
const User= mongoose.model('User',UserSchema);

module.exports = User;