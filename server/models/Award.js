const mongoose = require("mongoose");
const schema = new mongoose.Schema({ title:{type:String,required:true,trim:true}, organization:{type:String,default:""}, year:{type:Number,default:null}, description:{type:String,default:""}, pdf:{type:String,default:""}, pdfOriginalName:{type:String,default:""}, visible:{type:Boolean,default:true}, featured:{type:Boolean,default:false}, order:{type:Number,default:0} }, {timestamps:true, collection:"awards"});
module.exports = mongoose.model("Award", schema);
