const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  type:{type:String,default:""},
  role:{type:String,default:""},
  student:{type:String,default:""},
  institution:{type:String,default:""},
  year:{type:String,default:""},
  description:{type:String,default:""},
  visible:{type:Boolean,default:true},
  featured:{type:Boolean,default:false},
  order:{type:Number,default:0}
},{timestamps:true,collection:"supervision"});
module.exports=mongoose.model("Supervision",schema);
