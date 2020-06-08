const express=require('express');
var router=express.Router();

// router.get('/',function(req,res){
//     console.log('hello');
// });
router.get('/:name/:mobile',function(req,res){
    // console.log('h1');
    sess=req.session;
    console.log(sess.Mobile);
    if(sess.Mobile!=req.params.mobile)
    res.render('error.ejs',{error:'You are not allowed to view this page'});
    else
    {
    if(sess.Admin)
    res.render('admin_page.ejs',{message:'This is Admins Page'});
    else 
    {
        res.render('user_page.ejs',{username:req.params.name,usermobile:req.params.mobile});
    }
    }
});

module.exports=router;