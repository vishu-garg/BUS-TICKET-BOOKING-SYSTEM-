var express=require('express');
const bcrypt=require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
var db=require('../database');
var router=express.Router();
router.use(bodyParser.json());
router.post('/',(req,res)=>{
    var id=req.body.id;
    var pass=req.body.pass;
    var sql="SELECT  * FROM ADMIN JOIN EMPLOYEE_DETAILS ON ADMIN.admin_id=EMPLOYEE_DETAILS.admin_id AND ADMIN.admin_id='"+id+"';";
    db.query(sql,(err,data)=>{
    if(data.length==0)
    res.send('WRONG_DETAILS');
    else
    {
    bcrypt.compare(req.body.pass,data[0].admin_pass, function(err, result)
    {
    console.log(result);
    if(result==false)
        res.send('WRONG_DETAILS');
    else 
    {var sess=req.session;sess.admin_name=data[0].name;sess.admin_city=data[0].city;sess.staff_amount=data[0].staff_amount;sess.admin=data[0].type;sess.admin_id=id;res.send(data[0].type);}
    });
    }
});
});

module.exports=router;
