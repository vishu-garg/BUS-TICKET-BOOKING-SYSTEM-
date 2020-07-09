var express=require('express');
var router=express.Router();

var db=require('../database');


function cancel_seat(id,charge)
{
    var sql="UPDATE `dbms_project`.`bookings` SET amount='"+charge+"',status='CNCL' WHERE booking_id="+id+";";
    db.query(sql,function(err,data){
        if(err)throw err;
        console.log('cancelled');
        return;
    });
    console.log(sql+" ");
}


function do_delete(id,mobile,price,charge)
{
    var sql="INSERT INTO REFUNDS (user_id,amount) values ('"+mobile+"',"+price+");";
    db.query(sql,(err,data)=>{
        if(err)throw err;
        cancel_seat(id,charge);
    });
}


router.get('/:id/:mobile/:price',(req,res)=>{
    sess=req.session;
    if(req.params.mobile!=sess.Mobile)
    {
        req.flash('error_messages','Invalid User');
        res.redirect('/');
        return ;
    }
    var sql1='SELECT status FROM BOOKINGS WHERE booking_id='+req.params.id+';';
    db.query(sql1,(err,data)=>{
    console.log(data);
    if(data[0].status!='C')
    {
        req.flash('error_messages','Ticket Already Cancelled');
        res.redirect('/bookings/'+sess.Mobile);
        return ;
    }
    // var date=new Date();
    // dat=date.toLocaleDateString();
    // tme=date.toTimeString();
    // date=dat+' '+tme;
    // var date2='2020-06-14 18:00:00';
    // date2=new Date(date2);
    // date3=date2.toLocaleDateString();
    // date3=date2.toTimeString();
    // var d4=new Date(date).getTime();
    // var d2=new Date(date2).getTime();
    // var tmp=(d4-d2)/(3600000)
    // console.log(tmp);
    // var id=req.body.id;
    // var pass=req.body.pass;
    
    var sql2="call get_booking_details("+req.params.id+");";
    // console.log(sql2);
    db.query(sql2,(err,data)=>{
        if(err)throw err;
        var dt1=new  Date(data[0][0].dot).toLocaleDateString();
        console.log(data[0][0].timing);
        var dt2=new  Date(dt1+' '+data[0][0].timing);
        console.log(dt2);
        var dte=new Date();
        console.log(dte);
        dt2=dt2.getTime();
        dte=dte.getTime();
        var hrs=(dt2-dte)/(36e5);
        console.log(hrs);
        var price=data[0][0].price,tag=100;
        if(data[0][0].user!=req.params.mobile)
        {
            res.render('error.ejs',{error:'Unauthorised User'});
            return;
        }
        if(hrs<=0)
        {
            res.render('error.ejs',{error:'Ticket Cannot be cancelled now'});
            return;
        }
        else if(hrs>48)
        {
            price=(0.8)*price;
            tag=20;
        }
        else if(hrs<=48 && hrs>24)
        {
            price=(0.5)*(price);
            tag=50;
        }
        else if(hrs<=24)
        {
            price=(0.1)*(price);
            tag=90;
        }
        charge = data[0][0].price-price;
        do_delete(req.params.id,req.params.mobile,price,charge);
        res.render('deleted.ejs',{org:data[0][0].price,amount:price,tag:tag}); 
    });
    });
});

module.exports=router;