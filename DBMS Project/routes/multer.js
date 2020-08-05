const multer=require('multer');

const storage=multer.diskStorage({
    // destination:function(req,file,cb){
    //     // console.log('============');
    //     cb(null,'images_uploads')
    // },

    filename:function(req,file,cb){
        // console.log("=====");
        // console.log(file);
        cb(null,new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname)
    }
})

const fileFilter= (req,file,cb)=>{
    if (file.mimetype!='image/jpeg' && file.mimetype!='image/jpg' &&  file.mimetype!='image/png'){
        // console.log('=====');
        return cb(new Error('Unsupported Format'), false);
    }
    
    cb(null, true);
}

const upload=multer({
    storage:storage,
    fileFilter:fileFilter
})

module.exports=upload;