const express=require('express');

var router=express.Router();

router.post('/:type',(req,res)=>{
    res.redirect('/admin_home/'+req.params.type);
});

router.get('/:type',(req,res)=>{
    sess=req.session;
    console.log(sess);
    // sess.added=false;
    if(sess.admin!=req.params.type)
    {
        res.render('error.ejs',{error:'Unauthorized User!!!'})
    }
    if(sess.admin=='CEO')
    {
        res.render('ceo.ejs',{name:sess.admin_name});
    }
    if(sess.admin=='manager')
    {
        res.render('manager.ejs',{name:sess.admin_name,city:sess.admin_city});
    }
    if(sess.admin=='staff')
    {
        res.render('staff.ejs',{name:sess.admin_name,city:sess.admin_city});
    }
});

module.exports=router;