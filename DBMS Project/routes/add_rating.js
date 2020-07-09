var express=require('express');
var router=express.Router();
var starRatings = require('star-ratings');
var db=require('../database');

router.post('/',(req,res)=>{
    var sess=req.session;
    var can_rate=sess.can_rate;
    if(can_rate==undefined)
    {
        res.send('NOT LOGGED IN');
        return;
    }
    var bus_id=req.body.bus_id;
    // console.log(bus_id);
    // console.log(can_rate[bus_id]);
    if(can_rate[bus_id]!=1)
    {
        req.flash('error_messages','You Cannot Rate This Bus :(');
        res.redirect('/bookings/'+sess.Mobile);
        return ;
    }
    var stars=req.body.stars;

    if(stars<1 || stars>5)
    {
        req.flash('error_messages','Invalid Rating');
        res.redirect('/bookings/'+sess.Mobile);
        return ; 
    }

    var user_id=sess.Mobile;

    var sql = 'INSERT INTO `dbms_project`.`ratings` (`user_id`, `bus_id`, `rating`) VALUES ("'+user_id+'",'+bus_id+','+stars+');';
    // console.log(sql);
    db.query(sql,(err,data)=>{
        if(err)
        {
            req.flash('error_messages','You have Already Rated This Bus');
            res.redirect('/bookings/'+sess.Mobile);
            return ;
        }
        can_rate[bus_id]=0;
        req.flash('success_messages','Your Review Added Successfully!!!');
        res.redirect('/bookings/'+sess.Mobile);
        return ;
    })

});

module.exports=router;