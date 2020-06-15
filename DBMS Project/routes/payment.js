const express =require('express');
var db=require('../database');
var router=express.Router();
function book_seats(id,date,seat_no,final_date)
{
    var sql="UPDATE `dbms_project`.`bookings` SET booking_time='"+final_date+"',status='C' WHERE bus="+id+" AND dot='"+date+"' AND seat_no="+seat_no+";";
    db.query(sql,function(err,data){
        if(err)throw err;
        console.log('booked');
        return;
    });
    console.log(sql+" ");
}
router.post('/:type',(req,res)=>{
    var sess=req.session;
    var final_date=sess.final_date;
    var arr=sess.seats_array;
    console.log(final_date);
    for(let i=0;i<arr.length;i++)
    {
        book_seats(sess.bus_id,sess.main_date,arr[i],final_date);
    }
    res.render('success.ejs',{message:'YOUR PAYMENT RECIEVED'});
});

module.exports=router;