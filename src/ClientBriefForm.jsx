import { useState } from "react";
const STEPS = [
  { id:1, label:"專案基本資訊", icon:"📋" },
  { id:2, label:"研究範圍",     icon:"📐" },
  { id:3, label:"研究主題",     icon:"🎯" },
  { id:4, label:"消費者輪廓",   icon:"👥" },
  { id:5, label:"關鍵字設定",   icon:"🔍" },
  { id:6, label:"分析深度",     icon:"📊" },
  { id:7, label:"交付需求",     icon:"📦" },
];
const PLATFORMS    = ["Facebook","Instagram","Threads","YouTube","Forum（論壇）","新聞媒體","部落格"];
const PURPOSES     = ["品牌形象健檢","特定產品／服務評價","競品比較分析","危機事件追蹤","行銷活動成效評估","消費者洞察研究"];
const MODULES      = ["聲量趨勢分析","平台聲量分佈","熱門話題歸納","關鍵意見領袖（KOL）分析","情緒／情感分析","競品比較"];
const DELIVERABLES = ["PDF 報告","PPT 簡報","Excel 原始數據","Word 文件"];
const AUDIENCES    = ["行銷部門","高階主管","產品部門","公關部門","外部合作夥伴"];
const INDUSTRIES   = [
  {value:"auto",      label:"自動偵測（依品牌名推測）"},
  {value:"insurance", label:"保險業"},
  {value:"fmcg",      label:"快消品／食品"},
  {value:"tech",      label:"科技業"},
  {value:"finance",   label:"金融業"},
  {value:"other",     label:"其他"},
];
const NOISE_TYPES  = [
  {key:"lottery",       label:"抽獎／贈品文",  level:"通用",  group:"base" },
  {key:"recruit",       label:"徵才求職",       level:"通用",  group:"base" },
  {key:"live",          label:"直播帶貨",       level:"通用",  group:"base" },
  {key:"seo_spam",      label:"SEO 垃圾內容",  level:"通用",  group:"base" },
  {key:"politics",      label:"政治人物",       level:"強",    group:"base" },
  {key:"finance",       label:"財經股票",       level:"強",    group:"base" },
  {key:"social",        label:"社會新聞",       level:"強",    group:"base" },
  {key:"realestate",    label:"房產相關",       level:"強",    group:"base" },
  {key:"entertainment", label:"娛樂追星",       level:"強",    group:"base" },
  {key:"basketball",    label:"籃球體育",       level:"產業",  group:"insurance" },
  {key:"blood_donation",label:"捐血活動",       level:"產業",  group:"insurance" },
];
const LEVEL_COLOR = {"通用":"#94a3b8","強":"#ef4444","產業":"#8b5cf6"};
let _uid = 1;
const uid = () => _uid++;

function computeDateRange(range, customRange) {
  const end = new Date();
  const start = new Date();
  const monthMap = {"3m":3,"6m":6,"12m":12,"24m":24};
  if (monthMap[range]) {
    start.setMonth(start.getMonth() - monthMap[range]);
  } else if (range === "custom" && customRange) {
    return customRange;
  } else {
    start.setFullYear(start.getFullYear() - 1);
  }
  const fmt = d => `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  return `${fmt(start)} ~ ${fmt(end)}`;
}

function Field({label,required,hint,note,children}){return(
  <div style={{marginBottom:20}}>
    <label style={{display:"block",fontSize:13,fontWeight:700,color:"#1e293b",
      marginBottom:hint||note?4:7,letterSpacing:0.2}}>
      {label}{required&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}
    </label>
    {hint&&<div style={{fontSize:12,color:"#64748b",marginBottom:5,lineHeight:1.5}}>{hint}</div>}
    {note&&<div style={{fontSize:11.5,color:"#92400e",background:"#fef3c7",
      border:"1px solid #fde68a",borderRadius:6,padding:"5px 10px",marginBottom:7,lineHeight:1.5}}>{"⚠️"} {note}</div>}
    {children}
  </div>
);}
function Input({value,onChange,placeholder,multiline,rows=3}){
  const s={width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e2e8f0",
    fontSize:14,color:"#1e293b",background:"#fff",outline:"none",boxSizing:"border-box",
    fontFamily:"inherit",resize:multiline?"vertical":"none"};
  return multiline
    ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s}/>
    :<input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>;
}
function Pills({options,value=[],onChange}){
  const toggle=k=>onChange(value.includes(k)?value.filter(x=>x!==k):[...value,k]);
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {options.map(opt=>{
        const key=typeof opt==="object"?opt.key:opt;
        const label=typeof opt==="object"?opt.label:opt;
        const sel=value.includes(key);
        return(<button key={key} onClick={()=>toggle(key)} style={{
          padding:"6px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",
          fontWeight:sel?600:400,border:`1.5px solid ${sel?"#0f172a":"#e2e8f0"}`,
          background:sel?"#0f172a":"#fff",color:sel?"#fff":"#64748b",transition:"all 0.15s"
        }}>{label}</button>);
      })}
    </div>
  );
}
function Radio({options,value,onChange}){return(
  <div style={{display:"flex",flexDirection:"column",gap:8}}>
    {options.map(opt=>(
      <label key={opt.value} onClick={()=>onChange(opt.value)} style={{
        display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"10px 14px",
        borderRadius:8,border:`1.5px solid ${value===opt.value?"#0f172a":"#e2e8f0"}`,
        background:value===opt.value?"#f8fafc":"#fff",transition:"all 0.15s"
      }}>
        <div style={{width:16,height:16,borderRadius:"50%",marginTop:2,flexShrink:0,
          border:`2px solid ${value===opt.value?"#0f172a":"#cbd5e1"}`,
          background:value===opt.value?"#0f172a":"#fff",
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          {value===opt.value&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{opt.label}</div>
          {opt.sub&&<div style={{fontSize:12,color:"#64748b",marginTop:2,lineHeight:1.4}}>{opt.sub}</div>}
        </div>
      </label>
    ))}
  </div>
);}
function TagInput({value=[],onChange,placeholder}){
  const [inp,setInp]=useState("");
  const add=()=>{const t=inp.trim();if(t&&!value.includes(t))onChange([...value,t]);setInp("");};
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:7}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
          placeholder={placeholder} style={{flex:1,padding:"8px 12px",borderRadius:8,fontSize:14,
            border:"1.5px solid #e2e8f0",outline:"none",fontFamily:"inherit"}}/>
        <button onClick={add} style={{padding:"8px 14px",borderRadius:8,background:"#0f172a",
          color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>新增</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {value.map(v=>(
          <span key={v} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",
            borderRadius:20,fontSize:13,background:"#f1f5f9",color:"#334155",fontWeight:500}}>
            {v}
            <button onClick={()=>onChange(value.filter(x=>x!==v))} style={{
              background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:14,padding:0,lineHeight:1}}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
function YesNo({value,onChange,yesLabel="是",noLabel="否"}){return(
  <div style={{display:"flex",gap:8}}>
    {[{v:"yes",l:yesLabel},{v:"no",l:noLabel}].map(({v,l})=>(
      <button key={v} onClick={()=>onChange(v)} style={{
        padding:"7px 22px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"inherit",
        fontWeight:value===v?700:400,border:`1.5px solid ${value===v?"#0f172a":"#e2e8f0"}`,
        background:value===v?"#0f172a":"#fff",color:value===v?"#fff":"#64748b",transition:"all 0.15s"
      }}>{l}</button>
    ))}
  </div>
);}
function BrandCard({brand,onChange,onRemove,index}){
  const [open,setOpen]=useState(true);
  const upd=(k,v)=>onChange({...brand,[k]:v});
  return(
    <div style={{border:"1.5px solid #e2e8f0",borderRadius:10,marginBottom:10,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
        background:"#f8fafc",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{width:22,height:22,borderRadius:"50%",background:"#334155",
          color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {index+1}
        </div>
        <span style={{fontSize:13,fontWeight:700,color:"#1e293b",flex:1}}>
          {brand.name||`品牌 ${index+1}`}
        </span>
        <button onClick={e=>{e.stopPropagation();onRemove();}} style={{
          background:"none",border:"none",cursor:"pointer",color:"#94a3b8",
          fontSize:12,padding:"2px 6px",borderRadius:4,fontFamily:"inherit"}}>移除</button>
        <span style={{color:"#94a3b8",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"14px 16px"}}>
          <Field label="品牌／監測對象名稱" required>
            <Input value={brand.name} onChange={v=>upd("name",v)} placeholder="例：aaa 品牌"/>
          </Field>
          <Field label="分析面向" hint="若此層有多個面向，請逐一列出">
            <Input value={brand.dimension} onChange={v=>upd("dimension",v)} placeholder="例：品牌形象 / 服務體驗"/>
          </Field>
          <Field label="核心關鍵字（A 層）" required hint="品牌正式名稱、簡稱、英文名">
            <TagInput value={brand.coreKeywords} onChange={v=>upd("coreKeywords",v)} placeholder="輸入後按 Enter"/>
          </Field>
          <Field label="B 層情境關鍵字（選填）" hint="消費者評價情境詞">
            <Input value={brand.contextKeywords} onChange={v=>upd("contextKeywords",v)} placeholder="例：評價 OR 推薦 OR 心得"/>
          </Field>
          <Field label="品牌客製化排除詞" hint="此品牌特有的雜訊來源">
            <Input multiline value={brand.customExcludes} onChange={v=>upd("customExcludes",v)}
              placeholder={"例：-集團子公司 -無關事業體\n-地名混淆詞"} rows={3}/>
          </Field>
          <Field label="備註">
            <Input value={brand.notes} onChange={v=>upd("notes",v)} placeholder="例：排除同集團其他事業體"/>
          </Field>
        </div>
      )}
    </div>
  );
}
function LayerCard({layer,onChange,onRemove,layerIndex}){
  const [open,setOpen]=useState(true);
  const upd=(k,v)=>onChange({...layer,[k]:v});
  const addBrand=()=>onChange({...layer,brands:[...layer.brands,{
    id:uid(),name:"",dimension:"",coreKeywords:[],contextKeywords:"",customExcludes:"",notes:""
  }]});
  const updateBrand=(id,val)=>onChange({...layer,brands:layer.brands.map(b=>b.id===id?val:b)});
  const removeBrand=(id)=>onChange({...layer,brands:layer.brands.filter(b=>b.id!==id)});
  const accentColors=["#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444"];
  const color=accentColors[layerIndex%accentColors.length];
  return(
    <div style={{border:`2px solid ${color}30`,borderRadius:12,marginBottom:16,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
        background:`${color}08`,cursor:"pointer",borderBottom:`1px solid ${color}20`}}
        onClick={()=>setOpen(o=>!o)}>
        <div style={{width:26,height:26,borderRadius:8,background:color,
          color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          L{layerIndex+1}
        </div>
        <span style={{fontSize:14,fontWeight:700,color:"#1e293b",flex:1}}>
          {layer.name||`分析層 ${layerIndex+1}`}
        </span>
        <span style={{fontSize:11,color:color,fontWeight:600,fontFamily:"sans-serif"}}>
          {layer.brands.length} 個品牌
        </span>
        <button onClick={e=>{e.stopPropagation();onRemove();}} style={{
          background:"none",border:`1px solid #fca5a5`,borderRadius:6,cursor:"pointer",
          color:"#ef4444",fontSize:11,padding:"3px 8px",fontFamily:"inherit"}}>移除此層</button>
        <span style={{color:"#94a3b8",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Field label="層名稱" required>
              <Input value={layer.name} onChange={v=>upd("name",v)} placeholder="例：第一層：競品分析"/>
            </Field>
            <Field label="層目的說明">
              <Input value={layer.description} onChange={v=>upd("description",v)} placeholder="例：多品牌聲量比較"/>
            </Field>
          </div>
          <Field label="本層分析面向" hint="用頓號或換行分隔">
            <Input multiline value={layer.dimensions} onChange={v=>upd("dimensions",v)}
              placeholder={"例：\n總體聲量趨勢比較\n平台聲量來源分布\n熱門文章列表"} rows={3}/>
          </Field>
          <div style={{marginTop:4}}>
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>
              品牌關鍵字設定（{layer.brands.length} 組）
            </div>
            {layer.brands.map((b,i)=>(
              <BrandCard key={b.id} brand={b} index={i}
                onChange={val=>updateBrand(b.id,val)}
                onRemove={()=>removeBrand(b.id)}/>
            ))}
            <button onClick={addBrand} style={{
              width:"100%",padding:"9px 0",borderRadius:8,
              border:"1.5px dashed #cbd5e1",background:"#f8fafc",
              color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:500}}>
              + 新增品牌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function S1({d,set}){return(
  <>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
    <Field label="客戶名稱" required><Input value={d.clientName} onChange={v=>set("clientName",v)} placeholder="例：aaa 公司"/></Field>
    <Field label="聯絡窗口"><Input value={d.contact} onChange={v=>set("contact",v)} placeholder="例：PM xxx"/></Field>
  </div>
  <Field label="專案名稱" required><Input value={d.projectName} onChange={v=>set("projectName",v)} placeholder="例：bbb 聲量分析專案"/></Field>
  <Field label="填表日期"><Input value={d.formDate} onChange={v=>set("formDate",v)} placeholder="例：YYYY/MM/DD"/></Field>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
    <Field label="提案日期"><Input value={d.pitchDate} onChange={v=>set("pitchDate",v)} placeholder="YYYY/MM/DD"/></Field>
    <Field label="交付日期"><Input value={d.deadline} onChange={v=>set("deadline",v)} placeholder="YYYY/MM/DD"/></Field>
    <Field label="自訂時間區間"><Input value={d.customRange} onChange={v=>set("customRange",v)} placeholder="例：YYYY/MM/DD ~ YYYY/MM/DD"/></Field>
  </div>
  <Field label="預設時間範圍">
    <Radio value={d.timeRange} onChange={v=>set("timeRange",v)} options={[
      {value:"3m",label:"近 3 個月"},{value:"6m",label:"近 6 個月"},
      {value:"12m",label:"近 12 個月"},{value:"24m",label:"近 24 個月"},
      {value:"custom",label:"自訂（見上方欄位）"},
    ]}/>
  </Field>
  </>
);}
function S2({d,set}){return(
  <>
  <Field label="納入分析的平台（可複選）" required><Pills options={PLATFORMS} value={d.platforms} onChange={v=>set("platforms",v)}/></Field>
  <Field label="核心研究目的（可複選）" required><Pills options={PURPOSES} value={d.purposes} onChange={v=>set("purposes",v)}/></Field>
  <Field label="產業類別" hint="影響自動載入的排除詞庫，選「自動偵測」由腳本依品牌名推測">
    <Radio value={d.industry} onChange={v=>set("industry",v)} options={
      INDUSTRIES.map(i=>({value:i.value,label:i.label}))
    }/>
  </Field>
  <Field label="是否需要競品分析？" note="競品數量會影響報價，請確認後填寫">
    <YesNo value={d.needCompetitors} onChange={v=>set("needCompetitors",v)}/>
    {d.needCompetitors==="yes"&&<div style={{marginTop:10}}><TagInput value={d.competitors} onChange={v=>set("competitors",v)} placeholder="輸入競品名稱後按 Enter"/></div>}
  </Field>
  <Field label="是否需要提供策略建議？">
    <Radio value={d.strategy} onChange={v=>set("strategy",v)} options={[
      {value:"data",label:"僅需客觀數據洞察呈現",sub:"不含主觀策略判斷"},
      {value:"strategy",label:"需包含策略建議",sub:"由分析師加入行動建議"},
    ]}/>
  </Field>
  </>
);}
function S3({d,set}){return(
  <>
  <Field label="是否有特定想了解的品牌面向？" hint="例：服務品質、產品評價、企業形象">
    <Input multiline value={d.brandAspects} onChange={v=>set("brandAspects",v)}
      placeholder="例：服務體驗、產品評價、品牌形象" rows={2}/>
  </Field>
  <Field label="是否有近期特定事件需重點追蹤？">
    <YesNo value={d.hasEvents} onChange={v=>set("hasEvents",v)}/>
    {d.hasEvents==="yes"&&<div style={{marginTop:10}}><Input multiline value={d.specificEvents} onChange={v=>set("specificEvents",v)} placeholder="例：近期重大事件、新品上市" rows={2}/></div>}
  </Field>
  <Field label="趨勢圖事件高點標示方式">
    <Radio value={d.trendEventMode} onChange={v=>set("trendEventMode",v)} options={[
      {value:"ai_all",label:"綜合渠道，由 AI 推測事件"},
      {value:"top1",  label:"依比例最高渠道，標出具體事件與摘要"},
      {value:"top3",  label:"依比例前三高渠道，各自標記具體事件"},
    ]}/>
  </Field>
  <Field label="敏感議題或需避免的內容">
    <Input multiline value={d.sensitive} onChange={v=>set("sensitive",v)} placeholder="例：避免提及特定敏感事件" rows={2}/>
  </Field>
  </>
);}
function S4({d,set}){return(
  <>
  <Field label="是否需要推測消費者輪廓？"><YesNo value={d.needConsumerProfile} onChange={v=>set("needConsumerProfile",v)}/></Field>
  {d.needConsumerProfile==="yes"&&<>
    <Field label="特定想關注的消費者族群">
      <Input multiline value={d.targetSegment} onChange={v=>set("targetSegment",v)} placeholder="例：目標消費族群描述" rows={2}/>
    </Field>
    <Field label="希望著重了解的消費者輪廓項目">
      <Input multiline value={d.profileItems} onChange={v=>set("profileItems",v)} placeholder="例：年齡層分佈、購買動機" rows={2}/>
    </Field>
  </>}
  </>
);}
function S5({d,set}){
  const addLayer=()=>set("analysisLayers",[...d.analysisLayers,{
    id:uid(),name:"",description:"",dimensions:"",
    brands:[{id:uid(),name:"",dimension:"",coreKeywords:[],contextKeywords:"",customExcludes:"",notes:""}]
  }]);
  const updateLayer=(id,val)=>set("analysisLayers",d.analysisLayers.map(l=>l.id===id?val:l));
  const removeLayer=(id)=>set("analysisLayers",d.analysisLayers.filter(l=>l.id!==id));
  const visibleNoiseTypes = NOISE_TYPES.filter(n =>
    n.group === "base" || n.group === d.industry || d.industry === "auto"
  );
  return(
    <>
    <div style={{background:"#f8fafc",borderRadius:10,padding:"16px 18px",marginBottom:24,
      border:"1.5px solid #e2e8f0"}}>
      <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:14,letterSpacing:0.2}}>
        {"⚙️"} 全域篩選設定（套用至所有分析層）
      </div>
      <Field label="關鍵字濾除強度" required>
        <Radio value={d.filterLevel} onChange={v=>set("filterLevel",v)} options={[
          {value:"strong",label:"強",sub:"精準報告交付，精準度 >= 95%"},
          {value:"medium",label:"中等",sub:"日常監測與趨勢追蹤，精準度 >= 85%"},
          {value:"weak",  label:"弱",sub:"初期探索，精準度 >= 70%"},
          {value:"auto",  label:"AI 自動判斷",sub:"依專案目的與精準度期望自動選擇"},
        ]}/>
      </Field>
      <Field label="內建排除雜訊類型（可複選）" hint="依產業自動顯示追加類型">
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {visibleNoiseTypes.map(n=>{
            const sel=(d.noiseTypes||[]).includes(n.key);
            const col=LEVEL_COLOR[n.level]||"#94a3b8";
            return <button key={n.key}
              onClick={()=>{const c=d.noiseTypes||[];set("noiseTypes",sel?c.filter(x=>x!==n.key):[...c,n.key]);}}
              style={{padding:"6px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                fontWeight:sel?600:400,border:`1.5px solid ${sel?col:"#e2e8f0"}`,
                background:sel?col+"18":"#fff",color:sel?col:"#64748b",transition:"all 0.15s"}}>
              {n.label}<span style={{marginLeft:5,fontSize:10,opacity:0.7}}>{n.level}</span>
            </button>;
          })}
        </div>
      </Field>
      <Field label="全域自訂排除詞" hint="逗號分隔，套用至所有品牌的內容篩選">
        <Input value={d.globalCustomExcludes} onChange={v=>set("globalCustomExcludes",v)}
          placeholder="例：壽喜燒, 壽司, 蠟筆小新, 吃到飽, 火鍋"/>
      </Field>
      <Field label="抽獎文處理方式" note="如品牌有大量抽獎文章，建議保留或分開輸出">
        <Radio value={d.lotteryHandling} onChange={v=>set("lotteryHandling",v)} options={[
          {value:"exclude",  label:"排除",sub:"僅保留有效討論"},
          {value:"include",  label:"保留",sub:"需分析促銷活動聲量"},
          {value:"separate", label:"分開輸出",sub:"乾淨資料與抽獎文各自分析"},
        ]}/>
      </Field>
      <Field label="AI 自動校準" hint="自動分析可疑高頻詞，建議追加排除（適合競品沒填排除詞時使用）">
        <YesNo value={d.autoCalibrate} onChange={v=>set("autoCalibrate",v)}/>
      </Field>
      <Field label="語境排除規則" hint="排除含品牌名但語境無關的文章">
        <YesNo value={d.hasContextExclude} onChange={v=>set("hasContextExclude",v)}/>
        {d.hasContextExclude==="yes"&&<div style={{marginTop:10}}>
          <Input multiline value={d.contextExcludes} onChange={v=>set("contextExcludes",v)}
            placeholder={"每行一條規則，格式：\n當提到 [品牌詞] 但同時出現 [無關詞A/無關詞B] → 排除\n當提到 [產品詞] 但同時出現 [同名異義詞] → 排除\n\n或自由描述排除規則"} rows={4}/>
        </div>}
      </Field>
    </div>
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{"📑"} 分析層設定</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>
            每個分析層對應一個報告章節，可包含多個品牌各自的關鍵字組合
          </div>
        </div>
        <button onClick={addLayer} style={{
          padding:"8px 18px",borderRadius:8,border:"none",background:"#0f172a",
          color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>
          + 新增分析層
        </button>
      </div>
      {d.analysisLayers.length===0&&(
        <div style={{textAlign:"center",padding:"32px",borderRadius:10,
          border:"1.5px dashed #cbd5e1",color:"#94a3b8",fontSize:13}}>
          尚未設定分析層，點擊「新增分析層」開始設定
        </div>
      )}
      {d.analysisLayers.map((layer,i)=>(
        <LayerCard key={layer.id} layer={layer} layerIndex={i}
          onChange={val=>updateLayer(layer.id,val)}
          onRemove={()=>removeLayer(layer.id)}/>
      ))}
    </div>
    {d.analysisLayers.length===0&&(
      <button onClick={()=>{
        set("analysisLayers",[
          {id:uid(),name:"競品分析層",description:"多品牌聲量比較",
            dimensions:"總體聲量趨勢比較\n平台聲量來源分布\n熱門文章列表\n熱門 KOL 識別",
            brands:[{id:uid(),name:"",dimension:"",coreKeywords:[],contextKeywords:"",customExcludes:"",notes:""}]},
          {id:uid(),name:"深度洞察層",description:"主品牌深度分析",
            dimensions:"整體品牌形象\n業務員形象\n服務形象",
            brands:[{id:uid(),name:"",dimension:"整體品牌形象",coreKeywords:[],contextKeywords:"",customExcludes:"",notes:""}]},
        ]);
      }} style={{width:"100%",padding:"9px 0",borderRadius:8,
        border:"1.5px dashed #bfdbfe",background:"#eff6ff",color:"#3b82f6",
        cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:500}}>
        {"📋"} 套用範例架構
      </button>
    )}
    </>
  );
}
function S6({d,set}){return(
  <>
  <Field label="需要哪些分析模組？（可複選）"><Pills options={MODULES} value={d.modules} onChange={v=>set("modules",v)}/></Field>
  <Field label="是否需要情緒正負評分析？"><YesNo value={d.needSentiment} onChange={v=>set("needSentiment",v)}/></Field>
  <Field label="分析重點（最多三個）" hint="這次報告最希望回答的核心問題">
    <Input multiline value={d.focusPoints} onChange={v=>set("focusPoints",v)}
      placeholder={"例：\n1. 品牌好感度差異\n2. 業務員口碑\n3. 理賠體驗痛點"} rows={4}/>
  </Field>
  </>
);}
function S7({d,set,onExportDoc,docStatus,onExportMd,mdStatus}){return(
  <>
  <Field label="預期交付格式（可複選）"><Pills options={DELIVERABLES} value={d.deliverables} onChange={v=>set("deliverables",v)}/></Field>
  <Field label="報告主要閱讀對象（可複選）"><Pills options={AUDIENCES} value={d.audiences} onChange={v=>set("audiences",v)}/></Field>
  <Field label="其他補充說明">
    <Input multiline value={d.extraNotes} onChange={v=>set("extraNotes",v)}
      placeholder="例：特殊輸出需求或補充說明" rows={3}/>
  </Field>

  {/* ── Word 輸出 ── */}
  <div style={{marginTop:8,padding:"20px 22px",borderRadius:12,border:"1.5px dashed #cbd5e1",background:"#f8fafc"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
      <div style={{fontSize:28}}>📄</div>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:3}}>輸出 Word 需求確認表</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>
          格式化的 <code style={{background:"#e2e8f0",padding:"1px 5px",borderRadius:3,fontSize:11}}>.docx</code>，適合備存或提供客戶確認
        </div>
      </div>
    </div>
    <button onClick={onExportDoc} disabled={docStatus==="loading"} style={{
      width:"100%",padding:"12px 0",borderRadius:10,border:"none",
      cursor:docStatus==="loading"?"wait":"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",
      background:docStatus==="done"?"#10b981":docStatus==="loading"?"#94a3b8":"linear-gradient(135deg,#1e293b,#334155)",
      color:"#fff",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {docStatus==="loading"?"⏳ 正在產生文件…":docStatus==="done"?"✅ 文件已產生，請看下方對話":"⬇ 產出 Word 需求確認表 (.docx)"}
    </button>
  </div>

  {/* ── Markdown 輸出 ── */}
  <div style={{marginTop:12,padding:"20px 22px",borderRadius:12,border:"1.5px dashed #bfdbfe",background:"#eff6ff"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
      <div style={{fontSize:28}}>📝</div>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:3}}>輸出 Markdown 分析指令</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>
          輸出為 <code style={{background:"#dbeafe",padding:"1px 5px",borderRadius:3,fontSize:11}}>.md</code>，可直接上傳給 AI 作為分析輸入，或存入專案資料夾備查
        </div>
      </div>
    </div>
    <button onClick={onExportMd} style={{
      width:"100%",padding:"12px 0",borderRadius:10,border:"none",
      cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",
      background:mdStatus==="done"?"#10b981":"#3b82f6",
      color:"#fff",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {mdStatus==="done"?"✅ 已下載":"⬇ 下載 Markdown 分析指令 (.md)"}
    </button>
  </div>
  </>
);}
function generateBrief(d){
  const noiseLabels=NOISE_TYPES.filter(n=>(d.noiseTypes||[]).includes(n.key)).map(n=>n.label);
  const dateRange=computeDateRange(d.timeRange, d.customRange);
  const filterMap={strong:"強（≥95%）",medium:"中等（≥85%）",weak:"弱（≥70%）",auto:"AI 自動判斷"};
  const lotteryMap={exclude:"排除",include:"保留",separate:"分開輸出"};
  const trendMap={ai_all:"綜合渠道 AI 推測",top1:"最高渠道標記",top3:"前三渠道各自標記"};
  const industryMap={auto:"自動偵測",insurance:"保險業",fmcg:"快消品",tech:"科技業",finance:"金融業",other:"其他"};
  let layerSection="";
  (d.analysisLayers||[]).forEach((layer,li)=>{
    layerSection+=`\n### 分析層 ${li+1}：${layer.name||"（未命名）"}\n`;
    if(layer.description) layerSection+=`- 目的：${layer.description}\n`;
    if(layer.dimensions)  layerSection+=`- 分析面向：\n${layer.dimensions.split("\n").map(l=>`  • ${l}`).join("\n")}\n`;
    layer.brands.forEach((b,bi)=>{
      layerSection+=`\n  **品牌 ${bi+1}：${b.name||"（未填）"}**`;
      if(b.dimension) layerSection+=` ／ ${b.dimension}`;
      layerSection+="\n";
      if(b.coreKeywords?.length) layerSection+=`  - 核心關鍵字：${b.coreKeywords.join("、")}\n`;
      if(b.contextKeywords)      layerSection+=`  - B 層情境詞：${b.contextKeywords}\n`;
      if(b.customExcludes)       layerSection+=`  - 客製化排除：${b.customExcludes.replace(/\n/g," ")}\n`;
      if(b.notes)                layerSection+=`  - 備註：${b.notes}\n`;
    });
  });
  return`# 社群輿情分析報告｜需求確認表
## 一、專案基本資訊
- 客戶名稱：${d.clientName||"（未填）"}
- 專案名稱：${d.projectName||"（未填）"}
- 聯絡窗口：${d.contact||"未填"}
- 填表日期：${d.formDate||"未填"}
- 提案日期：${d.pitchDate||"未定"} ／ 交付日期：${d.deadline||"未定"}
## 二、研究範圍
- 分析時間：${dateRange}
- 分析平台：${(d.platforms||[]).join("、")||"未指定"}
- 核心目的：${(d.purposes||[]).join("、")||"未指定"}
- 產業類別：${industryMap[d.industry]||"自動偵測"}
- 競品分析：${d.needCompetitors==="yes"?`是，競品：${(d.competitors||[]).join("、")||"（未填）"}`:"否"}
## 三、研究主題
- 品牌面向：${d.brandAspects||"無特定限制"}
- 特定事件：${d.hasEvents==="yes"?(d.specificEvents||"（未填）"):"否"}
- 趨勢標示：${trendMap[d.trendEventMode]||"未指定"}
- 敏感議題：${d.sensitive||"無"}
## 四、消費者輪廓
- 需要推測：${d.needConsumerProfile==="yes"?"是":"否"}
${d.needConsumerProfile==="yes"?`- 目標族群：${d.targetSegment||"無限制"}\n- 著重項目：${d.profileItems||"無限制"}`:""}
## 五、關鍵字設定
### 全域篩選
- 產業類別：${industryMap[d.industry]||"自動偵測"}
- 濾除強度：${filterMap[d.filterLevel]||"未指定"}
- 排除雜訊：${noiseLabels.length?noiseLabels.join("、"):"僅基礎排除"}
- 全域自訂排除詞：${d.globalCustomExcludes||"無"}
- 抽獎文處理：${lotteryMap[d.lotteryHandling]||"未指定"}
- AI 自動校準：${d.autoCalibrate==="yes"?"是":"否"}
- 語境排除：${d.hasContextExclude==="yes"?(d.contextExcludes||"（未填）"):"無"}
${layerSection||"\n（尚未設定分析層）"}
## 六、分析深度
- 分析模組：${(d.modules||[]).join("、")||"未指定"}
- 情緒分析：${d.needSentiment==="yes"?"是":"否"}
- 分析重點：
${(d.focusPoints||"（未填）").split("\n").map(l=>"  "+l).join("\n")}
## 七、交付需求
- 交付格式：${(d.deliverables||[]).join("、")||"未指定"}
- 閱讀對象：${(d.audiences||[]).join("、")||"未指定"}
- 補充說明：${d.extraNotes||"無"}`;
}
export default function ClientBriefForm(){
  const [step,setStep]=useState(1);
  const [copied,setCopied]=useState(false);
  const [showBrief,setShowBrief]=useState(false);
  const [docStatus,setDocStatus]=useState("idle");
  const [mdStatus,setMdStatus]=useState("idle");
  const [data,setData]=useState({
    clientName:"",projectName:"",contact:"",formDate:"",
    pitchDate:"",deadline:"",customRange:"",timeRange:"12m",
    platforms:[],purposes:[],industry:"auto",needCompetitors:"no",competitors:[],strategy:"data",
    brandAspects:"",hasEvents:"no",specificEvents:"",trendEventMode:"",sensitive:"",
    needConsumerProfile:"no",targetSegment:"",profileItems:"",
    filterLevel:"auto",noiseTypes:[],globalCustomExcludes:"",lotteryHandling:"exclude",
    autoCalibrate:"yes",hasContextExclude:"no",contextExcludes:"",
    analysisLayers:[],
    modules:[],needSentiment:"no",focusPoints:"",
    deliverables:[],audiences:[],extraNotes:"",
  });
  const set=(k,v)=>setData(p=>({...p,[k]:v}));
  const brief=generateBrief(data);
  const copy=()=>{navigator.clipboard.writeText(brief).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  const handleExportDoc=async()=>{
    if(docStatus==="loading")return;
    setDocStatus("loading");
    try{
      // 在獨立網頁中，改為下載 Markdown 檔案（Claude Artifact 的 sendPrompt 不可用）
      const blob=new Blob([brief],{type:"text/markdown;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      const clientSlug=(data.clientName||"brief").replace(/\s+/g,"_");
      a.href=url;
      a.download=`${clientSlug}_需求確認表.md`;
      a.click();
      URL.revokeObjectURL(url);
      setDocStatus("done");
    }catch(e){console.error(e);setDocStatus("error");}
  };

  const handleExportMd=()=>{
    const clientSlug=(data.clientName||"client").replace(/\s+/g,"_");
    const projSlug=(data.projectName||"project").replace(/\s+/g,"_");
    const dateSlug=new Date().toISOString().slice(0,10).replace(/-/g,"");
    const filename=`需求確認表_${clientSlug}_${projSlug}_${dateSlug}.md`;
    const blob=new Blob([brief],{type:"text/markdown;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
    setMdStatus("done");
    setTimeout(()=>setMdStatus("idle"),3000);
  };
  const progress=((step-1)/(STEPS.length-1))*100;
  const StepComp=[S1,S2,S3,S4,S5,S6,S7][step-1];
  const totalLayers=data.analysisLayers.length;
  const totalBrands=data.analysisLayers.reduce((s,l)=>s+l.brands.length,0);
  const summary=[
    data.clientName&&`${data.clientName}`,
    data.projectName&&`${data.projectName}`,
    data.industry&&data.industry!=="auto"&&(INDUSTRIES.find(i=>i.value===data.industry)?.label||data.industry),
    totalLayers>0&&`${totalLayers} 層 / ${totalBrands} 品牌組`,
    data.filterLevel&&data.filterLevel!=="auto"&&`濾除：${{strong:"強",medium:"中等",weak:"弱"}[data.filterLevel]}`,
  ].filter(Boolean);
  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",
      fontFamily:"'Georgia','Noto Serif TC',serif",
      display:"flex",justifyContent:"center",padding:"32px 16px"}}>
      <div style={{width:"100%",maxWidth:720}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <h1 style={{fontSize:26,fontWeight:700,color:"#0f172a",margin:0,letterSpacing:-0.5}}>社群輿情分析｜需求確認表</h1>
          <p style={{color:"#64748b",fontSize:13,marginTop:6}}>填寫完成後可複製 AI Brief，或直接產出 Word 文件備存</p>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            {STEPS.map(s=>(
              <button key={s.id} onClick={()=>setStep(s.id)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                background:"none",border:"none",cursor:"pointer",padding:"4px 2px"}}>
                <div style={{width:30,height:30,borderRadius:"50%",display:"flex",
                  alignItems:"center",justifyContent:"center",fontSize:step>s.id?13:14,fontWeight:700,
                  background:step>=s.id?"#0f172a":"#e2e8f0",
                  color:step>=s.id?"#fff":"#94a3b8",transition:"background 0.2s"}}>
                  {step>s.id?"✓":s.id}
                </div>
                <span style={{fontSize:9.5,fontFamily:"sans-serif",
                  color:step===s.id?"#0f172a":"#94a3b8",fontWeight:step===s.id?700:400,
                  textAlign:"center",maxWidth:60,lineHeight:1.2}}>{s.label}</span>
              </button>
            ))}
          </div>
          <div style={{height:3,background:"#e2e8f0",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#0f172a",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:"26px 30px",
          boxShadow:"0 1px 4px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)",marginBottom:14}}>
          <h2 style={{fontSize:17,fontWeight:700,color:"#0f172a",margin:"0 0 20px",
            paddingBottom:12,borderBottom:"1.5px solid #f1f5f9"}}>
            {STEPS[step-1].icon} {STEPS[step-1].label}
          </h2>
          <StepComp d={data} set={set} onExportDoc={handleExportDoc} docStatus={docStatus} onExportMd={handleExportMd} mdStatus={mdStatus}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{
            padding:"10px 24px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",
            color:step===1?"#cbd5e1":"#374151",cursor:step===1?"default":"pointer",
            fontSize:14,fontFamily:"inherit",fontWeight:500}}>← 上一步</button>
          <div style={{display:"flex",gap:8}}>
            {step===STEPS.length&&(
              <button onClick={()=>setShowBrief(v=>!v)} style={{
                padding:"10px 20px",borderRadius:8,border:"1.5px solid #0f172a",
                background:"#fff",color:"#0f172a",cursor:"pointer",
                fontSize:14,fontFamily:"inherit",fontWeight:600}}>
                {showBrief?"收起 Brief":"查看 Brief"}
              </button>
            )}
            {step<STEPS.length&&(
              <button onClick={()=>setStep(s=>s+1)} style={{
                padding:"10px 28px",borderRadius:8,border:"none",background:"#0f172a",
                color:"#fff",cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:600}}>下一步 →</button>
            )}
          </div>
        </div>
        {showBrief&&step===STEPS.length&&(
          <div style={{background:"#0f172a",borderRadius:16,padding:24,marginBottom:16,
            boxShadow:"0 4px 24px rgba(0,0,0,0.18)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{color:"#64748b",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",fontFamily:"sans-serif"}}>AI 分析 Brief</span>
              <button onClick={copy} style={{padding:"6px 18px",borderRadius:6,border:"1px solid #334155",
                background:copied?"#10b981":"#1e293b",color:"#e2e8f0",cursor:"pointer",
                fontSize:12,fontFamily:"sans-serif",transition:"background 0.2s"}}>
                {copied?"✓ 已複製":"複製全文"}
              </button>
            </div>
            <pre style={{color:"#e2e8f0",fontSize:12,lineHeight:1.9,margin:0,
              whiteSpace:"pre-wrap",fontFamily:"'Courier New',monospace"}}>{brief}</pre>
          </div>
        )}
        {summary.length>0&&!showBrief&&(
          <div style={{background:"#fff",borderRadius:10,padding:"12px 16px",
            border:"1.5px solid #e2e8f0",fontSize:12,color:"#475569",
            fontFamily:"sans-serif",display:"flex",flexWrap:"wrap",gap:"6px 14px"}}>
            {summary.map((s,i)=><span key={i}>{s}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
