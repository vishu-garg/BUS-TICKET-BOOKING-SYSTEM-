var mongoose=require('mongoose');

const Schema = mongoose.Schema;
 
const ReviewsSchema = new Schema({
  review: String,
  user_id: String,
  bus_id: Number,
  stars:Number,
  date: {type:Date,default:Date.now}
});

module.exports=mongoose.model("Reviews",ReviewsSchema);