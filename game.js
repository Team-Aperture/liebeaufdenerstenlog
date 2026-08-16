"use strict";

const $ = (id) => document.getElementById(id);
const cv = $("scene"), ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;

const T = {
  de:{subtitle:"Ein chaotisches Geocaching-Datingspiel",aff:"Zuneigung",log:"Log-Qualität",restart:"↻ Neustart",soundOn:"♪ AN",soundOff:"♪ AUS",hint:"Tippe eine Antwort an oder nutze 1–3.",continue:"Weiter",saved:"● Fortschritt wird lokal gespeichert",disclaimer:"Inoffizielles, nicht-kommerzielles Fanprojekt. Nicht mit Geocaching HQ oder Groundspeak verbunden. Bitte verantwortungsvoll cachen.",confirm:"Gespeicherten Fortschritt löschen und neu starten?",ending:"ENDE FREIGESCHALTET"},
  en:{subtitle:"A chaotic geocaching dating sim",aff:"Affection",log:"Log quality",restart:"↻ Restart",soundOn:"♪ ON",soundOff:"♪ OFF",hint:"Tap an answer or use keys 1–3.",continue:"Continue",saved:"● Progress is saved locally",disclaimer:"Unofficial, non-commercial fan project. Not affiliated with Geocaching HQ or Groundspeak. Please cache responsibly.",confirm:"Erase saved progress and restart?",ending:"ENDING UNLOCKED"}
};
const B=(de,en)=>({de,en});
const chars={du:{name:B("Du","You"),icon:"🧭",color:"#ffdd71"},bots:{name:B("R-3MI & V-TGM","R-3MI & V-TGM"),icon:"🤖",color:"#9ae2dc"},petra:{name:B("Petra Petling","Petra Petling"),icon:"🧪",color:"#ff7da9"},nano:{name:B("Nando Nano","Nando Nano"),icon:"🔩",color:"#6dc8c2"},mysti:{name:B("Mysti Fünf-Sterne","Mysti Five-Star"),icon:"🔐",color:"#a987db"}};
const story={
 start:{who:"bots",text:B("Willkommen beim Mega-Event ‘Liebe auf den ersten Log’! Wir sind R-3MI und V-TGM, lizenzierte Kommentatoren ohne jede Lizenz. Dein GPS zeigt drei verdächtig attraktive Koordinaten.","Welcome to the ‘Love at First Log’ mega-event! We are R-3MI and V-TGM, fully unlicensed commentators. Your GPS shows three suspiciously attractive coordinates."),scene:"event",choices:[
  [B("Petra Petling – klassisch, wasserdicht, emotional leicht feucht","Petra Petling — classic, waterproof, emotionally slightly damp"),"petra1",0,1],
  [B("Nando Nano – winzig, magnetisch, schwer zu greifen","Nando Nano — tiny, magnetic, hard to get hold of"),"nano1",0,1],
  [B("Mysti Fünf-Sterne – kompliziert, rätselhaft, 47 Tabs offen","Mysti Five-Star — complex, mysterious, 47 tabs open"),"mysti1",0,1]]},
 petra1:{who:"petra",scene:"forest",text:B("Du findest Petra unter einer romantischen Eiche. ‘Mein Logbuch ist voll, mein Deckel klemmt und jemand hat einen Kassenbon als Tauschgegenstand hinterlassen.’ Traumdate!","You find Petra beneath a romantic oak. ‘My logbook is full, my lid is stuck, and someone left a receipt as swag.’ Dream date!"),choices:[
  [B("Wartungsset zücken und ein trockenes Logbuch spendieren.","Produce a maintenance kit and donate a dry logbook."),"petra2",2,2],[B("‘TFTC’ murmeln und sofort weitergehen.","Mumble ‘TFTC’ and leave immediately."),"petra2",-1,-2],[B("Den Kassenbon gegen einen Trackable tauschen.","Trade the receipt for a trackable."),"petra2",1,1]]},
 petra2:{who:"bots",scene:"forest",text:B("V-TGM: ‘Deckel dicht, Herz offen.’ R-3MI: ‘Bitte nicht als Wartungsanleitung zitieren.’ Plötzlich nähert sich ein Muggle mit Hund und sehr investigativem Blick.","V-TGM: ‘Lid sealed, heart open.’ R-3MI: ‘Please don't quote that as maintenance advice.’ Suddenly, a Muggle approaches with a dog and a highly investigative stare."),choices:[
  [B("Unauffällig den Baum umarmen. Völlig normal.","Casually hug the tree. Completely normal."),"final",2,1,"petra"],[B("Laut rufen: ‘Ich suche nur mein WLAN!’","Shout: ‘I'm only looking for my Wi-Fi!’"),"final",1,0,"petra"],[B("Petra tarnen und später wiederkommen.","Camouflage Petra and return later."),"final",1,2,"petra"]]},
 nano1:{who:"nano",scene:"city",text:B("Nando hängt magnetisch an der Rückseite eines Schildes. ‘Sorry, ich bin im echten Leben kleiner als auf meinem Profilbild.’ Ein Klassiker.","Nando is magnetically attached behind a sign. ‘Sorry, I'm smaller in real life than in my profile photo.’ A classic."),choices:[
  [B("‘Größe ist nur eine D/T-Wertung.’","‘Size is just another D/T rating.’"),"nano2",2,1],[B("Mit einem Bolzenschneider flirten.","Flirt using bolt cutters."),"nano2",-2,-1],[B("Ihn mit einem Spiegel diskret suchen.","Search discreetly with a mirror."),"nano2",1,2]]},
 nano2:{who:"bots",scene:"city",text:B("R-3MI: ‘Es knistert!’ V-TGM: ‘Das ist nur der Magnet am Straßenschild.’ Eine Gruppe Muggles blockiert die Dose und diskutiert seit zwölf Minuten über Parktickets.","R-3MI: ‘Sparks are flying!’ V-TGM: ‘That's just the magnet on the street sign.’ A group of Muggles blocks the cache and has discussed parking tickets for twelve minutes."),choices:[
  [B("Eine spontane Stadtführung vortäuschen.","Pretend to lead an impromptu city tour."),"final",2,2,"nano"],[B("Einen ehrlichen DNF loggen und Eis essen.","Log an honest DNF and get ice cream."),"final",1,2,"nano"],[B("‘SCHAU, EIN TRACKABLE!’ rufen und zugreifen.","Shout ‘LOOK, A TRACKABLE!’ and grab him."),"final",0,-1,"nano"]]},
 mysti1:{who:"mysti",scene:"ruins",text:B("Mysti wartet vor einer Ruine. ‘Für unser Date musst du nur den Geburtsort des Erfinders von ROT13, drei Primzahlen und das Gewicht dieses Mondes bestimmen.’ Sie zeigt auf den falschen Mond.","Mysti waits outside a ruin. ‘For our date, just determine the birthplace of ROT13's inventor, three primes, and the weight of this moon.’ She points at the wrong moon."),choices:[
  [B("Ein Spreadsheet öffnen. Das ist meine Liebessprache.","Open a spreadsheet. That's my love language."),"mysti2",2,2],[B("Die Lösung ‘42’ in jedes Feld schreiben.","Enter ‘42’ in every field."),"mysti2",1,0],[B("Im Listing nach einem versehentlichen Spoiler suchen.","Search the listing for an accidental spoiler."),"mysti2",0,1]]},
 mysti2:{who:"bots",scene:"ruins",text:B("V-TGM: ‘Die Chemie stimmt, die Koordinaten nicht.’ R-3MI: ‘Wie bei jedem guten Puzzle!’ Nach nur 73 Rechenschritten ergibt sich ein Final mitten in einem Brombeerbusch.","V-TGM: ‘The chemistry works, the coordinates don't.’ R-3MI: ‘Like every good puzzle!’ After only 73 calculations, the final lands in a blackberry bush."),choices:[
  [B("Gemeinsam hinein. Liebe ist temporär, Dornen sind ewig.","Go in together. Love is temporary, thorns are forever."),"final",2,1,"mysti"],[B("Erst einen Plausibilitätscheck machen.","Run a sanity check first."),"final",1,2,"mysti"],[B("Owner kontaktieren: ‘Brauche Hint. Und Pflaster.’","Message the owner: ‘Need hint. And bandages.’"),"final",1,1,"mysti"]]},
 final:{who:"bots",scene:"sunset",dynamic:true,choices:[[B("Noch einmal spielen","Play again"),"start",0,0,"restart"]]}
};
let state={node:"start",aff:0,log:0,route:null,lang:"de",sound:false};
try{const saved=JSON.parse(localStorage.getItem("firstLogSave"));if(saved&&story[saved.node]) state={...state,...saved};const lang=localStorage.getItem("firstLogLang");if(lang)state.lang=lang;}catch(_){/* invalid save: begin fresh */}

function ending(){
 const n=state.route?chars[state.route].name[state.lang]:"?", a=state.aff, l=state.log;
 if(a>=4&&l>=3)return B(`PERFEKTER FUND: ${n} und du loggt ein gemeinsames ‘Found it!’ — 843 Wörter, keine Spoiler. R-3MI weint Kühlflüssigkeit. V-TGM vergibt ein Favoritenherz.`,`PERFECT FIND: ${n} and you log a shared ‘Found it!’ — 843 words, no spoilers. R-3MI cries coolant. V-TGM awards a favorite point.`)[state.lang];
 if(a>=2)return B(`HERZ-FUND: ${n} mag dich! Euer nächstes Date ist eine Wartungsrunde. Romantik bedeutet schließlich, gemeinsam feuchte Logbücher zu wechseln.`,`HEART FOUND: ${n} likes you! Your next date is a maintenance run. Romance is replacing damp logbooks together.`)[state.lang];
 if(l>=3)return B("EHRENAMT-ENDE: Die Liebe blieb ein DNF, aber dein Log ist so hilfreich, dass drei Owner ihn ausdrucken. Du datest jetzt die Wartungsroutine.","VOLUNTEER ENDING: Love was a DNF, but your log is so useful that three owners print it. You are now dating the maintenance schedule.")[state.lang];
 return B("DNF MIT WÜRDE: Kein Kuss, keine Dose, aber ein gutes Picknick. Dein Log: ‘Viel gesehen. Nichts gefunden. TFTC trotzdem.’", "DIGNIFIED DNF: No kiss, no cache, but a lovely picnic. Your log: ‘Saw plenty. Found nothing. TFTC anyway.’")[state.lang];
}
function save(){try{localStorage.setItem("firstLogSave",JSON.stringify(state));localStorage.setItem("firstLogLang",state.lang);}catch(_){}}
function tr(v){return typeof v==="string"?v:v[state.lang]}
function render(){
 const t=T[state.lang], node=story[state.node], who=node.dynamic?chars.bots:chars[node.who];
 document.documentElement.lang=state.lang;$("subtitle").textContent=t.subtitle;$("affLabel").textContent=t.aff;$("logLabel").textContent=t.log;$("restartBtn").textContent=t.restart;$("soundBtn").textContent=state.sound?t.soundOn:t.soundOff;$("soundBtn").setAttribute("aria-pressed",String(state.sound));$("hint").textContent=t.hint;$("saveNote").textContent=t.saved;$("disclaimer").textContent=t.disclaimer;$("langBtn").textContent=state.lang==="de"?"EN":"DE";
 $("speaker").textContent=tr(who.name);$("portrait").textContent=who.icon;$("portrait").style.background=who.color;$("text").textContent=node.dynamic?ending():tr(node.text);
 $("affValue").textContent=state.aff;$("logValue").textContent=state.log;$("affBar").style.width=`${Math.max(0,Math.min(100,state.aff*20))}%`;$("logBar").style.width=`${Math.max(0,Math.min(100,state.log*20))}%`;
 $("badge").hidden=!node.dynamic;$("badge").textContent=t.ending;
 const box=$("choices");box.replaceChildren();node.choices.forEach((c,i)=>{const b=document.createElement("button");b.className="choice";b.type="button";b.innerHTML=`<b>${i+1}</b><span></span>`;b.querySelector("span").textContent=tr(c[0]);b.addEventListener("click",()=>choose(c));box.appendChild(b)});
 draw(node.scene);save();
}
function choose(c){beep();if(c[4]==="restart"){state={...state,node:"start",aff:0,log:0,route:null};}else{state.aff=Math.max(0,state.aff+c[2]);state.log=Math.max(0,state.log+c[3]);if(c[4])state.route=c[4];state.node=c[1];}render()}
function beep(){if(!state.sound)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=new AC(),o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.value=520;g.gain.setValueAtTime(.04,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.08);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.08);o.onended=()=>ac.close()}

function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function heart(x,y,s,c){rect(x+s,y,s,s,c);rect(x+3*s,y,s,s,c);rect(x,y+2*s,5*s,2*s,c);rect(x+s,y+4*s,3*s,s,c);rect(x+2*s,y+5*s,s,s,c)}
function tree(x,y){rect(x+35,y+90,35,120,"#70432b");rect(x,y+35,110,70,"#276749");rect(x+20,y,70,70,"#3b8b59");rect(x+40,y+55,12,12,"#75b85f")}
function person(x,y,color,type){rect(x+20,y,42,42,"#edbd91");rect(x+12,y+42,58,90,color);rect(x,y+55,12,65,"#edbd91");rect(x+70,y+55,12,65,"#edbd91");rect(x+18,y+132,18,55,"#31283c");rect(x+48,y+132,18,55,"#31283c");rect(x+27,y+17,7,7,"#28152b");rect(x+50,y+17,7,7,"#28152b");if(type==="petra")rect(x+5,y+72,18,45,"#fff0b8");if(type==="nano")rect(x+69,y+75,15,22,"#777");if(type==="mysti"){rect(x+7,y+48,70,8,"#28152b");rect(x+28,y-12,30,18,"#28152b")}}
function draw(scene){
 ctx.clearRect(0,0,cv.width,cv.height);rect(0,0,960,300,scene==="sunset"?"#e88991":"#83cddd");rect(0,300,960,200,scene==="city"?"#706675":"#5e9d52");
 rect(55,58,70,70,"#ffd86b");heart(820,55,8,"#ff679a");
 if(scene==="event"){tree(80,170);tree(780,180);rect(250,160,460,190,"#fff2c9");rect(280,190,400,90,"#b73469");ctx.fillStyle="#fff";ctx.font="bold 28px monospace";ctx.fillText("MEGA ♥ EVENT",365,245);person(160,285,"#f16b9b","petra");person(710,285,"#55aaa5","nano")}
 if(scene==="forest"){tree(80,140);tree(670,130);tree(810,170);person(460,270,"#ef6795","petra");rect(355,400,75,48,"#cfdae1");rect(370,386,46,18,"#e8eff2")}
 if(scene==="city"){for(let x=35;x<900;x+=190){rect(x,150,150,180,"#dfb19c");for(let y=175;y<290;y+=55)for(let z=55;z<150;z+=55)rect(x+z-40,y,28,35,"#704b72")}rect(650,160,14,270,"#4f4b53");rect(610,180,95,60,"#eee");person(455,275,"#56aaa8","nano")}
 if(scene==="ruins"){tree(40,190);rect(690,160,190,210,"#77707f");rect(730,100,65,260,"#8f8791");rect(765,225,55,145,"#292032");person(445,270,"#9871c2","mysti")}
 if(scene==="sunset"){for(let i=0;i<7;i++)heart(170+i*100,90+(i%2)*30,5,"#ffd0d9");person(350,270,"#ffd052","");person(520,270,state.route?chars[state.route].color:"#ff7da9",state.route);rect(0,440,960,60,"#3d5b47")}
 rect(0,465,960,35,"#3e283f");for(let x=10;x<950;x+=40)rect(x,478,18,5,"#ffdb6b")
}
$("langBtn").addEventListener("click",()=>{state.lang=state.lang==="de"?"en":"de";render()});
$("soundBtn").addEventListener("click",()=>{state.sound=!state.sound;beep();render()});
$("restartBtn").addEventListener("click",()=>{if(confirm(T[state.lang].confirm)){state={...state,node:"start",aff:0,log:0,route:null};render()}});
document.addEventListener("keydown",e=>{if(e.key>="1"&&e.key<="3"){const b=$("choices").children[Number(e.key)-1];if(b)b.click()}else if((e.key==="Enter"||e.key===" ")&&$("choices").children.length===1){e.preventDefault();$("choices").children[0].click()}});
render();
