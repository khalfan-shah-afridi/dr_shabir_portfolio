const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    fullName: {
      type: String,
      required: true,
      trim: true,
      default: "Dr. Muhammad Shabir Afridi",
    },

    fatherName: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Other",
        "Prefer not to say",
        "",
      ],
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    maritalStatus: {
      type: String,
      enum: [
        "Single",
        "Married",
        "Divorced",
        "Widowed",
        "Prefer not to say",
        "",
      ],
      default: "",
      trim: true,
    },

    nationality: {
      type: String,
      trim: true,
      default: "Pakistani",
    },

    cnic: {
      type: String,
      trim: true,
      default: "",
    },

    passportNumber: {
      type: String,
      trim: true,
      default: "",
    },

    religion: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // CONTACT INFORMATION
    // =====================================================

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    alternatePhone: {
      type: String,
      trim: true,
      default: "",
    },

    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // ADDRESS INFORMATION
    // =====================================================

    currentAddress: {
      type: String,
      trim: true,
      default: "",
    },

    permanentAddress: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "Pakistan",
    },

    // =====================================================
    // PROFESSIONAL INFORMATION
    // =====================================================

    professionalTitle: {
      type: String,
      trim: true,
      default: "Academic & Professional",
    },

    currentJob: {
      type: String,
      trim: true,
      default: "",
    },

    currentDesignation: {
      type: String,
      trim: true,
      default: "",
    },

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // PROFESSIONAL SUMMARY
    // =====================================================

    professionalSummary: {
      type: String,
      trim: true,
      default: "",
    },

    shortBio: {
      type: String,
      trim: true,
      default: "",
    },

    biography: {
      type: String,
      trim: true,
      default: "",
    },

    careerObjective: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // RESEARCH INFORMATION
    // =====================================================

    researchInterests: {
      type: [String],
      default: [],
    },

    researchAreas: {
      type: [String],
      default: [],
    },

    // =====================================================
    // PROFESSIONAL SKILLS
    // =====================================================

    skills: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    // =====================================================
    // PROFESSIONAL / ACADEMIC LINKS
    // =====================================================

    website: {
      type: String,
      trim: true,
      default: "",
    },

    personalWebsite: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    googleScholar: {
      type: String,
      trim: true,
      default: "",
    },

    researchGate: {
      type: String,
      trim: true,
      default: "",
    },

    orcid: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // CV / RESUME
    // =====================================================

    cv: {
      type: String,
      trim: true,
      default: "",
    },

    cvUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // PROFILE DISPLAY SETTINGS
    // =====================================================

    showPersonalInformation: {
      type: Boolean,
      default: true,
    },

    showContactInformation: {
      type: Boolean,
      default: true,
    },

    showAddress: {
      type: Boolean,
      default: true,
    },

    showProfessionalInformation: {
      type: Boolean,
      default: true,
    },

    showResearchInformation: {
      type: Boolean,
      default: true,
    },

    showSkills: {
      type: Boolean,
      default: true,
    },

    showProfessionalLinks: {
      type: Boolean,
      default: true,
    },

    showProfileImage: {
      type: Boolean,
      default: true,
    },

    showCV: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // PROFILE PUBLISH STATUS
    // =====================================================

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Profile",
  profileSchema
);