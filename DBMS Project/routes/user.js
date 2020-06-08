var express =require('express');
var router=express.Router();
var db=require('../database');

app.get('/',function(req,res){
    let sql='SELECT * FROM buyer';
    db.query(sql,function(err,data){
        if(err)throw err;
        // console.log(data[0].NAME);
        res.render('user-list',{title:'User-List',userData:data});
    });
});

module.exports = router;