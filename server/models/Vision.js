const mongoose = require("mongoose");
const schema = new mongoose.Schema({ title:{type:String,default:"Vision"}, content:{type:String,default:""}, description:{type:String,default:""}, visible:{type:Boolean,default:true}, order:{type:Number,default:0} }, {timestamps:true, collection:"vision"});
module.exports = mongoose.model("Vision", schema);
