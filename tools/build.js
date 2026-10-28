// Menyusun dashboard-tanya-jawab-v3.html: menanam data, Chart.js, dan huruf Poppins
// agar file dapat dibuka tanpa internet.
"use strict";
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const vendor=path.join(root,"vendor");
// pemakaian: node tools/build.js [v4]
const V=process.argv[2]==="v4";
const src=fs.readFileSync(path.join(root,"src",V?"dashboard-v4.src.html":"dashboard.src.html"),"utf8");
const data=fs.readFileSync(path.join(root,"src","data-contoh.json"),"utf8").trim();
const chart=fs.readFileSync(path.join(vendor,"chart.umd.min.js"),"utf8");
const fonts=[400,500,600,700].map(w=>{
  const b64=fs.readFileSync(path.join(vendor,`poppins-latin-${w}-normal.woff2`)).toString("base64");
  return `@font-face{font-family:"Poppins";font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
}).join("\n");
let out=src.replace("/*@@FONTS@@*/",()=>fonts).replace("/*@@CHARTJS@@*/",()=>chart.replace(/<\/script/gi,"<\\/script")).replace("/*@@DATA@@*/",()=>data).replace("/*@@PETA@@*/",()=>fs.readFileSync(path.join(root,"src","peta.json"),"utf8").trim());
if(/@@[A-Z]+@@/.test(out))throw new Error("placeholder tersisa");
const OUT=V?"dashboard-tanya-jawab-v4.html":"dashboard-tanya-jawab-v3.html";
fs.writeFileSync(path.join(root,OUT),out);
console.log(OUT,Math.round(out.length/1024)+" KB");
