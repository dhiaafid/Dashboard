// Membuat data contoh sekali saja (generator sama dengan sketsa v2), lalu menyimpannya
// sebagai objek DATA yang rapi. Nanti objek ini diganti dengan data dari Excel ringkas.
"use strict";
const fs = require("fs"), path = require("path");
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(20260928);
const between=(a,b)=>a+(b-a)*R();
function pois(l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=R()}while(p>L);return k-1}
const MON=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep"];
const r1=x=>x==null?null:Math.round(x*10)/10, r2=x=>x==null?null:Math.round(x*100)/100, r3=x=>x==null?null:Math.round(x*1000)/1000;

// Lokasi perkiraan (tingkat kecamatan, dari alamat cabang)
const LOK={
  "Kaligawe":["Kota Semarang",-6.955,110.468],"Pemuda":["Kota Semarang",-6.978,110.414],"Majapahit":["Kota Semarang",-6.996,110.457],
  "Siliwangi":["Kota Semarang",-6.985,110.384],"Gombel":["Kota Semarang",-7.050,110.420],"Pati":["Kab. Pati",-6.760,111.055],
  "Demak":["Kab. Demak",-6.870,110.660],"Karangjati":["Kab. Semarang",-7.185,110.420],
  "Janti":["Kab. Bantul",-7.790,110.410],"Bantul":["Kab. Bantul",-7.825,110.335],"Mlati":["Kab. Sleman",-7.735,110.355],
  "Purwokerto":["Kab. Banyumas",-7.435,109.250],"Magelang":["Kab. Magelang",-7.525,110.220],"Wonosobo":["Kab. Wonosobo",-7.395,109.875],
  "Cilacap":["Kab. Cilacap",-7.720,109.010],"Purbalingga":["Kab. Purbalingga",-7.410,109.330],
  "Slamet Riyadi":["Kota Surakarta",-7.556,110.780],"Ring Road":["Kab. Karanganyar",-7.548,110.875],"Solo Baru":["Kab. Sukoharjo",-7.605,110.815],
  "Tegal":["Kota Tegal",-6.865,109.140],"Pekalongan":["Kota Pekalongan",-6.890,109.690],"Klaten":["Kab. Klaten",-7.690,110.620],
  "Salatiga":["Kota Salatiga",-7.320,110.500],"Brebes":["Kab. Brebes",-6.880,109.000]};
const WHY_LB=["Persiapan closing akhir bulan dan stock opname","Kekurangan dua teknisi, servis menumpuk di akhir pekan","Pameran akhir pekan dan pengiriman unit","Audit internal dan rekonsiliasi dokumen","Perbaikan gedung, admin bekerja di luar jam","Lonjakan servis berkala setelah program diskon"];

const NAMES=[["Kaligawe","Pemuda","Majapahit","Siliwangi","Gombel","Pati","Demak","Karangjati"],["Janti","Bantul","Mlati","Purwokerto","Magelang","Wonosobo","Cilacap","Purbalingga"],["Slamet Riyadi","Ring Road","Solo Baru","Tegal","Pekalongan","Klaten","Salatiga","Brebes"]];
const cabang=[];let idx=0;
NAMES.forEach((g,ai)=>g.forEach(n=>{
  const f=between(.6,1.45);
  const mpp={sales:Math.round(30*f),afs:Math.round(40*f),admin:Math.round(22*f),os:Math.round(18*f)};
  const act={};for(const k in mpp)act[k]=Math.max(1,Math.round(mpp[k]*between(.84,1.07)));
  const mpH=MON.map((_,i)=>{const d=8-i;const o={};for(const k in act)o[k]=Math.max(1,act[k]+Math.round((R()-.45)*d*.6));return o});
  mpH[8]=Object.assign({},act);
  const base=between(.058,.122);
  const gp=MON.map(()=>((act.afs+act.admin+act.os)*4.25)*between(.97,1.03));
  const rat=MON.map((_,i)=>Math.max(.03,base+(i===2?.012:0)+(i===3?.008:0)+(R()-.5)*.022));
  const lb=gp.map((g,i)=>g*rat[i]);
  const to={sales:MON.map(()=>pois(act.sales*.016)),afs:MON.map(()=>pois(act.afs*.006)),admin:MON.map(()=>pois(act.admin*.005))};
  const ps=between(1.9,3.7),pt=between(3.1,5.3),pa=between(9,14.2);
  const prS=MON.map((_,i)=>Math.max(.8,ps+(R()-.5)*.7+(i===2||i===3?-.35:0)));
  const prT=MON.map(()=>Math.max(1.5,pt+(R()-.5)*.6));prT[8]=null;
  const prA=MON.map(()=>pa+(R()-.5)*1.4);prA[8]=null;
  const gpec={total:between(2.9,6.6),sales:between(7.5,16.5),sa:between(3.6,8.2),tech:between(1.9,5.2)};
  const gpPrev={};for(const k in gpec)gpPrev[k]=gpec[k]*between(.95,1.05);
  // GP/EC total YTD per akhir bulan (Agustus = gpPrev, September = gpec)
  const gpecYtdBulan=MON.map((_,i)=>i===8?gpec.total:(i===7?gpPrev.total:gpec.total*(.90+.012*i)));
  const L=LOK[n];
  cabang.push({nama:n,area:ai+1,kota:L[0],lat:L[1],lon:L[2],
    mpp,mp:mpH,gajiPokok:gp.map(r1),lembur:lb.map(r2),
    keluar:to,prodSales:prS.map(r2),prodTeknisi:prT.map(r2),prodSA:prA.map(r2),
    gpecYtd:{total:r2(gpec.total),sales:r2(gpec.sales),sa:r2(gpec.sa),tech:r2(gpec.tech)},
    gpecYtdAgustus:{total:r2(gpPrev.total),sales:r2(gpPrev.sales),sa:r2(gpPrev.sa),tech:r2(gpPrev.tech)},
    gpecYtdBulan:gpecYtdBulan.map(r2),
    alasanLembur:WHY_LB[idx++%WHY_LB.length]});
}));
// FY 2025 per cabang (pembanding YTD, seperti Dashboard A: FY 2025 vs YTD 2026)
const R2=rng(20251231);
cabang.forEach(c=>{const lb=c.lembur.reduce((a,b)=>a+b,0)/c.gajiPokok.reduce((a,b)=>a+b,0),ps=c.prodSales.reduce((a,b)=>a+b,0)/9;
  c.fy25={rasioLembur:r3(lb*(.9+R2()*.22)),prodSales:r2(ps*(.92+R2()*.16))}});
const hoGaji=MON.map(()=>between(935,975)),hoRat=[.036,.034,.047,.044,.039,.037,.038,.041,.049];
const DATA={
  meta:{judul:"Dashboard Manpower",periode:"September 2026",bulanLalu:"Agustus",tahun:2026,
    bulan:MON,indeksBulanIni:8,tahunan:["FY20","FY21","FY22","FY23","FY24","FY25","YTD 26"],
    angkaContoh:true,
    dataBelumMasuk:[{topik:"Produktivitas Aftersales",bulan:"September",pengganti:"Agustus"}]},
  cabang,
  headOffice:{mpp:182,mp:[171,172,174,173,175,176,176,177,178],gajiPokok:hoGaji.map(r1),lembur:hoGaji.map((g,i)=>r2(g*hoRat[i]))},
  tahunan:{
    mpTotal:[2478,2391,2446,2512,2583,2617],porsiMp:{ho:.066,sales:.29,afs:.36,admin:.165,os:.119},
    turnover:{sales:[28.4,31.2,26.1,24.3,27.6,25.2],afs:[9.1,8.2,10.4,7.3,8.1,8.8],admin:[6.2,7.1,5.4,6.3,5.2,5.9]},
    produktivitas:{sales:[2.31,2.58,2.86,3.07,2.82,2.71],sa:[10.6,11.2,11.9,12.4,12.0,11.7],tech:[3.62,3.88,4.12,4.41,4.22,4.05]},
    opec:{sales:{fy25:1.62,bulan:[1.4,1.5,1.2,1.3,1.7,1.8,1.9,1.7,1.8]},gr:{fy25:2.41,bulan:[2.2,2.3,2.0,2.1,2.5,2.6,2.6,2.4,2.5]},bp:{fy25:1.18,bulan:[1.0,1.1,.9,1.0,1.3,1.2,1.3,1.2,1.25]}}},
  lemburDeptHO:[
    {dept:"General Services",agustus:1.7,september:4.6,alasan:"Pendampingan kunjungan BoD dan persiapan upacara 17 Agustus"},
    {dept:"Human Capital Management",agustus:2.4,september:4.9,alasan:"Persiapan payroll, job fair, dan rekrutmen kampus"},
    {dept:"Regional Business Support",agustus:3.4,september:5.3,alasan:"Closing pertengahan dan akhir bulan, penyusunan target cabang"},
    {dept:"Information System & Technology",agustus:.4,september:.7,alasan:"Dukungan closing sales dan akunting"},
    {dept:"FP&A",agustus:5.0,september:5.3,alasan:"Closing bulanan dan rekonsiliasi saldo bank"},
    {dept:"Vehicle Sales",agustus:4.0,september:4.1,alasan:"Closing akhir bulan dan piket"}]
};
// tulis ringkas: satu cabang per baris
const out="{\n"+Object.entries(DATA).map(([k,v])=>k==="cabang"
  ?`"cabang":[\n${v.map(c=>"  "+JSON.stringify(c)).join(",\n")}\n]`
  :JSON.stringify(k)+":"+JSON.stringify(v)).join(",\n")+"\n}";
fs.writeFileSync(path.join(__dirname,"..","src","data-contoh.json"),out);
console.log("ok",cabang.length,"cabang");
