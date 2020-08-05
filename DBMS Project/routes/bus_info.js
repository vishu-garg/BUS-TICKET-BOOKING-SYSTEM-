const express=require('express');
const db=require('../database');
var mongoose=require('mongoose');
var review_model=require('../models/comment');
var router=express.Router();
var review_model=require('../models/comment');

var moment=require('moment');

var get_lat_long=require('../routes/tmp');

function func1(id) {
    return new Promise((resolve,reject)=>{
        let obj={bus_id:id};
        review_model.find(obj,(err,result)=>{
        // console.log(err);
        // console.log('==============');
        if(err)
        {
            // console.log('===================');
            reject(new Error("Whoops!"));
            // return;
        }
        // console.log(result);
        else
        // {console.log('=======');
        {resolve(result);}
        })
    })
}

router.get('/:id/',(req,res)=>{


    var id=req.params.id;
    var sess=req.session;
    var sql='CALL show_bus_info('+id+');';
    // console.log('============================');
    db.query(sql,(err_0,data)=>
    {
        if(err_0)
        {
            // console.log('==================');
            res.send(err_0);
        }
        get_lat_long(data[1][0].origin+',India',data[1][0].dest+',India').then(
        (lat_long)=>{
        console.log(lat_long);
        func1(id).then(
            (result)=>{
                if(data[0].length==0)
                {
                    res.render('bus_info.ejs',{bus_details:data[1],total_images:0,review_details:data[0],usermobile:sess.Mobile,unm:sess.Name,origin_lat_long:lat_long[0],dest_lat_long:lat_long[1]});
                }
                else 
                {
                    var review_details={};
                    var total_images=0;
                    // console.log(data[0][0]);

                    for(var i=0;i<data[0].length;i++)
                    {
                        let ind=data[0][i].user_id;
                        var obj={};
                        obj['Name']=data[0][i].Name;
                        obj['rating']=data[0][i].rating;
                        obj['user_id']=data[0][i].user_id;
                        obj['image_url']=data[0][i].image_url;
                        if(data[0][i].image_url)
                        {
                            total_images++;
                        }
                        // obj['created_at']=moment(data[0][i].created_at).fromNow();
                        review_details[ind]=obj;
                    }
                    for(let j=0;j<result.length;j++)
                    {
                        review_details[result[j].user_id]['comment']=result[j].review;
                        review_details[result[j].user_id]['created_at']=moment(result[j].date).fromNow();
                        console.log(review_details[result[j].user_id]);
                    }
                    review_details_arr=[];

                    for(let k=0;k<data[0].length;k++)
                    {
                        console.log(review_details[data[0][k].user_id])
                        review_details_arr.push(review_details[data[0][k].user_id]);
                    }

                    // res.send(review_details_arr);

                    res.render('bus_info.ejs',{bus_details:data[1],review_details:review_details_arr,usermobile:sess.Mobile,unm:sess.Name,total_images:total_images,origin_lat_long:lat_long[0],dest_lat_long:lat_long[1]});
                }

            }
        ),error => {res.send(error);}
        }),err=>{
            res.send(err);
        }
    });
})

module.exports=router;