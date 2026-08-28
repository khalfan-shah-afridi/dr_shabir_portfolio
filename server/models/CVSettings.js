const mongoose = require("mongoose");

// Every CV section the generator knows how to render. Admin can toggle
// each one on/off and reorder them; "key" values below map directly to
// the section builders inside utils/generateCV.js.
//
// Order mirrors Dr. Shabir's reference CV layout: Personal Information,
// Education, then Experience broken out by category (Teaching,
// Administration, Focal Person, Project Director), Certifications by
// category, Conferences, Research Resources, Project Wins, Research
// Papers, Supervision, Research Interest, Skills, Projects, Honor and
// Awards, Reviewer, References.
const DEFAULT_SECTIONS = [
  { key:"personalInformation", label:"Personal Information", enabled:true, order:1 },
  { key:"professionalSummary", label:"Professional Summary", enabled:true, order:2 },
  { key:"education", label:"Education", enabled:true, order:3 },
  { key:"teachingExperience", label:"Teaching Experience", enabled:true, order:4 },
  { key:"administrationExperience", label:"Administration Experience", enabled:true, order:5 },
  { key:"focalPerson", label:"Focal Person", enabled:true, order:6 },
  { key:"projectDirector", label:"Project Director", enabled:true, order:7 },
  { key:"generalExperience", label:"Additional Experience", enabled:true, order:8 },
  { key:"internationalCertifications", label:"International Certifications", enabled:true, order:9 },
  { key:"facultyTraining", label:"Higher Education Faculty Training", enabled:true, order:10 },
  { key:"nationalCertifications", label:"National Certifications", enabled:true, order:11 },
  { key:"otherCertifications", label:"Other Certifications", enabled:true, order:12 },
  { key:"conferences", label:"Conferences", enabled:true, order:13 },
  { key:"researchResources", label:"Research Resources Generation", enabled:true, order:14 },
  { key:"projectWins", label:"Project Win", enabled:true, order:15 },
  { key:"publications", label:"Research Papers", enabled:true, order:16 },
  { key:"supervision", label:"Supervision", enabled:true, order:17 },
  { key:"researchInterests", label:"Research Interest", enabled:true, order:18 },
  { key:"skills", label:"Skills", enabled:true, order:19 },
  { key:"projects", label:"Projects", enabled:true, order:20 },
  { key:"awards", label:"Honor and Awards", enabled:true, order:21 },
  { key:"reviewer", label:"Reviewer", enabled:true, order:22 },
  { key:"references", label:"References", enabled:true, order:23 },
];

const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    cvTitle: { type: String, default: "Curriculum Vitae" },
    professionalSummary: { type: String, default: "" },
    showProfileImage: { type: Boolean, default: true },
    showContactInformation: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: false },
    showSocialLinks: { type: Boolean, default: true },
    sections: { type: [sectionSchema], default: DEFAULT_SECTIONS },
  },
  { timestamps: true, collection: "cvSettings" }
);

schema.statics.DEFAULT_SECTIONS = DEFAULT_SECTIONS;

module.exports = mongoose.model("CVSettings", schema);
