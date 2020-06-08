var express=require('express');
var router=express.Router();
var db=require('../database');

var mn_dte,mx_dte;
router.get('/',(req,res)=>{
    res.render('index.ejs');
});


router.get('/:mobile',function(req,res){
    sess=req.session;
    if(sess.Mobile!=req.params.mobile)
    {res.render('error.ejs',{error:'You are not allowed to view this page'});
    return;}
    var sql='SELECT * FROM cities';
    db.query(sql,function(err,data){
        if(err) throw err;
        // var values=Object.values(data);
        // console.log(data[0].city);

        var datetime=new Date();
        var today = new Date(datetime);
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            } 
        var min_date = yyyy+'-'+mm+'-'+dd;
        mn_dte=min_date;
        // console.log(min_date);
        if(mm==12)
        {yyyy=today.getFullYear()+1;mm='01';}
        else 
        {mm=today.getMonth()+2;if(mm<10){
            mm='0'+mm;
        }}
        
        if(dd=='31')dd='30';
        
        if(mm==2 && dd==31)dd=28;

        var max_date = yyyy+'-'+mm+'-'+dd;
        mx_dte=max_date;
        // console.log(max_date);
        // var year=new Date(datetime).getFullYear();var month=new Date(datetime).getMonth();var dte=new Date(datetime).getDate();
        // console.log(month);
        // var dd_mm
        res.render('booking_form.ejs',{mobile:req.params.mobile,cities:data,min_date:min_date,max_date:max_date});
    });
});

router.post('/:mobile',(req,res)=>{
    sess=req.session;
    if(sess.Mobile!=req.params.mobile || req.body.dot>mx_dte || req.body.dot<mn_dte)
    {res.render('error.ejs',{error:'You are not allowed to view this page'});
    return;}
    var date=new Date(req.body.dot);
    var day=date.getDay();
    console.log(day);
    if(day==1)day='MON';
    else if(day==2)day='TUES'
    else if(day==3)day='WEDNES';
    else if(day==4)day='THURS';
    else if(day==5)day='FRI';
    else  if(day==6)day='SATUR';
    else day='SUN';
    day+='DAY';
    // console.log(date);
    var dt=date.getDate();
    var mnth=date.getMonth();
    mnth+=1;
    var yr=date.getFullYear();
    var  sql="CALL buses_on_route('"+req.body.origin+"','"+req.body.dest+"','"+req.body.dot+"','"+day+"');";
    console.log(sql);
    db.query(sql,(err,data)=>{
        if(err)throw err;
        buses_on_route=Object.values(data[0]);
        sess=req.session;
        sess.date='';
        if(mnth<10)mnth='0'+mnth;
        if(dt<10)dt='0'+dt;
        sess.main_date=yr+'-'+mnth+'-'+dt;
        sess.date+=yr;sess.date+=mnth;sess.date+=dt;
        sess.searched_buses={};
        for(let i=0;i<buses_on_route.length;i++)
        {
            sess.searched_buses[buses_on_route[i].id]=1;
        }
        // chkd=true;
        // console.log(sess.date);
        res.render('search_result.ejs',{buses:buses_on_route,org:req.body.origin,dst:req.body.dest,date:req.body.dot,dt:sess.date,mobile:req.params.mobile});
    });
});

router.get('/bus_chart/:mobile/:id/:date',(req,res)=>
{
    sess=req.session;
    if(sess.Mobile!=req.params.mobile)
    {res.render('error.ejs',{error:'You are not allowed to view this page'});
    return;}
    if(sess.date!=req.params.date || sess.searched_buses[req.params.id]!=1)
    {
        res.render('error.ejs',{error:'Unknown Error :(  Try Again '});
    }
    else{
    // res.send('Reched Here');
    var date=req.params.date;
    // var date;
    console.log(date);
    var sql="CALL show_seats("+req.params.id+",'"+date+"');";
    // console.log(sql);
    db.query(sql,function(err,data){
        if(err)throw err;
        var seats=[];
        
        var layout=[];
        var label={};
        var cnt=1;
        var seat_id={};
        for(let i=0;i<data[0].length;i++)
        {seats.push(data[0][i].booked);label[seats[i]]=1;}
        if(data[1][0].category=='AC SEATER'){
        for(var i=0;i<10;i++)
        {
        var num='';
        var crnt=1;
        for(var j=0;j<6;j++){
        if(crnt==3)
        {
            num+='_';
            crnt++;
            continue;
        }
        var tmp=i+'_'+j;
        seat_id[tmp]=cnt;
        if(label[cnt]==1)
        {num+='b';crnt++;
        cnt++;}
        else 
        {
            num+='a';
            cnt++;
            crnt++;
        }
        }
        // console.log(num);
        layout.push(num);
        }
        }
        
        // console.log(seat_id);
        // console.log(arr);
        res.render('seat_chart.ejs',{layout:layout,seat_id:seat_id,busdata:data[1],mobile:req.params.mobile});
    });
}
});

router.post('/final_page/:mobile/:id',(req,res)=>{
    var sess=req.session;
    if(sess.Mobile!=req.params.mobile)
    {res.render('error.ejs',{error:'You are not allowed to view this page'});
    return;}
    var date=sess.main_date;
    var arr=Object.values(req.body);
    var total_seats=arr.length;
    var sql="CALL show_seats("+req.params.id+",'"+date+"');";
    // console.log(sql);
    db.query(sql,function(err,data){
        if(err)throw err;
        data=Object.values(data[0]);
        var booked_seats={};
        for(var i=0;i<data.length;i++)
        {
            booked_seats[data[i].booked]=1;
        }
        for(var i=0;i<arr.length;i++)
        {
            if(booked_seats[arr[i]]==1)
            {
                res.render('error.ejs',{error:'Sorry, seat '+arr[i]+' is already booked....(Please select seats again)'});
                return;
            }
        }

        // var expirytime=Date(Date.now()).toString;
        // expirytime=expirytime.toString();
        // expirytime+=(10*60*1000);
        // console.log(main_date);
        // console.log(expirytime);
        // console.log(' '+date+' ');
        var final_date=sess.main_date;
        final_date+=' 23:59:59';
        // final_date+=((24*60*60)*1000);
        console.log(final_date);

    });
});


module.exports=router;