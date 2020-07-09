var express=require('express');
var router=express.Router();
var starRatings = require('star-ratings');
var db=require('../database');

var mn_dte,mx_dte;

router.get('/',(req,res)=>{
    sess=req.session;
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
        res.render('booking_form.ejs',{mobile:sess.Mobile,cities:data,min_date:min_date,max_date:max_date,usermobile:sess.Mobile,unm:sess.Name});
    });
});

router.get('/:mobile',function(req,res){
    res.redirect('/book');
    return;
});

function calc_rating(bus_id,callback)
{
    var sql= "select rating from bus_rating where bus_id="+bus_id+";";
    // console.log(sql);
    db.query(sql,(err,data)=>{
        // return data[0].rating;
        // console.log(data[0].rating);
        if (err) {
            callback(err, null);
        } else 
            {
                if(data.length!=0)
                callback(null, data[0].rating);
                else 
                callback(null,3);
            }
    });
}

router.get('/chart/:dot/:origin/:dest',(req,res)=>{
    if(mn_dte==undefined || mx_dte==undefined)
    {
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
    }
    req.body.dot=req.params.dot;
    req.body.origin=req.params.origin;
    req.body.dest=req.params.dest;
    sess=req.session;
    console.log(req.body.dot,mn_dte);
    if(req.body.dot>mx_dte || req.body.dot<mn_dte || req.body.origin==req.body.dest || req.body.dot=="" || req.body.origin=="" || req.body.dest=="" || req.body.dot==undefined || req.body.origin==undefined || req.body.dest==undefined || req.body.dot.length!=mx_dte.length)
    {
        console.log(req.body.dot,req.body.origin,req.body.dest);
        console.log(req.body.dot>mx_dte , req.body.dot<mn_dte , req.body.origin==req.body.dest , req.body.dot=="" , req.body.origin=="" , req.body.dest=="" , req.body.dot==undefined , req.body.origin==undefined , req.body.dest==undefined , req.body.dot.length!=mx_dte.length);
        req.flash('error_messages','Invalid Details');
        res.redirect('/book/'+sess.Mobile+'/');
        return ; 
    }
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
        console.log(data);
        if(err)throw err;
        buses_on_route=Object.values(data[0]);
        sess=req.session;
        sess.date='';
        if(mnth<10)mnth='0'+mnth;
        if(dt<10)dt='0'+dt;
        sess.main_date=yr+'-'+mnth+'-'+dt;
        sess.date+=yr;sess.date+=mnth;sess.date+=dt;
        sess.searched_buses={};
        var rating={};
        if(buses_on_route.length==0)
        {
            res.render('search_result.ejs',{buses:buses_on_route,org:req.body.origin,dst:req.body.dest,date:req.body.dot,dt:sess.date,mobile:sess.Mobile,usermobile:sess.Mobile,unm:sess.Name,ratings:rating}); 
        }
        for(let i=0;i<buses_on_route.length;i++)
        {
            sess.searched_buses[buses_on_route[i].id]=1;
            calc_rating(buses_on_route[i].id,function(err,val){
            if(err)
            res.send('error');
            else{
            rating[buses_on_route[i].id]=val;
            }
        if(i==buses_on_route.length-1){
        res.render('search_result.ejs',{buses:buses_on_route,org:req.body.origin,dst:req.body.dest,date:req.body.dot,dt:sess.date,mobile:sess.Mobile,usermobile:sess.Mobile,unm:sess.Name,ratings:rating});
        }});
        }
   });
})

router.post('/:mobile',(req,res)=>{
    sess=req.session;
    // if(sess.Mobile!=req.params.mobile)
    // {
    //     req.flash('error_messages','Invalid User');
    //     res.redirect('/');
    //     return ; 
    // }
    if(req.body.dot>mx_dte || req.body.dot<mn_dte || req.body.origin==req.body.dest || req.body.dot=="" || req.body.origin=="" || req.body.dest=="" || req.body.dot==undefined || req.body.origin==undefined || req.body.dest==undefined)
    {
        req.flash('error_messages','Invalid Form Details');
        res.redirect('/book/'+sess.Mobile+'/');
        return ; 
    }
    res.redirect('/book/chart/'+req.body.dot+'/'+req.body.origin+'/'+req.body.dest);
    return;
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
        console.log(data);
        if(err)throw err;
        buses_on_route=Object.values(data[0]);
        sess=req.session;
        sess.date='';
        if(mnth<10)mnth='0'+mnth;
        if(dt<10)dt='0'+dt;
        sess.main_date=yr+'-'+mnth+'-'+dt;
        sess.date+=yr;sess.date+=mnth;sess.date+=dt;
        sess.searched_buses={};
        var rating={};
        if(buses_on_route.length==0)
        {
            res.render('search_result.ejs',{buses:buses_on_route,org:req.body.origin,dst:req.body.dest,date:req.body.dot,dt:sess.date,mobile:req.params.mobile,usermobile:sess.Mobile,unm:sess.Name,ratings:rating}); 
        }
        for(let i=0;i<buses_on_route.length;i++)
        {
            sess.searched_buses[buses_on_route[i].id]=1;
            calc_rating(buses_on_route[i].id,function(err,val){
            if(err)
            res.send('error');
            else{
            rating[buses_on_route[i].id]=val;
            }
        if(i==buses_on_route.length-1){
        res.render('search_result.ejs',{buses:buses_on_route,org:req.body.origin,dst:req.body.dest,date:req.body.dot,dt:sess.date,mobile:req.params.mobile,usermobile:sess.Mobile,unm:sess.Name,ratings:rating});
        }});
        }
   });
});

router.get('/bus_chart/:mobile/:id/:date',(req,res)=>
{
    sess=req.session;
    if(sess.Mobile==undefined || sess.Mobile!=req.params.mobile)
    {
        req.flash('error_messages','Invalid User');
        res.redirect('/book/'+req.params.mobile+'/');
        return ; 
    }
    if(sess.date!=req.params.date || sess.searched_buses[req.params.id]!=1)
    {
        req.flash('error_messages','Unknown Error Search Again');
        res.redirect('/book/'+req.params.mobile+'/');
        return ;
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
        sess.bus_price=data[1][0].price;
        sess.bus_name=data[1][0].agent_id;
        sess.type=data[1][0].category;
        if(data[1][0].category=='AC SEATER' ||data[1][0].category=='NON AC SEATER'){
        var tmp45=data[1][0].capacity/5;
        for(var i=0;i<tmp45;i++)
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
        else {
            var tmp45=data[1][0].capacity/3;
            for(var i=0;i<tmp45;i++)
            {
            if(i<(tmp45/2)){
            var num='';
            var crnt=1;
            for(var j=0;j<4;j++){
            if(crnt==2)
            {
                num+='_';
                crnt++;
                continue;
            }
            var tmp=i+'_'+j;
            seat_id[tmp]=cnt;
            if(label[cnt]==1)
            {num+='b';crnt++;
            if(j==0)
            cnt+=2;
            else if(j==2)
            cnt++;
            else 
            cnt+=3;
            }
            else 
            {
                num+='a';
                if(j==0)
                cnt+=2;
                else if(j==2)
                cnt++;
                else 
                cnt+=3;
                crnt++;
            }
            }
            if(i+1==(tmp45/2))cnt=2;
            }
            else{
                var num='';
                var crnt=1;
                for(var j=0;j<4;j++){
                if(crnt==2)
                {
                    num+='_';
                    crnt++;
                    continue;
                }
                var tmp=i+'_'+j;
                seat_id[tmp]=cnt;
                if(label[cnt]==1)
                {num+='b';crnt++;
                if(j==0)
                cnt+=3;
                else if(j==2)
                cnt++;
                else 
                cnt+=2;
                }
                else 
                {
                    num+='a';
                    crnt++;
                    if(j==0)
                    cnt+=3;
                    else if(j==2)
                    cnt++;
                    else 
                    cnt+=2;
                }
                } 
            }
            // console.log(num);
            layout.push(num);
            }
            }

        
        console.log(layout.length);
        // console.log(seat_id);
        // console.log(arr);
        res.render('seat_chart.ejs',{layout:layout,seat_id:seat_id,busdata:data[1],mobile:req.params.mobile,usermobile:sess.Mobile,unm:sess.Name});
    });
}
});

function lock_seat(mobile,id,date,seat_no,amount)
{
    var sql="INSERT INTO `dbms_project`.`bookings` (`user`, `bus`, `dot`, `seat_no`,`amount`) VALUES ('"+mobile+"', '"+id+"', '"+date+"', '"+seat_no+"',"+amount+");";
    db.query(sql,function(err,data){
        if(err)throw err;
        console.log('inserted');
        return;
    });
}

router.post('/final_page/:mobile/:id',(req,res)=>{
    var sess=req.session;
    if(sess.Mobile!=req.params.mobile)
    {
        req.flash('error_messages','Invalid User');
        res.redirect('/book/'+req.params.mobile+'/');
        return ;
    }
    var date=sess.main_date;
    var arr=Object.values(req.body);
    if(arr.length==0)
    {
        req.flash('error_messages','Seat Not Selected!');
        res.redirect('/book/bus_chart/'+req.params.mobile+'/'+req.params.id+'/'+sess.date+'/');
        return ;
    }
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
                req.flash('error_messages','Sorry, seat '+arr[i]+' is already booked....(Please select seats again)');
                res.redirect('/book/bus_chart/'+req.params.mobile+'/'+req.params.id+'/'+sess.date+'/');
                return ;
            }
        }
        sess.seats_array=arr;
        console.log(sess.seats_array);
        sess.bus_id=req.params.id;
        for(var i=0;i<arr.length;i++)
        {
            lock_seat(req.params.mobile,req.params.id,date,arr[i],sess.bus_price);
        }
        var final_date=sess.main_date;
        final_date+=' 23:59:59';
        sess.final_date=final_date;
        // final_date+=((24*60*60)*1000);
        console.log(final_date);
        price=sess.bus_price;
        var amount=price*(arr.length);
        sess.amount=amount;
        price+=' x '+arr.length+' = '+amount;
        res.render('confirm_payment.ejs',{seats:arr,date:date,bus:sess.bus_name,price:price,type:sess.type,usermobile:sess.Mobile,unm:sess.Name});
        
    });
});


module.exports=router;