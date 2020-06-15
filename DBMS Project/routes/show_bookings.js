const express=require('express');
var router=express.Router();
var db=require('../database');

router.get('/:mobile',(req,res)=>{
    sess=req.session;
    if(sess.Mobile!=req.params.mobile)
    {res.render('error.ejs',{error:'You are not allowed to view this page'});
    return;}
    var sql='call show_bookings('+req.params.mobile+');';
    db.query(sql,(err,data)=>{
        // console.log(data);

        // for(let i=0;i<data[0].length;i++)
        // {
        //     var t1=data[0][i].timing[0]+data[0][i].timing[1];
        //     // console.log(t1);
        //     if(t1==12)dat[0][i].timing+='PM';
        //     else if(t1<12)dat[0][i].timing+='AM'
        //     else
        //     {
        //         var t2=t1%12;
        //         // t2=10;
        //         // console.log(t2);
        //         var  ch='';
        //         if(t2<10)
        //         ch+=('0');
        //         ch+=t2;
        //         // console.log(ch);
        //         var tmp=ch;
        //         for(let j=2;j<data[0][i].timing.length;j++)
        //         tmp+=data[0][i].timing[j];
        //         // console.log(tmp);
        //         // tmp[0]=ch[0];
        //         // tmp[1]=ch[1];
        //         tmp+=' PM';
        //         data[0][i].timing=tmp;
        //         console.log(1234);
        //         // console.log(data[0][i].timing[0]);
        //     }
        //     console.log(data[0][i].timing);
        // }
        
        var tme=new Date().toTimeString();
        console.log(new Date('1/1/2000 01:02:36'));
        var date=new Date().toDateString();
        var tme2=new Date().getTime();
        label={};
        console.log(date);
        for(let i=0;i<data[0].length;i++)
        {
            var tme3=new Date(data[0][i].dot).getTime();
            if((data[0][i].dot).toDateString()!=date && tme3>tme2)
            {label[i]=1;}
            else if((data[0][i].dot).toDateString()==date && new Date('1/1/2011 '+data[0][i].timing) > new Date('01/01/2011 '+tme))
            {label[i]=1;}
            console.log(new Date('1/1/2011 '+data[0][i].timing));
        }

        res.render('bookings.ejs',{data:data[0],label:label});

    });
});

module.exports=router;