const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js");
const User = require('../models/user');
const shortid = require('shortid');
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
router.get('/stream_key',ensureAuthenticated, (req,res)=> {
    var stream_key = shortid.generate();
    console.log('email ', req.user.email);
    User.updateOne({email : req.user.email}, {stream_key : stream_key}, function(err, result) {
        if(err) {
            return console.log(err);
        } 
        console.log(result);

    });
    console.log('stream_key ', req.user.stream_key, ' | ', stream_key);
    res.render('../views/create_stream.ejs', {
        stream_key: stream_key
    });
    /*User.findOne({email: req.user.email}, (err, user) => {
        if (!err) {
            res.json({
                stream_key: user.stream_key
            })
        }
    }); */
});
router.post('/stream_key', ensureAuthenticated, (req, res) => {

        User.findOneAndUpdate({
            email: req.user.email
        }, {
            stream_key: shortid.generate()
        }, {
            upsert: true,
            new: true,
        }, (err, user) => {
            if (!err) {
                res.json({
                    stream_key: user.stream_key
                })
            }
    });
});



module.exports = router; 



