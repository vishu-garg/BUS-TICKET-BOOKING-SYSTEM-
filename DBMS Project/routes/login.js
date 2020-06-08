const express=require('express');
var router=express.Router();
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../database');

router.post('/',function(req,res){
    let sql='SELECT * FROM users WHERE Mobile="'+req.body.mobile+'"';
    db.query(sql,function(err,data){
        if(err) throw err;
        // console.log(data);
        if(data.length>0)
        {
            // console.log(data[0].Password);
            bcrypt.compare(req.body.password,data[0].Password, function(err, result) {
                // result == true
                if(result==true)
                {
                    sess=req.session;
                    sess.Name=data[0].Name;
                    sess.Mobile=req.body.mobile;
                    console.log('/home/'+sess.Name+'/'+sess.Mobile);
                    res.redirect('/home/'+sess.Name+'/'+sess.Mobile);
                }
                else 
                {
                    res.render('error.ejs',{error:'Wrong  Password'});
                }
            });
        }
        else  
        {
            res.render('error.ejs',{error:'Mobile Number Not Exits'});
        }
    });
});



module.exports=router;