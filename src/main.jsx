import React, {useEffect, useMemo, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, CircleMarker, Popup} from "react-leaflet";
import L from "leaflet";
import "./styles.css";

const icon = {
  home:"⌂", project:"▣", image:"▧", video:"▶", music:"♫", user:"●",
  settings:"⚙", logout:"↪", users:"♟", map:"⌖", report:"▥", upload:"↑",
  crop:"□", rotate:"↻", text:"T", filter:"✦", effect:"✣", transition:"⇄",
  resize:"⤢", compress:"◈", play:"▶", pause:"Ⅱ", undo:"↶", redo:"↷"
};

const demoUsers = [
  {id:1,name:"Rohan",email:"rohan@example.com",status:"online",city:"Ahmedabad",lat:23.0225,lng:72.5714,last:"2 min ago"},
  {id:2,name:"Priya",email:"priya@example.com",status:"online",city:"Surat",lat:21.1702,lng:72.8311,last:"5 min ago"},
  {id:3,name:"Amit",email:"amit@example.com",status:"offline",city:"Rajkot",lat:22.3039,lng:70.8022,last:"1 hr ago"},
  {id:4,name:"Neha",email:"neha@example.com",status:"online",city:"Vadodara",lat:22.3072,lng:73.1812,last:"10 min ago"}
];

function App(){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("sq_user")||"null"));
  const [view,setView]=useState("dashboard");
  const [admin,setAdmin]=useState(false);
  const [projects,setProjects]=useState(()=>JSON.parse(localStorage.getItem("sq_projects")||"[]"));
  const [assets,setAssets]=useState([]);
  const [selected,setSelected]=useState(null);
  const [duration,setDuration]=useState(3);
  const [loop,setLoop]=useState(true);
  const [loopCount,setLoopCount]=useState(3);
  const [music,setMusic]=useState(null);
  const [toast,setToast]=useState("");

  useEffect(()=>{localStorage.setItem("sq_projects",JSON.stringify(projects))},[projects]);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(""),2200);return()=>clearTimeout(t)}},[toast]);

  if(!user) return <Auth onLogin={u=>{setUser(u);localStorage.setItem("sq_user",JSON.stringify(u))}}/>;

  const addProject=()=>{
    const p={id:Date.now(),name:"New Project",updated:new Date().toLocaleString(),assets:[]};
    setProjects(x=>[p,...x]); setView("editor"); setToast("New project created");
  };

  const logout=()=>{localStorage.removeItem("sq_user");setUser(null)};

  return <div className="app">
    <Sidebar view={view} setView={setView} admin={admin} setAdmin={setAdmin} logout={logout}/>
    <main className="main">
      <Topbar user={user} admin={admin} setAdmin={setAdmin}/>
      {view==="dashboard" && <Dashboard user={user} projects={projects} addProject={addProject} setView={setView}/>}
      {view==="editor" && <Editor assets={assets} setAssets={setAssets} selected={selected} setSelected={setSelected}
        duration={duration} setDuration={setDuration} loop={loop} setLoop={setLoop} loopCount={loopCount} setLoopCount={setLoopCount}
        music={music} setMusic={setMusic} toast={setToast} projects={projects} setProjects={setProjects}/>}
      {view==="assets" && <Assets assets={assets} setAssets={setAssets} setView={setView}/>}
      {view==="admin" && <Admin/>}
      {view==="profile" && <Profile user={user}/>}
      {view==="settings" && <Settings/>}
    </main>
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function Auth({onLogin}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",mobile:"",password:"",terms:false});
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=e=>{
    e.preventDefault();
    if(mode==="register" && !form.terms) return alert("Please accept Terms & Conditions.");
    if(!form.email || !form.password) return alert("Email/mobile and password are required.");
    onLogin({name:form.name||"User",email:form.email,mobile:form.mobile});
  };
  return <div className="auth-shell">
    <div className="auth-card">
      <div className="brand large">SENQUARA<span>•</span></div>
      <p className="muted">Simple • Powerful • Creative</p>
      <div className="auth-tabs"><button className={mode==="login"?"active":""} onClick={()=>setMode("login")}>Login</button><button className={mode==="register"?"active":""} onClick={()=>setMode("register")}>Register</button></div>
      <button className="google-btn" onClick={()=>onLogin({name:"Google User",email:"google.user@example.com"})}>G&nbsp; Continue with Google</button>
      <div className="or"><span>OR</span></div>
      <form onSubmit={submit}>
        {mode==="register" && <input placeholder="Full Name" value={form.name} onChange={e=>update("name",e.target.value)} />}
        <input placeholder="Email / Mobile" value={form.email} onChange={e=>update("email",e.target.value)} />
        {mode==="register" && <input placeholder="Mobile Number" value={form.mobile} onChange={e=>update("mobile",e.target.value)} />}
        <input type="password" placeholder="Password" value={form.password} onChange={e=>update("password",e.target.value)} />
        {mode==="register" && <label className="check"><input type="checkbox" checked={form.terms} onChange={e=>update("terms",e.target.checked)}/> I agree to Terms & Conditions</label>}
        <button className="primary wide">{mode==="login"?"Login":"Register"}</button>
      </form>
      <small className="muted">Production Google OAuth and server-side authentication should be configured before deployment.</small>
    </div>
  </div>
}

function Sidebar({view,setView,admin,setAdmin,logout}){
  const item=(id,ic,label)=><button className={view===id?"nav active":"nav"} onClick={()=>{setView(id);if(id!=="admin")setAdmin(false)}}><span>{ic}</span>{label}</button>;
  return <aside className="sidebar">
    <div className="brand">SENQUARA</div>
    <div className="navs">
      {item("dashboard",icon.home,"Dashboard")}
      {item("editor",icon.project,"Editor")}
      {item("assets",icon.image,"Images / Videos")}
      {item("assets",icon.music,"Music")}
      {item("profile",icon.user,"Profile")}
      {item("settings",icon.settings,"Settings")}
      <div className="nav-sep"/>
      <button className={admin?"nav active":"nav"} onClick={()=>{setAdmin(true);setView("admin")}}><span>{icon.users}</span>Admin Dashboard</button>
      <button className="nav" onClick={logout}><span>{icon.logout}</span>Logout</button>
    </div>
    <div className="side-foot">Live • Replay • Relay</div>
  </aside>
}

function Topbar({user,admin,setAdmin}){
  return <header className="topbar"><div><b>{admin?"Admin Dashboard":"Workspace"}</b><span className="crumb"> / {admin?"Users & Live Map":"Media Studio"}</span></div>
    <div className="top-user"><span className="online-dot"/>{user.name}<button className="avatar">{(user.name||"U")[0]}</button></div>
  </header>
}

function Dashboard({user,projects,addProject,setView}){
  return <section className="page">
    <div className="hero"><div><span className="eyebrow">WELCOME BACK</span><h1>{user.name}</h1><p>Create, resize, compress, edit and replay your media from one responsive workspace.</p></div><button className="primary" onClick={addProject}>＋ Create New Project</button></div>
    <div className="stat-grid"><Stat n={projects.length} l="Projects"/><Stat n="∞" l="Replay / Loop"/><Stat n="Live" l="Relay Ready"/><Stat n="Touch" l="Editing"/></div>
    <div className="section-head"><h2>Quick tools</h2></div>
    <div className="tool-grid">
      <Tool title="Touch Editor" sub="Images + videos + live preview" ic={icon.project} onClick={()=>setView("editor")}/>
      <Tool title="Image Resizer" sub="Custom size, crop, fit and fill" ic={icon.resize} onClick={()=>setView("assets")}/>
      <Tool title="Image Compressor" sub="Batch quality and size control" ic={icon.compress} onClick={()=>setView("assets")}/>
      <Tool title="Music Studio" sub="Trim, volume, fade and preview" ic={icon.music} onClick={()=>setView("assets")}/>
    </div>
    <div className="section-head"><h2>Recent projects</h2></div>
    <div className="projects">{projects.length===0?<div className="empty">No projects yet. Create your first project.</div>:projects.map(p=><div className="project-card" key={p.id}><div className="thumb">▶</div><b>{p.name}</b><small>{p.updated}</small></div>)}</div>
  </section>
}
const Stat=({n,l})=><div className="stat"><strong>{n}</strong><span>{l}</span></div>;
const Tool=({title,sub,ic,onClick})=><button className="tool" onClick={onClick}><span className="red-icon">{ic}</span><span><b>{title}</b><small>{sub}</small></span><span className="arrow">→</span></button>;

function Assets({assets,setAssets,setView}){
  const [quality,setQuality]=useState(0.78),[targetW,setTargetW]=useState(1080),[targetH,setTargetH]=useState(1080);
  const [busy,setBusy]=useState(false);
  const fileRef=useRef();
  const addFiles=e=>setAssets(a=>[...a,...Array.from(e.target.files||[]).map(f=>({file:f,id:crypto.randomUUID(),url:URL.createObjectURL(f),duration:3}))]);
  const process=(compress=false)=>{
    setBusy(true);
    Promise.all(assets.map(a=>transformImage(a.file,targetW,targetH,quality,compress))).then(out=>{
      out.forEach((b,i)=>downloadBlob(b,`${assets[i].file.name.replace(/\.[^.]+$/,"")}-${compress?"compressed":"resized"}.jpg`));
      setBusy(false);
    }).catch(()=>{setBusy(false);alert("Some files could not be decoded by this browser.")});
  };
  return <section className="page">
    <div className="hero compact"><div><span className="eyebrow">MEDIA TOOLS</span><h1>Resize & Compress</h1><p>Batch process browser-supported image formats. Original files stay untouched.</p></div><button className="primary" onClick={()=>fileRef.current?.click()}>＋ Add Images</button></div>
    <input ref={fileRef} hidden type="file" accept="image/*" multiple onChange={addFiles}/>
    <div className="card controls">
      <label>Width<input type="number" value={targetW} onChange={e=>setTargetW(+e.target.value)}/></label>
      <label>Height<input type="number" value={targetH} onChange={e=>setTargetH(+e.target.value)}/></label>
      <label>JPEG Quality <b>{Math.round(quality*100)}%</b><input type="range" min=".1" max="1" step=".01" value={quality} onChange={e=>setQuality(+e.target.value)}/></label>
      <div className="button-row"><button className="primary" disabled={!assets.length||busy} onClick={()=>process(false)}>⤢ Resize & Download</button><button className="outline" disabled={!assets.length||busy} onClick={()=>process(true)}>◈ Compress & Download</button></div>
    </div>
    <div className="asset-grid">{assets.map(a=><div className="asset-card" key={a.id}><img src={a.url}/><div><b>{a.file.name}</b><small>{Math.round(a.file.size/1024)} KB • {a.file.type||"unknown"}</small></div><button onClick={()=>setAssets(x=>x.filter(y=>y.id!==a.id))}>×</button></div>)}</div>
    <div className="hint">For GIF/BMP/HEIC/RAW and other formats, decoding depends on browser support. A production backend can add universal transcoding.</div>
  </section>
}

async function transformImage(file,w,h,q){
  const bitmap=await createImageBitmap(file);
  const canvas=document.createElement("canvas"); canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);
  const scale=Math.min(w/bitmap.width,h/bitmap.height);
  const dw=bitmap.width*scale,dh=bitmap.height*scale;
  ctx.drawImage(bitmap,(w-dw)/2,(h-dh)/2,dw,dh);
  return new Promise(res=>canvas.toBlob(res,"image/jpeg",q));
}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}

function Editor({assets,setAssets,selected,setSelected,duration,setDuration,loop,setLoop,loopCount,setLoopCount,music,setMusic,toast,projects,setProjects}){
  const [tool,setTool]=useState("edit"); const [text,setText]=useState(""); const [playing,setPlaying]=useState(false);
  const [zoom,setZoom]=useState(1),[rotation,setRotation]=useState(0); const fileRef=useRef(),musicRef=useRef();
  const current=selected!==null?assets[selected]:assets[0];
  const add=e=>setAssets(a=>[...a,...Array.from(e.target.files||[]).map(f=>({file:f,id:crypto.randomUUID(),url:URL.createObjectURL(f),duration}))]);
  const addMusic=e=>{const f=e.target.files?.[0];if(f)setMusic({file:f,url:URL.createObjectURL(f)})};
  const save=()=>{setProjects(p=>[{id:Date.now(),name:"Live Edit",updated:new Date().toLocaleString(),assets:assets.map(a=>({name:a.file.name,duration:a.duration}))},...p]);toast("Project saved")};
  return <section className="page">
    <div className="editor-head"><div><span className="eyebrow">LIVE EDITOR</span><h1>Touch Studio</h1></div><div className="button-row"><button className="outline" onClick={save}>Save</button><button className="primary" onClick={()=>toast("Export pipeline ready")}>Export MP4</button></div></div>
    <div className="editor-layout">
      <div className="editor-main card">
        <div className="toolbar">{[
          ["edit","✎ Edit"],["crop","□ Crop"],["rotate","↻ Rotate"],["text","T Text"],["filter","✦ Filter"],["effect","✣ Effect"],["transition","⇄ Transition"],["resize","⤢ Resize"]
        ].map(([id,l])=><button className={tool===id?"tool-btn active":"tool-btn"} key={id} onClick={()=>{setTool(id);if(id==="rotate")setRotation(r=>r+90)}}>{l}</button>)}</div>
        <div className="canvas-wrap" style={{touchAction:"none"}}>
          {current?<img src={current.url} className="canvas-media" style={{transform:`scale(${zoom}) rotate(${rotation}deg)`}}/>:<div className="canvas-empty">Tap “Add Media” to begin</div>}
          {text&&<div className="canvas-text">{text}</div>}
          <div className="touch-badge">☝ Touch • Drag • Pinch • Rotate</div>
        </div>
        <div className="timeline">
          <button onClick={()=>setPlaying(!playing)}>{playing?icon.pause:icon.play}</button>
          <div className="track">{assets.map((a,i)=><button key={a.id} className={i===selected?"clip active":"clip"} onClick={()=>setSelected(i)}><img src={a.url}/><span>{a.duration}s</span></button>)}</div>
          <span>{assets.reduce((s,a)=>s+a.duration,0)}s</span>
        </div>
      </div>
      <aside className="editor-side">
        <div className="card panel"><h3>Media</h3><input ref={fileRef} hidden type="file" accept="image/*,video/*" multiple onChange={add}/><button className="outline wide" onClick={()=>fileRef.current?.click()}>↑ Add Images / Videos</button>
          {assets.map((a,i)=><div className="side-asset" key={a.id} onClick={()=>setSelected(i)}><img src={a.url}/><div><b>{a.file.name}</b><small>{a.file.type}</small></div></div>)}
        </div>
        <div className="card panel"><h3>Touch controls</h3><label>Zoom <input type="range" min=".5" max="3" step=".01" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label><label>Duration <input type="number" min="0.5" step=".5" value={duration} onChange={e=>{setDuration(+e.target.value);if(selected!==null)setAssets(a=>a.map((x,i)=>i===selected?{...x,duration:+e.target.value}:x))}}/></label><label>Text<input value={text} onChange={e=>setText(e.target.value)} placeholder="Add text overlay"/></label></div>
        <div className="card panel"><h3>Music</h3><input ref={musicRef} hidden type="file" accept="audio/*" onChange={addMusic}/><button className="outline wide" onClick={()=>musicRef.current?.click()}>♫ Add Music</button>{music&&<div className="music-row"><b>{music.file.name}</b><audio controls src={music.url}/></div>}</div>
        <div className="card panel"><h3>Replay / Loop</h3><label className="check"><input type="checkbox" checked={loop} onChange={e=>setLoop(e.target.checked)}/> Loop / Replay</label>{loop&&<label>Loop count<input type="number" min="1" value={loopCount} onChange={e=>setLoopCount(+e.target.value)}/></label>}<small className="muted">Preview will repeat the timeline {loop?loopCount:"once"} time(s).</small></div>
      </aside>
    </div>
    <div className="card relay"><div><b>Real-time Relay Connection</b><small>WebSocket-ready collaboration channel</small></div><span className="relay-dot"/> <b>Ready</b><span className="relay-pill">REPLAY ENABLED</span></div>
  </section>
}

function Admin(){
  const [users,setUsers]=useState(demoUsers),[selected,setSelected]=useState(null),[q,setQ]=useState("");
  const filtered=users.filter(u=>(u.name+" "+u.email+" "+u.city).toLowerCase().includes(q.toLowerCase()));
  return <section className="page">
    <div className="hero compact"><div><span className="eyebrow">ADMIN</span><h1>Users & Live Map</h1><p>Online status and approximate IP-based location. Exact GPS requires user permission.</p></div><span className="admin-badge">ADMIN</span></div>
    <div className="admin-layout">
      <div className="card table-card"><div className="table-head"><h3>Registered Users</h3><input placeholder="Search name / email / city…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Status</th><th>IP Location</th><th>Last Active</th></tr></thead><tbody>{filtered.map(u=><tr key={u.id} onClick={()=>setSelected(u)}><td><b>{u.name}</b><small>{u.email}</small></td><td><span className={u.status==="online"?"status on":"status"}>{u.status}</span></td><td>India • {u.city} <small>(approx.)</small></td><td>{u.last}</td></tr>)}</tbody></table></div>
      </div>
      <div className="card map-card"><h3>Live / Approximate Location</h3><MapContainer center={[22.7,72.9]} zoom={7} scrollWheelZoom={true} style={{height:"100%",minHeight:360}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{filtered.map(u=><CircleMarker key={u.id} center={[u.lat,u.lng]} radius={8} pathOptions={{color:u.status==="online"?"#16a34a":"#e11d48"}} eventHandlers={{click:()=>setSelected(u)}}><Popup><b>{u.name}</b><br/>{u.city} (approx.)<br/>{u.status}</Popup></CircleMarker>)}</MapContainer></div>
    </div>
    {selected&&<div className="card detail"><b>{selected.name}</b><span>{selected.email}</span><span>Location: {selected.city}, India (approx.)</span><span>Last active: {selected.last}</span><button className="outline" onClick={()=>setSelected(null)}>Close</button></div>}
  </section>
}

const Profile=({user})=><section className="page"><div className="card profile"><div className="big-avatar">{(user.name||"U")[0]}</div><h1>{user.name}</h1><p>{user.email}</p><p>{user.mobile||"Mobile not added"}</p></div></section>;
const Settings=()=> <section className="page"><div className="card settings"><h1>Settings</h1><label className="check"><input type="checkbox" defaultChecked/> Auto-save projects</label><label className="check"><input type="checkbox" defaultChecked/> Live preview</label><label className="check"><input type="checkbox"/> Relay notifications</label><p className="muted">Production deployment should use HTTPS, secure sessions, server-side validation and explicit location consent.</p></div></section>;

createRoot(document.getElementById("root")).render(<App/>);
