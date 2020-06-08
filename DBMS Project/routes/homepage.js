let db=require('../database');
let express=require('express');
var router=express.Router();

app.get('/',function(req,res){
    res.render('homepage.ejs',{title:'E_Bus'});
});
