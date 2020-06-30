const express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
var db=require('../../database');
var router=express.Router();

router.get('/:id',(req,res)=>{
    sess=req.session;
    var id='"'+req.params.id+'"';
    var sql1="SELECT * FROM buses where id="+id+";";
    db.query(sql1,(err,data)=>{
        if(data.length==0 ||  data[0].origin!=sess.admin_city)
        {
            res.render('error.ejs',{error:'Unauthorised Access!'});
            return;
        }
        sess.bus_id=req.params.id;
        res.render('add_in_chart.ejs',{id:req.params.id,name:data[0].agent_id,org:data[0].origin,dest:data[0].dest,type:sess.admin});
    });

});

router.post('/:id',(req,res)=>{
    sess=req.session;
    if(req.params.id!=sess.bus_id)
    {
        res.render('error.ejs',{error:'Unauthorised Access!'});
        return;
    }
    // res.send(req.body);
    var arr=Array();
    var id=req.params.id;
    if(req.body.SUNDAY)
    arr.push('SUNDAY');
    if(req.body.MONDAY)
    arr.push('MONDAY');
    if(req.body.TUESDAY)
    arr.push('TUESDAY');
    if(req.body.WEDNESDAY)
    arr.push('WEDNESDAY');
    if(req.body.THURSDAY)
    arr.push('THURSDAY');
    if(req.body.FRIDAY)
    arr.push('FRIDAY');
    if(req.body.SATURDAY)
    arr.push('SATURDAY');
    console.log(arr);
    var sql1="DELETE FROM chart where bus="+id+";";
    console.log(sql1);
    db.query(sql1,(err,data1)=>{
        if(err)
        {
            res.render('error.ejs',{error:'Something Unexpected Happened :('});
            return;
        }
        for(let i=0;i<arr.length;i++)
        {
            var sql2="INSERT INTO chart (`bus`,`day`) values ("+id+",'"+arr[i]+"');";
            console.log(sql2);
            db.query(sql2,(err,data)=>{
                console.log('inserted!');
            });
        }
        res.render('success.ejs',{message:'CHART UPDATED'});
    });
});

router.get('/',(req,res)=>{
    res.render('fill_id.ejs');
});
router.post('/',(req,res)=>{
    res.redirect('/add_chart/'+req.body.id);
});

module.exports=router;