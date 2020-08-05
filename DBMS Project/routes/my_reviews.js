var express=require('express');
var router=express.Router();
var db=require('../database');
var mongoose=require('mongoose');
var review_model=require('../models/comment');


function get_bus_details(bus_id,callback)
{
    var sql="SELECT id,agent_id as name , origin, dest from BUSES where id="+bus_id+";";
            db.query(sql,(err,result1)=>{
                if (err) {
                    callback(err, null);
                }else 
                    {
                        // console.log(result);
                        callback(null,result1);
                    }
            });
    // var sql= "select rating from bus_rating where bus_id="+bus_id+";";
    // console.log(sql);
    // db.query(sql,(err,data)=>{
        // return data[0].rating;
        // console.log(data[0].rating);
        
    // });
}



router.get('/:user_id',(req,res)=>{
    var user_id=req.params.user_id;
    var sess=req.session;
    if(user_id!=sess.Mobile)
    {
        req.flash('error_messages','Invalid User');
        res.redirect('/');
        return ; 
    }
    var obj={user_id:user_id};
    review_model.find(obj,function (err,result){
        if(Object.keys(result).length==0){
            req.flash('error_messages','You  have given no reviews. ');
            res.redirect('/');
            return;
        }
        else
        {
            // console.log(result);
            var bus_details={};
            for(let i=0;i<result.length;i++)
            {
            get_bus_details(result[i].bus_id,function (err,result1) { 
                if(err){console.log(err);return;}
                else 
                {
                    // console.log(result1);
                    bus_details[result[i].bus_id]=result1[0];
                    // console.log(i);
                }
                if(i==result.length-1)
                {
                    // console.log(bus_details);
                    // console.log(bus_details[3].name);
                    res.render('my_reviews.ejs',{result:result,unm:sess.Name,usermobile:sess.Mobile,bus_details:bus_details});
                    return;
                }});
            }
            return;
        }
    });
});

module.exports=router;