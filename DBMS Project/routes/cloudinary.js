const fs=require('fs');
const cloudinary=require('cloudinary');
const dotenv=require('dotenv');
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

function func1(req,result){

    // console.log(req.file.path);
    return new Promise((resolve,reject)=>{
        fs.unlink(req.file.path,(err)=>{
            if(err)
            reject();
            else 
            {console.log('Server File is Deleted!');resolve(result.secure_url);}
        });
    })
}

function upload_image(req,cb)
{
//   return new Promise((resolve,reject)=>{
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err){
        cb('UNEXPECTED ERROR!',null);
        return;
      } 
      else{
        // console.log('=============');
        // console.log(result);
         func1(req,result).then((result)=>{
             cb(null,result);
             return;
         }).catch(()=>{
            cb('UNEXPECTED ERROR!',null);
            return;
         })
        }
    });
}

module.exports=upload_image;
