const express=require('express');
var router=express.Router();
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../database');

router.post('/',function(req,res){
    let sql='SELECT COUNT(*) AS prev FROM users WHERE Mobile="'+req.body.mobile+'"';
    db.query(sql,function(err,data){
        if(err)throw err;
        if(data[0].prev!=0)
        {
            console.log(data[0].prev);

            res.render('error.ejs',{error:'User Already Exits'});
        }
        else 
        {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                sql='Insert into users (Mobile,Name,Password) values ("'+req.body.mobile+'", "'+req.body.name+'", "'+hash+'")';
                console.log(sql);
                db.query(sql,function(err,data){
                    console.log(data);
                    sess=req.session;
                    sess.Name=req.body.name;
                    sess.Mobile=req.body.mobile;
                    res.redirect('/home/'+sess.Name+'/'+sess.Mobile);
                });
            });
        }
    });
});

module.exports=router;

