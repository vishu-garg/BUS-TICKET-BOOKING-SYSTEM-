let db=require('../database');
let express=require('express');
var router=express.Router();

app.get('/',function(req,res){
    sess=req.session;
    // console.log(sess.Mobile);
    if(sess.Mobile!=undefined)
    {
        res.redirect('/home/'+sess.Name+'/'+sess.Mobile+'/');
    }
    else
    res.render('homepage.ejs',{title:'E_Bus'});
});
