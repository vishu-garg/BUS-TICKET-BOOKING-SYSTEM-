const express=require('express');
var router=express.Router();

router.get('/',function(req,res){
    req.session.destroy();
    console.log('1234');
    res.redirect('/');
    // res.end();
});

module.exports=router;