const express=require('express');
const bodyParser = require('body-parser');
const session=require('express-session');
var db=require('./database');


app=express();
app.use(express.static( "public"));
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
let pay=require('./routes/payment');
let bookings=require('./routes/show_bookings');
let cancel=require('./routes/cancel_booking');
app.get('/',function(req,res){
    app.use(homepage);
});
app.use('/register',register);
app.use('/login',login);
app.use('/home',user_home);
app.use('/logout',logout);
// Let's Book a ticket
app.use('/book',book);
app.use('/pay',pay);
// See all bookings
app.use('/bookings',bookings);
// cancel all bookings
app.use('/delete',cancel);
app.listen(3000,'192.168.43.80',function(){
    console.log('Listening at 3000');

var app2=express();
app2.use(express.static( "admin_public"));
app2.use(session({secret:'qwerghjkasdf$$$$$QWE!@@'}));
app2.set('view-engine','ejs');

let admin_check=require('./routes/admin_check');
let admin_home=require('./routes/admin_controls/admin_home');

app2.get('/',(req,res)=>{
    res.render('admin_console_login.ejs',{title:'Admin Login',check:'YOyo'});
});

app2.use('/check',admin_check);
app2.use('/admin_home',admin_home);
app2.listen(6732,'192.168.43.80',()=>{
    console.log('Admin port opened!!!');
});



});


