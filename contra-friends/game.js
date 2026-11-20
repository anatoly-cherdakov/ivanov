/* Friends vs Aliens — original browser action game in the spirit of 8-bit run-and-gun. No Konami ROM is distributed or run. */
(()=>{"use strict";
const W=256,H=240,TILE=16,GROUND=191,FPS=60;
const $=id=>document.getElementById(id),cv=$("screen"),ctx=cv.getContext("2d",{alpha:false});
ctx.imageSmoothingEnabled=false;
const levels=[
 {name:"ДЖУНГЛИ",en:"JUNGLE",theme:"jungle",length:2100,pits:true,seed:73},
 {name:"БАЗА № 1",en:"BASE 1",theme:"base",length:1960,pits:false,seed:34},
 {name:"ВОДОПАД",en:"WATERFALL",theme:"waterfall",length:2200,pits:true,seed:94},
 {name:"БАЗА № 2",en:"BASE 2",theme:"base2",length:2000,pits:false,seed:22},
 {name:"ЗИМНЯЯ КРЕПОСТЬ",en:"SNOWFIELD",theme:"snow",length:2250,pits:true,seed:74},
 {name:"ЭНЕРГОЗОНА",en:"ENERGY",theme:"energy",length:2000,pits:false,seed:17},
 {name:"АНГАР",en:"HANGAR",theme:"hangar",length:2180,pits:true,seed:62},
 {name:"ЛОГОВО ПРИШЕЛЬЦЕВ",en:"ALIEN'S LAIR",theme:"alien",length:2480,pits:false,seed:28}
];
const phrases=[
 "Союзник, возьми меня с собой!",
 "Но ты ещё не увидел свои руки во сне.",
 "Но ты ещё летаешь при помощи рук.",
 "Я могу и 10 грамм.",
 "Маловато Рериха.",
 "Благодарю, Ванёк! Спасибо, отец Анатолий!",
 "Ты почти добрался до принцессы."
];
const colors={
 jungle:{sky:"#6987aa",far:"#40617b",mid:"#274c4c",ground:"#51402f",top:"#54a34f",detail:"#7ebc6a"},
 waterfall:{sky:"#506a91",far:"#263e68",mid:"#35558c",ground:"#4b4548",top:"#63a3ad",detail:"#a3e8fd"},
 snow:{sky:"#b7cad8",far:"#7892b3",mid:"#637393",ground:"#677c8c",top:"#e5f4f9",detail:"#ffffff"},
 base:{sky:"#121c37",far:"#203152",mid:"#2b4064",ground:"#4a5872",top:"#8795ab",detail:"#c4dae6"},
 base2:{sky:"#191d3e",far:"#243b61",mid:"#253b60",ground:"#4c5377",top:"#9f94bc",detail:"#d6c0f5"},
 energy:{sky:"#162647",far:"#223a5b",mid:"#34556c",ground:"#455968",top:"#4fd2be",detail:"#91f9e1"},
 hangar:{sky:"#1a2941",far:"#34476e",mid:"#3a5676",ground:"#5a6474",top:"#a8b9c6",detail:"#f9be7a"},
 alien:{sky:"#2a153b",far:"#4a234c",mid:"#512e51",ground:"#552e4a",top:"#ad647a",detail:"#fe8cb9"}
};
const skill={gravity:.23,jump:-5.4,speed:1.92,bulletSpeed:5.3};
let mode="title",stage=0,frame=0,scroll=0,duo=true,score=0,animationHandle=0;
let players=[],enemies=[],shots=[],enemyShots=[],pickups=[],particles=[],boss=null,alerts=[];
let gameFinished=false,lastTimestamp=0,accum=0;
let heroImage=null,coverImage=null,allies={toad:null,peach:null,roerich:null};
let ambientAudio=null,touchPlayer=0,pauseBefore="playing",cameraShake=0;
const keys=new Set(),touchKeys=new Set();
const music={frequency:660};
const starDust=["#ffe178","#7de8ff","#fe9ca8","#b1ff96"];
const control1={left:["KeyA"],right:["KeyD"],up:["KeyW"],down:["KeyS"],jump:["KeyK","Space"],shoot:["KeyJ"]};
const control2={left:["ArrowLeft"],right:["ArrowRight"],up:["ArrowUp"],down:["ArrowDown"],jump:["Digit2","Numpad2"],shoot:["Digit1","Numpad1"]};
const kbd={left:"left",right:"right",up:"up",down:"down",jump:"jump",shoot:"shoot"};
function beep(hz=400,length=.06,shape="square",loud=.035){
 try{if(!ambientAudio)ambientAudio=new (window.AudioContext||window.webkitAudioContext)();if(ambientAudio.state==="suspended")ambientAudio.resume();
 const oscillator=ambientAudio.createOscillator(),gain=ambientAudio.createGain();
 oscillator.type=shape;oscillator.frequency.value=hz;gain.gain.setValueAtTime(loud,ambientAudio.currentTime);
 gain.gain.exponentialRampToValueAtTime(.0001,ambientAudio.currentTime+length);
 oscillator.connect(gain);gain.connect(ambientAudio.destination);
 oscillator.start();oscillator.stop(ambientAudio.currentTime+length+.01);}catch(_){}
}
function hash(n){let x=(n|0)^0x5bce8d;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return((x^(x>>>16))>>>0)/4294967295}
function fill(x,y,w,h,c){if(w<=0||h<=0)return;ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}
function rect(x,y,w,h,c){fill(x,y,w,h,c)}
function outline(x,y,w,h,c){fill(x,y,w,2,c);fill(x,y+h-2,w,2,c);fill(x,y,2,h,c);fill(x+w-2,y,2,h,c)}
function pixelText(text,x,y,color="#f8f3da",size=8,align="left"){
 ctx.font="bold "+size+"px monospace";ctx.textAlign=align;ctx.textBaseline="top";ctx.fillStyle="#091223";
 ctx.fillText(text,x+1,y+1);ctx.fillStyle=color;ctx.fillText(text,x,y);
}
function fitText(text,x,y,maxWidth=230,sz=9){
 ctx.font="bold "+sz+"px monospace";let actual=sz;
 while(ctx.measureText(text).width>maxWidth&&actual>6){actual--;ctx.font="bold "+actual+"px monospace";}
 pixelText(text,x,y,"#f1f3fe",actual,"center");
}
async function decodeArt(art){
 if(!art||!art.palette||!art.data)throw Error("Sprite data unavailable");
 if(!("DecompressionStream" in window))throw Error("Required DecompressionStream missing");
 const zipped=Uint8Array.from(atob(art.data),x=>x.charCodeAt(0));
 const raw=new Uint8Array(await new Response(new Blob([zipped]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer());
 if(raw.length!==art.w*art.h)throw Error("Invalid pixel data");
 const target=document.createElement("canvas");target.width=art.w;target.height=art.h;
 const targetCtx=target.getContext("2d"),image=targetCtx.createImageData(art.w,art.h);
 const palette=art.palette.map(s=>[0,2,4,6].map(n=>parseInt(s.slice(n,n+2),16)));
 for(let i=0;i<raw.length;i++){const col=palette[raw[i]]||[0,0,0,0];image.data.set(col,i*4);}
 targetCtx.putImageData(image,0,0);return target;
}
function displayAvatar(id,row){
 if(!heroImage||!heroImage.complete||!heroImage.naturalWidth)return;
 const dest=$(id);if(!dest)return;
 const ct=dest.getContext("2d");
 ct.imageSmoothingEnabled=false;ct.clearRect(0,0,dest.width,dest.height);
 ct.drawImage(heroImage,0,row*96,64,96,0,0,dest.width,dest.height);
}
async function loadArt(){
 heroImage=new Image();
 heroImage.onload=()=>{displayAvatar("heroBlack",0);displayAvatar("heroBlue",1);};
 heroImage.src=window.CONTRA_FRIENDS_HERO_SHEET||"";
 const entries=[["toad","FRIENDS_ENDING_ART","toad"],["peach","FRIENDS_ENDING_ART","peach"],
 ["roerich","FRIENDS_ROERICH_BOSS_ART",null],["cover","FRIENDS_PHOTO_ART",null]];
 for(const [key,globalName,inner] of entries){
 try{const target=window[globalName],data=inner?(target&&target[inner]):target;
 if(!data)continue;const c=await decodeArt(data);if(key==="cover")coverImage=c;else allies[key]=c;}catch(err){console.warn("Optional artwork not available",key,err);}
 }
}
function drawNPC(kind){const target=$("npcCanvas"),asset=allies[kind];if(!target)return;
 const ct=target.getContext("2d");ct.clearRect(0,0,target.width,target.height);
 if(asset){ct.imageSmoothingEnabled=false;ct.drawImage(asset,0,0,asset.width,asset.height,0,0,target.width,target.height);}
 else{ct.fillStyle=kind==="peach"?"#a65b80":"#ba936b";ct.fillRect(4,4,target.width-8,target.height-8);}
}
function setOverlay(title,message,screen,opts={}){
 mode=screen;
 $("menuTitle").textContent=title;
 $("menuMessage").textContent=message;
 $("overlay").hidden=false;
 $("menuNPC").hidden=!opts.npc;
 if(opts.npc){$("npcLabel").textContent=opts.npc==="peach"?"ПРИНЦЕССА":"СОЮЗНИК";drawNPC(opts.npc);}
 $("startSolo").hidden=screen!=="title";
 $("startCoop").hidden=screen!=="title";
 $("continue").hidden=screen!=="between"&&screen!=="paused";
 $("again").hidden=screen!=="gameover"&&screen!=="victory";
 $("continue").textContent=screen==="paused"?"ВЕРНУТЬСЯ В ИГРУ":"СЛЕДУЮЩИЙ ЭТАП";
 $("menuFoot").hidden=screen!=="title";
 $("status").textContent=message;
}
function player(id){return{id,px:26+id*20,y:GROUND-27,w:14,h:27,vx:0,vy:0,dir:1,aim:0,lives:4,points:0,weapon:"R",invuln:110,dead:false,onGround:true,jumping:false,lastShot:0,anim:0,deathFrame:0};}
function initGame(isTwo){
 duo=!!isTwo;score=0;stage=0;gameFinished=false;frame=0;
 players=[player(0)];if(duo)players.push(player(1));
 startStage();
}
function groundAt(wx){
 const cfg=levels[stage],x=Math.max(0,wx);
 if(cfg.pits&&x>175&&x<cfg.length-205){
   const k=stage===2?286:stage===4?360:stage===6?395:330;
   const a=(x+stage*32)%k;
   if(a>235&&a<274)return 999;
 }
 if(stage===2){const k=Math.floor(x/220)%4;return [191,178,184,170][k]}
 if(stage===4){return Math.floor(x/340)%2?189:194;}
 return GROUND;
}
function startStage(){
 mode="playing";scroll=0;cameraShake=0;alerts=[];shots=[];enemyShots=[];enemies=[];pickups=[];particles=[];
 boss={x:levels[stage].length-132,y:GROUND-77,w:62,h:74,hp:25+stage*7,maxHp:25+stage*7,
 time:0,death:false,visible:false,at:levels[stage].length-185};
 for(const p of players){p.px=30+p.id*20;p.y=GROUND-27;p.vx=p.vy=0;p.dead=p.lives<=0;p.invuln=100;p.onGround=true;p.aim=0;p.dir=1;}
 const cfg=levels[stage],number=Math.floor(cfg.length/102);
 for(let n=0;n<number;n++){
   const px=188+n*97+Math.floor(hash(n*71+stage*27)*27);
   if(px>cfg.length-230)break;
   const kind=(n%7===2?"turret":n%5===4?"drone":"grunt");
   const y=(kind==="drone"?76+Math.floor(hash(n*17+stage)*42):groundAt(px)-22);
   enemies.push({x:px,y,w:kind==="turret"?18:14,h:kind==="drone"?13:22,
      kind,hp:kind==="turret"?5:kind==="drone"?2:2+stage*.17,
      lastFire:n*12,time:0,dir:-1,dead:false,baseX:px,aggression:0});
 }
 for(let n=0;n<6;n++){
  const x=270+n*Math.floor((cfg.length-500)/6);
  const types=["M","S","L","H","M","S"];
  pickups.push({x,y:groundAt(x)-19,kind:types[(n+stage)%types.length],taken:false,bob:n*13});
 }
 $("status").textContent="ЭТАП "+(stage+1)+"/8: "+cfg.name;
 $("stageNotice").textContent=(duo?"ДВА БОЙЦА":"ОДИН БОЕЦ");
 $("overlay").hidden=true;
 soundStage();
}
function soundStage(){beep(330,.08);setTimeout(()=>beep(475,.07),110);}
function deadPlayers(){return players.filter(p=>!p.dead&&p.lives>0)}
function controls(p){
 const mapping=(p.id===0?control1:control2);const has=name=>mapping[name].some(k=>keys.has(k))||touchKeys.has(p.id+":"+name);
 return Object.fromEntries(Object.keys(mapping).map(name=>[name,has(name)]));
}
function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function shoot(p,input){
 if(frame-p.lastShot<(p.weapon==="M"?5:10))return;
 p.lastShot=frame;
 const ox=p.px+p.w/2,oy=p.y+(input.down?20:input.up?3:11);
 const dirs=[];if(input.up&&!input.left&&!input.right)dirs.push([0,-1]);
 else if(input.up)dirs.push([p.dir*.72,-.69]);
 else if(input.down&&!p.onGround)dirs.push([p.dir*.78,.62]);
 else dirs.push([p.dir,0]);
 if(p.weapon==="S"){const d=dirs[0],angle=Math.atan2(d[1],d[0]);dirs.length=0;[-.24,0,.24].forEach(offset=>dirs.push([Math.cos(angle+offset),Math.sin(angle+offset)]));}
 for(const [dx,dy] of dirs){shots.push({x:ox,y:oy,w:3,h:p.weapon==="L"?3:2,vx:dx*(p.weapon==="L"?7:5.9),vy:dy*(p.weapon==="L"?7:5.9),power:p.weapon==="L"?3:1,owner:p.id,life:60,color:p.weapon==="L"?"#a4ffff":p.weapon==="S"?"#efeeab":"#ffe890"});}
 if(frame%2===0)beep(p.weapon==="L"?570:470,.025,"square",.011);
}
function addSpark(x,y,color="#ffee77",count=7){
 for(let i=0;i<count;i++){const angle=i*2.399;particles.push({x,y,vx:Math.cos(angle)*(1+hash(i+frame)*1.4),vy:Math.sin(angle)*(1+hash(i*2+frame)*1.4),life:17+Math.floor(hash(i*81+frame)*12),color});}
}
function hurt(p){
 if(p.invuln>0||p.dead||mode!=="playing")return;
 p.lives--;p.invuln=120;p.weapon="R";cameraShake=4;beep(145,.18,"sawtooth",.038);
 addSpark(p.px+p.w/2,p.y+11,"#ff777e",13);
 if(p.lives<=0){p.dead=true;p.deathFrame=frame;if(deadPlayers().length===0){finishGame(false);}return;}
 p.y=Math.max(50,groundAt(p.px)-p.h-12);p.vx=0;p.vy=-2;
}
function movePlayers(){
 const cfg=levels[stage];
 for(const p of players){if(p.dead)continue;const input=controls(p);
  p.aim=input.up?-1:input.down?1:0;
  let dir=Number(input.right)-Number(input.left);
  p.vx=dir*(input.down&&p.onGround?.85:skill.speed);
  if(dir)p.dir=dir;
  if(input.jump&&p.onGround){p.vy=skill.jump;p.onGround=false;beep(280,.06,"triangle",.027);}
  if(input.shoot)shoot(p,input);
  p.px=Math.max(scroll+3,Math.min(cfg.length-15,p.px+p.vx));
  const beforeY=p.y;p.vy=Math.min(6.7,p.vy+skill.gravity);p.y+=p.vy;
  const feet=p.y+p.h,ground=groundAt(p.px+p.w/2);
  if(ground!==999&&p.vy>=0&&feet>=ground&&beforeY+p.h<=ground+11){p.y=ground-p.h;p.vy=0;p.onGround=true;}
  else if(ground===999||feet<ground-1)p.onGround=false;
  if(p.y>H+20){p.invuln=0;hurt(p);p.y=groundAt(Math.max(scroll+25,p.px)) - p.h-22;if(p.y>H)p.y=124;}
  if(p.invuln>0)p.invuln--;
  p.anim+=Math.abs(p.vx);
  for(const e of enemies){if(e.dead||e.kind==="drone"||!collision({x:p.px,y:p.y,w:p.w,h:p.h},e))continue;hurt(p);}
  for(const b of enemyShots){if(!b.dead&&collision({x:p.px,y:p.y,w:p.w,h:p.h},b)){b.dead=true;hurt(p);}}
  if(boss&&boss.hp>0&&collision({x:p.px,y:p.y,w:p.w,h:p.h},{x:boss.x+7,y:boss.y+7,w:boss.w-14,h:boss.h-7}))hurt(p);
  for(const bonus of pickups){if(bonus.taken)continue;
   if(collision({x:p.px,y:p.y,w:p.w,h:p.h},{x:bonus.x,y:bonus.y-3,w:13,h:14})){bonus.taken=true;
    if(bonus.kind==="H"){p.lives=Math.min(9,p.lives+1);makeAlert("ДОПОЛНИТЕЛЬНАЯ ЖИЗНЬ!",p.px,p.y-16);}
    else{p.weapon=bonus.kind;makeAlert("ОРУЖИЕ "+bonus.kind,p.px,p.y-16);}
    beep(840,.12,"triangle",.036);addSpark(bonus.x,bonus.y,"#ffe8b2",12);
   }
  }
 }
 // Keep both players in the same view; the leading fighter determines scroll.
 const alive=deadPlayers();if(alive.length){
  const leader=Math.max(...alive.map(p=>p.px));
  scroll=Math.min(cfg.length-W,Math.max(scroll,leader-91));
  for(const p of alive){if(p.px<scroll+2)p.px=scroll+2;}
 }
}
function makeAlert(text,x,y){alerts.push({text,x,y,life:110});if(alerts.length>4)alerts.shift();}
function nearest(x,y){let result=null,dist=99999;for(const p of deadPlayers()){const d=Math.hypot(p.px-x,p.y-y);if(d<dist){dist=d;result=p;}}return result;}
function enemyFire(x,y,speed=1.7){
 const target=nearest(x,y);if(!target)return;
 const dx=target.px+6-x,dy=target.y+13-y,d=Math.max(1,Math.hypot(dx,dy));
 enemyShots.push({x,y,w:3,h:3,vx:dx/d*speed,vy:dy/d*speed,dead:false,life:185});
}
function updateEnemies(){
 for(const e of enemies){if(e.dead)continue;if(e.x<scroll-60||e.x>scroll+W+52)continue;
  e.time++;
  const target=nearest(e.x,e.y);if(!target)continue;
  const distance=Math.abs(target.px-e.x);
  e.dir=target.px>=e.x?1:-1;
  if(e.kind==="grunt"){
    if(distance<130&&distance>30)e.x+=e.dir*(stage>3?.43:.32);
    e.y=groundAt(e.x)-e.h;if(e.y>240)e.dead=true;
    if(e.time%105===0&&distance<180)enemyFire(e.x+e.w/2,e.y+10,1.5+stage*.04);
  }else if(e.kind==="drone"){
    e.x+=Math.sin((e.time+e.baseX)/30)*.23;e.y+=Math.sin((e.time+e.baseX)/18)*.24;
    if(e.time%91===0&&distance<170)enemyFire(e.x+6,e.y+8,1.7);
  }else if(e.kind==="turret"){
    if(e.time%(95-stage*3)===0&&distance<175)enemyFire(e.x+8,e.y+5,1.9+stage*.04);
  }
 }
 if(boss&&boss.hp>0&&scroll+W>boss.x-65){
   boss.visible=true;boss.time++;
   if(boss.time%54===0){enemyFire(boss.x+15,boss.y+34,2.0+stage*.06);
     if(stage>3)enemyFire(boss.x+boss.w-13,boss.y+20,1.9+stage*.06);}
   if(boss.time%155===0){for(let i=0;i<3;i++)enemyShots.push({x:boss.x+7+i*19,y:boss.y+boss.h/2,
     w:4,h:4,vx:-2-i*.12,vy:-1.25+i*1.2,dead:false,life:112});}
 }
}
function updateShots(){
 for(const b of shots){if(b.dead)continue;
   b.x+=b.vx;b.y+=b.vy;b.life--;
   if(b.life<=0||b.y<14||b.y>H-7||b.x<scroll-10||b.x>scroll+W+10){b.dead=true;continue;}
   for(const e of enemies){if(e.dead)continue;if(collision(b,e)){e.hp-=b.power;b.dead=true;
     addSpark(b.x,b.y,"#ffda80",4);
     if(e.hp<=0){e.dead=true;score+=100;players[b.owner].points+=100;addSpark(e.x+7,e.y+7,"#ffb16c",11);beep(155,.09,"sawtooth",.012);}break;}}
   if(boss&&!b.dead&&boss.hp>0&&collision(b,boss)){b.dead=true;boss.hp-=b.power;addSpark(b.x,b.y,"#bce8ff",3);
    if(boss.hp<=0){boss.hp=0;score+=4000+stage*800;cameraShake=15;addSpark(boss.x+24,boss.y+30,"#ffb68a",65);beep(155,.5,"sawtooth",.06);
      finishStage();}}
 }
 shots=shots.filter(b=>!b.dead);
 for(const b of enemyShots){b.x+=b.vx;b.y+=b.vy;b.life--;if(b.life<=0||b.x<scroll-20||b.x>scroll+W+20||b.y<-10||b.y>H+10)b.dead=true;}
 enemyShots=enemyShots.filter(b=>!b.dead);
}
function tickParticles(){
 particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.065;p.life--});particles=particles.filter(p=>p.life>0);
 alerts.forEach(a=>{a.life--;a.y-=.14});alerts=alerts.filter(a=>a.life>0);
}
function finishStage(){
 if(mode!=="playing")return;
 for(const p of players)if(!p.dead){p.invuln=180;p.points+=300;}
 const final=stage===7;
 if(final){gameFinished=true;setOverlay("ТЫ СТАЛ ВОИНОМ.","Ты стал воином. Приглашаю тебя в подготовишку.","victory",{npc:"peach"});}
 else{const line=phrases[stage]||"Союзник, возьми меня с собой!";
  setOverlay("ЭТАП "+(stage+1)+" ПРОЙДЕН",line,"between",{npc:"toad"});}
 beep(740,.15,"triangle",.055);setTimeout(()=>beep(920,.21,"triangle",.047),160);
}
function finishGame(won){
 if(won){finishStage();return;}
 setOverlay("ИГРА ОКОНЧЕНА","Попробуй снова: союзники и принцесса ещё ждут спасения.","gameover");
 beep(110,.5,"sawtooth",.035);
}
function nextStage(){
 if(mode==="paused"){mode=pauseBefore;$("overlay").hidden=true;return;}
 if(mode!=="between")return;
 stage++;if(stage>=levels.length){finishGame(true);return;}
 startStage();
}
function pauseGame(){
 if(mode==="playing"){pauseBefore=mode;setOverlay("ПАУЗА","Нажми «Вернуться в игру» или Enter.","paused");}
 else if(mode==="paused"){nextStage();}
}
function step(){
 frame++;
 if(mode==="playing"){
  movePlayers();
  updateEnemies();
  updateShots();
  tickParticles();
  if(cameraShake>0)cameraShake--;
 }else if(mode==="title"){tickParticles();}
}
function drawCloud(x,y,seed){
 const c=colors[levels[stage].theme];
 fill(x,y+5,38,8,"#d1e2ef");fill(x+7,y,24,17,"#d7e8ef");fill(x+11,y-3,14,4,"#eef7fe");
 fill(x+16,y+2,8,3,c.sky);
}
function drawBackground(){
 const theme=levels[stage].theme,style=colors[theme];
 fill(0,0,W,H,style.sky);
 // 8-bit starfields, distant mountains and panel buildings vary by stage.
 if(theme==="jungle"||theme==="waterfall"||theme==="snow"){
  for(let n=0;n<8;n++){const x=(n*81-Math.floor(scroll*.17)%81+W)%W;
   if(theme!=="snow"&&n%3===0)drawCloud(x-30,17+((n*13)%23),n);
  }
  for(let x=-40;x<W+60;x+=41){
   const sx=x-Math.floor(scroll*.22)%41;
   const h=36+Math.floor(hash((x+211)*3+stage)*46);
   fill(sx,GROUND-h,52,h,style.far);
   fill(sx+9,GROUND-h-13,35,13,style.mid);
   if(theme==="snow"){fill(sx+8,GROUND-h-13,20,4,"#e1ebf5");fill(sx+19,GROUND-h-9,26,3,"#cfdeeb");}
   if(theme==="waterfall"&&x%3===0){fill(sx+22,GROUND-h,10,h,"#85b7d7");fill(sx+24,GROUND-h,3,h,"#c6f7ff");}
  }
  if(theme==="jungle"){
   for(let n=0;n<19;n++){const x=n*24-Math.floor(scroll*.45)%24,yy=128+Math.floor(hash(n*113)*17);
    fill(x+7,yy,5,55,"#304831");fill(x,yy-10,21,19,"#2a5848");fill(x+5,yy-15,12,12,"#44704e");
    fill(x+2,yy-7,4,4,"#5d8c54");}
  }
 }else if(theme==="alien"){
  for(let n=0;n<21;n++){const x=((n*43-Math.floor(scroll*.12))%(W+60)+W+60)%(W+60);
   const y=19+n*19%130;
   fill(x,y,2,2,n%2?"#e2b5e7":"#ff798b");}
  for(let n=0;n<8;n++){const x=n*45-Math.floor(scroll*.29)%45;
   fill(x+4,83,21,83,"#432047");fill(x+12,60,7,94,"#7b3c62");
   fill(x+9,78,13,5,"#b95889");}
 }else{
  for(let n=0;n<9;n++){
   const x=n*41-Math.floor(scroll*.16)%41,ht=55+Math.floor(hash(n*24+stage)*60);
   fill(x,GROUND-ht,32,ht,style.far);
   fill(x+7,GROUND-ht-8,17,8,style.mid);
   for(let row=0;row<6;row++)fill(x+4+(row%2)*12,GROUND-ht+10+row*12,7,5,row%2?style.top:style.mid);
  }
  for(let x=0;x<W;x+=32){fill(x,81,3,81,style.mid);fill(x+9,104,21,3,style.top);}
 }
}
function drawGround(){
 const cfg=levels[stage],style=colors[cfg.theme];
 const begin=Math.floor(scroll/TILE)*TILE,end=scroll+W+TILE;
 for(let wx=begin;wx<end;wx+=TILE){
  let y=groundAt(wx+8);if(y===999){
    // Pit water, plasma, or lava at the bottom.
    const col=cfg.theme==="alien"?"#b34882":cfg.theme==="energy"?"#1ce5ba":"#315a77";
    fill(wx-scroll,H-19,16,19,col);fill(wx-scroll+2,H-18,9,2,"#b1f1fa");continue;}
  y=Math.floor(y);
  fill(wx-scroll,y,17,H-y,style.ground);
  fill(wx-scroll,y,17,5,style.top);
  fill(wx-scroll+2,y+7,7,3,style.mid);
  fill(wx-scroll+11,y+14,3,3,style.detail);
  fill(wx-scroll+1,y+21,10,2,"#273149");
  if(cfg.theme==="base"||cfg.theme==="base2"||cfg.theme==="hangar"||cfg.theme==="energy"){
    fill(wx-scroll+8,y+4,2,19,style.mid);fill(wx-scroll+4,y+13,3,2,style.detail);
  }else if(cfg.theme==="jungle"||cfg.theme==="waterfall"){
    if(hash(wx+stage*17)>.57){fill(wx-scroll+8,y-3,2,4,style.detail);fill(wx-scroll+5,y-2,3,2,style.top);}
  }else if(cfg.theme==="snow"){fill(wx-scroll+3,y+1,9,2,"#f5ffff");}
 }
 // Artificial bunker ledges and cliff-side bridges.
 for(let n=0;n<Math.ceil(cfg.length/260);n++){
  const x=170+n*276,screenX=x-scroll;
  if(screenX<-80||screenX>W+30||cfg.theme==="alien")continue;
  const h=stage===2?146:138;
  fill(screenX,h,53,5,style.mid);
  fill(screenX,h,53,2,style.top);
  for(let i=0;i<3;i++)fill(screenX+9+i*13,h+5,3,9,"#24334c");
 }
 if(boss&&boss.hp>0){const bx=boss.x-scroll;
 if(bx>-120&&bx<W+20){fill(bx+5,GROUND-6,64,7,style.top);}}
}
function drawWorldDetails(){
 const cfg=levels[stage];
 for(let i=0;i<Math.floor(cfg.length/125);i++){
   const x=i*125+110-scroll;if(x<-40||x>W+35)continue;
   if(cfg.theme==="jungle"){fill(x,GROUND-44,4,46,"#4a3e32");
    fill(x-12,GROUND-60,27,22,"#2d6a46");fill(x-5,GROUND-68,17,18,"#40824b");
    fill(x+5,GROUND-54,12,12,"#2e6545");
   }else if(cfg.theme==="snow"){fill(x,GROUND-32,5,33,"#566274");fill(x-6,GROUND-43,16,9,"#f5ffff");}
   else if(cfg.theme==="alien"){fill(x,GROUND-35,12,31,"#7a385c");fill(x+4,GROUND-42,4,7,"#f87b8a");}
   else{fill(x,GROUND-36,13,36,"#293652");fill(x+2,GROUND-30,9,3,"#8bb0ca");}
 }
}
function drawPlayer(p){
 if(p.dead)return;
 const x=Math.round(p.px-scroll),y=Math.round(p.y);
 if(x<-20||x>W+20)return;
 if(p.invuln>0&&Math.floor(frame/5)%2===0)return;
 const pose=p.onGround?(p.aim>0?4:Math.abs(p.vx)>.2?1+Math.floor(p.anim/18)%2:0):3;
 if(heroImage&&heroImage.complete&&heroImage.naturalWidth){
  ctx.save();ctx.imageSmoothingEnabled=false;
  if(p.dir<0){ctx.translate(x+p.w,0);ctx.scale(-1,1);ctx.drawImage(heroImage,pose*64,p.id*96,64,96,0,y,p.w,p.h);}
  else ctx.drawImage(heroImage,pose*64,p.id*96,64,96,x,y,p.w,p.h);
  ctx.restore();
 }else{
  fill(x+4,y,8,8,p.id?"#289bed":"#232327");
  fill(x+2,y+9,11,12,p.id?"#3d92d6":"#242a32");
  fill(x+3,y+21,4,6,"#8f9da2");fill(x+9,y+21,4,6,"#93a5ae");
 }
 // Rifles aim in the same direction as the user; sprites remain unchanged.
 if(p.aim<0){fill(x+8,y+1,3,12,"#1e293b");fill(x+9,y-3,2,5,"#e7ddd3");}
 else if(p.aim>0){fill(x+3,y+16,3,9,"#2c3247");fill(x+3,y+22,2,4,"#f2d7a8");}
 else{const bx=p.dir>0?x+10:x-7;fill(bx,y+12,10,3,"#111827");fill(bx+5,y+11,3,2,"#bfd8d9");}
 const hud=deadPlayers().length>1?["1","2"][p.id]:"",shade=p.id?"#66c2fb":"#f6d0a6";
 if(hud)pixelText(hud,x+3,y-12,shade,8);
}
function drawGrunt(e){
 const x=Math.round(e.x-scroll),y=Math.round(e.y);
 if(x<-30||x>W+30)return;
 ctx.save();if(e.dir===1){ctx.translate(x+e.w,0);ctx.scale(-1,1);}
 if(e.kind==="drone"){
  fill(0,y+4,13,5,"#e7a37a");fill(2,y,9,5,"#bb567a");
  fill(-5,y+4,6,3,"#527f89");fill(12,y+4,5,3,"#527f89");
  fill(5,y+5,3,3,"#fdf0b5");
 }else if(e.kind==="turret"){
  fill(1,y+6,17,13,"#394d55");fill(4,y+2,10,9,"#91a8ab");
  fill(-7,y+7,13,5,"#1f2a3b");fill(6,y+10,4,4,"#ffbd73");
  fill(3,y+16,13,4,"#99a9c9");
 }else{
  fill(3,y,9,7,"#a3af69");fill(4,y+4,7,4,"#684f41");
  fill(1,y+7,13,10,"#45675b");fill(2,y+14,13,6,"#385b4c");
  fill(0,y+12,7,3,"#1e272d");fill(0,y+19,5,4,"#242b37");fill(10,y+19,4,4,"#252d39");
 }
 ctx.restore();
}
function drawBoss(){
 if(!boss||boss.hp<=0)return;
 const x=Math.round(boss.x-scroll),y=Math.round(boss.y);
 if(x<-95||x>W+40)return;
 const theme=levels[stage].theme,accent=colors[theme].detail;
 if(stage===4&&allies.roerich){
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(allies.roerich,x+8,y+4,49,62);ctx.restore();
 }else{
  fill(x+9,y+6,47,64,"#253246");outline(x+8,y+3,50,67,"#9fa9b4");
  fill(x+12,y+12,39,32,stage===7?"#744360":"#4e738a");
  fill(x+21,y+16,21,19,stage===7?"#c36392":"#203a54");
  fill(x+25,y+20,11,11,stage===7?"#f1c9dc":"#fbba83");
  fill(x,y+25,12,9,"#17273e");fill(x+50,y+19,12,9,"#15233a");
  for(let i=0;i<3;i++)fill(x+16+i*12,y+52,7,7,accent);
  fill(x+6,y+64,16,9,"#1e2c41");fill(x+44,y+64,16,9,"#1e2c41");
 }
 fill(x+7,y-8,52,5,"#1b2130");
 fill(x+9,y-7,Math.max(1,Math.ceil(48*boss.hp/boss.maxHp)),3,"#ef647b");
 if(boss.time%32<6){fill(x+4,y+34,4,5,"#ffdb7b");}
}
function drawPickups(){
 for(const b of pickups){if(b.taken)continue;const x=Math.round(b.x-scroll),y=Math.round(b.y+Math.sin((frame+b.bob)/12)*3);
 if(x<-30||x>W+20)continue;
 fill(x,y,14,14,"#1a3d59");outline(x,y,14,14,b.kind==="H"?"#b9ffae":"#f1dd6e");
 fill(x+3,y+3,8,8,b.kind==="H"?"#5cbe83":"#8a6588");
 pixelText(b.kind,x+4,y+2,"#fff4cc",9);
 }
}
function drawHUD(){
 fill(0,0,W,23,"#071021");fill(0,22,W,1,"#5d8f9e");
 const active=players.map(p=>(p.id+1)+": "+Math.max(0,p.lives)+" ♥ "+p.weapon).join("   ");
 pixelText(active,5,5,"#e7d8a6",8);
 pixelText("ЭТАП "+(stage+1),W-7,5,"#afdcff",8,"right");
 fill(0,H-13,W,13,"#0d1526");
 pixelText("СЧЁТ: "+score,6,H-10,"#e6dcc7",7);
 if(boss&&boss.visible&&boss.hp>0)pixelText("БОСС",W-8,H-10,"#ff9da7",7,"right");
}
function render(){
 const shake=(cameraShake>0?Math.floor(hash(frame*94)*3)-1:0);
 ctx.save();ctx.translate(shake,0);
 drawBackground();drawGround();drawWorldDetails();
 drawPickups();enemies.forEach(e=>{if(!e.dead)drawGrunt(e)});
 drawBoss();
 for(const b of shots){fill(b.x-scroll,b.y,b.w+1,b.h,b.color);}
 for(const b of enemyShots){fill(b.x-scroll,b.y,4,4,"#fe8883");}
 players.forEach(drawPlayer);
 for(const p of particles){fill(p.x-scroll,p.y,2+Math.max(0,p.life/20),2,p.color);}
 for(const a of alerts){if(a.x-scroll>-170&&a.x-scroll<W+170)fitText(a.text,a.x-scroll,a.y,160,8);}
 drawHUD();ctx.restore();
 if(mode==="title")renderTitleArt();
}
function renderTitleArt(){
 // Actual inherited photos and character sheets are shown in the HTML menu;
 // the canvas behind the menu contains only thematic pixel scenery.
 if(coverImage){ctx.save();ctx.globalAlpha=.32;ctx.imageSmoothingEnabled=false;ctx.drawImage(coverImage,0,0,coverImage.width,coverImage.height,0,26,W,146);ctx.restore();}
 fill(0,H-58,W,58,"#152c47");
 for(let i=0;i<11;i++){fill(i*26-2,H-34-(i%3)*6,14,34+(i%3)*6,i%2?"#263f63":"#254353");}
}
function drawTitleBackground(){stage=0;scroll=Math.floor(frame*.42)%1100;render();}
function animate(ts){
 if(!lastTimestamp)lastTimestamp=ts;
 let delta=Math.min(.15,(ts-lastTimestamp)/1000);lastTimestamp=ts;accum+=delta;
 let loops=0;
 while(accum>=1/FPS&&loops<4){step();accum-=1/FPS;loops++;}
 if(mode==="title"){stage=0;scroll=(frame*.28)%1000;}
 render();
 animationHandle=requestAnimationFrame(animate);
}
function releaseTouch(){touchKeys.clear();for(const b of document.querySelectorAll("[data-touch]"))b.style.opacity="";}
function installEvents(){
 $("startSolo").onclick=()=>{releaseTouch();initGame(false);};
 $("startCoop").onclick=()=>{releaseTouch();initGame(true);};
 $("continue").onclick=nextStage;
 $("again").onclick=()=>{setOverlay("ОПЕРАЦИЯ «ДРУЗЬЯ»","Начни новую миссию с теми же героями.","title");stage=0;};
 $("pauseBtn").onclick=pauseGame;
 $("switchTouch").onclick=()=>{touchPlayer=1-touchPlayer;$("switchTouch").textContent="ИГРОК "+(touchPlayer+1);releaseTouch();};
 document.addEventListener("keydown",e=>{
  const code=e.code||e.key;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","Enter"].includes(code))e.preventDefault();
  if(e.repeat&&code==="Enter")return;
  keys.add(code);
  if(code==="Enter"){if(mode==="between"||mode==="paused")nextStage();else if(mode==="playing")pauseGame();
    else if(mode==="title")initGame(true);else if(mode==="gameover"||mode==="victory")setOverlay("ОПЕРАЦИЯ «ДРУЗЬЯ»","Выбери режим и начни ещё раз.","title");}
 });
 document.addEventListener("keyup",e=>keys.delete(e.code||e.key));
 window.addEventListener("blur",()=>{keys.clear();releaseTouch();});
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&mode==="playing")pauseGame();});
 for(const element of document.querySelectorAll("[data-touch]")){
  const input=element.dataset.touch;
  const on=e=>{e.preventDefault();const token=touchPlayer+":"+input;touchKeys.add(token);element.style.opacity="1";if(element.setPointerCapture)element.setPointerCapture(e.pointerId);};
  const off=e=>{e.preventDefault();touchKeys.delete(touchPlayer+":"+input);element.style.opacity="";};
  element.addEventListener("pointerdown",on,{passive:false});
  for(const type of ["pointerup","pointercancel","lostpointercapture"])element.addEventListener(type,off,{passive:false});
 }
}
loadArt().then(()=>{displayAvatar("heroBlack",0);displayAvatar("heroBlue",1);}).catch(console.warn);
installEvents();render();
animationHandle=requestAnimationFrame(animate);
window.FriendsContraDebug={get state(){return {mode,stage,frame,players:players.map(p=>({id:p.id,x:p.px,y:p.y,lives:p.lives,weapon:p.weapon,dead:p.dead})),score,boss:boss?{hp:boss.hp,x:boss.x}:null,scroll,enemies:enemies.length};},
 start: initGame,
 next:()=>{if(mode==="between")nextStage();},
 setStage:n=>{if(Number.isInteger(n)&&n>=0&&n<8){stage=n;if(!players.length)players=[player(0),player(1)];startStage();}},
 defeatBoss:()=>{if(boss){boss.hp=0;finishStage();}},
 get loadedArt(){return {heroes:!!(heroImage&&heroImage.complete&&heroImage.naturalWidth),toad:!!allies.toad,peach:!!allies.peach,cover:!!coverImage};}
};
})();