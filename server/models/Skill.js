const mongoose = require("mongoose");
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, category:{type:String,default:""}, level:{type:String,default:""}, description:{type:String,default:""}, visible:{type:Boolean,default:true}, featured:{type:Boolean,default:false}, order:{type:Number,default:0} }, {timestamps:true, collection:"skills"});
module.exports = mongoose.model("Skill", schema);
