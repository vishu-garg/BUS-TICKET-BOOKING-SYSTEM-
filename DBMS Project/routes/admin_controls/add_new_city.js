const express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../../database');
var router=express.Router();
router.get('/',(req,res)=>{
    var sess=req.session;
    if(sess.admin!='CEO')
    {
        res.render('error.ejs',{error:'UNAUTHORISED ACCESS!'});
        return;
    }
    res.render('add_city.ejs');
});

router.post('/',(req,res)=>{
    var city="'"+req.body.city+"'";
    var sql1="SELECT COUNT(*) AS CNT FROM cities WHERE city="+city+";";
    db.query(sql1,(err,data1)=>{
    // console.log(data1);
    if(data1[0].CNT!=0)
    {
        res.render('error.ejs',{error:'City already present'});
        return;
    }
    var sql="INSERT INTO cities (`city`) VALUES("+city+");";
    console.log(sql);
    db.query(sql,(err,data)=>{
        if(err)
        res.render('error.ejs',{error:'Unknown Error :('});
        else
        {
        var sess=req.session;
        if(sess.city_data)
        delete sess.city_data;
        res.render('success.ejs',{message:'Inserted'});
        }
    });
});
});

module.exports=router;