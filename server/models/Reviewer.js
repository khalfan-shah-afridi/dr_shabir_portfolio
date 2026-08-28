const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  journal:{type:String,required:true,trim:true},
  role:{type:String,default:"Reviewer"},
  publisher:{type:String,default:""},
  year:{type:String,default:""},
  description:{type:String,default:""},
  visible:{type:Boolean,default:true},
  featured:{type:Boolean,default:false},
  order:{type:Number,default:0}
},{timestamps:true,collection:"reviewers"});
module.exports=mongoose.model("Reviewer",schema);
