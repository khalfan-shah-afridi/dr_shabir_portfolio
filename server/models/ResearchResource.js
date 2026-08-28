const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  description:{type:String,default:""},
  type:{type:String,default:""},
  url:{type:String,default:""},
  year:{type:String,default:""},
  visible:{type:Boolean,default:true},
  featured:{type:Boolean,default:false},
  order:{type:Number,default:0}
},{timestamps:true,collection:"researchResources"});
module.exports=mongoose.model("ResearchResource",schema);
