var mongoose=require('mongoose');

const Schema = mongoose.Schema;
 
const Tickets_Schema = new Schema({
  ticket_id:Number,
  seat_no:Number,
  bus_name:String,
  origin:String,
  dest:String,
  user_id:String,
  dot:String,
  ticket_url:String,
  date: {type:Date,default:Date.now}
});

module.exports=mongoose.model("tickets",Tickets_Schema);