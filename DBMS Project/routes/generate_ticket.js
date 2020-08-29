var express=require('express');
var router=express.Router();
var ticket_model=require('../models/tickets');
const path=require('path');
const fs=require('fs');
const PDFDocument = require('pdfkit');
const cloudinary=require('cloudinary');
const dotenv=require('dotenv');
const https=require('https');
const os = require('os');
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

async function tempFile (name, data = '', encoding = 'utf8') {

  return new Promise((resolve, reject) => {
      const tempPath = path.join(os.tmpdir(), 'foobar-');
      fs.mkdtemp(tempPath, (err, folder) => {
          if (err) 
              return reject(err)

          const file_name = path.join(folder, name);

          fs.writeFile(file_name, data, encoding, error_file => {
              if (error_file) 
                  return reject(error_file);

              resolve(file_name)
          })
      })
  });
}

async function upload_pdf(filename,cb)
{
//   return new Promise((resolve,reject)=>{
    cloudinary.v2.uploader.upload(filename, function(err,result) {
      if(err)
      console.log(err);
      else 
      {
      fs.unlinkSync(filename);  
      console.log('deleted_temp_file',filename);
      // console.log(result);
      cb(null,result);
      }
		// return result;
    });
}

async function generateHeader(doc) {
  doc
    .image("./routes/builds/logo.jpg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("BharatYatra Inc.", 110, 57)
    .fontSize(10)
    .text("CEO : Vishu Garg",215,57,{align:"right"})
    .text("Contact Us : help@bharatyatra.com",215,72,{align:"right"})
    .moveDown();

    return;
}

async function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thanks for being with us.",
      50,
      780,
      { align: "center", width: 500 }
    )
    .moveDown();
    return;
}

async function generateCustomerInformation(doc, invoice) {
  const ticket_info = invoice;

  doc
    .text(`Ticket Number: ${invoice.ticket_id}`, 50, 200)
    .text(`Date of Journey: ${invoice.date}`, 50, 215)
    .text(`Origin : ${invoice.origin}`, 50, 230)
    .text(`Destination: ${invoice.dest}`,50,245)
    .text(`Bus: ${invoice.bus_name}`,50,260)
    .text(`Seat No. : ${invoice.seat_no}`,50,280)
    .text(invoice.user_name, 300, 200)
    .text(invoice.mobile, 300, 215)
    .moveDown();

    return ;
}
function insert_in_collection(invoice,url)
{
  var obj={
    ticket_id:invoice.ticket_id,
    seat_no:invoice.seat_no,
    bus_name:invoice.bus_name,
    origin:invoice.origin,
    dest:invoice.dest,
    user_id:invoice.mobile,
    dot:invoice.date,
    ticket_url:url,
  }
  console.log(obj);
  ticket_model.create(obj,(err,response)=>{
    if(err)
    {
      console.log(err);
    }
    else 
    {
      console.log('inserted_in_db');
    }
  });
}
async function func1(invoice)
{
	const doc = new PDFDocument();
	// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
await tempFile(invoice.ticket_id+'.pdf').then(async(filename)=>{
console.log(filename);
doc.pipe(fs.createWriteStream(filename));

await generateHeader(doc);
await generateCustomerInformation(doc,invoice);
await generateFooter(doc);
// Finalize PDF file
doc.end();

await upload_pdf(filename,(err,result)=>{
  // console.log(result);
  result2=result.secure_url;
  result2=result2.substr(0, result2.lastIndexOf(".")) + ".png";
  insert_in_collection(invoice,result2);
});

}).catch((err)=>{
  console.log(err);
});
}



async function create_ticket(invoice){
	
 
	await func1(invoice);

}

exports.create_ticket=create_ticket;