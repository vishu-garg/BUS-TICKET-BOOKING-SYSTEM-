const express=require('express');
const bodyParser = require('body-parser');
const session=require('express-session');
var db=require('./database');
app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'qwerghjkasdf$$$$1234'}));

app.set('view engine','ejs');

let homepage=require('./routes/homepage');
let register=require('./routes/register');
let login=require('./routes/login');
let user_home=require('./routes/user_home');
let logout=require('./routes/logout');
let book=require('./routes/book');

app.get('/',function(req,res){
    app.use(homepage);
});

app.use('/register',register);
app.use('/login',login);
app.use('/home',user_home);
app.use('/logout',logout);

// Let's Book a ticket
app.use('/book',book);



app.listen(3000,function(){
    console.log('Listening at 3000');
});


