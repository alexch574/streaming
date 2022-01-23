const mongoose = require('mongoose');
var shortid = require('shortid');
const StreamSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : false
    }, email : {
        type  : String,
        required : false
    },  stream_id :{
        type  : String,
        required : false
    }, stream_key : {
        type : String, 
        required : true
    }, date :{
        type : Date,
        default : Date.now
    }
});
StreamSchema.methods.generateStreamKey = () => {
    return shortid.generate();
}
const Stream= mongoose.model('Stream',StreamSchema);

module.exports = Stream;