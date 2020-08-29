const express =require('express');
var router=express.Router();
var tckt_model=require('../models/tickets');
router.get('/:user_id',(req,res)=>{
    sess=req.session;
    if(sess.Mobile==undefined || sess.Mobile!=req.params.user_id)
    {
        req.flash('error_messages','Invalid User');
        res.redirect('/');
        return ; 
    }
    else 
    {
        tckt_model.find({user_id:req.params.user_id},(err,result)=>{
            if(err)
            console.log(err);
            else 
            {
            
               res.render('download_tickets.ejs',{data:result,unm:sess.Name,usermobile:sess.Mobile}); 
            }
        });
    }   

});

module.exports=router;