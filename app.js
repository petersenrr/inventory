const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database, {
    useMongoClient: true
});
let db = mongoose.connection;

db.once('open', function(){
    console.log("Connected to mongoDB");
});

db.on('error', function(err){
    console.log(err);
})

let Item = require('./models/item');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//session middleware
app.use(session({
    secret: '1234pass',
    resave: true,
    saveUninitialized: true,
  }));

  //express messages middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
            var namespace = param.split('.')
            , root   = namespace.shift()
            ,  formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});


app.get('/', ensureAuthenticated, function(req,res){
    Item.find({}, function(err, items){
        if(err){
            console.log(err)
        }else {
            res.render('index', {  
                title: 'index',
                items: items
            });
        }
    })
});

let items = require('./routes/items');
let users = require('./routes/users');
app.use('/item', items);
app.use('/users', users);


//access control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect('/users/login');
    }
};

app.listen(3000);

console.log('Running on port 3000');