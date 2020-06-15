let db=require('../database');
let express=require('express');
var router=express.Router();

app.get('/',function(req,res){
    sess=req.session;
    sess.cancelled={};
    res.render('homepage.ejs',{title:'E_Bus'});
});
