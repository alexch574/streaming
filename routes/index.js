require('../models/user');
require('../models/stream');
const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js");
const User = require('mongoose').model('User');
const Stream = require('mongoose').model('Stream');
var shortid = require('shortid');
//login page
router.get('/', (req,res)=>{
    res.render('../views/welcome.ejs');
});
//register page
router.get('/register', (req,res)=>{
    res.render('../views/register.ejs');
});
router.get('/dashboard',ensureAuthenticated, (req,res)=>{
    res.render('../views/dashboard',{
        user: req.user
        });
});
/*User.findByIdAndUpdate(req.user.id, {name: req.user.name, email: req.user.email, password: req.user.password, stream_key: stream_key}, function(err, user){
     
    mongoose.disconnect();
    if(err) return console.log(err);
    console.log("Обновленный объект", user);
}); */
router.get('/streams/menu',ensureAuthenticated, (req,res)=> {
    var stream_key = shortid.generate();
    console.log('email ', req.user.email);
   
    User.findOne({email: req.user.email}, (err, user) => {
        if(!err) {
            if(user) {
                res.render('../views/update_stream.ejs', {name : user.stream_name,stream_id: user.stream_code, stream_key: user.stream_key});
            }
            else {
                res.render('../views/create_stream.ejs');

                
            }
        }
    })

});

router.post('/streams/create', ensureAuthenticated, (req,res) => {
    User.findOneAndUpdate({email: req.user.email}, 
                          {stream_key: shortid.generate(), 
                            stream_code: shortid.generate(), 
                            stream_name: req.body.name}, 
                            { upsert: true,
                                new: true,
                            },  (err, user) => {
                                if(!err) {
                                    res.render('../views/update_stream.ejs', {stream_key: user.stream_key, stream_id: user.stream_code, name: user.stream_name});
                                }
                            });
                          
});


router.get('/streams/:streamid', ensureAuthenticated, (req, res) => {
        var streamid = req.params.streamid;
        User.findOne({stream_code: streamid}, (err, user) => {
            if(!err) {
                if(user) {
                    res.render('../views/stream.ejs', {
                        stream_key: user.stream_key,
                        stream_name: user.stream_name,
                        username: user.name
                    });
                }
            }
        })

});



module.exports = router; 



