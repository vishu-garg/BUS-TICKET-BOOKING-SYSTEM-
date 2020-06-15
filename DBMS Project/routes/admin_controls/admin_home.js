const express=require('express');

var router=express.Router();

router.post('/:type',(req,res)=>{
    sess=req.session;
    sess.admin=req.params.type;
    if(sess.admin=='CEO')
    {
        res.render('ceo.ejs');
    }
});

module.exports=router;