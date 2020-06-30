const express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../../database');
var router=express.Router();
router.get('/:type/',(req,res)=>{
    var sess=req.session;
    var tmp_sql="select staff_amount from employee_details where admin_id='"+sess.admin_id+"';";
    // console.log(tmp_sql);
    db.query(tmp_sql,(err,data2)=>{
    sess.staff_amount=data2[0].staff_amount;
    console.log(sess.staff_amount);
    if(sess.staff_amount==0)
    {
    res.render('error.ejs',{error:'Sorry You cannot add more Employess.'});
    return;
    }
    var add_type=req.params.type;
    if(add_type=='manager')
    {
        if(sess.admin!='CEO')
        {res.render('error.ejs',{error:'Only CEO can Add Managers...'});return;}
        else 
        {
            if(sess.city_data)
            {res.render('add_admin.ejs',{type:req.params.type,cities:sess.city_data});}
            else{
            var sql='SELECT city FROM cities';
            db.query(sql,(err,data)=>{
                // console.log(data[0].city);
                sess.city_data=data;
                res.render('add_admin.ejs',{type:req.params.type,cities:data});
            });
            } 
        }
    }
    else if(add_type=='CEO')
    {
        res.render('error.ejs',{error:'Unkonown Action!'});return;
    }
    else if(add_type=='staff')
    {
        if(sess.admin!='CEO' && sess.admin!='manager')
        {
            res.render('error.ejs',{error:'Unauthorised Access...'});return;
        }
        else 
        {
            if(sess.admin=='CEO')
            {
                if(sess.city_data)
                res.render('add_admin.ejs',{type:req.params.type,cities:sess.city_data});
                else 
                {
                    var sql='SELECT city FROM cities';
                    db.query(sql,(err,data)=>{
                    // console.log(data[0].city);
                    sess.city_data=data;
                    res.render('add_admin.ejs',{type:req.params.type,cities:data});
            }); 
                } 
            }
            else if(sess.admin=='manager')
            {
                if(sess.city_data)
                {
                    res.render('add_admin.ejs',{type:req.params.type,cities:sess.city_data});
                }
                else 
                {
                    var sql="SELECT city FROM employee_details where admin_id='"+sess.admin_id+"';";
                    db.query(sql,(err,data)=>{
                        sess.city_data=data;
                        res.render('add_admin.ejs',{type:req.params.type,cities:data});
                    });
                }
            }

        }
    }
    else 
    {
        res.render('error.ejs',{error:'Unkonown Action!'});return;
    }
});
});

router.post('/:type/',(req,res)=>{
    
    var sess=req.session;
    if(sess.staff_amount==0)
    {
        res.render('error.ejs',{error:'Sorry You cannot add more Employess.'});
        return;
    }
    
    if(req.body.type=='manager' && sess.admin=='CEO')
    {
        req.body.salary=50000;
        req.body.staff=5;
        req.body.password=req.body.name[0]+req.body.name[1]+req.body.name[2]+"1234";
    }
    else if(req.body.type=='staff')
    {
        if(sess.admin=='manager')
        {
            var tmp=sess.city_data;
            if(tmp[0].city!=req.body.city)
            {
                res.render('error.ejs',{error:'UNAUTHORISED ACCESS'});
                return;
            }
        }
        req.body.salary=25000;
        req.body.staff=0;
        req.body.password=req.body.name[0]+req.body.name[1]+req.body.name[2]+"1234";
    }
    else 
    {
        res.render('error.ejs',{error:'Unauthorised access'});
        return;
    }

        // console.log(req.body.password);
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    sess.staff_amount-=1;
    sql ="call insert_admin('"+ req.body.type +"','"+ req.body.id+"','"+ req.body.name +"',"+ req.body.age +",'"+ req.body.doj +"','"+ req.body.city +"','"+ hash +"',"+ req.body.salary +","+ req.body.staff + ","+sess.staff_amount+ ");";
    console.log(sql);
    db.query(sql,(err,data)=>{
        if(err)
        {console.log(err);res.render('error.ejs',{error:'Something Unexpected Happened ! Please check  the details again..'});}
        else 
        res.render('success.ejs',{message:req.body.type+' added!'});
    });        
    });
});

module.exports=router;
