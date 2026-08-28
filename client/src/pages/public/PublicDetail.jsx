import React,{useEffect,useMemo,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {ArrowLeft,ExternalLink,Eye,CalendarDays,Building2,Hash,FileText,Layers3,Tag,MapPin,UserRound,ShieldCheck} from "lucide-react";
import api from "../../services/api";
import "./PublicPortfolio.css";

const labels={projects:"Projects",publications:"Publications",experience:"Experience",education:"Education",awards:"Awards & Honors",certificates:"Certifications",conferences:"Conferences","research-resources":"Research Resources","project-wins":"Project Wins",supervision:"Supervision",reviewer:"Reviewer",references:"References"};
const endpointFor={awards:"/awards",certificates:"/certificates"};
const titleOf=(x,m)=>m==="experience"?x.position:m==="publications"?x.title:m==="education"?x.degree:m==="certificates"?x.title:m==="conferences"?(x.title||x.name):m==="reviewer"?x.journal:x.title||x.name||"Portfolio Record";
// Fields kept out of the public record grid entirely - either internal
// bookkeeping, or fields that were intentionally removed from admin
// forms and must never surface on the public site even if legacy
// database records still carry a value for them.
const hidden=["_id","__v","visible","isVisible","featured","order","createdAt","updatedAt","image","pdf","pdfOriginalName","presentationTitle","certificateUrl","certificate","credentialId","expiryDate","verificationUrl","technologies","githubUrl","shortDescription","content"];
const pretty=k=>k.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase()).replace(/Url/g,"URL").replace(/Id/g,"ID");
const isUrl=v=>typeof v==="string"&&/^https?:\/\//i.test(v);
const valueOf=v=>Array.isArray(v)?v.join(" · "):String(v);

function iconFor(key){
 const icons={projectId:Hash,startDate:CalendarDays,completionDate:CalendarDays,organization:Building2,institution:Building2,issuer:Building2,year:CalendarDays,category:Tag,level:Layers3,field:Layers3,student:UserRound,location:MapPin};
 return icons[key]||FileText;
}

export default function PublicDetail(){
 const {module,id}=useParams();
 const [item,setItem]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{setLoading(true);setError("");api.get(`/public/${module}/${id}`).then(r=>setItem(r.data.data)).catch(e=>setError(e.response?.data?.message||"Record not found")).finally(()=>setLoading(false))},[module,id]);

 const fields=useMemo(()=>item?Object.entries(item).filter(([k,v])=>!hidden.includes(k)&&v!==""&&v!==null&&v!==undefined):[],[item]);
 const title=item?titleOf(item,module):"";
 const description=item?.description||item?.abstract||"";
 const meta=[item?.projectId&&`Project ID: ${item.projectId}`,item?.organization,item?.institution,item?.issuer,item?.year&&String(item.year),item?.status].filter(Boolean);
 const certificateUrl=item&&item.pdf&&endpointFor[module]?`${api.defaults.baseURL}${endpointFor[module]}/${item._id}/file`:"";

 if(loading)return <div className="public-detail-page"><div className="public-detail-loading">Loading record...</div></div>;
 if(error)return <div className="public-detail-page"><div className="public-detail-error"><Link className="detail-back-link" to={`/portfolio/${module}`}><ArrowLeft size={16}/> Back to {labels[module]||"Portfolio"}</Link><h1>{error}</h1><p>The requested public record could not be loaded.</p></div></div>;

 return <div className="public-detail-page">
   <div className="public-detail-topbar">
     <Link className="detail-back-link" to={`/portfolio/${module}`}><ArrowLeft size={16}/> Back to {labels[module]||"Portfolio"}</Link>
     <span className="detail-live"><Eye size={13}/> Public record</span>
   </div>

   <section className="public-detail-hero glass">
     <div className="detail-kicker">{labels[module]||"PORTFOLIO RECORD"}</div>
     <h1>{title}</h1>
     {meta.length>0&&<div className="detail-meta-row">{meta.map((m,i)=><span key={`${m}-${i}`}>{m}</span>)}</div>}
     {description&&<p className="detail-lead">{description}</p>}
     {certificateUrl&&<a className="detail-back-link" href={certificateUrl} target="_blank" rel="noreferrer" style={{marginTop:16,display:"inline-flex"}}><ShieldCheck size={16}/> View / Download Certificate (PDF)</a>}
   </section>

   <section className="public-detail-content">
     <div className="detail-content-head"><div><span className="eyebrow">RECORD INFORMATION</span><h2>Complete details</h2></div><span className="detail-count">{fields.length} detail{fields.length===1?"":"s"}</span></div>
     <div className="professional-detail-grid">
       {fields.map(([k,v])=>{const Icon=iconFor(k);return <article className={`professional-detail-card ${isUrl(v)?"has-link":""}`} key={k}>
         <div className="detail-field-icon"><Icon size={17}/></div>
         <div className="detail-field-copy"><small>{pretty(k)}</small>
           {isUrl(v)?<a href={v} target="_blank" rel="noreferrer">{v}<ExternalLink size={14}/></a>:<strong>{valueOf(v)}</strong>}
         </div>
       </article>})}
     </div>
   </section>
 </div>;
}
