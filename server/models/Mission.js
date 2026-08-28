const mongoose = require("mongoose");
const schema = new mongoose.Schema({ title:{type:String,default:"Mission"}, content:{type:String,default:""}, description:{type:String,default:""}, visible:{type:Boolean,default:true}, order:{type:Number,default:0} }, {timestamps:true, collection:"mission"});
module.exports = mongoose.model("Mission", schema);
