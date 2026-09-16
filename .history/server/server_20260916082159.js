const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ==========================================
// CORS - ALLOW ALL LOCAL VITE PORTS
// ==========================================

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost with any port
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      // Allow 127.0.0.1 with any port
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin not allowed")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const submitPaperRoutes = require(
  "./routes/submitPaperRoutes"
);

const researchPaperSubmissionRoutes = require(
  "./routes/researchPaperSubmissionRoutes"
);

const researchPublicationRoutes = require(
  "./routes/researchPublicationRoutes"
);

const conferenceRoutes = require(
  "./routes/conferenceRoutes"
);

const referenceRoutes = require(
  "./routes/referenceRoutes"
);

const profileRoutes = require(
  "./routes/profileRoutes"
);
const personalRoutes = require("./routes/personalRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const awardRoutes = require("./routes/awardRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const missionRoutes = require("./routes/missionRoutes");
const visionRoutes = require("./routes/visionRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const documentRoutes = require("./routes/documentRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const cvRoutes = require("./routes/cvRoutes");
const researchResourceRoutes = require("./routes/researchResourceRoutes");
const projectWinRoutes = require("./routes/projectWinRoutes");
const supervisionRoutes = require("./routes/supervisionRoutes");
const reviewerRoutes = require("./routes/reviewerRoutes");
const Document = require("./models/Document");
const Experience = require("./models/Experience");
const { getOrCreateSettings } = require("./controllers/settingsController");

const Education = require("./models/Education");
const Skill = require("./models/Skill");
const Project = require("./models/Project");
const Award = require("./models/Award");
const Certificate = require("./models/Certificate");
const ResearchPublication = require("./models/ResearchPublication");
const Conference = require("./models/Conference");
const Reference = require("./models/Reference");
const ResearchResource = require("./models/ResearchResource");
const ProjectWin = require("./models/ProjectWin");
const Supervision = require("./models/Supervision");
const Reviewer = require("./models/Reviewer");
const ContactMessage = require("./models/ContactMessage");

// ==========================================
// AUTH
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// Public contact form
app.use("/api/contact", contactRoutes);

// ==========================================
// RESEARCH PUBLICATIONS
// ==========================================

app.use(
  "/api/research-publications",
  researchPublicationRoutes
);

// ==========================================
// SUBMIT PAPERS
// ==========================================

app.use(
  "/api/submit-papers",
  submitPaperRoutes
);

// ==========================================
// RESEARCH PAPER SUBMISSIONS
// ==========================================

app.use(
  "/api/research-paper-submissions",
  researchPaperSubmissionRoutes
);

// ==========================================
// CONFERENCES
// ==========================================

app.use(
  "/api/conferences",
  conferenceRoutes
);

// ==========================================
// REFERENCES
// ==========================================

app.use(
  "/api/references",
  referenceRoutes
);

// ==========================================
// PROFILE
// ==========================================

app.use(
  "/api/profile",
  profileRoutes
);
app.use("/api/personal-information", personalRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/mission", missionRoutes);
app.use("/api/vision", visionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/research-resources", researchResourceRoutes);
app.use("/api/project-wins", projectWinRoutes);
app.use("/api/supervision", supervisionRoutes);
app.use("/api/reviewer", reviewerRoutes);

app.get("/api/dashboard/stats", async (req,res)=>{
  try {
    const [projects,publications,certificates,education,skills,awards,conferences,references,mission,vision,documents,experience,researchResources,projectWins,supervision,reviewer,messages,unreadMessages] = await Promise.all([
      Project.countDocuments(), ResearchPublication.countDocuments(), Certificate.countDocuments(), Education.countDocuments(), Skill.countDocuments(), Award.countDocuments(), Conference.countDocuments(), Reference.countDocuments(),
      require("./models/Mission").countDocuments(), require("./models/Vision").countDocuments(), Document.countDocuments(), Experience.countDocuments(), ResearchResource.countDocuments(), ProjectWin.countDocuments(), Supervision.countDocuments(), Reviewer.countDocuments(),
      ContactMessage.countDocuments(), ContactMessage.countDocuments({status:"New"})
    ]);
    res.json({success:true,data:{projects,publications,certificates,education,skills,awards,conferences,references,mission,vision,documents,experience,researchResources,projectWins,supervision,reviewer,messages,unreadMessages}});
  } catch(error) { res.status(500).json({success:false,message:error.message}); }
});

app.get("/api/portfolio", async (req,res)=>{
  try {
    const settings = await getOrCreateSettings();
    const m = settings.modules || {};

    const [personal,profile,education,skills,projects,awards,certificates,mission,vision,publications,conferences,references,experience,researchResources,projectWins,supervision,reviewer] = await Promise.all([
      m.personalInformation === false ? null : require("./models/PersonalInformation").findOne({visible:true}).lean(),
      m.profile === false ? null : require("./models/Profile").findOne({isPublished:true}).lean(),
      m.education === false ? [] : Education.find({visible:true}).sort({order:1,startYear:-1}).lean(),
      m.skills === false ? [] : Skill.find({visible:true}).sort({order:1}).lean(),
      m.projects === false ? [] : Project.find({visible:true}).sort({order:1}).lean(),
      m.awards === false ? [] : Award.find({visible:true}).sort({order:1,year:-1}).lean(),
      m.certificates === false ? [] : Certificate.find({visible:true}).sort({order:1}).lean(),
      m.mission === false ? [] : require("./models/Mission").find({visible:true}).sort({order:1}).lean(),
      m.vision === false ? [] : require("./models/Vision").find({visible:true}).sort({order:1}).lean(),
      m.publications === false ? [] : ResearchPublication.find({isVisible:true}).sort({publicationDate:-1}).lean(),
      m.conferences === false ? [] : Conference.find({isVisible:true}).sort({startDate:-1}).lean(),
      m.references === false ? [] : Reference.find({isVisible:true}).sort({createdAt:-1}).lean(),
      m.experience === false ? [] : Experience.find({visible:true}).sort({order:1,startDate:-1}).lean(),
      m.researchResources === false ? [] : ResearchResource.find({visible:true}).sort({order:1,year:-1}).lean(),
      m.projectWins === false ? [] : ProjectWin.find({visible:true}).sort({order:1,year:-1}).lean(),
      m.supervision === false ? [] : Supervision.find({visible:true}).sort({order:1,year:-1}).lean(),
      m.reviewer === false ? [] : Reviewer.find({visible:true}).sort({order:1,year:-1}).lean()
    ]);
    if(personal){ const p=personal.privacy||{}; ["email","phone","location","address","profileImage","linkedin","googleScholar","researchGate","orcid"].forEach(k=>{if(p[k]===false) personal[k]="";}); delete personal.privacy; }
    res.json({success:true,data:{personal,profile,education,skills,projects,awards,certificates,mission,vision,publications,conferences,references,experience,researchResources,projectWins,supervision,reviewer,researchInterests:[...(profile?.researchInterests||[]),...(profile?.researchAreas||[])].filter(Boolean),moduleVisibility:m}});
  } catch(error) { res.status(500).json({success:false,message:error.message}); }
});

// Public detail records. Read-only and visibility-aware.
app.get("/api/public/:module/:id", async (req,res)=>{
  try{
    const maps={
      projects:{Model:Project,field:"visible"},
      education:{Model:Education,field:"visible"},
      awards:{Model:Award,field:"visible"},
      certificates:{Model:Certificate,field:"visible"},
      experience:{Model:Experience,field:"visible"},
      "research-resources":{Model:ResearchResource,field:"visible"},
      "project-wins":{Model:ProjectWin,field:"visible"},
      supervision:{Model:Supervision,field:"visible"},
      reviewer:{Model:Reviewer,field:"visible"},
      publications:{Model:ResearchPublication,field:"isVisible"},
      conferences:{Model:Conference,field:"isVisible"},
      references:{Model:Reference,field:"isVisible"}
    };
    const cfg=maps[req.params.module];
    if(!cfg) return res.status(404).json({success:false,message:"Public module not found"});
    const data=await cfg.Model.findOne({_id:req.params.id,[cfg.field]:true}).lean();
    if(!data) return res.status(404).json({success:false,message:"Public record not found"});
    res.json({success:true,data});
  }catch(error){res.status(500).json({success:false,message:error.message});}
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Dr. Muhammad Shabir Afridi Portfolio API is running",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is working",
  });
});

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});

// ==========================================
// MONGODB
// ==========================================

const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI or MONGODB_URI is missing in .env"
  );

  process.exit(1);
}

// ==========================================
// CONNECT DATABASE
// ==========================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      });
    }
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });

module.exports = app;