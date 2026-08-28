const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  fullName:{type:String,default:"Dr. Muhammad Shabir Afridi",trim:true}, designation:{type:String,default:"Professor"}, department:{type:String,default:"Computer Science"}, institution:{type:String,default:"University Name"},
  email:{type:String,default:"",trim:true,lowercase:true}, phone:{type:String,default:""}, location:{type:String,default:"Pakistan"}, address:{type:String,default:""}, profileImage:{type:String,default:""},
  linkedin:{type:String,default:""}, googleScholar:{type:String,default:""}, researchGate:{type:String,default:""}, orcid:{type:String,default:""}, visible:{type:Boolean,default:true},
  privacy:{ type: new mongoose.Schema({ email:{type:Boolean,default:false}, phone:{type:Boolean,default:false}, location:{type:Boolean,default:true}, address:{type:Boolean,default:false}, profileImage:{type:Boolean,default:true}, linkedin:{type:Boolean,default:true}, googleScholar:{type:Boolean,default:true}, researchGate:{type:Boolean,default:true}, orcid:{type:Boolean,default:true} }, {_id:false}), default:() => ({}) }
}, {timestamps:true, collection:"personalInformation"});
module.exports = mongoose.model("PersonalInformation", schema);
