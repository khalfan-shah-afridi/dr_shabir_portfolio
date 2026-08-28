const Profile = require("../models/Profile");
const fs = require("fs");
const path = require("path");

// ==========================================
// GET PROFILE
// ADMIN
// ==========================================

const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        fullName: "Dr. Muhammad Shabir Afridi",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// ==========================================
// GET PUBLIC PROFILE
// PUBLIC
// ==========================================

const getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      isPublished: true,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found",
      });
    }

    const publicProfile = profile.toObject();
    if (!profile.showPersonalInformation) {
      ["fatherName","gender","dateOfBirth","maritalStatus","nationality","cnic","passportNumber","religion"].forEach((k) => delete publicProfile[k]);
    }
    if (!profile.showContactInformation) ["email","phone","alternatePhone","whatsapp"].forEach((k) => delete publicProfile[k]);
    if (!profile.showAddress) ["currentAddress","permanentAddress","city","country"].forEach((k) => delete publicProfile[k]);
    if (!profile.showProfessionalInformation) ["currentJob","currentDesignation","organization","department"].forEach((k) => delete publicProfile[k]);
    if (!profile.showResearchInformation) ["researchInterests","researchAreas"].forEach((k) => delete publicProfile[k]);
    if (!profile.showSkills) ["skills","languages"].forEach((k) => delete publicProfile[k]);
    if (!profile.showProfessionalLinks) ["website","personalWebsite","linkedin","googleScholar","researchGate","orcid","github"].forEach((k) => delete publicProfile[k]);
    if (!profile.showProfileImage) delete publicProfile.profileImage;
    if (!profile.showCV) { delete publicProfile.cv; delete publicProfile.cvUrl; }
    res.status(200).json({ success: true, profile: publicProfile });
  } catch (error) {
    console.error("GET PUBLIC PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get public profile",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE PROFILE
// ADMIN
// ==========================================

const createProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message:
          "Profile already exists. Use update profile instead.",
      });
    }

    const profileData = {
      ...req.body,
    };

    if (req.file) {
      profileData.profileImage =
        `/uploads/profile/${req.file.filename}`;
    }

    const profile = await Profile.create(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ADMIN
// ==========================================

const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile();
    }

    const oldImage = profile.profileImage;

    const arrayFields = [
      "researchInterests",
      "researchAreas",
      "skills",
      "languages",
    ];

    const booleanFields = [
      "showPersonalInformation",
      "showContactInformation",
      "showAddress",
      "showProfessionalInformation",
      "showResearchInformation",
      "showSkills",
      "showProfessionalLinks",
      "showProfileImage",
      "showCV",
      "isPublished",
    ];

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) return;

      let value = req.body[key];

      // FormData sends booleans as strings; convert them back to real booleans.
      if (booleanFields.includes(key)) {
        value = value === true || value === "true";
      }

      // FormData sends these arrays as JSON strings.
      if (arrayFields.includes(key) && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.split(",").map((item) => item.trim()).filter(Boolean);
        }
      }

      profile[key] = value;
    });

    if (req.file) {
      profile.profileImage =
        `/uploads/profile/${req.file.filename}`;

      // ==========================================
      // DELETE OLD PROFILE IMAGE
      // ==========================================

      if (oldImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          oldImage.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (deleteError) {
            console.error(
              "OLD PROFILE IMAGE DELETE ERROR:",
              deleteError.message
            );
          }
        }
      }
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PROFILE IMAGE
// ADMIN
// ==========================================

const deleteProfileImage = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (!profile.profileImage) {
      return res.status(400).json({
        success: false,
        message: "No profile image exists",
      });
    }

    const imagePath = path.join(
      __dirname,
      "..",
      profile.profileImage.replace(/^\/+/, "")
    );

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (deleteError) {
        console.error(
          "PROFILE IMAGE DELETE ERROR:",
          deleteError.message
        );
      }
    }

    profile.profileImage = "";

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "DELETE PROFILE IMAGE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete profile image",
      error: error.message,
    });
  }
};

// ==========================================
// TOGGLE PROFILE VISIBILITY
// ADMIN
// ==========================================

const toggleProfileVisibility = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.isPublished = !profile.isPublished;

    await profile.save();

    res.status(200).json({
      success: true,
      message: profile.isPublished
        ? "Profile published successfully"
        : "Profile unpublished successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "TOGGLE PROFILE VISIBILITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to change profile visibility",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getProfile,
  getPublicProfile,
  createProfile,
  updateProfile,
  deleteProfileImage,
  toggleProfileVisibility,
};