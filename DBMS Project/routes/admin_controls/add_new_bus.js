const express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../../database');
var router=express.Router();
router.get('/',(req,res)=>{
    var sess=req.session;
    if(sess.admin!='manager' && sess.admin!='staff')
    {
        res.render('error.ejs',{error:'UNAUTHORISED ACCESS!'});
        return;
    }
    // sess.added=false;
    var sql='SELECT city from cities;';
    db.query(sql,(err,data)=>{
        sql="SELECT city from employee_details where admin_id='"+sess.admin_id+"';";
        db.query(sql,(err,data1)=>{
        sess.admin_city=data1[0].city;
        res.render('add_bus.ejs',{data:data,its_city:data1});
    });
    
    });
});

router.post('/',(req,res)=>{
    var sess=req.session;
    req.body.timing=req.body.timing+":00";
    // res.send(req.body);
    var tmp=req.body;
    a_id='"'+tmp.agent_id+'"';
    name1='"'+tmp.name+'"';
    org='"'+sess.admin_city+'"'; 
    dst='"'+tmp.dest+'"'; 
    mobile='"'+tmp.mobile+'"'; 
    cap=tmp.cap;
    price=tmp.price;
    category='"'+tmp.type+'"';
    timing=tmp.timing;
    admin_id='"'+sess.admin_id+'"';
    // console.log(a_id,name1, org, dst, mobile, cap, 'YES', price, category, timing,admin_id);
    var sql='call add_new_bus('+a_id+','+name1+','+org+','+dst+','+mobile+','+cap+','+price+','+category+',"'+timing+'",'+admin_id+');';
    console.log(sql);
    // res.send(sql);
    
    db.query(sql,(err,data)=>{
        if(err)
        {
            console.log(err);
            res.render('error.ejs',{error:'ERROR 404!'});
            return;
        }
        sess.added=data[0][0].id;
        console.log(data[0][0].id);
        res.redirect('/addbus/'+data[0][0].id);
        // res.render('bus_added.ejs',{id:});
    });
});

router.get('/:id',(req,res)=>{
    var sess=req.session;
    console.log(sess.added);
    res.render('bus_added.ejs',{id:sess.added});
});

module.exports=router;