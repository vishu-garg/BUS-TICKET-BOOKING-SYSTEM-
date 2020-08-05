var express=require('express');
var router=express.Router();
var db=require('../database');
var mongoose=require('mongoose');
var review_model=require('../models/comment');

const server_upload=require('../routes/multer');
const cloud_upload=require('../routes/cloudinary');

router.post('/',server_upload.single('image'),(req,res,next)=>{

    var sess=req.session;
    var can_rate=sess.can_rate;
    if(can_rate==undefined)
    {
        res.send('NOT LOGGED IN');
        return;
    }


    var bus_id=req.body.bus_id;


    if(can_rate[bus_id]!=1)
    {
        req.flash('error_messages','You Cannot Rate This Bus :(');
        res.redirect('/bookings/'+sess.Mobile);
        return ;
    }
    var stars=req.body.stars;
    var review=req.body.comment;



    if(stars<1 || stars>5)
    {
        req.flash('error_messages','Invalid Rating');
        res.redirect('/bookings/'+sess.Mobile);
        return ; 
    }

    var user_id=sess.Mobile;

    var obj={review:review,user_id:user_id,bus_id:bus_id,stars:stars};
    
    var month=new Date().getMonth();
    month+=1;
    if(month<10)month=('0'+month);
    var day = new Date().getDate();
    if(day<10)day=('0'+day);
    var tmp_date=(new Date().getFullYear())+'-'+month+'-'+day;
    var sql = "INSERT INTO `dbms_project`.`ratings` (`user_id`, `bus_id`, `rating`,`created_at`) VALUES ('"+user_id+"',"+bus_id+","+stars+",'"+ tmp_date +"');";


    // console.log(sql);
    db.query(sql,(err,data)=>{
        if(err)
        {
            req.flash('error_messages','You have Already Rated This Bus');
            res.redirect('/bookings/'+sess.Mobile);
            return ;
        }

        // console.log(req.body);
        // console.log(req.file);
        if(req.file!=undefined)
        {
        cloud_upload(req,(err,result1)=>
        {
            if(err){
                console.log(err);
                return;
            }
            // console.log(result1);
            can_rate[bus_id]=0;
            db.query("UPDATE `dbms_project`.`ratings` SET `image_url` = '"+result1+"'WHERE user_id='"+user_id+"'AND bus_id="+bus_id+";",(err,res1)=>
            {
            if(err)
            {
                res.send(err);
                return;
            } 
            req.flash('success_messages','Your Review Added Successfully!!!');
            
            review_model.create(obj,function(err,result){
                if(err)console.log(err);
                // console.log(result);
            });
            
            res.redirect('/bookings/'+sess.Mobile);
            return ;
            });
        });
    }
    else  
    {
        can_rate[bus_id]=0;
        req.flash('success_messages','Your Review Added Successfully!!!');
        review_model.create(obj,function(err,result){
            if(err)console.log(err);
            // console.log(result);
        });
        res.redirect('/bookings/'+sess.Mobile);
        return; 
    }
    })

});

module.exports=router;