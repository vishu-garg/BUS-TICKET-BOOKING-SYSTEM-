var express=require('express');
const bodyParser = require('body-parser');
var db=require('../database');
var router=express.Router();
router.use(bodyParser.json());
router.post('/',(req,res)=>{
    var id=req.body.id;
    var pass=req.body.pass;
    var sql="SELECT  COUNT(*) AS person , type as role FROM ADMIN JOIN EMPLOYEE_DETAILS ON ADMIN.admin_id=EMPLOYEE_DETAILS.admin_id AND ADMIN.admin_id='"+id+"' AND admin_pass='"+pass+"';";
    db.query(sql,(err,data)=>{
        if(err)throw err;
        console.log(data);
        if(data[0].person==0)
        res.send('WRONG_DETAILS');
        else 
        res.send(data[0].role);
    })
})

module.exports=router;
