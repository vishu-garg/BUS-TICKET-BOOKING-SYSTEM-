let nodeGeocoder = require('node-geocoder');


let options = {
    provider: 'openstreetmap'
    };
    
    let geoCoder = nodeGeocoder(options);



function func(station1,station2) {
    var obj=[];
    return new Promise((resolve,reject)=>{
    geoCoder.geocode(station1)
    .then((reslt)=> {
        obj.push(reslt[0]);
        geoCoder.geocode(station2)
        .then((reslt2)=>{
                obj.push(reslt2[0]);console.log(obj);
        console.log('==================');
        resolve(obj);
        })
    })
    .catch((err)=> {
        reject(err);
        console.log(err);
    });
    });

}

module.exports=func;