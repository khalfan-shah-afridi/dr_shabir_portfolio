import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";
import PublicPortfolio from "./pages/public/PublicPortfolio";
import PublicDetail from "./pages/public/PublicDetail";
import PublicListing from "./pages/public/PublicListing";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminConferences from "./pages/admin/AdminConferences";
import AdminReferences from "./pages/admin/AdminReferences";
import Profile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVisibility from "./pages/admin/AdminVisibility";
import ResearchPublicationManager from "./pages/ResearchPublicationManager";
import SubmitPaperManager from "./pages/SubmitPaperManager";
import ContentManager from "./pages/admin/ContentManager";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminExperience from "./pages/admin/AdminExperience";
import CVGenerator from "./pages/admin/CVGenerator";
import PersonalInformation from "./pages/admin/PersonalInformation";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import AdminShell from "./components/admin/AdminShell";

function AdminLayout(){return <AdminShell><Routes>
<Route index element={<AdminDashboard/>}/>
<Route path="research-resources" element={<ContentManager module="researchResources"/>}/>
<Route path="project-wins" element={<ContentManager module="projectWins"/>}/>
<Route path="supervision" element={<ContentManager module="supervision"/>}/>
<Route path="reviewer" element={<ContentManager module="reviewer"/>}/>
<Route path="education" element={<ContentManager module="education"/>}/>
<Route path="skills" element={<ContentManager module="skills"/>}/>
<Route path="projects" element={<ContentManager module="projects"/>}/>
<Route path="awards" element={<ContentManager module="awards"/>}/>
<Route path="certificates" element={<ContentManager module="certificates"/>}/>
<Route path="documents" element={<AdminDocuments/>}/>
<Route path="experience" element={<AdminExperience/>}/>
<Route path="cv-generator" element={<CVGenerator/>}/>
<Route path="mission" element={<ContentManager module="mission"/>}/>
<Route path="vision" element={<ContentManager module="vision"/>}/>
<Route path="personal-information" element={<PersonalInformation/>}/>
<Route path="profile" element={<Profile/>}/>
<Route path="publications" element={<ResearchPublicationManager/>}/>
<Route path="submit-papers" element={<SubmitPaperManager/>}/>
<Route path="conferences" element={<AdminConferences/>}/>
<Route path="references" element={<AdminReferences/>}/>
<Route path="messages" element={<AdminContactMessages/>}/>
<Route path="visibility" element={<AdminVisibility/>}/>
<Route path="settings" element={<AdminSettings/>}/>
<Route path="*" element={<Navigate to="/admin" replace/>}/>
</Routes></AdminShell>}
export default function App(){return <Routes><Route path="/portfolio" element={<PublicPortfolio/>}/><Route path="/portfolio/:module" element={<PublicListing/>}/><Route path="/portfolio/:module/:id" element={<PublicDetail/>}/><Route path="/login" element={<Login/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/admin/*" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Navigate to="/admin/profile" replace/></ProtectedRoute>}/><Route path="/" element={<Navigate to="/portfolio" replace/>}/><Route path="*" element={<Navigate to="/portfolio" replace/>}/></Routes>}
