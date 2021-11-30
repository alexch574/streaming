var User = require("../models/user");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
//GET REQUESTS
router.get('/login', (req,res) => {
    res.render('../views/login');
});

router.get('/register', (req,res) => {
    res.render('../views/register');
});
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next)
});
//POST REQUESTS
router.post('/register', (req,res) => {
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }

    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }

    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }

    if(errors.length > 0 ) {
        res.render('register', {
            errors : errors,
            name : name,
            email : email,
            password : password,
            password2 : password2})
    } else { 
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user); 
            if(user) {
                errors.push({msg: 'email already registered'});
                res.render('register',{errors,name,email,password,password2})  
                
            } else {
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password,
                    stream_key : '0'
                });
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt, (err,hash)=> {
                    if(err) throw err;
                        
                    newUser.password = hash;
                    
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
            }
        });
    }
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
});

module.exports = router;