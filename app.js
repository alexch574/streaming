var express = require('express');
var app = express();
var router = express.Router;
var mongoose = require('mongoose');
var expressEjsLayout = require('express-ejs-layouts');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var node_media_server = require('./media_server');
require("./config/passport")(passport)
//database connecting
mongoose.connect('mongodb://localhost/edplatform',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('Connected to MongoDB succesfully! '))
.catch((err)=> console.log(err));

//Ejs
app.set('view engine','ejs');
app.use(expressEjsLayout);

//Parsing
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));

   app.use(passport.initialize());
   app.use(passport.session());

   //Flash
   app.use(flash());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
   });
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(3000); 
node_media_server.run();