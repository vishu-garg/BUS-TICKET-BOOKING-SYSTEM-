const express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../../database');
var router=express.Router();

router.get('/sales/',(req,res)=>{
    var sess=req.session;
    if(sess.admin=='CEO')
    {
        var sql="select SUM(Amount) AS Amount,Month, Year from revenue where Status='C' group by Month , Year order by Year ;";
    db.query(sql,(err,data1)=>{
        // console.log(data1);
        var sql="select SUM(Amount) AS Amount,bus_Id from revenue where Status='C' group by bus_id;";
        db.query(sql,(err,data2)=>{
        // console.log(data2)
        // res.render('charts.ejs',{data:data1,data2:data2,type:sess.admin});
        sql="select SUM(Tickets) AS Tickets,Month, Year from revenue where Status='C' group by Month , Year order by Year ;";
        db.query(sql,(err,data3)=>{
            // console.log(data3);
            sql="select SUM(Tickets) AS Tickets,bus_Id from revenue where Status='C' group by bus_id;";
            db.query(sql,(err,data4)=>{
                // console.log(data4)
                res.render('sales.ejs',{data:data1,data2:data2,data3:data3,data4:data4,type:sess.admin});
                });
            });
        });
    });
    }
    else 
    {
        if(sess.admin=='manager')
        {
            var city=sess.admin_city;
            console.log(city);
            var sql="select SUM(Amount) AS Amount,Month, Year from revenue where Status='C' and bus_id in (SELECT id from buses where origin='"+city+"') group by Month , Year order by Year ;";
            db.query(sql,(err,data1)=>{
            console.log(data1);
            var sql="select SUM(Amount) AS Amount,bus_Id from revenue where Status='C'and bus_id in (SELECT id from buses where origin='"+city+"') group by bus_id;";
            db.query(sql,(err,data2)=>{
            // console.log(data2)
            // res.render('charts.ejs',{data:data1,data2:data2,type:sess.admin});
            sql="select SUM(Tickets) AS Tickets,Month, Year from revenue where Status='C'and bus_id in (SELECT id from buses where origin='"+city+"') group by Month , Year order by Year ;";
            db.query(sql,(err,data3)=>{
            // console.log(data3);
            sql="select SUM(Tickets) AS Tickets,bus_Id from revenue where Status='C'and bus_id in (SELECT id from buses where origin='"+city+"') group by bus_id;";
            db.query(sql,(err,data4)=>{
            // console.log(data4)
            res.render('sales.ejs',{data:data1,data2:data2,data3:data3,data4:data4,type:sess.admin});
            });});});});
        }
        else 
        {
            res.render('error.ejs',{error:'Unauthorised Access!'});
        }
    }
});

router.get('/cities_stats',(req,res)=>{
var sess=req.session;
var sql="SELECT Origin AS City , SUM(Amount) as Amount , SUM(Tickets) AS Tickets FROM buses JOIN revenue ON buses.ID=revenue.BUS_ID AND status='C' GROUP BY City;";
    db.query(sql,(err,data)=>{
        res.render('cities_stats.ejs',{data:data,type:sess.admin});
    })
})

module.exports=router;