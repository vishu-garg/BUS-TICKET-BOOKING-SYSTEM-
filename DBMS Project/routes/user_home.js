const express=require('express');
var router=express.Router();

// router.get('/',function(req,res){
//     console.log('hello');
// });
router.get('/:name/:mobile',function(req,res){
    // console.log('h1');
    sess=req.session;
    // console.log(sess);
    // console.log(sess.Name,req.params.name);
    if(sess.Mobile!=req.params.mobile || sess.Name!=req.params.name)
    {
        // console.log(sess.Mobile!=req.params.mobile , sess.Name!=req.params.name);
        req.flash('error_messages','You are not allowed to view this page');
        res.redirect('/');
        return ;
    }
    else 
    {
        res.render('user_page.ejs',{username:req.params.name,usermobile:req.params.mobile,unm:sess.Name});
    }
});

module.exports=router;