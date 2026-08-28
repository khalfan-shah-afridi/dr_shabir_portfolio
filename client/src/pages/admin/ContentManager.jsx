import React,{useEffect,useMemo,useState} from "react";
import {Plus,Pencil,Trash2,Eye,EyeOff,X,Save,Search,Star} from "lucide-react";
import api from "../../services/api";
import "./ContentManager.css";

export const MODULES={
 education:{title:"Education",endpoint:"/education",fields:[
  ["level","Level","text"],["degree","Degree","text"],["field","Field","text"],["institution","Institution","text"],["startYear","Start Year","number"],["endYear","End Year","number"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["order","Display Order","number"]]},
 skills:{title:"Skills",endpoint:"/skills",fields:[["name","Skill Name","text"],["category","Category","text"],["level","Level","select",["Beginner","Intermediate","Advanced","Expert"]],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 projects:{title:"Projects",endpoint:"/projects",fields:[["projectId","Project ID","text"],["title","Project Title","text"],["description","Description","textarea"],["grants","Grants","textarea"],["startDate","Start Date","text"],["completionDate","Completion Date","text"],["status","Status","select",["Planned","In Progress","Completed","Archived"]],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 awards:{title:"Awards",endpoint:"/awards",fields:[["title","Award Title","text"],["organization","Organization","text"],["year","Year","number"],["description","Description","textarea"],["pdf","Certificate (PDF)","file"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 certificates:{title:"Certificates",endpoint:"/certificates",fields:[["title","Certificate Title","text"],["issuer","Issuer","text"],["category","Types","select",["International Certification","Higher Education Faculty Training","National Certification","Other"]],["issueDate","Issue Date","text"],["pdf","Certificate (PDF)","file"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 mission:{title:"Mission",endpoint:"/mission",fields:[["title","Title","text"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["order","Display Order","number"]]},
 vision:{title:"Vision",endpoint:"/vision",fields:[["title","Title","text"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["order","Display Order","number"]]},
 researchResources:{title:"Research Resources",endpoint:"/research-resources",fields:[["title","Resource Title","text"],["type","Type","text"],["year","Year","text"],["url","Resource URL","url"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 projectWins:{title:"Project Wins",endpoint:"/project-wins",fields:[["title","Project Title","text"],["projectId","Project / Grant ID","text"],["organization","Organization","text"],["department","Department","text"],["fundingAmount","Funding Amount","text"],["year","Year","text"],["status","Status","text"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 supervision:{title:"Supervision",endpoint:"/supervision",fields:[["title","Research / Project Title","text"],["type","Supervision Type","select",["Supervisor","Co-Supervisor"]],["role","Role","text"],["student","Student","text"],["institution","Institution","text"],["year","Year","text"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
 reviewer:{title:"Reviewer",endpoint:"/reviewer",fields:[["journal","Journal / Publisher","text"],["role","Role","text"],["publisher","Publisher","text"],["year","Year","text"],["description","Description","textarea"],["visible","Public Visibility","boolean"],["featured","Featured","boolean"],["order","Display Order","number"]]},
};

const initial=cfg=>Object.fromEntries(cfg.fields.map(([k,,type])=>[k,type==="boolean"?true:type==="array"?"":type==="number"?0:"" ]));

export default function ContentManager({module}){
 const cfg=MODULES[module]||MODULES.education; const [items,setItems]=useState([]); const [form,setForm]=useState(initial(cfg)); const [editing,setEditing]=useState(null); const [open,setOpen]=useState(false); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [search,setSearch]=useState(""); const [error,setError]=useState("");
 const load=async()=>{try{setLoading(true);const r=await api.get(cfg.endpoint);setItems(r.data?.data||[]);}catch(e){setError(e.response?.data?.message||"Failed to load records");}finally{setLoading(false);}};
 useEffect(()=>{load();},[module]);
 const filtered=useMemo(()=>items.filter(x=>JSON.stringify(x).toLowerCase().includes(search.toLowerCase())),[items,search]);
 const edit=item=>{setEditing(item._id);const next={};cfg.fields.forEach(([k,,type])=>next[k]=type==="array"?(item[k]||[]).join(", "):item[k]??(type==="boolean"?true:""));setForm(next);setOpen(true);setError("");};
 const add=()=>{setEditing(null);setForm(initial(cfg));setOpen(true);setError("");};
 const change=(k,v,type)=>setForm(f=>({...f,[k]:type==="boolean"?v:v}));
 const fileUrl=()=>editing?`${api.defaults.baseURL}${cfg.endpoint}/${editing}/file`:"";
 const save=async e=>{e.preventDefault();try{setSaving(true);
   const fileFields=cfg.fields.filter(([,,type])=>type==="file");
   const changedFile=fileFields.find(([k])=>form[k] instanceof File);
   let payload,config={};
   if(changedFile){
     const fd=new FormData();
     cfg.fields.forEach(([k,,type])=>{
       if(type==="file")return;
       let v=form[k];
       if(type==="array")v=String(v||"").split(",").map(s=>s.trim()).filter(Boolean).join(",");
       if(type==="number")v=v===""?"":Number(v);
       fd.append(k,v===null||v===undefined?"":v);
     });
     fd.append(changedFile[0],form[changedFile[0]]);
     payload=fd; config={headers:{"Content-Type":"multipart/form-data"}};
   }else{
     payload={...form};
     cfg.fields.forEach(([k,,type])=>{
       if(type==="file")delete payload[k];
       if(type==="array")payload[k]=String(payload[k]||"").split(",").map(v=>v.trim()).filter(Boolean);
       if(type==="number")payload[k]=payload[k]===""?null:Number(payload[k]);
     });
   }
   if(editing)await api.put(`${cfg.endpoint}/${editing}`,payload,config);else await api.post(cfg.endpoint,payload,config);setOpen(false);await load();}catch(e){setError(e.response?.data?.message||"Could not save");}finally{setSaving(false);}};
 const remove=async id=>{if(!window.confirm("Delete this record permanently?"))return;try{await api.delete(`${cfg.endpoint}/${id}`);await load();}catch(e){setError(e.response?.data?.message||"Could not delete");}};
 const toggle=async id=>{try{await api.patch(`${cfg.endpoint}/${id}/toggle`);await load();}catch(e){setError(e.response?.data?.message||"Could not change visibility");}};
 return <div className="cm-page"><header className="cm-header"><div><span>CONTENT MANAGEMENT</span><h1>{cfg.title}</h1><p>Professional, database-driven {cfg.title.toLowerCase()} management.</p></div><button className="cm-primary" onClick={add}><Plus size={17}/> Add {cfg.title}</button></header>{error&&<div className="cm-error">{error}</div>}<div className="cm-toolbar"><div className="cm-search"><Search size={16}/><input placeholder={`Search ${cfg.title.toLowerCase()}...`} value={search} onChange={e=>setSearch(e.target.value)}/></div><small>{filtered.length} record(s)</small></div>{loading?<div className="cm-empty">Loading...</div>:filtered.length===0?<div className="cm-empty">No records found.</div>:<div className="cm-list">{filtered.map(item=><article className="cm-card" key={item._id}><div className="cm-main"><div className="cm-title"><h3>{item.title||item.name||item.degree||cfg.title}</h3><span>{item.projectId?`${item.projectId} · `:""}{item.level||item.category||item.issuer||item.organization||"Portfolio record"}</span></div><p>{item.description||"No description provided."}</p><div className="cm-tags">{item.featured&&<b><Star size={12}/> Featured</b>}<b className={item.visible===false?"off":"on"}>{item.visible===false?<EyeOff size={12}/>:<Eye size={12}/>} {item.visible===false?"Hidden":"Public"}</b></div></div><div className="cm-actions"><button title={item.visible===false?"Show publicly":"Hide publicly"} onClick={()=>toggle(item._id)}>{item.visible===false?<Eye size={17}/>:<EyeOff size={17}/>}</button><button title="Edit" onClick={()=>edit(item)}><Pencil size={17}/></button><button className="danger" title="Delete" onClick={()=>remove(item._id)}><Trash2 size={17}/></button></div></article>)}</div>}
 {open&&<div className="cm-overlay"><form className="cm-modal" onSubmit={save}><div className="cm-modal-head"><div><span>{editing?"EDIT RECORD":"NEW RECORD"}</span><h2>{editing?`Edit ${cfg.title}`:`Add ${cfg.title}`}</h2></div><button type="button" onClick={()=>setOpen(false)}><X/></button></div><div className="cm-form">{cfg.fields.map(([k,label,type,options])=>type==="boolean"?<label className="cm-check" key={k}><input type="checkbox" checked={!!form[k]} onChange={e=>change(k,e.target.checked,type)}/><span>{label}</span></label>:type==="file"?<label key={k}><span>{label}</span>{typeof form[k]==="string"&&form[k]&&<div className="cm-file-current"><a href={fileUrl()} target="_blank" rel="noreferrer">View current PDF</a></div>}{form[k] instanceof File&&<div className="cm-file-current">Selected: {form[k].name}</div>}<input type="file" accept="application/pdf" onChange={e=>change(k,e.target.files[0]||"",type)}/></label>:<label key={k}><span>{label}</span>{type==="textarea"?<textarea rows="4" value={form[k]||""} onChange={e=>change(k,e.target.value,type)}/>:type==="select"?<select value={form[k]||options[0]} onChange={e=>change(k,e.target.value,type)}>{options.map(o=><option key={o}>{o}</option>)}</select>:<input type={type==="url"?"url":type==="number"?"number":"text"} value={form[k]??""} onChange={e=>change(k,e.target.value,type)}/>}</label>)}</div><div className="cm-modal-actions"><button type="button" className="cm-secondary" onClick={()=>setOpen(false)}>Cancel</button><button className="cm-primary" disabled={saving}><Save size={16}/>{saving?"Saving...":"Save Changes"}</button></div></form></div>}
 </div>
}
