import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Profile.css";

const DEFAULT_PROFILE = {
  fullName: "Dr. Muhammad Shabir Afridi",
  fatherName: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  nationality: "Pakistani",
  cnic: "",
  passportNumber: "",
  religion: "",

  profileImage: "",

  email: "",
  phone: "",
  alternatePhone: "",
  whatsapp: "",

  currentAddress: "",
  permanentAddress: "",
  city: "",
  country: "Pakistan",

  professionalTitle: "Academic & Professional",
  currentJob: "",
  currentDesignation: "",
  organization: "",
  department: "",

  professionalSummary: "",
  shortBio: "",
  biography: "",
  careerObjective: "",

  researchInterests: "",
  researchAreas: "",

  skills: "",
  languages: "",

  website: "",
  personalWebsite: "",
  linkedin: "",
  googleScholar: "",
  researchGate: "",
  orcid: "",
  github: "",

  cv: "",
  cvUrl: "",

  showPersonalInformation: true,
  showContactInformation: true,
  showAddress: true,
  showProfessionalInformation: true,
  showResearchInformation: true,
  showSkills: true,
  showProfessionalLinks: true,
  showProfileImage: true,
  showCV: true,

  isPublished: true,
};

const Profile = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");

      if (response.data?.success && response.data?.profile) {
        const data = response.data.profile;

        setProfile({
          ...DEFAULT_PROFILE,

          fullName: data.fullName || DEFAULT_PROFILE.fullName,
          fatherName: data.fatherName || "",
          gender: data.gender || "",

          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",

          maritalStatus: data.maritalStatus || "",
          nationality: data.nationality || "",
          cnic: data.cnic || "",
          passportNumber: data.passportNumber || "",
          religion: data.religion || "",

          profileImage: data.profileImage || "",

          email: data.email || "",
          phone: data.phone || "",
          alternatePhone: data.alternatePhone || "",
          whatsapp: data.whatsapp || "",

          currentAddress: data.currentAddress || "",
          permanentAddress: data.permanentAddress || "",
          city: data.city || "",
          country: data.country || "",

          professionalTitle: data.professionalTitle || "",
          currentJob: data.currentJob || "",
          currentDesignation: data.currentDesignation || "",
          organization: data.organization || "",
          department: data.department || "",

          professionalSummary: data.professionalSummary || "",
          shortBio: data.shortBio || "",
          biography: data.biography || "",
          careerObjective: data.careerObjective || "",

          researchInterests: Array.isArray(data.researchInterests)
            ? data.researchInterests.join(", ")
            : data.researchInterests || "",

          researchAreas: Array.isArray(data.researchAreas)
            ? data.researchAreas.join(", ")
            : data.researchAreas || "",

          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : data.skills || "",

          languages: Array.isArray(data.languages)
            ? data.languages.join(", ")
            : data.languages || "",

          website: data.website || "",
          personalWebsite: data.personalWebsite || "",
          linkedin: data.linkedin || "",
          googleScholar: data.googleScholar || "",
          researchGate: data.researchGate || "",
          orcid: data.orcid || "",
          github: data.github || "",

          cv: data.cv || "",
          cvUrl: data.cvUrl || "",

          showPersonalInformation:
            data.showPersonalInformation !== undefined
              ? data.showPersonalInformation
              : true,

          showContactInformation:
            data.showContactInformation !== undefined
              ? data.showContactInformation
              : true,

          showAddress:
            data.showAddress !== undefined
              ? data.showAddress
              : true,

          showProfessionalInformation:
            data.showProfessionalInformation !== undefined
              ? data.showProfessionalInformation
              : true,

          showResearchInformation:
            data.showResearchInformation !== undefined
              ? data.showResearchInformation
              : true,

          showSkills:
            data.showSkills !== undefined
              ? data.showSkills
              : true,

          showProfessionalLinks:
            data.showProfessionalLinks !== undefined
              ? data.showProfessionalLinks
              : true,

          showProfileImage:
            data.showProfileImage !== undefined
              ? data.showProfileImage
              : true,

          showCV:
            data.showCV !== undefined
              ? data.showCV
              : true,

          isPublished:
            data.isPublished !== undefined
              ? data.isPublished
              : true,
        });

        if (data.profileImage) {
          const apiBase = (
            import.meta.env.VITE_API_URL ||
            "http://localhost:5000/api"
          ).replace(/\/api$/, "");
          setImagePreview(
            data.profileImage.startsWith("http")
              ? data.profileImage
              : `${apiBase}${data.profileImage.startsWith("/") ? "" : "/"}${data.profileImage}`
          );
        } else {
          setImagePreview("");
        }
      }
    } catch (err) {
      console.error("LOAD PROFILE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
    setError("");
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImagePreview(imageUrl);
    setImageFile(file);

    setProfile((previous) => ({
      ...previous,
      profileImage: file.name,
    }));

    setSaved(false);
    setError("");
  };

  // =====================================================
  // CONVERT COMMA TEXT TO ARRAY
  // =====================================================

  const convertToArray = (value) => {
    if (!value || !value.trim()) {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const formData = new FormData();

      // =================================================
      // PERSONAL INFORMATION
      // =================================================

      formData.append("fullName", profile.fullName);
      formData.append("fatherName", profile.fatherName);
      formData.append("gender", profile.gender);

      if (profile.dateOfBirth) {
        formData.append(
          "dateOfBirth",
          profile.dateOfBirth
        );
      }

      formData.append(
        "maritalStatus",
        profile.maritalStatus
      );

      formData.append(
        "nationality",
        profile.nationality
      );

      formData.append("cnic", profile.cnic);

      formData.append(
        "passportNumber",
        profile.passportNumber
      );

      formData.append(
        "religion",
        profile.religion
      );

      // =================================================
      // CONTACT
      // =================================================

      formData.append("email", profile.email);
      formData.append("phone", profile.phone);

      formData.append(
        "alternatePhone",
        profile.alternatePhone
      );

      formData.append(
        "whatsapp",
        profile.whatsapp
      );

      // =================================================
      // ADDRESS
      // =================================================

      formData.append(
        "currentAddress",
        profile.currentAddress
      );

      formData.append(
        "permanentAddress",
        profile.permanentAddress
      );

      formData.append("city", profile.city);
      formData.append("country", profile.country);

      // =================================================
      // PROFESSIONAL
      // =================================================

      formData.append(
        "professionalTitle",
        profile.professionalTitle
      );

      formData.append(
        "currentJob",
        profile.currentJob
      );

      formData.append(
        "currentDesignation",
        profile.currentDesignation
      );

      formData.append(
        "organization",
        profile.organization
      );

      formData.append(
        "department",
        profile.department
      );

      // =================================================
      // SUMMARY / BIO
      // =================================================

      formData.append(
        "professionalSummary",
        profile.professionalSummary
      );

      formData.append(
        "shortBio",
        profile.shortBio
      );

      formData.append(
        "biography",
        profile.biography
      );

      formData.append(
        "careerObjective",
        profile.careerObjective
      );

      // =================================================
      // RESEARCH
      // =================================================

      formData.append(
        "researchInterests",
        JSON.stringify(
          convertToArray(profile.researchInterests)
        )
      );

      formData.append(
        "researchAreas",
        JSON.stringify(
          convertToArray(profile.researchAreas)
        )
      );

      // =================================================
      // SKILLS
      // =================================================

      formData.append(
        "skills",
        JSON.stringify(
          convertToArray(profile.skills)
        )
      );

      formData.append(
        "languages",
        JSON.stringify(
          convertToArray(profile.languages)
        )
      );

      // =================================================
      // LINKS
      // =================================================

      formData.append(
        "website",
        profile.website
      );

      formData.append(
        "personalWebsite",
        profile.personalWebsite
      );

      formData.append(
        "linkedin",
        profile.linkedin
      );

      formData.append(
        "googleScholar",
        profile.googleScholar
      );

      formData.append(
        "researchGate",
        profile.researchGate
      );

      formData.append(
        "orcid",
        profile.orcid
      );

      formData.append(
        "github",
        profile.github
      );

      // =================================================
      // CV
      // =================================================

      formData.append("cv", profile.cv);

      formData.append(
        "cvUrl",
        profile.cvUrl
      );

      // =================================================
      // DISPLAY SETTINGS
      // =================================================

      formData.append(
        "showPersonalInformation",
        profile.showPersonalInformation
      );

      formData.append(
        "showContactInformation",
        profile.showContactInformation
      );

      formData.append(
        "showAddress",
        profile.showAddress
      );

      formData.append(
        "showProfessionalInformation",
        profile.showProfessionalInformation
      );

      formData.append(
        "showResearchInformation",
        profile.showResearchInformation
      );

      formData.append(
        "showSkills",
        profile.showSkills
      );

      formData.append(
        "showProfessionalLinks",
        profile.showProfessionalLinks
      );

      formData.append(
        "showProfileImage",
        profile.showProfileImage
      );

      formData.append(
        "showCV",
        profile.showCV
      );

      formData.append(
        "isPublished",
        profile.isPublished
      );

      // =================================================
      // PROFILE IMAGE
      // =================================================

      if (imageFile) {
        formData.append(
          "profileImage",
          imageFile
        );
      }

      // =================================================
      // API
      // =================================================

      const response = await api.put(
        "/profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        setSaved(true);
        setImageFile(null);

        const savedProfile =
          response.data.profile;

        if (savedProfile) {
          setProfile((previous) => ({
            ...previous,

            profileImage:
              savedProfile.profileImage ||
              previous.profileImage,
          }));

          if (savedProfile.profileImage) {
            const apiBase = (
              import.meta.env.VITE_API_URL ||
              "http://localhost:5000/api"
            ).replace(/\/api$/, "");
            setImagePreview(
              savedProfile.profileImage.startsWith("http")
                ? savedProfile.profileImage
                : `${apiBase}${savedProfile.profileImage.startsWith("/") ? "" : "/"}${savedProfile.profileImage}`
            );
          }
        }

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      }
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    if (
      !window.confirm(
        "Are you sure you want to reset the form?"
      )
    ) {
      return;
    }

    loadProfile();
    setImageFile(null);
    setSaved(false);
    setError("");
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDeleteImage = async () => {
    try {
      setError("");

      const response =
        await api.delete(
          "/profile/image"
        );

      if (response.data?.success) {
        setProfile((previous) => ({
          ...previous,
          profileImage: "",
        }));

        setImagePreview("");
        setImageFile(null);
      }
    } catch (err) {
      console.error(
        "DELETE PROFILE IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete profile image"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="admin-profile-card">
          <h3>Loading Profile...</h3>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="profile-page-header">

        <div>
          <span className="profile-eyebrow">
            PROFILE MANAGEMENT
          </span>

          <h2>
            Professional Profile
          </h2>

          <p>
            Manage complete personal,
            professional and academic
            information.
          </p>
        </div>

        <div className="profile-header-status">
          <span className="status-dot" />
          Profile Editor
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="profile-save-message">
          {error}
        </div>
      )}

      <form
        className="profile-form"
        onSubmit={handleSave}
      >

        {/* =================================================
            01 PROFILE IMAGE
        ================================================= */}

        <section className="admin-profile-card profile-image-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                01
              </span>

              <div>
                <h3>
                  Profile Image
                </h3>

                <p>
                  Professional profile photograph.
                </p>
              </div>
            </div>

          </div>

          <div className="profile-image-content">

            <div className="profile-image-preview">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                />
              ) : (
                <div className="profile-image-placeholder">
                  DS
                </div>
              )}

            </div>

            <div className="image-upload-area">

              <h4>
                Professional Photo
              </h4>

              <p>
                JPG, PNG or WEBP recommended.
              </p>

              <label className="upload-button">

                Choose Image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />

              </label>

              {profile.profileImage && (
                <span className="selected-file">
                  {profile.profileImage}
                </span>
              )}

              {profile.profileImage && (
                <button
                  type="button"
                  className="reset-profile-button"
                  onClick={handleDeleteImage}
                >
                  Delete Image
                </button>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            02 PERSONAL INFORMATION
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                02
              </span>

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Complete personal information.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Father Name</label>

              <input
                type="text"
                name="fatherName"
                value={profile.fatherName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Marital Status</label>

              <select
                name="maritalStatus"
                value={profile.maritalStatus}
                onChange={handleChange}
              >
                <option value="">
                  Select Marital Status
                </option>

                <option value="Single">
                  Single
                </option>

                <option value="Married">
                  Married
                </option>

                <option value="Divorced">
                  Divorced
                </option>

                <option value="Widowed">
                  Widowed
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Nationality</label>

              <input
                type="text"
                name="nationality"
                value={profile.nationality}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>CNIC Number</label>

              <input
                type="text"
                name="cnic"
                value={profile.cnic}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>

            <div className="form-group">
              <label>Passport Number</label>

              <input
                type="text"
                name="passportNumber"
                value={profile.passportNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Religion</label>

              <input
                type="text"
                name="religion"
                value={profile.religion}
                onChange={handleChange}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            03 CONTACT INFORMATION
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                03
              </span>

              <div>
                <h3>
                  Contact Information
                </h3>

                <p>
                  Complete contact details.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Alternate Phone</label>

              <input
                type="tel"
                name="alternatePhone"
                value={profile.alternatePhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>

              <input
                type="tel"
                name="whatsapp"
                value={profile.whatsapp}
                onChange={handleChange}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            04 ADDRESS
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                04
              </span>

              <div>
                <h3>
                  Address Information
                </h3>

                <p>
                  Current and permanent address.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Current Address</label>

              <textarea
                name="currentAddress"
                value={profile.currentAddress}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Permanent Address</label>

              <textarea
                name="permanentAddress"
                value={profile.permanentAddress}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            05 PROFESSIONAL INFORMATION
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                05
              </span>

              <div>
                <h3>
                  Professional Information
                </h3>

                <p>
                  Academic and employment information.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>
                Professional Title
              </label>

              <input
                type="text"
                name="professionalTitle"
                value={profile.professionalTitle}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Job</label>

              <input
                type="text"
                name="currentJob"
                value={profile.currentJob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Designation</label>

              <input
                type="text"
                name="currentDesignation"
                value={profile.currentDesignation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Organization</label>

              <input
                type="text"
                name="organization"
                value={profile.organization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>

              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleChange}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            06 PROFESSIONAL SUMMARY
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                06
              </span>

              <div>
                <h3>
                  Professional Summary
                </h3>

                <p>
                  Biography and career information.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>
                Professional Summary
              </label>

              <textarea
                name="professionalSummary"
                value={profile.professionalSummary}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-group full-width">
              <label>
                Short Bio
              </label>

              <textarea
                name="shortBio"
                value={profile.shortBio}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group full-width">
              <label>
                Full Biography
              </label>

              <textarea
                name="biography"
                value={profile.biography}
                onChange={handleChange}
                rows="8"
              />
            </div>

            <div className="form-group full-width">
              <label>
                Career Objective
              </label>

              <textarea
                name="careerObjective"
                value={profile.careerObjective}
                onChange={handleChange}
                rows="5"
              />
            </div>

          </div>

        </section>

        {/* =================================================
            07 RESEARCH INFORMATION
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                07
              </span>

              <div>
                <h3>
                  Research Information
                </h3>

                <p>
                  Research interests and areas.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>
                Research Interests
              </label>

              <textarea
                name="researchInterests"
                value={profile.researchInterests}
                onChange={handleChange}
                rows="4"
                placeholder="Artificial Intelligence, Machine Learning, Computer Vision"
              />

              <small>
                Separate multiple items with commas.
              </small>
            </div>

            <div className="form-group full-width">
              <label>
                Research Areas
              </label>

              <textarea
                name="researchAreas"
                value={profile.researchAreas}
                onChange={handleChange}
                rows="4"
                placeholder="AI, Data Science, Healthcare AI"
              />

              <small>
                Separate multiple items with commas.
              </small>
            </div>

          </div>

        </section>

        {/* =================================================
            08 SKILLS & LANGUAGES
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                08
              </span>

              <div>
                <h3>
                  Skills & Languages
                </h3>

                <p>
                  Professional skills and languages.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>
                Professional Skills
              </label>

              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                rows="4"
                placeholder="Teaching, Research, Programming, Leadership"
              />

              <small>
                Separate multiple skills with commas.
              </small>
            </div>

            <div className="form-group full-width">
              <label>
                Languages
              </label>

              <textarea
                name="languages"
                value={profile.languages}
                onChange={handleChange}
                rows="4"
                placeholder="English, Urdu, Pashto"
              />

              <small>
                Separate multiple languages with commas.
              </small>
            </div>

          </div>

        </section>

        {/* =================================================
            09 PROFESSIONAL & ACADEMIC LINKS
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                09
              </span>

              <div>
                <h3>
                  Professional & Academic Links
                </h3>

                <p>
                  Research and professional profiles.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Website
              </label>

              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Personal Website
              </label>

              <input
                type="url"
                name="personalWebsite"
                value={profile.personalWebsite}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Google Scholar
              </label>

              <input
                type="url"
                name="googleScholar"
                value={profile.googleScholar}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                ResearchGate
              </label>

              <input
                type="url"
                name="researchGate"
                value={profile.researchGate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                ORCID
              </label>

              <input
                type="url"
                name="orcid"
                value={profile.orcid}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                GitHub
              </label>

              <input
                type="url"
                name="github"
                value={profile.github}
                onChange={handleChange}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            10 CV / RESUME
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                10
              </span>

              <div>
                <h3>
                  CV / Resume
                </h3>

                <p>
                  Professional CV information.
                </p>
              </div>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>
                CV
              </label>

              <input
                type="text"
                name="cv"
                value={profile.cv}
                onChange={handleChange}
                placeholder="CV file path or reference"
              />
            </div>

            <div className="form-group full-width">
              <label>
                CV URL
              </label>

              <input
                type="url"
                name="cvUrl"
                value={profile.cvUrl}
                onChange={handleChange}
                placeholder="https://example.com/cv.pdf"
              />
            </div>

          </div>

        </section>

        {/* =================================================
            11 DISPLAY SETTINGS
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                11
              </span>

              <div>
                <h3>
                  Profile Display Settings
                </h3>

                <p>
                  Control which profile sections
                  appear publicly.
                </p>
              </div>
            </div>

          </div>

          <div className="visibility-grid">

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showPersonalInformation"
                checked={
                  profile.showPersonalInformation
                }
                onChange={handleChange}
              />
              <span>
                Show Personal Information
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showContactInformation"
                checked={
                  profile.showContactInformation
                }
                onChange={handleChange}
              />
              <span>
                Show Contact Information
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showAddress"
                checked={profile.showAddress}
                onChange={handleChange}
              />
              <span>
                Show Address
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showProfessionalInformation"
                checked={
                  profile.showProfessionalInformation
                }
                onChange={handleChange}
              />
              <span>
                Show Professional Information
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showResearchInformation"
                checked={
                  profile.showResearchInformation
                }
                onChange={handleChange}
              />
              <span>
                Show Research Information
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showSkills"
                checked={profile.showSkills}
                onChange={handleChange}
              />
              <span>
                Show Skills
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showProfessionalLinks"
                checked={
                  profile.showProfessionalLinks
                }
                onChange={handleChange}
              />
              <span>
                Show Professional Links
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showProfileImage"
                checked={
                  profile.showProfileImage
                }
                onChange={handleChange}
              />
              <span>
                Show Profile Image
              </span>
            </label>

            <label className="visibility-item">
              <input
                type="checkbox"
                name="showCV"
                checked={profile.showCV}
                onChange={handleChange}
              />
              <span>
                Show CV
              </span>
            </label>

          </div>

        </section>

        {/* =================================================
            12 PUBLISH STATUS
        ================================================= */}

        <section className="admin-profile-card">

          <div className="section-heading">

            <div>
              <span className="section-number">
                12
              </span>

              <div>
                <h3>
                  Profile Publishing
                </h3>

                <p>
                  Control public profile visibility.
                </p>
              </div>
            </div>

          </div>

          <label className="visibility-item">

            <input
              type="checkbox"
              name="isPublished"
              checked={profile.isPublished}
              onChange={handleChange}
            />

            <span>
              Publish profile on public portfolio
            </span>

          </label>

        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="profile-actions">

          <button
            type="button"
            className="reset-profile-button"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Complete Profile"}
          </button>

        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {saved && (
          <div className="profile-save-message">
            <span>✓</span>
            Profile information saved successfully.
          </div>
        )}

      </form>

    </div>
  );
};

export default Profile;