const express =require('express');
var db=require('../database');
var router=express.Router();
var create_ticket=require('./generate_ticket');
function book_seats(id,date,seat_no,final_date)
{
    var sql="UPDATE `bookings` SET booking_time='"+final_date+"',status='C' WHERE bus="+id+" AND dot='"+date+"' AND seat_no="+seat_no+" AND status='L';";
    db.query(sql,function(err,data){
        if(err){console.log(err);}
        console.log('booked');
        return;
    });
    console.log(sql+" ");
}

async function func2(invoice)
{
    create_ticket.create_ticket(invoice);
    return;
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
    var sql2="SELECT * FROM buses where id="+sess.bus_id;
    console.log(sql2);
    db.query(sql2,async (err,res2)=>{
    for(let i=0;i<sess.seats_array.length;i++)
    {
    var sql="SELECT booking_id,seat_no from bookings WHERE bus="+sess.bus_id+" AND dot='"+sess.main_date+"' AND seat_no="+sess.seats_array[i]+" AND status='C';"
    console.log(sql);
    db.query(sql,async(err,seat_id)=>{
    // console.log(seat_id[0]);
    var t_id=seat_id[0].booking_id;
    let invoice={
        ticket_id:t_id,
        date:sess.main_date,
        origin:res2[0].origin,
        dest:res2[0].dest,
        seat_no:seat_id[0].seat_no,
        bus_name:res2[0].agent_id,
        user_name:sess.Name,
        mobile:sess.Mobile
    }
    console.log(invoice);
    await func2(invoice);
}); 
if(i==sess.seats_array.length-1){
    req.flash('success_messages','Your Seats Booked Succesfully !');
    res.redirect('/');
    return ;
    }
}   
});
});

module.exports=router;