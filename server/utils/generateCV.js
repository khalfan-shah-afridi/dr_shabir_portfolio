const fs=require("fs");
const path=require("path");
const PDFDocument=require("pdfkit");
const MARGIN=50, ACCENT="#2f3a47", TEXT="#1c1f22", MUTED="#5a6470", LINE="#d7dbe0";
const formatDate=v=>{if(!v)return "";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString("en-US",{month:"short",year:"numeric"});};
const formatDOB=v=>{if(!v)return "";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString("en-US",{day:"2-digit",month:"short",year:"numeric"});};
const dateRange=(s,e,c)=>`${formatDate(s)} — ${c?"Present":formatDate(e)||"Present"}`;
const ensureSpace=(d,n=60)=>{if(d.y+n>d.page.height-d.page.margins.bottom)d.addPage();};
const sectionHeading=(d,t)=>{ensureSpace(d,50);d.moveDown(.6).fillColor(ACCENT).font("Helvetica-Bold").fontSize(12.5).text(String(t).toUpperCase(),{characterSpacing:.6});const y=d.y+2;d.moveTo(d.page.margins.left,y).lineTo(d.page.width-d.page.margins.right,y).lineWidth(1).strokeColor(LINE).stroke();d.moveDown(.6).fillColor(TEXT).font("Helvetica").fontSize(10.5);};
const subHeading=(d,t)=>{ensureSpace(d,24);d.font("Helvetica-Bold").fontSize(10.5).fillColor(TEXT).text(String(t));d.moveDown(.2);};
const body=(d,t)=>{if(!t)return;d.font("Helvetica").fontSize(10).fillColor(TEXT).text(String(t),{lineGap:2});d.moveDown(.45);};
const bullet=(d,items)=>{(items||[]).filter(Boolean).forEach(x=>{ensureSpace(d,20);d.font("Helvetica").fontSize(10).fillColor(TEXT).text(`•  ${x}`,{indent:8,lineGap:1});});d.moveDown(.35);};
const entry=(d,title,right,sub,desc)=>{ensureSpace(d,45);const y=d.y;d.font("Helvetica-Bold").fontSize(11).fillColor(TEXT).text(title||"Record",d.page.margins.left,y,{width:d.page.width-d.page.margins.left-d.page.margins.right-145});if(right)d.font("Helvetica").fontSize(9).fillColor(MUTED).text(right,d.page.width-d.page.margins.right-145,y,{width:145,align:"right"});d.moveDown(.15);if(sub)d.font("Helvetica-Oblique").fontSize(10).fillColor(MUTED).text(sub);if(desc)body(d,desc);d.moveDown(.15);};
// Numbered, multi-line entry — used for Research Papers / Reviewer, matching
// the reference CV's "1. Title (link) / Authors / Venue / DOI" pattern.
const numberedEntry=(d,n,title,link,lines)=>{ensureSpace(d,40);d.font("Helvetica-Bold").fontSize(10.5).fillColor(TEXT);const prefix=`${n}.  `;const startX=d.page.margins.left,width=d.page.width-d.page.margins.left-d.page.margins.right;if(link){d.text(prefix+title,startX,d.y,{width,link,underline:true,lineGap:2});}else{d.text(prefix+title,startX,d.y,{width,lineGap:2});}d.moveDown(.1);(lines||[]).filter(Boolean).forEach(l=>{d.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(l,{indent:16,lineGap:1});});d.moveDown(.4);};

// ==========================================
// SECTION BUILDERS
// Layout mirrors the reference CV: Personal Information, Education,
// Experience split by category (Teaching / Administration / Focal
// Person / Project Director), Certifications by category, Conferences,
// Research Resources, Project Win, Research Papers, Supervision,
// Research Interest, Skills, Projects, Honor and Awards, Reviewer,
// References.
// ==========================================

const buildPersonal=(d,data,s)=>{
  sectionHeading(d,"Personal Information");
  const p=data.personal||{},pr=data.profile||{};
  // These fields are always included, with their labels, whenever the
  // admin has actually filled them in — nothing here is gated behind a
  // toggle, so Father Name / Marital Status / CNIC / Passport / Religion
  // never silently disappear from a generated CV.
  const lines=[
    pr.fatherName?`Father Name: ${pr.fatherName}`:"",
    pr.gender?`Gender: ${pr.gender}`:"",
    pr.dateOfBirth?`Date of Birth: ${formatDOB(pr.dateOfBirth)}`:"",
    pr.maritalStatus?`Marital Status: ${pr.maritalStatus}`:"",
    pr.nationality?`Nationality: ${pr.nationality}`:"",
    pr.cnic?`CNIC No: ${pr.cnic}`:"",
    pr.passportNumber?`Passport No: ${pr.passportNumber}`:"",
    pr.religion?`Religion: ${pr.religion}`:"",
    p.email&&s.showEmail!==false?`Email: ${p.email}`:"",
    p.phone&&s.showPhone!==false?`Phone: ${p.phone}`:"",
    s.showAddress&&(pr.permanentAddress)?`Permanent Address: ${pr.permanentAddress}`:"",
    s.showAddress&&(pr.currentAddress&&pr.currentAddress!==pr.permanentAddress)?`Current Address: ${pr.currentAddress}`:"",
    s.showAddress&&!pr.permanentAddress&&(p.address||p.location)?`Address: ${p.address||p.location}`:"",
    p.location&&!s.showAddress?`Location: ${p.location}`:"",
    p.linkedin&&s.showSocialLinks!==false?`LinkedIn: ${p.linkedin}`:"",
    p.googleScholar&&s.showSocialLinks!==false?`Google Scholar: ${p.googleScholar}`:"",
    p.researchGate&&s.showSocialLinks!==false?`ResearchGate: ${p.researchGate}`:"",
    p.orcid&&s.showSocialLinks!==false?`ORCID: ${p.orcid}`:"",
  ].filter(Boolean);
  lines.forEach(x=>body(d,x));
};

const buildSummary=(d,data,s)=>{const t=s.professionalSummary||data.profile?.professionalSummary||data.profile?.biography;if(t){sectionHeading(d,"Professional Summary");body(d,t);}};

const buildEdu=(d,data)=>{if(!(data.education||[]).length)return;sectionHeading(d,"Education");data.education.forEach(x=>entry(d,x.degree||x.title,dateRange(x.startYear,x.endYear,false),[x.institution,x.field,x.fieldOfStudy].filter(Boolean).join(" — "),x.description));};

// Experience is split into four category-specific sections plus a
// catch-all for "General" records, matching the reference CV where
// Teaching / Administration / Focal Person / Project Director are each
// their own block instead of one combined "Experience" list.
const experienceByCategory=(cat)=>(d,data)=>{
  const list=(data.experience||[]).filter(x=>(x.category||"General")===cat);
  if(!list.length)return;
  const label=cat==="General"?"Additional Experience":cat;
  sectionHeading(d,label);
  if(cat==="Focal Person"||cat==="Project Director"){
    // Reference CV renders these as a plain bullet list of roles/projects
    // rather than dated entries.
    bullet(d,list.map(x=>[x.position,x.organization].filter(Boolean).join(" — ")+(x.description?` (${x.description})`:"")));
  }else{
    list.forEach(x=>entry(d,x.position,dateRange(x.startDate,x.endDate,x.current),[x.organization,x.department].filter(Boolean).join(" — "),x.description));
  }
};
const buildTeaching=experienceByCategory("Teaching");
const buildAdministration=experienceByCategory("Administration");
const buildFocalPerson=experienceByCategory("Focal Person");
const buildProjectDirector=experienceByCategory("Project Director");
const buildGeneralExperience=experienceByCategory("General");

// Certificates split by category, matching the reference CV's
// International / Higher Education Faculty Training / National blocks.
const certificatesByCategory=(cat,label)=>(d,data)=>{
  const list=(data.certificates||[]).filter(x=>(x.category||"Other")===cat);
  if(!list.length)return;
  sectionHeading(d,label);
  bullet(d,list.map(x=>[x.title,x.issuer,x.issueDate].filter(Boolean).join(" — ")));
};
const buildInternationalCerts=certificatesByCategory("International Certification","International Certifications");
const buildFacultyTraining=certificatesByCategory("Higher Education Faculty Training","Higher Education Faculty Training");
const buildNationalCerts=certificatesByCategory("National Certification","National Certifications");
const buildOtherCerts=certificatesByCategory("Other","Other Certifications");

// Conferences — grouped by type (International / National / Local /
// Online) when more than one type is present, otherwise rendered as a
// single flat list so a person who only attends international
// conferences gets a clean "Conferences" section, same as the reference.
const buildConf=(d,data)=>{
  const list=data.conferences||[];
  if(!list.length)return;
  sectionHeading(d,"Conferences");
  const types=[...new Set(list.map(x=>x.type).filter(Boolean))];
  const renderOne=x=>entry(d,x.title||x.name,formatDate(x.startDate)||x.date,[x.role,x.organizer,x.location].filter(Boolean).join(" — "),x.description);
  if(types.length>1){
    types.forEach(t=>{subHeading(d,t);list.filter(x=>x.type===t).forEach(renderOne);});
  }else{
    list.forEach(renderOne);
  }
};

const buildResearchResources=(d,data)=>{const list=data.researchResources||[];if(!list.length)return;sectionHeading(d,"Research Resources Generation");bullet(d,list.map(x=>[x.title,x.year].filter(Boolean).join(" — ")));};

const buildProjectWins=(d,data)=>{const list=data.projectWins||data.grants||[];if(!list.length)return;sectionHeading(d,"Project Win");list.forEach(x=>entry(d,x.title,x.year,[x.projectId,x.organization,x.department,x.fundingAmount&&`Funding: ${x.fundingAmount}`].filter(Boolean).join(" — "),x.description));};

// Research Papers — numbered, each with title (linked when a DOI/URL is
// available), authors, venue, and DOI on their own lines.
const buildPublications=(d,data)=>{
  const list=data.publications||[];
  if(!list.length)return;
  sectionHeading(d,"Research Papers");
  list.forEach((p,i)=>{
    const link=p.paperUrl||(p.doi?(p.doi.startsWith("http")?p.doi:`https://doi.org/${p.doi}`):"");
    const venue=[p.journal,p.volume&&`Vol. ${p.volume}`,p.issue&&`Issue ${p.issue}`,p.pages].filter(Boolean).join(", ");
    const year=p.publicationDate?new Date(p.publicationDate).getFullYear():"";
    numberedEntry(d,i+1,p.title||"Untitled",link,[
      p.authors,
      [venue,year].filter(Boolean).join(" — "),
      p.doi?`DOI: ${p.doi}`:"",
    ]);
  });
};

const buildSupervision=(d,data)=>{const list=data.supervision||[];if(!list.length)return;sectionHeading(d,"Supervision");bullet(d,list.map(x=>[x.title,x.student,x.year].filter(Boolean).join(" — ")));};

const buildInterests=(d,data)=>{if(!data.researchInterests?.length)return;sectionHeading(d,"Research Interest");bullet(d,data.researchInterests);};

const buildSkills=(d,data)=>{if(!(data.skills||[]).length)return;sectionHeading(d,"Skills");const grouped={};data.skills.forEach(x=>{const cat=x.category||"General";(grouped[cat]=grouped[cat]||[]).push(x.level?`${x.name} (${x.level})`:x.name);});Object.entries(grouped).forEach(([cat,names])=>{if(cat!=="General"){d.font("Helvetica-Bold").fontSize(10).fillColor(TEXT).text(cat);d.moveDown(.15);}body(d,names.join(", "));});};

const buildProjects=(d,data)=>{if(!(data.projects||[]).length)return;sectionHeading(d,"Projects");data.projects.forEach(x=>entry(d,x.projectId?`${x.projectId} · ${x.title}`:x.title,dateRange(x.startDate,x.completionDate,false),x.status||"",x.description));};

const buildAwards=(d,data)=>{if(!data.awards?.length)return;sectionHeading(d,"Honor and Awards");bullet(d,data.awards.map(x=>[x.title,x.organization,x.year].filter(Boolean).join(" — ")));};

const buildReviewer=(d,data)=>{
  const list=data.reviewer||[];
  if(!list.length)return;
  sectionHeading(d,"Reviewer");
  list.forEach((x,i)=>{
    const label=[x.journal,x.role&&x.role!=="Reviewer"?x.role:"",x.year].filter(Boolean).join(" — ");
    ensureSpace(d,16);
    d.font("Helvetica").fontSize(10).fillColor(TEXT).text(`${i+1}.  ${label}`,{lineGap:1});
  });
  d.moveDown(.35);
};

const buildRefs=(d,data)=>{if(!data.references?.length)return;sectionHeading(d,"References");data.references.forEach(x=>entry(d,`${x.name}${x.relationship?` (${x.relationship})`:""}`,"",[x.designation,x.institution,x.department].filter(Boolean).join(", "),[x.contactEmail&&`Email: ${x.contactEmail}`,x.phone&&`Phone No: ${x.phone}`].filter(Boolean).join("   |   ")));};

const SECTION_BUILDERS={
 personalInformation:buildPersonal,
 professionalSummary:buildSummary,
 education:buildEdu,
 teachingExperience:buildTeaching,
 administrationExperience:buildAdministration,
 focalPerson:buildFocalPerson,
 projectDirector:buildProjectDirector,
 generalExperience:buildGeneralExperience,
 internationalCertifications:buildInternationalCerts,
 facultyTraining:buildFacultyTraining,
 nationalCertifications:buildNationalCerts,
 otherCertifications:buildOtherCerts,
 conferences:buildConf,
 researchResources:buildResearchResources,
 projectWins:buildProjectWins,
 publications:buildPublications,
 supervision:buildSupervision,
 researchInterests:buildInterests,
 skills:buildSkills,
 projects:buildProjects,
 awards:buildAwards,
 reviewer:buildReviewer,
 references:buildRefs,
};

const generateCVPdf=(data,out)=>{const s=data.settings||{};const d=new PDFDocument({size:"A4",margins:{top:MARGIN,bottom:MARGIN,left:MARGIN,right:MARGIN},bufferPages:true});d.pipe(out);const p=data.personal||{},pr=data.profile||{};const name=p.fullName||pr.fullName||"Curriculum Vitae";const headline=[p.designation,p.institution,pr.currentDesignation,pr.organization].filter(Boolean).slice(0,2).join(" · ");let x=d.page.margins.left;if(s.showProfileImage!==false&&p.profileImage){try{const ip=path.join(__dirname,"..",p.profileImage);if(fs.existsSync(ip)){d.image(ip,x,d.y,{width:72,height:72});x+=90;}}catch{}}const y=d.y;d.font("Helvetica-Bold").fontSize(22).fillColor(TEXT).text(name,x,y,{width:d.page.width-d.page.margins.right-x});if(headline)d.font("Helvetica").fontSize(12).fillColor(MUTED).text(headline,x,d.y+2);d.y=Math.max(d.y,y+80);d.x=d.page.margins.left;d.moveTo(d.page.margins.left,d.y+4).lineTo(d.page.width-d.page.margins.right,d.y+4).lineWidth(1.4).strokeColor(ACCENT).stroke();d.moveDown(1);
[...(s.sections||[])].sort((a,b)=>a.order-b.order).filter(x=>x.enabled!==false&&SECTION_BUILDERS[x.key]).forEach(x=>SECTION_BUILDERS[x.key](d,data,s));
const r=d.bufferedPageRange();for(let i=r.start;i<r.start+r.count;i++){d.switchToPage(i);d.font("Helvetica").fontSize(8.5).fillColor(MUTED).text(`Page ${i+1} of ${r.count}`,0,d.page.height-34,{align:"center"});}d.end();};
module.exports=generateCVPdf;
