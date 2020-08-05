const express=require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const redis = require('redis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();


var flash=require('req-flash');
var db=require('./database');
const { resolve } = require('path');

db.query('SET GLOBAL event_scheduler = ON;',(err,data)=>{
if(err)throw err;

mongoose.connect('mongodb://localhost/BUS_REVIEWS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app=express();

app.use(express.static( "public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.set('trust proxy', 1);
app.use(
    session({
        cookie : {
            maxAge: 1000* 60 * 60 *24 * 365
        },
      store: new RedisStore({ client: redisClient}),
      secret: 'keyboard cat',
      resave: false,
    })
  );
app.use(flash());
app.set('view engine','ejs');
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});


let homepage=require('./routes/homepage');
let register=require('./routes/register');
let login=require('./routes/login');
let user_home=require('./routes/user_home');
let logout=require('./routes/logout');
let book=require('./routes/book');
let pay=require('./routes/payment');
let bookings=require('./routes/show_bookings');
let cancel=require('./routes/cancel_booking');
let rate=require('./routes/add_rating');
let my_reviews=require('./routes/my_reviews');
let bus_info=require('./routes/bus_info');


app.use('/register',register);
app.use('/login',login);
app.use('/home',user_home);
app.use('/logout',logout);

// Let's Book a ticket
app.use('/book',book);
app.use('/pay',pay);

// See all bookings
app.use('/bookings',bookings);

// cancel bookings
app.use('/delete',cancel);
app.use('/thanks',rate);
app.use('/reviews',my_reviews);

// get bus_info
app.use('/bus_info',bus_info);


// TESTING FOR IMAGE UPLOADING THROUGH CLOUDINARY AND MULTER__
//                                                            |
//                                                            V

// const server_upload=require('./routes/multer');
// const cloud_upload=require('./routes/cloudinary');

// app.post('/upload-images/',server_upload.single('image'),(req,res,next)=>{
// console.log(req.file.path);
// cloud_upload(req,(err,result)=>{
//   if(err)
//   console.log(err);
//   else 
//   console.log(result);
// })
// });

// app.get('/upload-images/',(req,res)=>{
//   res.render('tmp.ejs');
// });

app.listen(3000,'192.168.43.80',function(){
    console.log('Listening at 3000');


// ========================================================================================================

var app2=express();


app2.use(express.static( "admin_public"));
app2.use(
    session({
        cookie : {
            maxAge: 1000* 60 * 60 *24 * 365
        },
      store: new RedisStore({ client: redisClient}),
      secret: 'keyboard cat',
      resave: false,
    })
  );

app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());
app2.use(flash());
app2.set('view-engine','ejs');
app2.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});
let admin_check=require('./routes/admin_check');
let admin_home=require('./routes/admin_controls/admin_home');
let admin_add=require('./routes/admin_controls/add_admin.js');
let add_new_bus=require('./routes/admin_controls/add_new_bus');
let add_new_city=require('./routes/admin_controls/add_new_city');
let bus_chart=require('./routes/admin_controls/bus_chart');
let stats_show=require('./routes/admin_controls/show_stats');
app2.get('/',(req,res)=>{
    res.render('admin_console_login.ejs',{title:'Admin Login',check:'YOyo'});
});

app2.use('/check',admin_check);
app2.use('/admin_home',admin_home);
app2.use('/admin_logout',logout);
app2.use('/add',admin_add);
app2.use('/addbus/',add_new_bus);
app2.use('/addcity/',add_new_city);
app2.use('/add_chart',bus_chart);
app2.use('/show',stats_show);






app2.listen(6732,'192.168.43.80',()=>{
    console.log('Admin port opened!!!');
});



});

});


