(function(){
"use strict";
var BASE="https://www.mawidna.com/mawi-product/";

var ANALYTES=[
  {id:"hdna",name:"Human genomic DNA",low:"human genomic DNA",samples:["buccal","saliva"],assays:["array","ngs","sanger"],dna:true},
  {id:"hrna",name:"Human RNA (gene expression)",low:"human RNA (gene expression)",samples:["buccal"],assays:["qpcr","array","rnaseq"]},
  {id:"multi",name:"DNA, RNA and protein from one sample",low:"DNA, RNA and protein from one sample",samples:["buccal"],assays:["rnaseq","qpcr","array","prot"]},
  {id:"forensic",name:"Forensic or reference DNA",low:"forensic or reference DNA",samples:["buccal","touch"],assays:["str"],dna:true},
  {id:"adna",name:"Animal DNA",low:"animal DNA",samples:["animal"],assays:["array","ngs"],dna:true},
  {id:"mdna",name:"Microbial DNA (microbiome)",low:"microbial DNA (microbiome)",samples:["fecal","oral","saliva","nasal","skin","vaginal","soil"],assays:["ngs","qpcr","array"]},
  {id:"mrna",name:"Microbial RNA",low:"microbial RNA",samples:["fecal","oral","saliva","nasal","skin","vaginal","soil"],assays:["ngs","qpcr"]}
];
var SAMPLES={buccal:"Buccal (cheek) swab",saliva:"Saliva (spit)",touch:"Touch DNA, blood spots or other body fluids",animal:"Animal oral, nasal or rectal swab",fecal:"Stool (fecal)",oral:"Oral swab",nasal:"Nasal swab",skin:"Skin swab",vaginal:"Vaginal swab",soil:"Soil or surface"};
var ASSAYS={array:"Genotyping or microarray",ngs:"Next-generation sequencing",sanger:"Sanger sequencing",qpcr:"qPCR / RT-PCR",rnaseq:"RNA-seq",str:"STR / ID profiling",prot:"Proteomics (mass spec, ELISA, Western)"};

/* All kit figures from Mawi product pages (see Sources). */
var KITS=[
  {id:"dsc",name:"iSWAB-Discovery",part:"iSWAB-DSC",url:BASE+"iswab-dsc/",an:["hdna"],samples:["buccal","saliva"],assays:["array","ngs","sanger"],vol:"400 µL",inc:"1 swab",y:[2,7],rt:{hdna:60},note:"60 days real time (3 years accelerated)"},
  {id:"d250",name:"iSWAB-DNA-250",part:"iSWAB-DNA-250",url:BASE+"iswab-dna-250/",an:["hdna"],samples:["buccal","saliva"],assays:["array","ngs","sanger"],vol:"600 µL",inc:"2 swabs",y:[5,15],rt:{hdna:60},note:"60 days real time (3 years accelerated)",saliva:"iSPIT funnel sold separately"},
  {id:"d1200",name:"iSWAB-DNA-1200",part:"iSWAB-DNA-1200",url:BASE+"iswab-dna-1200/",an:["hdna"],samples:["buccal","saliva"],assays:["array","ngs","sanger"],vol:"1.0 mL",inc:"4 swabs",y:[10,30],rt:{hdna:60},note:"60 days real time (3 years accelerated)"},
  {id:"id",name:"iSWAB-ID",part:"iSWAB-ID-250",url:BASE+"iswab-id-250/",an:["forensic"],samples:["buccal","touch"],assays:["str"],vol:"Not listed",inc:"Pre-barcoded for chain of custody",y:[2,7],rt:{forensic:60},note:"60 days real time (3 years accelerated)"},
  {id:"anml",name:"iSWAB-Animal",part:"iSWAB-ANML",url:BASE+"iswab-anml-250/",an:["adna"],samples:["animal"],assays:["array","ngs"],vol:"400 µL",inc:"1 swab",y:[2,7],rt:{adna:60},note:"60 days real time (3 years accelerated)"},
  {id:"rna",name:"iSWAB-RNA-v2",part:"iSWAB-RNA-v2",url:BASE+"iswab-rna-v2/",an:["hrna"],samples:["buccal"],assays:["qpcr","array","rnaseq"],vol:"1.0 mL",inc:"4 sterile applicators",y:null,rt:{hrna:28},note:"Up to 4 weeks; several years at -20 to -80 °C"},
  {id:"cells",name:"iSWAB-Cells",part:"iSWAB-Cells-1200",url:BASE+"iswab-cells-1200/",an:["multi","hrna"],samples:["buccal"],assays:["rnaseq","qpcr","array","prot"],vol:"1.0 mL",inc:"4 sterile applicators",y:null,rt:{multi:28,hrna:28},note:"Viable cells up to 4 weeks"},
  {id:"mb",name:"iSWAB-Microbiome",part:"iSWAB-MB-1200",url:BASE+"iswab-mb-1200/",an:["mdna","mrna"],samples:["fecal","oral","saliva","nasal","skin","vaginal","soil"],assays:["ngs","qpcr","array"],vol:"1.0 mL",inc:"2 swabs; FecesCatcher on request",y:null,rt:{mdna:40,mrna:21},note:"40 days microbial DNA, 21 days microbial RNA",saliva:"Spit funnel sold separately"},
  {id:"mbf",name:"iSWAB-Microbiome with FecesCatcher",part:"iSWAB-MBF-1200",url:BASE+"iswab-mbf-1200/",an:["mdna","mrna"],samples:["fecal"],assays:["ngs","qpcr","array"],vol:"1.0 mL",inc:"1 swab + FecesCatcher",y:null,rt:{mdna:40,mrna:21},note:"40 days microbial DNA; 21 days listed for SARS-CoV-2 RNA",rnaCaveat:true}
];
/* Preference order within an analyte when checks tie. */
var PREF={hdna:["dsc","d250","d1200"],hrna:["rna","cells"],multi:["cells"],forensic:["id"],adna:["anml"],mdna:["mbf","mb"],mrna:["mbf","mb"]};

var PRESETS={
  peds:{analyte:"hdna",sample:"buccal",assay:"array",need:1,days:10},
  exome:{analyte:"hdna",sample:"saliva",assay:"ngs",need:8,days:14},
  gut:{analyte:"mrna",sample:"fecal",assay:"ngs",need:0,days:30},
  forensic:{analyte:"forensic",sample:"touch",assay:"str",need:1,days:45},
  rna:{analyte:"hrna",sample:"buccal",assay:"rnaseq",need:0,days:21}
};

var $=function(id){return document.getElementById(id)};
var el={analyte:$("analyte"),sample:$("sample"),assay:$("assay"),need:$("need"),days:$("days")};
function lc(t){return /^[A-Z][a-z]/.test(t)?t.charAt(0).toLowerCase()+t.slice(1):t}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]})}
function fill(sel,items,val){sel.innerHTML=items.map(function(i){return '<option value="'+i[0]+'">'+esc(i[1])+'</option>'}).join("");if(val&&items.some(function(i){return i[0]===val}))sel.value=val}
function A(){return ANALYTES.filter(function(a){return a.id===el.analyte.value})[0]}

function syncOptions(keepS,keepA){
  var a=A();
  fill(el.sample,a.samples.map(function(s){return [s,SAMPLES[s]]}),keepS);
  fill(el.assay,a.assays.map(function(s){return [s,ASSAYS[s]]}),keepA);
  $("needField").style.display=a.dna?"":"none";
}

/* Evaluate one kit against inputs. status: ok | warn | fail */
function evaluate(k,inp){
  var a=inp.analyte,checks=[];
  var hasA=k.an.indexOf(a)>=0;
  checks.push({what:"Analyte",st:hasA?"ok":"fail",why:hasA?"Listed use covers "+A().low+".":"Not listed for this analyte."});
  var hasS=k.samples.indexOf(inp.sample)>=0;
  checks.push({what:"Sample type",st:hasS?"ok":"fail",why:hasS?(SAMPLES[inp.sample]+" is a listed sample type."+(inp.sample==="saliva"&&k.saliva?" "+k.saliva+".":"")):"Not listed for "+lc(SAMPLES[inp.sample])+"."});
  var hasT=k.assays.indexOf(inp.assay)>=0;
  checks.push({what:"Downstream assay",st:hasT?"ok":"fail",why:hasT?ASSAYS[inp.assay]+" is a listed application.":ASSAYS[inp.assay]+" is not a listed application."});
  if(k.y&&A().dna&&inp.need>0){
    var lo=k.y[0],hi=k.y[1],s,w;
    if(lo>=inp.need){s="ok";w="Published yield "+lo+"–"+hi+" µg covers "+inp.need+" µg even at the low end."}
    else if(hi>=inp.need){s="warn";w=inp.need+" µg sits inside the published "+lo+"–"+hi+" µg range but above its low end, so some samples may fall short."}
    else{s="fail";w="Published yield tops out at "+hi+" µg, below your "+inp.need+" µg."}
    checks.push({what:"DNA yield",st:s,why:w,key:"yield"});
  }else if(k.y&&A().dna){
    checks.push({what:"DNA yield",st:"ok",why:"Published yield "+k.y[0]+"–"+k.y[1]+" µg. Enter your need to size the kit.",key:"yield"});
  }
  var win=k.rt[a];
  if(win){
    var head=win-inp.days,s2,w2;
    if(head>=0){s2="ok";w2="Room-temp window "+win+" days vs your "+inp.days+" days: "+head+" days to spare."}
    else{s2="warn";w2="Your "+inp.days+" days exceeds the published "+win+"-day room-temp window by "+(-head)+" days. Mawi's guidance is -20 to -80 °C for longer storage."}
    if(a==="mrna"&&k.rnaCaveat){s2=s2==="ok"?"warn":s2;w2+=" This kit's page lists the 21 days for SARS-CoV-2 RNA, so confirm it applies to your microbial RNA."}
    checks.push({what:"Room-temp stability",st:s2,why:w2,key:"rt",win:win,head:head});
  }
  var f=checks.filter(function(c){return c.st==="fail"}).length,wn=checks.filter(function(c){return c.st==="warn"}).length;
  return {kit:k,checks:checks,fails:f,warns:wn,status:f?"fail":(wn?"warn":"ok")};
}

function read(){
  return {analyte:el.analyte.value,sample:el.sample.value,assay:el.assay.value,
    need:Math.max(0,parseFloat(el.need.value)||0),days:Math.max(0,parseInt(el.days.value,10)||0)};
}

function rank(inp){
  var pref=PREF[inp.analyte]||[];
  var res=KITS.map(function(k){return evaluate(k,inp)});
  res.sort(function(x,y){
    var ax=x.kit.an.indexOf(inp.analyte)>=0?0:1, ay=y.kit.an.indexOf(inp.analyte)>=0?0:1;
    if(ax!==ay)return ax-ay;
    if(x.fails!==y.fails)return x.fails-y.fails;
    if(x.warns!==y.warns)return x.warns-y.warns;
    var px=pref.indexOf(x.kit.id),py=pref.indexOf(y.kit.id);
    return (px<0?99:px)-(py<0?99:py);
  });
  return res;
}

var ST={ok:["Pass","v-ok"],warn:["Check","v-warn"],fail:["No fit","v-fail"]};
var VERDICT={ok:"Fits on every published check",warn:"Fits, with one or more checks to confirm",fail:"No iSWAB kit fits every check"};

function render(){
  var inp=read(),a=A(),list=rank(inp),best=list[0],k=best.kit;
  var r=$("result");
  r.innerHTML='<span class="label">Recommended existing kit</span>'+
    '<div class="kit">'+esc(k.name)+'</div><div class="part">Part number '+esc(k.part)+' · '+esc(k.vol)+' buffer · '+esc(k.inc)+'</div>'+
    '<span class="pill verdict '+ST[best.status][1]+'">'+VERDICT[best.status]+'</span>'+
    '<ul class="checks">'+best.checks.map(function(c){return '<li><span class="pill st '+ST[c.st][1]+'">'+ST[c.st][0]+'</span><div><div class="what">'+esc(c.what)+'</div><div class="why">'+esc(c.why)+'</div></div></li>'}).join("")+'</ul>'+
    '<div class="links"><a class="btn btn-primary" href="'+k.url+'">Product page, IFU and data sheet</a></div>';

  /* Why */
  var why=[];
  var same=list.filter(function(x){return x.kit.an.indexOf(inp.analyte)>=0});
  if(a.dna&&a.id==="hdna"){
    var rng=same.slice().sort(function(p,q){return p.kit.y[0]-q.kit.y[0]}).map(function(x){return x.kit.name+" "+x.kit.y[0]+"–"+x.kit.y[1]+" µg"}).join(", ");
    if(inp.need>0){
      why.push(best.checks.some(function(c){return c.key==="yield"&&c.st==="ok"})
        ? "Your "+inp.need+" µg need drives the choice. Published yields: "+rng+". This is the smallest kit whose low end still covers your need."
        : "No human DNA kit covers "+inp.need+" µg at the low end of its published range ("+rng+"). This is the closest fit.");
    }else why.push("All three human DNA kits fit your sample and assay. With no DNA need entered, the pick is the smallest kit. Enter your need to size it.");
  }else if(same.length>1){
    var others=same.slice(1).map(function(x){return x.kit.name}).join(", ");
    why.push(k.name+" ranks ahead of "+others+(inp.analyte==="mdna"||inp.analyte==="mrna"?(inp.sample==="fecal"?" because it ships with a FecesCatcher for stool.":" because "+others+" is listed for stool only."):(k.id==="rna"?" because it is the RNA-specific kit; iSWAB-Cells also covers RNA when you need DNA and protein from the same sample.":".")));
  }else why.push(k.name+" is the only iSWAB kit listed for "+a.low+".");
  var rt=best.checks.filter(function(c){return c.key==="rt"})[0];
  if(rt) why.push(rt.head>=0?"Stability is not the constraint: "+rt.head+" days of room-temp headroom.":"Stability is the constraint: plan freezing on arrival or a faster shipping lane.");
  $("why").innerHTML=why.map(function(t){return "<p>"+esc(t)+"</p>"}).join("<br>");

  /* Ask */
  var ask=["Pilot "+k.name+" with your own extraction kit and "+lc(ASSAYS[inp.assay])+" before scaling."];
  if(best.checks.some(function(c){return c.key==="yield"&&c.st!=="ok"}))ask.push("Ask for typical yield data in a population like yours, since your need sits above the low end of the published range.");
  if(rt&&rt.head<0)ask.push("Confirm the freeze-on-arrival protocol (-20 to -80 °C) for your transit time.");
  if(inp.analyte==="mrna"&&k.rnaCaveat)ask.push("Confirm the room-temp window for microbial RNA in the FecesCatcher kit.");
  ask.push("Get per-sample pricing at your volume, plus the rack versus individually packed format.");
  ask.push("If participants self-collect, ask about Mawi's listed customization: editable IFU files, custom barcode labels and white-box kits.");
  $("ask").innerHTML=ask.map(function(t){return "<li>"+esc(t)+"</li>"}).join("");

  /* Summary */
  var yc=best.checks.filter(function(c){return c.key==="yield"})[0];
  var s="For "+a.low+" from "+lc(SAMPLES[inp.sample])+" going to "+lc(ASSAYS[inp.assay])+", the closest existing kit is "+k.name+" ("+k.part+"). ";
  if(k.y)s+="Published yield is "+k.y[0]+"–"+k.y[1]+" µg"+(inp.need>0&&a.dna?" against a "+inp.need+" µg need":"")+". ";
  if(rt)s+="Its published room-temp window is "+rt.win+" days against "+inp.days+" days in transit and queue"+(rt.head>=0?".":", so samples should be frozen on arrival.")+" ";
  s+="Next step: pilot it with our extraction method and assay. Product page: "+k.url;
  $("summaryText").textContent=s;$("copied").textContent="";

  /* Table */
  var cols=same.length?same:[best];
  $("cmpSub").textContent="Every iSWAB kit listed for "+a.low+", checked against your inputs. Figures are as published by Mawi.";
  var rows=[
    ["Fit for your inputs",function(x){return '<span class="mini '+ST[x.status][1]+'">'+(x.status==="ok"?"Fits":x.status==="warn"?"Check":"No fit")+'</span>'}],
    ["Part number",function(x){return esc(x.kit.part)}],
    ["Buffer volume",function(x){return esc(x.kit.vol)}],
    ["Included",function(x){return esc(x.kit.inc)}],
    ["Sample types",function(x){return esc(x.kit.samples.map(function(s){return SAMPLES[s]}).join("; "))}],
    ["Listed assays",function(x){return esc(x.kit.assays.map(function(s){return ASSAYS[s]}).join("; "))}],
    ["DNA yield",function(x){return x.kit.y?x.kit.y[0]+"–"+x.kit.y[1]+" µg":"Not stated"}],
    ["Room-temp window",function(x){return esc(x.kit.note)}],
    ["Headroom at "+inp.days+" days",function(x){var c=x.checks.filter(function(c){return c.key==="rt"})[0];return c?(c.head>=0?c.head+" days":'<span class="mini v-warn">'+(-c.head)+" days over</span>"):"—"}]
  ];
  var bestId=best.kit.id;
  var html='<thead><tr><th scope="col"><span class="label">Published spec</span></th>'+cols.map(function(x){return '<th scope="col" class="'+(x.kit.id===bestId?"pick":"")+'">'+esc(x.kit.name)+(x.kit.id===bestId?' <span class="mini v-ok">Pick</span>':'')+'</th>'}).join("")+'</tr></thead><tbody>'+
    rows.map(function(r){return '<tr><th scope="row">'+esc(r[0])+'</th>'+cols.map(function(x){return '<td class="'+(x.kit.id===bestId?"pick":"")+'">'+r[1](x)+'</td>'}).join("")+'</tr>'}).join("")+'</tbody>';
  $("cmp").innerHTML=html;
}

function setPreset(id){
  var p=PRESETS[id];if(!p)return;
  el.analyte.value=p.analyte;syncOptions(p.sample,p.assay);
  el.need.value=p.need;el.days.value=p.days;
  document.querySelectorAll(".chip").forEach(function(c){c.setAttribute("aria-pressed",c.dataset.preset===id?"true":"false")});
  render();
}
function clearPreset(){document.querySelectorAll(".chip").forEach(function(c){c.setAttribute("aria-pressed","false")})}

fill(el.analyte,ANALYTES.map(function(a){return [a.id,a.name]}));
el.analyte.addEventListener("change",function(){syncOptions();clearPreset();render()});
["sample","assay","need","days"].forEach(function(k){el[k].addEventListener("input",function(){clearPreset();render()});el[k].addEventListener("change",render)});
$("form").addEventListener("submit",function(e){e.preventDefault()});
document.querySelectorAll(".chip").forEach(function(c){c.addEventListener("click",function(){setPreset(c.dataset.preset)})});
$("copyBtn").addEventListener("click",function(){
  var t=$("summaryText").textContent;
  try{navigator.clipboard.writeText(t).then(function(){$("copied").textContent="Copied"},function(){$("copied").textContent="Copy blocked here; select the text above instead"})}
  catch(e){$("copied").textContent="Copy blocked here; select the text above instead"}
});

var src=[["Mawi DNA Technologies: all products","https://www.mawidna.com/all-product/"]].concat(KITS.map(function(k){return ["Mawi product page: "+k.name,k.url]}));
$("sources").innerHTML=src.map(function(s){return '<li><a href="'+s[1]+'">'+esc(s[0])+'</a></li>'}).join("");

setPreset("exome");
})();
