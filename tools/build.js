// Menyusun dashboard-tanya-jawab-v3.html: menanam data, Chart.js, dan huruf Poppins
// agar file dapat dibuka tanpa internet.
"use strict";
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const vendor=path.join(root,"vendor");
const src=fs.readFileSync(path.join(root,"src","dashboard.src.html"),"utf8");
const data=fs.readFileSync(path.join(root,"src","data-contoh.json"),"utf8").trim();
const chart=fs.readFileSync(path.join(vendor,"chart.umd.min.js"),"utf8");
const fonts=[400,500,600,700].map(w=>{
  const b64=fs.readFileSync(path.join(vendor,`poppins-latin-${w}-normal.woff2`)).toString("base64");
  return `@font-face{font-family:"Poppins";font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
}).join("\n");
let out=src.replace("/*@@FONTS@@*/",()=>fonts).replace("/*@@CHARTJS@@*/",()=>chart.replace(/<\/script/gi,"<\\/script")).replace("/*@@DATA@@*/",()=>data);
if(/@@[A-Z]+@@/.test(out))throw new Error("placeholder tersisa");
fs.writeFileSync(path.join(root,"dashboard-tanya-jawab-v3.html"),out);
console.log("dashboard-tanya-jawab-v3.html",Math.round(out.length/1024)+" KB");
