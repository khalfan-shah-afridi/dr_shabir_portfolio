const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  projectId:{type:String,default:""},
  organization:{type:String,default:""},
  department:{type:String,default:""},
  fundingAmount:{type:String,default:""},
  year:{type:String,default:""},
  status:{type:String,default:""},
  description:{type:String,default:""},
  visible:{type:Boolean,default:true},
  featured:{type:Boolean,default:false},
  order:{type:Number,default:0}
},{timestamps:true,collection:"projectWins"});
module.exports=mongoose.model("ProjectWin",schema);
