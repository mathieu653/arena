var crCx=()=>'',crGet=()=>null,crFill=()=>'#888',crBodyFx=()=>{},crUp=()=>{},crWpnFx=()=>{},crBul=()=>0,crKillAt=()=>{},crWin=()=>{},crS=0,crClick=()=>{},crMenuClick=()=>0;
const c=document.getElementById('c'),g=c.getContext('2d'),W=960,H=540,MW=1600,MH=1200;
const CH=[
{n:'Phénix',hp:120,sp:250,col:'#ff8a3c',cd:.14,dmg:9,bs:800,spr:.09,pel:1,life:.7,r:15,L:24,acd:22,ab:'rewind'},
{n:'Nitro',hp:100,sp:225,col:'#ff7ad9',cd:.14,dmg:10,bs:780,spr:.08,pel:1,life:.8,r:14,L:22,acd:12,ab:'tur'},
{n:'Jaguar',hp:100,sp:245,col:'#3a7bff',cd:.3,dmg:14,bs:820,spr:.04,pel:1,life:.9,r:14,L:22,acd:10,ab:'trap'},
{n:'Chum',hp:110,sp:220,col:'#8b5a2b',cd:.2,dmg:10,bs:760,spr:.06,pel:1,life:.8,r:15,L:22,acd:14,ab:'bot'},
{n:'Corona',hp:100,sp:230,col:'#e33a3a',cd:.6,dmg:11,bs:850,spr:.14,pel:3,life:.4,r:14,L:20,acd:14,ab:'flash'},
{n:'Zéphir',hp:75,sp:270,col:'#f5f5f5',cd:.6,dmg:11,bs:850,spr:.14,pel:3,life:.4,r:12,L:20,acd:14,ab:'invis5'},
{n:'Spider',hp:95,sp:235,col:'#9b59ff',cd:.22,dmg:10,bs:800,spr:.05,pel:1,life:.8,r:13,L:20,acd:6,ab:'tp'},
{n:'Aura',hp:100,sp:230,col:'#2de0e0',cd:.18,dmg:9,bs:780,spr:.06,pel:1,life:.8,r:14,L:20,acd:12,ab:'regen'},
{n:'Ixchel',hp:120,sp:215,col:'#3fcf5a',cd:.2,dmg:10,bs:760,spr:.06,pel:1,life:.8,r:16,L:22,acd:16,ab:'ixz'},
{n:'Voyageur du Vent',hp:85,sp:260,col:'#9fd8ff',cd:.17,dmg:9,bs:820,spr:.05,pel:1,life:.8,r:13,L:20,acd:3,ab:'dash'},
{n:'Calamité',hp:120,sp:225,col:'#c04bd8',cd:.15,dmg:11,bs:780,spr:.06,pel:1,life:.8,r:15,L:22,acd:16,ab:'inv'},
{n:'Broker',hp:110,sp:215,col:'#2b2b36',cd:.9,dmg:0,bs:560,spr:.02,pel:1,life:1.2,r:15,L:30,acd:9,ab:'salvo',rk:1},
{n:'Pathogène',hp:105,sp:230,col:'#c9a3ff',cd:.2,dmg:10,bs:780,spr:.06,pel:1,life:.8,r:14,L:20,acd:7,ab:'wall'},
{n:'Yuhei',hp:100,sp:235,col:'#ffd23a',cd:.17,dmg:10,bs:800,spr:.05,pel:1,life:.8,r:14,L:20,acd:12,ab:'shield4'},
{n:'Chamber',hp:100,sp:235,col:'#e0a800',cd:.36,dmg:16,bs:900,spr:.02,pel:1,life:.8,r:14,L:20,acd:16,ab:'sniper'},
{n:'Magmaar',hp:160,sp:205,col:'#ff5a1a',cd:.42,dmg:22,bs:740,spr:.03,pel:1,life:.8,r:17,L:24,acd:14,ab:'quake',sec:1},
{n:'Crocodile',hp:140,sp:235,col:'#1d5a2b',cd:.5,dmg:38,bs:0,spr:0,pel:0,life:0,r:16,L:30,acd:18,ab:'swim',ml:1,mr:78,ma:1.1,sec:2,hid:1,cr:1},
{n:'Tong Tong Sahur',hp:130,sp:225,col:'#b9824a',cd:.6,dmg:32,bs:0,spr:0,pel:0,life:0,r:15,L:46,acd:9,ab:'behind',ml:1,mr:84,ma:.95,sec:1},
{n:'Nécro-Sire',hp:125,sp:225,col:'#4be39a',cd:.3,dmg:13,bs:760,spr:.05,pel:1,life:.8,r:15,L:22,acd:14,ab:'nsum',sec:1}];
// ---- Nécro-Sire : invocation (Assassin / Tank / Archer / Mage) + série de kills en 3 stades ----
const NSK=2; // kills (sans mourir) nécessaires pour monter d'un stade : 2 / 4 / 6
const SUMT=[
{n:'Assassin',hp:45,sp:230,r:9,rn:20,rg:26,dm:12,mc:.5,pd:.5,pcd:7,col:'#a64bff',d:'Rapide · corps à corps · pouvoir : bond x2 dégâts'},
{n:'Tank',hp:150,sp:105,r:15,rn:24,rg:34,dm:10,mc:.8,pd:3,pcd:9,col:'#6fa04b',d:'Costaud · corps à corps · pouvoir : rempart tournoyant'},
{n:'Archer',hp:40,sp:130,r:10,rn:330,rg:0,dm:6,mc:.45,pd:2,pcd:8,col:'#e8d27a',d:'À distance · flèches · pouvoir : pluie de flèches'},
{n:'Mage',hp:35,sp:100,r:11,rn:300,rg:0,dm:0,mc:2.4,pd:.3,pcd:9,col:'#4bb6ff',d:'À distance · explosions · pouvoir : nova'}];
const SUMM=g=>1+.35*g; // bonus de PV / dégâts par stade
const necStage=()=>CH[me.c]&&CH[me.c].ab=='nsum'?Math.min(3,Math.floor((me.ns|0)/NSK)):0;
function necroKill(){if(!me.al||CH[me.c].ab!='nsum')return;const b=necStage();me.ns=(me.ns|0)+1;const n=necStage();if(n>b){feed.push({t:'☠ Invocation : stade '+n+'/3'+(n==3?' — POUVOIR débloqué !':' — renforcée !'),l:4});for(let i=0;i<26;i++)ptc(me.x,me.y,i%2?'#4be39a':'#c8ffe4')}}
function drawNecBar(){const k=me.ns|0,sg=necStage();g.save();g.textAlign='left';for(let i=0;i<3;i++){const x=14+i*75,f=Math.max(0,Math.min(1,(k-i*NSK)/NSK));g.fillStyle='#000a';g.fillRect(x,H-14,70,8);g.fillStyle=f>=1?'#4be39a':'#2a7a58';g.fillRect(x,H-14,70*f,8);g.strokeStyle=i<sg?'#c8ffe4':'#1e4a38';g.lineWidth=1;g.strokeRect(x+.5,H-13.5,69,7)}g.fillStyle='#9fe8c4';g.font='bold 11px'+F2;g.fillText('☠ Stade '+sg+'/3 · '+SUMT[SV.sm&3].n+(sg>=3?' · POUVOIR ACTIF':''),246,H-7);g.restore()}
const sumBtn=i=>({x:lcR.x+14+i*76,y:lcR.y+142,w:72,h:22});
function drawSumPick(p){const sm=SV.sm&3;g.save();g.textAlign='center';for(let i=0;i<4;i++){const r=sumBtn(i),T=SUMT[i],on=i==sm,h=inB(r,M.x,M.y);g.fillStyle=on?T.col:'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=on||h?'#fff':T.col;g.lineWidth=on||h?2.5:1.5;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle=on?'#10151f':T.col;g.font='bold 12px'+F2;g.fillText(T.n,r.x+r.w/2,r.y+15)}g.fillStyle='#8f9bb3';g.font='10px'+F2;g.fillText(SUMT[sm].d,p.x+p.w/2,p.y+p.h-28);g.restore()}
function depSum(){const st=SV.sm&3,sg=necStage(),id=(myPeer||'me')+':'+(++dpn),a=me.a;let x=me.x+Math.cos(a)*38,y=me.y+Math.sin(a)*38;if(hitW(x,y)||x<30||y<30||x>MW-30||y>MH-30){x=me.x;y=me.y}const o=initDp({id,k:'sum',x,y,ho:0,own:myPeer||'me',st,sg});addDp(o);snd('dep',{id,k:'sum',x:Math.round(x),y:Math.round(y),ho:0,st,sg});for(let i=0;i<24;i++)ptc(x,y,i%2?'#4be39a':'#2a7a58')}
function ctMark(n){for(let i=Math.max(0,Bu.length-n);i<Bu.length;i++)Bu[i].ct=1}
function sumStrike(o,rg,dm){for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<rg+14)hitBot(q,dm);if(BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+rg)bossHit(dm);for(const m of MINL.slice())if(Math.hypot(m.x-o.x,m.y-o.y)<rg+MNR)minHit(m,dm)}
function sumUpd(o,dt,mine){const T=SUMT[o.st],m=SUMM(o.sg|0),myId=myPeer||'me';o.mt-=dt;o.pw-=dt;if(ph.n!=0)return;
if(!mine){if(o.tx!=null){const f=1-Math.exp(-dt*14);o.x+=(o.tx-o.x)*f;o.y+=(o.ty-o.y)*f}
if(SV.mode!=2&&me.al){const d=Math.hypot(me.x-o.x,me.y-o.y),rr=CH[me.c].r;if(o.st==1&&o.pw>0){if(d<95+rr){const f=me.fl;hurtMe(22*m*dt,o.own);if(me.al)me.fl=f}}else if(T.rg&&d<T.rg+rr&&o.mt<=0){hurtMe(T.dm*m*(o.st==0&&o.pw>0?2:1),o.own);o.mt=T.mc}}return}
const sg=necStage();if(sg!=o.sg){if(sg>o.sg){o.hp=Math.min(T.hp*SUMM(sg),o.hp+T.hp*.35);for(let i=0;i<18;i++)ptc(o.x,o.y,'#c8ffe4')}o.sg=sg}o.mh=T.hp*SUMM(o.sg);
const tg=target(o);let mx=0,my=0,sp=T.sp*(1+.1*o.sg);
if(tg){const dx=tg.x-o.x,dy=tg.y-o.y,d=Math.hypot(dx,dy)||1;o.an=Math.atan2(dy,dx);if(d>T.rn){mx=dx/d;my=dy/d}else if(T.rn>100&&d<T.rn*.55){mx=-dx/d;my=-dy/d}}
else{const dx=me.x-o.x,dy=me.y-o.y,d=Math.hypot(dx,dy);if(d>90){mx=dx/d;my=dy/d}}
if(o.st==0&&o.pw>0)sp*=3.2;
o.x+=mx*sp*dt;o.y+=my*sp*dt;col(o,T.r);o.x=Math.max(30,Math.min(MW-30,o.x));o.y=Math.max(30,Math.min(MH-30,o.y));
o.pc-=dt;if(o.sg>=3&&o.pw<=0&&o.pc<=0&&tg&&Math.hypot(tg.x-o.x,tg.y-o.y)<(T.rn>100?T.rn+60:200)){o.pw=T.pd;o.pc=T.pcd;for(let i=0;i<24;i++)ptc(o.x,o.y,i%2?T.col:'#fff');if(o.st==3){const as=[];for(let i=0;i<8;i++)as.push(i*Math.PI/4);shoot(o.x,o.y,as,0,true,myId,1,0);ctMark(as.length);snd('shot',{x:o.x,y:o.y,as,c:0,g:1,d:0,ct:1})}}
if(tg){const d=Math.hypot(tg.x-o.x,tg.y-o.y);
if(T.rg){if(o.st==1&&o.pw>0)sumStrike(o,95,22*m*dt);else if(o.mt<=0&&d<T.rg+14){sumStrike(o,T.rg,T.dm*m*(o.st==0&&o.pw>0?2:1));o.mt=T.mc}}
else{o.cd-=dt;if(o.cd<=0&&d<T.rn+40){if(o.st==2){const dm=T.dm*m,as=o.pw>0?[o.an-.18,o.an,o.an+.18]:[o.an];o.cd=o.pw>0?T.mc/3:T.mc;shoot(o.x,o.y,as,0,true,myId,0,dm);snd('shot',{x:o.x,y:o.y,as,c:0,g:0,d:Math.min(30,dm)})}else{o.cd=T.mc/(1+.25*o.sg);shoot(o.x,o.y,[o.an],0,true,myId,1,0);ctMark(1);snd('shot',{x:o.x,y:o.y,as:[o.an],c:0,g:1,d:0,ct:1})}}}}
o.sy-=dt;if(o.sy<=0){o.sy=.1;snd('sm',{id:o.id,x:Math.round(o.x),y:Math.round(o.y),a:+(o.an||0).toFixed(2),p:o.pw>0?1:0,g:o.sg,h:Math.round(o.hp)})}}
function drawSum(o,mine){const T=SUMT[o.st],r=T.r,pw=o.pw>0;
if(pw&&o.st==1){g.fillStyle='rgba(111,160,75,.22)';g.beginPath();g.arc(0,0,95,0,7);g.fill();g.strokeStyle='#9fd06a';g.lineWidth=2;g.setLineDash([8,6]);g.lineDashOffset=-tt*30;g.stroke();g.setLineDash([])}
if(pw){g.shadowColor=T.col;g.shadowBlur=18}
g.fillStyle=T.col;g.strokeStyle=mine?'#4be39a':'#000';g.lineWidth=2;g.beginPath();g.arc(0,0,r,0,7);g.fill();g.stroke();g.shadowBlur=0;
g.fillStyle='#10151f';g.fillRect(-r*.5,-r*.3,r*.35,r*.3);g.fillRect(r*.15,-r*.3,r*.35,r*.3);
g.save();g.rotate(o.an||0);g.strokeStyle='#e8f5ee';g.fillStyle='#e8f5ee';g.lineWidth=2.5;
if(o.st==0){g.beginPath();g.moveTo(r,0);g.lineTo(r+12,0);g.stroke()}else if(o.st==1){g.lineWidth=5;g.beginPath();g.arc(0,0,r+3,-.8,.8);g.stroke()}else if(o.st==2){g.beginPath();g.arc(r-2,0,10,-1.2,1.2);g.stroke();g.lineWidth=1;g.beginPath();g.moveTo(r+3,-8);g.lineTo(r+3,8);g.stroke()}else{g.beginPath();g.moveTo(r-2,0);g.lineTo(r+12,0);g.stroke();g.fillStyle=pw?'#fff':'#9fe8ff';g.beginPath();g.arc(r+13,0,4,0,7);g.fill()}
g.restore();
for(let i=0;i<o.sg;i++){g.fillStyle='#4be39a';g.beginPath();g.arc((i-(o.sg-1)/2)*7,-r-14,2.6,0,7);g.fill()}
g.fillStyle='#000a';g.fillRect(-14,-r-10,28,4);g.fillStyle=mine?'#4be39a':'#e05a5a';g.fillRect(-14,-r-10,28*Math.max(0,o.hp/o.mh),4)}
// ---- Admin : incarner le boss de l'événement (ou remplacer le boss en cours) ----
let POS=0,posT=0,posK=0; // POS : 1 quand le serveur dit que CE joueur pilote le boss
function posReq(b){if(SV.mode!=2)joinLobby(2);net.send('bpos',b?{on:1,b}:{on:1})}
function posStart(){me.al=0;me.pl=0;mode=1;st=bp=shop=psk=0;admOpen=0;admBm=0;admP=0;menuOpen=0;posK=0;posT=0;feed.push({t:'🎮 Tu incarnes '+bossName()+' — clic : attaque · Maj/Espace : spécial · X : rendre le boss',l:7});pres()}
function posEnd(){me.al=0;mode=0;posK=0;feed.push({t:'Le boss est rendu à l\'IA',l:4});pres()}
function posUpd(dt){me.al=0;me.x=BS.x;me.y=BS.y;cam.x=Math.max(0,Math.min(MW-W,BS.x-W/2));cam.y=Math.max(0,Math.min(MH-H,BS.y-H/2));
const ov=st||shop||bp||psk||menuOpen||quitAsk;
if(K.KeyX){K.KeyX=0;net.send('bpos',{on:0});return}
if(!ov&&M.d)posK=1;if(AB){if(!ov)posK=2;AB=0}
posT+=dt;if(posT<.05)return;posT=0;
const dx=ov?0:((K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.KeyQ||K.ArrowLeft?1:0))+TV.mx,dy=ov?0:((K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.KeyZ||K.ArrowUp?1:0))+TV.my;
const a=TV.on?TV.aim:Math.atan2(M.y+cam.y-BS.y,M.x+cam.x-BS.x);
net.send('bctl',{dx:+dx.toFixed(2),dy:+dy.toFixed(2),a:+a.toFixed(2),k:posK});posK=0}
function drawPos(){g.save();g.textAlign='center';g.fillStyle='rgba(10,30,20,.78)';g.fillRect(W/2-300,72,600,26);g.fillStyle='#9fffc0';g.font='bold 13px'+F2;g.fillText('🎮 Tu incarnes '+bossName()+' · ZQSD : bouger · clic : attaque · Maj/Espace : spécial · X : rendre',W/2,90);g.restore()}
const B4=[[0,0,1600,24],[0,1176,1600,24],[0,0,24,1200],[1576,0,24,1200]];
const MAPS=[
{n:'Ruines',d:'Pierres, mousse et bloc central',fl:'#2b3a4a',gr:'#34475a',wa:'#56688a',wt:'#7e92b8',dc:['#2f5a45','#4a5568'],w:[...B4,[700,500,200,200],[220,220,220,36],[220,220,36,220],[1160,944,220,36],[1344,760,36,220],[1160,220,220,36],[1344,220,36,220],[220,944,220,36],[220,760,36,220],[760,180,80,120],[760,900,80,120],[300,560,60,80],[1240,560,60,80]]},
{n:'Forteresse',d:'Couloirs et murs épais',fl:'#3a3238',gr:'#4a4048',wa:'#7a6060',wt:'#a08080',dc:['#6b3030','#554a4a'],w:[...B4,[200,200,36,300],[200,700,36,300],[1364,200,36,300],[1364,700,36,300],[400,350,300,36],[900,350,300,36],[400,814,300,36],[900,814,300,36],[760,450,80,300],[500,560,120,80],[980,560,120,80]]},
{n:'Marais',d:'Piliers épars et flaques qui ralentissent',mud:[[380,420,200,120],[1020,420,200,120],[380,660,200,120],[1020,660,200,120],[700,430,200,90],[700,680,200,90],[150,150,180,110],[1270,940,180,110]],fl:'#1f3a2c',gr:'#2a4b39',wa:'#3f6e4d',wt:'#5f9a70',dc:['#2e6b44','#3a7a6a'],w:[...B4,[300,300,70,70],[1230,300,70,70],[300,830,70,70],[1230,830,70,70],[765,200,70,70],[765,930,70,70],[520,565,70,70],[1010,565,70,70],[200,560,50,80],[1350,560,50,80]]},
{n:'Fournaise',d:'Les flaques de lave brûlent !',fl:'#3a1f18',gr:'#4a2a20',wa:'#5e4a44',wt:'#826860',dc:['#7a3a20','#4a3028'],w:[...B4,[760,560,80,80]],lv:[[300,250,260,140],[1040,250,260,140],[300,810,260,140],[1040,810,260,140],[700,420,200,100],[700,680,200,100],[200,440,70,320],[1330,440,70,320]]},
{n:'Catacombes',d:'Plaques piégées : des pointes sortent !',fl:'#25253a',gr:'#30304a',wa:'#4d4872',wt:'#6f6a9a',dc:['#4a3a6a','#3a3a4a'],w:[...B4,[400,300,36,260],[1164,300,36,260],[400,640,36,260],[1164,640,36,260],[600,200,400,36],[600,964,400,36],[740,560,120,80]],pl:[[300,600],[800,300],[800,900],[1300,600],[560,450],[1040,450],[560,750],[1040,750],[800,480],[800,720],[200,300],[1400,900],[200,900],[1400,300]]},
{n:'Laboratoire',d:'Laser et bonus apparaissent toutes les 15 s',fl:'#18313b',gr:'#214452',wa:'#2c5a6c',wt:'#4a8aa0',dc:['#2f7a8a','#3a5a66'],w:[...B4,[660,420,80,40],[860,420,80,40],[660,740,80,40],[860,740,80,40],[300,520,40,160],[1260,520,40,160],[560,300,36,160],[1004,300,36,160],[560,740,36,160],[1004,740,36,160]],orb:[[800,600],[400,300],[1200,300],[400,900],[1200,900],[800,250],[800,950],[250,600],[1350,600]]},
{n:'Jungle',d:'Cache-toi dans les buissons',fl:'#2a4a2a',gr:'#356035',wa:'#4a6a3a',wt:'#6a9050',dc:['#3f9a3f','#6a8a5a'],w:[...B4,[500,300,60,60],[1040,300,60,60],[500,840,60,60],[1040,840,60,60],[780,560,40,80]],bu:[[250,200,260,200],[1090,200,260,200],[250,800,260,200],[1090,800,260,200],[650,450,300,300],[100,520,120,160],[1380,520,120,160],[700,100,200,100],[700,1000,200,100]]},
{n:'Nuit noire',d:'Tu ne vois que devant toi',fl:'#2a2a3e',gr:'#36364e',wa:'#4a4a6a',wt:'#6a6a92',dc:['#4a4a7a','#3a3a52'],vis:1,w:[...B4,[300,300,36,300],[1264,300,36,300],[300,640,300,36],[1000,640,300,36],[700,300,200,36],[700,860,200,36],[560,880,36,200],[1004,100,36,200],[800,560,60,60]]},
{n:'Antre du Boss',d:'Événement spécial : tous contre le boss',fl:'#241526',gr:'#2e1c34',wa:'#5a3a62',wt:'#8a5a96',dc:['#6a2a5a','#4a3a4a'],ev:1,w:[...B4,[500,340,70,70],[1030,340,70,70],[500,790,70,70],[1030,790,70,70]]},
{n:'Toundra',d:'Neige : tu glisses sur la glace !',fl:'#7a9bb2',gr:'#8aaac0',wa:'#4f7390',wt:'#dff3ff',dc:['#a9c9dd','#e8f4fb'],ice:1,snow:1,w:[...B4,[300,300,120,60],[1180,300,120,60],[300,840,120,60],[1180,840,120,60],[700,520,200,160],[520,200,60,140],[1020,200,60,140],[520,860,60,140],[1020,860,60,140]]}];
let WL=MAPS[0].w,mi=0;
const SP=[[100,100],[1500,100],[100,1100],[1500,1100],[800,120],[800,1080],[120,600],[1480,600]];
const net={now:()=>Date.now(),send(){},presence(){},adminLogin(){},adm(){},up(){return 0}};
let myPeer='',R={},bots=[],Bu=[],Pa=[],feed=[],cam={x:0,y:0},mode=0,AB=0,pt=0,tt=0,ph={n:0,left:300,id:0},DC=[];
const K={},M={x:480,y:270,d:0};
const me={x:800,y:1000,a:0,hp:0,c:0,k:0,cd:0,ab:0,iv:0,sh:0,al:0,ro:0,fl:0,dt:0,rx:0,ry:0,v:null,ri:0,rs:640,bn:0,bt:0,inv:0,pt:null,tc:0,bl:0,lz:0,rg:0,sc:0,fr:0,pl:0,dth:0,god:0,rdy:0,db:0,hs:0,sw:0,sn:0,bdm:0,sw2:0,vx:0,vy:0,ns:0};
const snd=(t,d)=>net.send(t,d);
const tag=p=>p===myPeer||p==='me'?'Toi':String(p).startsWith('bot')?'Bot '+((+String(p).slice(4)||0)+1):p==='env'?'Environnement':p==='boss'?bossName():(R[p]&&R[p].n)||'J-'+String(p).slice(0,3);
const fdHow=a=>{const c=(a===myPeer||a==='me')?me.c:(R[a]?R[a].c:-1);return c>=0&&CH[c]?' ('+CH[c].n+')':''};
const fd=(a,b)=>feed.push({t:tag(a)+fdHow(a)+' ▸ '+tag(b),k:1,l:5});
const ptc=(x,y,col)=>Pa.push({x,y,vx:(Math.random()-.5)*300,vy:(Math.random()-.5)*300,l:.5,col});
function col(o,r){for(const w of WL.concat(DP.filter(q=>q.k=='bw').map(q=>[q.x-q.w/2,q.y-q.h/2,q.w,q.h]))){const cx=Math.max(w[0],Math.min(o.x,w[0]+w[2])),cy=Math.max(w[1],Math.min(o.y,w[1]+w[3])),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);if(d<r){if(d>.01){o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}else o.y-=r}}}
const hitW=(x,y)=>WL.some(w=>x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3])||DP.some(o=>o.k=='bw'&&x>o.x-o.w/2&&x<o.x+o.w/2&&y>o.y-o.h/2&&y<o.y+o.h/2);
function spawnPos(){let best=SP[0],bd=-1;for(let i=0;i<8;i++){const s=SP[Math.random()*8|0];let d=1e9;for(const k in R)d=Math.min(d,Math.hypot(R[k].x-s[0],R[k].y-s[1]));d=Math.min(d,Math.hypot(me.x-s[0],me.y-s[1]));if(d>bd){bd=d;best=s}}return best}
function pick(i){if(mode==2&&me.dt>0)return;if(i>=CH.length||!owned(i))return;clrTp();if(ph.n==0&&!me.pl){me.pl=1;me.late=ph.left<=PL-60;if(SV.mode==1&&me.late)feed.push({t:'Partie en cours : tu peux gagner des RR mais pas en perdre',l:5})}const p=spawnPos();me.c=i;me.hp=CH[i].hp;me.x=p[0];me.y=p[1];me.al=1;me.cd=.5;me.ab=0;me.iv=me.sh=me.ro=me.ri=me.inv=me.bn=me.bl=0;me.lz=me.rg=me.db=me.brn=0;me.sn=me.sw=me.sw2=me.vx=me.vy=me.ns=0;me.pt=null;mode=1;pres()}
function shoot(x,y,as,ci,mine,own,gr,dm,lz,gd,sn,mt){const s=CH[ci];mt=mt&&s.ab=='quake';const sp=mt?430:sn?3400:gd?3000:lz?2200:gr?460:s.bs;as.forEach(a=>Bu.push({x:x+Math.cos(a)*20,y:y+Math.sin(a)*20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:mt?1.4:sn?.9:gd?.7:lz?.45:gr?.75:s.life,d:mt?0:sn?999:gd?60:lz?6:gr?0:s.rk?0:(dm||s.dmg),mine,own,gr,rk:mt?1:(!gr&&!lz&&!gd&&!sn&&s.rk?1:0),mt:mt?1:0,ci,lz:lz?1:0,gd:gd?1:0,sn:sn?1:0,bo:dm&&dm>s.dmg?1:0}))}
function boom(b){const R0=b.mt?78:b.rk?60:95,DM=b.mt?40:b.rk?34:48;if(b.mt&&b.mine)dep('lava',b.x,b.y,0);for(let i=0;i<24;i++)ptc(b.x,b.y,i%2?'#ffb347':'#fff3b0');if(!b.mine&&me.al&&SV.mode!=2){const d=Math.hypot(b.x-me.x,b.y-me.y);if(d<R0){hurtMe(DM*(1-d/(2*R0)),b.own);if(b.mt&&me.al){me.brn=3;me.bro=b.own}}}
if(b.mine)for(const o of bots)if(o.hp>0){const d=Math.hypot(b.x-o.x,b.y-o.y);if(d<R0)hitBot(o,DM*(1-d/(2*R0)))}
if(b.mine&&BS.al){const d=Math.max(0,Math.hypot(b.x-BS.x,b.y-BS.y)-BS.r);if(d<R0)bossHit(DM*(1-d/(2*R0)))}if(b.mine)for(const m of MINL){const d=Math.max(0,Math.hypot(b.x-m.x,b.y-m.y)-MNR);if(d<R0)minHit(m,DM*(1-d/(2*R0)))}}
function hitBot(o,d){o.hp-=d;o.fl=.1;if(o.hp<=0){o.dt=3;o.d=(o.d||0)+1;me.k++;necroKill();gain(20,1);botRR();crKillAt('me',o.x,o.y);fd('me','bot:'+bots.indexOf(o));for(let i=0;i<14;i++)ptc(o.x,o.y,'#c55')}}
function hurtMe(d,by){if(!me.al||me.ri>0||me.inv>0)return;if(me.sh>0)d*=.2;if(me.sw2>0)d*=.4;if(me.bn>0){const a=Math.min(me.bn,d);me.bn-=a;d-=a}me.hp-=d;me.fl=.12;if(me.hp<=0){if(me.pt){me.hp=me.pt.hp;me.x=me.pt.x;me.y=me.pt.y;me.pt=null;me.ri=.6;for(let i=0;i<20;i++)ptc(me.x,me.y,'#ff8a3c');return}me.al=0;me.ns=0;mode=2;me.dt=2;clrTp();me.kby=tag(by);me.dth++;if(SV.mode==2&&by==='boss'&&!(me.bdm>0)&&!SV.xc)unlockCroc();if(String(by).startsWith('bot:')){const bb=bots[+String(by).slice(4)];if(bb)bb.k=(bb.k||0)+1}snd('kill',{by,vic:myPeer});fd(by,'me');crKillAt(by,me.x,me.y);for(let i=0;i<20;i++)ptc(me.x,me.y,CH[me.c].col);pres()}}
function pres(){net.presence({x:Math.round(me.x),y:Math.round(me.y),a:+me.a.toFixed(2),hp:Math.round(me.hp),c:me.c,k:me.k,al:me.al,iv:me.iv>0?1:0,sh:(me.sh>0||me.inv>0)?1:0,v:me.v,m:mi,s:SV.skin,b:Math.round(me.bn),n:SV.name,pk:curPk(),cx:crCx(),rv:me.fr>0?1:0,md:SV.mode,pl:me.pl?1:0,dd:me.dth||0,rk:SV.rk.r,rd:me.rdy,pw:me.pt?1:0,go:me.god?1:0,sn:(me.sn&&me.al)?1:0,cs:(me.sw2>0&&me.al)?1:0})}
function upd(dt){tick();tt+=dt;me.sc-=dt;me.fl-=dt;me.dt-=dt;me.sw-=dt;me.sw2-=dt;if(me.brn>0){me.brn-=dt;if(me.al&&ph.n==0){const f=me.fl;hurtMe(7*dt,me.bro);if(me.al)me.fl=f;if(Math.random()<dt*25)ptc(me.x+(Math.random()-.5)*20,me.y+(Math.random()-.5)*20,Math.random()<.5?'#ff8a1a':'#ffd23a')}else me.brn=0}
if(me.al&&ph.n==0){const s=CH[me.c],dx=((K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.KeyQ||K.ArrowLeft?1:0))+TV.mx,dy=((K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.KeyZ||K.ArrowUp?1:0))+TV.my,l=Math.hypot(dx,dy)||1;
if(TV.on)me.a=TV.aim;else if(SV.ctl){if(dx||dy)me.la=Math.atan2(dy,dx);me.a=me.la||0}else me.a=Math.atan2(M.y+cam.y-me.y,M.x+cam.x-me.x);me.cd-=dt;me.ab-=dt;me.iv-=dt;me.sh-=dt;me.hs-=dt;me.db-=dt;me.lz-=dt;me.fr-=dt;if(me.god){me.ri=Math.max(me.ri,.3);me.hp=CH[me.c].hp}if(me.rg>0){me.rg-=dt;me.hp=Math.min(CH[me.c].hp,me.hp+7*dt);if(Math.random()<.2)ptc(me.x,me.y,'#7dff9a')}const mp=MAPS[mi];if(mp.lv&&mp.lv.some(r=>me.x>r[0]-4&&me.x<r[0]+r[2]+4&&me.y>r[1]-4&&me.y<r[1]+r[3]+4))hurtMe(45*dt,'env');for(const ob of orbList()){if(Math.hypot(me.x-ob.x,me.y-ob.y)<30){orbPicked.add(ob.k);snd('orb',{k:ob.k});applyOrb(ob.t)}}me.ri-=dt;me.bt-=dt;if(me.bt<=0)me.bn=0;me.bl-=dt;me.tc-=dt;me.inv-=dt;if(inIx(me.x,me.y)){me.iv=me.sh=me.inv=me.bn=0;me.pt=null}if(me.pt){me.pt.t-=dt;if(me.pt.t<=0){me.x=me.pt.x;me.y=me.pt.y;me.hp=me.pt.hp;me.pt=null;me.ri=.3;for(let i=0;i<24;i++)ptc(me.x,me.y,'#ff8a3c')}}
if(me.ro>0){me.ro-=dt;me.x+=me.rx*me.rs*dt;me.y+=me.ry*me.rs*dt;if(Math.random()<.5)ptc(me.x,me.y,'#8f8')}else{const sp=s.sp*(me.sh>0?.6:1)*(me.hs>0?1.6:1)*(me.sw2>0?2.3:1)*(inMud(me.x,me.y)?.5:1);if(mp.ice){const f=1-Math.exp(-dt*(dx||dy?2.2:.9));me.vx+=(dx/l*sp-me.vx)*f;me.vy+=(dy/l*sp-me.vy)*f;me.x+=me.vx*dt;me.y+=me.vy*dt}else{me.vx=me.vy=0;me.x+=dx/l*sp*dt;me.y+=dy/l*sp*dt}}
col(me,s.r);bossPush(me,s.r);
if((M.d||(SV.ctl&&(K.KeyJ||K.KeyF)))&&me.cd<=0&&me.ro<=0&&me.inv<=0){const lz=me.lz>0,gd=me.god?1:0;me.fr=.6;if(s.ml&&!lz&&!gd){me.cd=s.cd;doMelee(s)}else if(me.sn&&!lz&&!gd){me.cd=.5;doSniper(s)}else{me.cd=gd?.12:lz?.06:s.cd;const as=[];if(lz||gd)as.push(me.a);else for(let i=0;i<s.pel;i++)as.push(me.a+(Math.random()-.5)*s.spr*2);const dm=me.db>0&&!s.rk?Math.min(30,s.dmg*2):0;const mt=s.ab=='quake'&&!lz&&!gd&&((me.mc=(me.mc|0)+1)%4==0)?1:0;shoot(me.x,me.y,as,me.c,true,myPeer||'me',0,dm,lz,gd,0,mt);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0,lz:lz?1:0,gd,d:dm,mt});if(mt)for(let i=0;i<10;i++)ptc(me.x+Math.cos(me.a)*26,me.y+Math.sin(me.a)*26,i%2?'#ff7a1a':'#ffd23a')}}
if(AB&&me.ab<=0){me.ab=s.acd;useAb(s,dx,dy,l)}
AB=0;cam.x=Math.max(0,Math.min(MW-W,me.x-W/2));cam.y=Math.max(0,Math.min(MH-H,me.y-H/2))}
evUpd(dt);if(POS)posUpd(dt);if((pt+=dt)>.033){pt=0;pres()}
const nr=Object.keys(R).length,rkn=Object.values(R).filter(o=>o.md==1).length,want=SV.mode==2?0:SV.mode?(rkn?0:3):(nr?0:2);if(!want)bots=[];else{bots.length=Math.min(bots.length,want);while(bots.length<want){const p=SP[Math.random()*8|0];bots.push({x:p[0],y:p[1],hp:60,a:0,cd:1,fl:0,dt:0,k:0,d:0})}}
for(const o of bots){if(o.hp<=0){if(o.dt-=dt,o.dt<=0){const p=SP[Math.random()*8|0];Object.assign(o,{x:p[0],y:p[1],hp:60})}continue}
o.fl-=dt;const d=Math.hypot(me.x-o.x,me.y-o.y);o.a=Math.atan2(me.y-o.y,me.x-o.x);const m=d>280?1:-.3;o.x+=Math.cos(o.a+Math.sin(tt*2)*.5)*90*m*dt;o.y+=Math.sin(o.a+Math.sin(tt*2)*.5)*90*m*dt;col(o,14);
o.cd-=dt;if(me.al&&ph.n==0&&d<560&&o.cd<=0){o.cd=.7;shoot(o.x,o.y,[o.a+(Math.random()-.5)*.3],0,false,'bot:'+bots.indexOf(o),0);Bu[Bu.length-1].d=8}}
PLT.forEach((p,i)=>{p.t-=dt;if(p.s==0){if(me.al&&ph.n==0&&Math.hypot(me.x-p.x,me.y-p.y)<24){p.s=1;p.t=.6;snd('plate',{i})}}else if(p.s==1&&p.t<=0){p.s=2;p.t=.7;p.h=0}else if(p.s==2){if(me.al&&!p.h&&Math.hypot(me.x-p.x,me.y-p.y)<46){p.h=1;hurtMe(32,'env')}if(p.t<=0){p.s=3;p.t=5}}else if(p.s==3&&p.t<=0)p.s=0});
const myId=myPeer||'me';
for(const o of DP){o.l-=dt;const mine=o.own===myId;if(o.k=='sum')sumUpd(o,dt,mine);
if((o.k=='tur'||o.k=='bot')&&mine&&ph.n==0){o.cd-=dt;if(o.cd<=0){const tg=target(o);if(tg){o.cd=o.k=='tur'?1.1:.3;const an=Math.atan2(tg.y-o.y,tg.x-o.x)+(Math.random()-.5)*.1,dm=o.k=='tur'?8:5;o.an=an;shoot(o.x,o.y,[an],0,true,myId,0,dm);snd('shot',{x:o.x,y:o.y,as:[an],c:0,g:0,d:dm})}else o.cd=.2}}
if(o.k=='trap'){if(!o.act&&!mine&&SV.mode!=2&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<45){o.act=5;snd('act',{id:o.id})}if(!o.act&&mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<45)o.act=5;if(!o.act&&mine&&BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+45)o.act=5;
if(o.act>0){o.act-=dt;if(!mine&&SV.mode!=2&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<70)hurtMe(14*dt,o.own);if(mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<70)hitBot(q,14*dt);if(mine&&BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+70)bossHit(28*dt);if(o.act<=0)o.l=0}}
if(o.k=='lava'){const rr=o.rad;if(!mine&&SV.mode!=2&&me.al&&ph.n==0&&Math.hypot(me.x-o.x,me.y-o.y)<rr+CH[me.c].r*.5){const f=me.fl;hurtMe(18*dt,o.own);if(me.al)me.fl=f;me.brn=Math.max(me.brn||0,1.5);me.bro=o.own}if(mine){for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<rr)hitBot(q,18*dt);if(BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+rr)bossHit(30*dt)}}
if(o.k=='tp'&&mine&&me.al&&me.tc<=0){const ps=DP.filter(q=>q.k=='tp'&&q.own==myId);if(ps.length==2&&Math.hypot(me.x-o.x,me.y-o.y)<22){const q=ps[0]==o?ps[1]:ps[0];me.x=q.x;me.y=q.y;me.tc=1;for(let i=0;i<14;i++)ptc(q.x,q.y,'#c9a0ff')}}
if(o.k=='ixz'){for(const q of DP)if(q.k!='ixz'&&Math.hypot(q.x-o.x,q.y-o.y)<170)q.l=0;for(const b of Bu)if(b.gr&&Math.hypot(b.x-o.x,b.y-o.y)<170){b.l=-1;b.nb=1}}}
DP=DP.filter(o=>o.l>0&&o.hp>0);
for(const b of Bu){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;let dead=b.l<=0;
for(const o of DP)if(o.k=='bw'&&Math.abs(b.x-o.x)<o.w/2&&Math.abs(b.y-o.y)<o.h/2){o.hp-=b.d||25;ptc(o.x,o.y,'#c9a3ff');dead=true;break}
if(hitS(b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y))dead=true;
if(!dead&&!b.gr){if(!b.mine&&SV.mode!=2&&me.al&&!b.hm&&me.ri<=0&&me.inv<=0&&segD(me.x,me.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<CH[me.c].r+(b.gd?22:0)){hurtMe(b.d,b.own);if(b.ci!=null&&CH[b.ci]&&CH[b.ci].ab=='quake'&&me.al){me.brn=3;me.bro=b.own}if(b.gd)b.hm=1;else dead=true}
if(b.mine)for(const o of bots)if(o.hp>0&&segD(o.x,o.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<15+(b.gd?22:0)){hitBot(o,b.d);if(!b.gd)dead=true;break}}
if(!dead&&BS.al&&!b.gr&&segD(BS.x,BS.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<BS.r+(b.gd?22:0)){if(b.mine&&!b.bh)bossHit(b.sn?SNB:(b.d||0));if(b.gd)b.bh=1;else dead=true}if(!dead&&b.mine&&!b.gr&&MINL.length&&minBullet(b,dt))dead=true;
if(!dead&&!b.gr&&SV.mode!=2)for(const o of DP)if((o.k=='tur'||o.k=='bot'||o.k=='trap'||o.k=='tp'||o.k=='sum')&&o.own!==b.own&&Math.hypot(b.x-o.x,b.y-o.y)<14){o.hp-=b.d;dead=true;ptc(o.x,o.y,'#ff9');break}
if(!dead&&b.ct){if(!b.mine){if(SV.mode!=2&&me.al&&me.ri<=0&&me.inv<=0&&Math.hypot(me.x-b.x,me.y-b.y)<CH[me.c].r+8)dead=true}else{for(const o of bots)if(o.hp>0&&Math.hypot(o.x-b.x,o.y-b.y)<22){dead=true;break}if(!dead&&BS.al&&Math.hypot(BS.x-b.x,BS.y-b.y)<BS.r+6)dead=true;if(!dead)for(const m of MINL)if(Math.hypot(m.x-b.x,m.y-b.y)<MNR+6){dead=true;break}}}
if(dead){b.x-=b.vx*dt;b.y-=b.vy*dt;if(b.gr||b.rk){if(!b.nb)boom(b)}else ptc(b.x,b.y,'#ffd');b.l=-1}}
Bu=Bu.filter(b=>b.l>0);for(const q of Pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt}Pa=Pa.filter(q=>q.l>0);
for(const k in R){const o=R[k];o.ex=Math.min(.1,(o.ex||0)+dt);if(o.sw>0)o.sw-=dt;const px=o.tx+(o.vx||0)*o.ex,py=o.ty+(o.vy||0)*o.ex;if(Math.hypot(px-o.x,py-o.y)>260){o.x=px;o.y=py}else{const f=1-Math.exp(-dt*22);o.x+=(px-o.x)*f;o.y+=(py-o.y)*f}}
feed.forEach(f=>f.l-=dt);feed=feed.filter(f=>f.l>0)}
function pl(x,y,a,ci,hp,tg,iv,sh,isMe,fl,sk,bn,pk,rk,ex){ex=ex||{};const s=CH[ci],cb=crGet(ex.cx,'b'),cw=crGet(ex.cx,'w');if(cb){pk=0;sk=0}ex.rs=!!SKINS[sk|0].an;g.save();g.translate(x-cam.x,y-cam.y);g.globalAlpha=iv?(isMe?.35:0):1;if(!g.globalAlpha){g.restore();return}
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(4,6,s.r,s.r*.85,0,0,7);g.fill();if(ex.cs)wake(s.r);g.rotate(a);if(ex.go)wings(s.r);wpn(s,ex);if(cw)crWpnFx(s,cw);
g.fillStyle=fl>0?'#fff':ex.go?'#fff7dc':(cb?crFill(cb,s.r):pk?PACKS[pk-1].col:SKINS[sk|0].c||s.col);g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle=s.col=='#2b2b36'?'#aab6d0':'rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();if(s.cr)scales(s);if(!ex.go){drawDet(pk,s);if(!pk){rkFx(s,sk);if(ex.rs)radFx(s)}}if(cb&&!ex.go)crBodyFx(s,cb);g.rotate(-a);if(cb&&!ex.go)crUp(s,cb);if(ex.go)angelFx(s.r);
if(sh){g.strokeStyle='rgba(120,220,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,s.r+7,0,7);g.stroke()}
g.fillStyle='#000a';g.fillRect(-18,-s.r-14,36,5);g.fillStyle=hp/s.hp>.35?'#6fd16f':'#e25a4a';g.fillRect(-18,-s.r-14,36*Math.max(0,hp/s.hp),5);if(bn>0){g.fillStyle='#b070ff';g.fillRect(-18+36*Math.min(1,Math.max(0,hp)/s.hp),-s.r-14,36*bn/s.hp,5)}g.fillStyle=rk==null?'#e6ecf5':rankFill(rk,0,90);g.font='bold 12px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(tg,0,-s.r-18);if(!ex.nl){g.font='bold 11px Trebuchet MS,sans-serif';g.lineWidth=3;g.lineJoin='round';g.strokeStyle='rgba(0,0,0,.75)';g.strokeText(s.n,0,s.r+15);g.fillStyle=s.col=='#2b2b36'?'#aab6d0':s.col;g.fillText(s.n,0,s.r+15)}g.restore()}
function draw(){g.setTransform(1,0,0,1,0,0);g.fillStyle=MAPS[mi].fl;g.fillRect(0,0,W,H);g.save();g.translate(-cam.x,-cam.y);
g.strokeStyle=MAPS[mi].gr;g.lineWidth=1;for(let x=0;x<=MW;x+=80){g.beginPath();g.moveTo(x,0);g.lineTo(x,MH);g.stroke()}for(let y=0;y<=MH;y+=80){g.beginPath();g.moveTo(0,y);g.lineTo(MW,y);g.stroke()}
for(const d of DC){if(d.x<cam.x-150||d.x>cam.x+W+150||d.y<cam.y-100||d.y>cam.y+H+100)continue;const m=MAPS[mi];g.save();g.translate(d.x,d.y);g.scale(d.s,d.s);
if(d.t==0){g.strokeStyle=m.dc[0];g.lineWidth=2;for(let j=-1;j<2;j++){g.beginPath();g.moveTo(j*5,0);g.quadraticCurveTo(j*5+Math.sin(tt+d.x)*2,-8,j*7,-14);g.stroke()}}
else if(d.t==1){g.fillStyle=m.dc[1];g.beginPath();g.ellipse(0,0,10,7,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.08)';g.beginPath();g.ellipse(-2,-2,5,3,0,0,7);g.fill()}
else if(d.t==2){g.fillStyle='rgba(90,140,200,.13)';g.beginPath();g.ellipse(0,0,26,13,0,0,7);g.fill()}
else if(d.t==4){g.fillStyle='rgba(255,255,255,.025)';g.beginPath();g.ellipse(0,0,140,90,0,0,7);g.fill()}
else{g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(-14,0);g.lineTo(-3,4);g.lineTo(4,-3);g.lineTo(15,2);g.stroke()}g.restore()}
drawHaz();for(const w of WL){g.fillStyle='#000';g.fillRect(w[0]+6,w[1]+8,w[2],w[3]);g.fillStyle=MAPS[mi].wa;g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle=MAPS[mi].wt;g.fillRect(w[0],w[1],w[2],5)}
g.globalCompositeOperation='lighter';WL.slice(4).forEach((w,i)=>{const gx=w[0],gy=w[1],f=.13+.05*Math.sin(tt*5+i*2),r=g.createRadialGradient(gx,gy,2,gx,gy,110);r.addColorStop(0,'rgba(255,170,80,'+f+')');r.addColorStop(1,'rgba(255,170,80,0)');g.fillStyle=r;g.fillRect(gx-110,gy-110,220,220)});g.globalCompositeOperation='source-over';
g.restore();
drawDP();drawArena();drawMinions();drawBoss();drawMeteors();for(const b of bots)if(b.hp>0)pl(b.x,b.y,b.a,0,b.hp*100/60,'Bot',0,0,0,b.fl,0,0,0,null,{nl:1});
for(const k in R){const o=R[k];if(o.al&&!(inBush(o.x,o.y)&&!o.rv&&Math.hypot(o.x-me.x,o.y-me.y)>110)){if(o.pw){phAura(o.x,o.y,CH[o.c].r);if(o.px!=null)phMark(o.px,o.py)}pl(o.x,o.y,o.a,o.c,o.hp,tag(k),o.iv,o.sh,0,0,o.s,o.b,o.pk,o.rk,{sw:o.sw,go:o.go,sn:o.sn,cs:o.cs,cx:o.cx})}}
if(me.al){if(me.pt)phAura(me.x,me.y,CH[me.c].r);pl(me.x,me.y,me.a,me.c,me.hp,SV.name,me.iv>0,me.sh>0||me.inv>0,1,me.fl,SV.skin,me.bn,curPk(),SV.rk.r,{sw:me.sw,go:me.god,sn:me.sn,cs:me.sw2>0,cx:crCx()})}
drawBush();for(const b of Bu){if(crBul(b))continue;if(b.mt){drawFire(b);continue}if(b.gd){const x0=b.x-cam.x,y0=b.y-cam.y;g.lineCap='round';g.strokeStyle='rgba(255,60,255,.35)';g.lineWidth=40;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0-b.vx*.08,y0-b.vy*.08);g.stroke();g.strokeStyle='#fff';g.lineWidth=12;g.stroke();g.lineCap='butt';continue}if(b.sn){const x0=b.x-cam.x,y0=b.y-cam.y;g.lineCap='round';g.strokeStyle='rgba(255,210,60,.35)';g.lineWidth=14;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0-b.vx*.06,y0-b.vy*.06);g.stroke();g.strokeStyle='#fff6c0';g.lineWidth=4;g.stroke();g.lineCap='butt';continue}if(b.lz){g.strokeStyle='rgba(120,255,255,.9)';g.lineWidth=3;g.beginPath();g.moveTo(b.x-cam.x,b.y-cam.y);g.lineTo(b.x-cam.x-b.vx*.03,b.y-cam.y-b.vy*.03);g.stroke();continue}g.fillStyle=b.gr?'#ffb347':b.rk?'#ff6a3a':b.bo?'#ff4a4a':'#fff6c0';g.beginPath();g.arc(b.x-cam.x,b.y-cam.y,b.gr?6:b.rk?5:b.bo?4:3,0,7);g.fill()}
for(const q of Pa){g.globalAlpha=Math.max(0,q.l*2);g.fillStyle=q.col;g.fillRect(q.x-cam.x,q.y-cam.y,3,3)}g.globalAlpha=1;
drawFog();drawSnow();{const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=v;g.fillRect(0,0,W,H)}
if(me.bl>0){g.fillStyle='rgba(255,255,255,'+(me.bl>4?1:.1+.11*me.bl)+')';g.fillRect(0,0,W,H)}
if(me.sc>0)drawScream();
drawTop();g.textAlign='right';g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+'  ·  Palier '+tier()+'  ·  B : Battle Pass  ·  M : musique',W-14,H-14);
g.textAlign='left';g.font='13px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(SV.mode==2?"Événement spécial — équipe : "+(nr()+1)+" joueur"+(nr()?"s":""):nr()?('En ligne : '+(Object.keys(R).length+1)+' joueurs'):'Seul : 2 bots t\'attendent. Partage le lien pour jouer à plusieurs.',14,22);
const sc=[['Toi',me.k,SV.rk.r],...Object.keys(R).map(k=>[tag(k),R[k].k,R[k].rk])].sort((a,b)=>b[1]-a[1]);g.textAlign='right';sc.slice(0,6).forEach((s,i)=>{g.fillStyle=s[2]!=null?rankFill(s[2],W-70,130):'#c5cfe0';g.fillText(s[0]+(SV.mode==2?'':'  '+s[1]),W-14,22+i*17)});
/* le feed (kills, paliers…) s'affiche maintenant dans le chat (chat.js) */
if(POS)drawPos();if(me.al){const s=CH[me.c];if(s.ab=='nsum')drawNecBar();g.fillStyle='#000a';g.fillRect(14,H-44,220,12);g.fillStyle='#6fd16f';g.fillRect(14,H-44,220*Math.max(0,me.hp/s.hp),12);if(me.bn>0){g.fillStyle='#b070ff';g.fillRect(14+220*Math.min(1,Math.max(0,me.hp)/s.hp),H-44,220*me.bn/s.hp,12)}g.fillStyle='#000a';g.fillRect(14,H-26,220,8);g.fillStyle=me.sn?'#ffd23a':me.ab<=0?'#7ad0ff':'#456';g.fillRect(14,H-26,220*(me.ab<=0||me.sn?1:Math.max(0,1-me.ab/s.acd)),8);g.fillStyle='#e6ecf5';g.fillText(s.n+(me.sn?' — 🎯 SNIPER ÉQUIPÉ : une seule balle':me.ab<=0?' — capacité prête (Maj / Espace / clic droit)':'')+(me.lz>0?'   ⚡ LASER '+Math.ceil(me.lz)+' s':'')+(me.hs>0?'   » VITESSE '+Math.ceil(me.hs)+' s':'')+(me.db>0?'   ✦ DÉGÂTS x2 '+Math.ceil(me.db)+' s':''),14,H-52)}
if(mode!=1){drawSelScreen()}}
function nr(){return Object.keys(R).length}
const PL=300,SC=10,VT=15,CY=PL+SC+VT;
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
function phase(){if(SV.mode==2)return{n:0,left:PL,id:0};const t=net.now()/1000,e=t%CY,id=Math.floor(t/CY);return e<PL?{n:0,left:PL-e,id}:e<PL+SC?{n:1,left:PL+SC-e,id}:{n:2,left:CY-e,id}}
function tally(){const a=[0,0,0];if(me.v!=null)a[me.v]++;for(const k in R){const v=R[k].v;if(v!=null&&v>=0&&v<3)a[v]++}return a}
function winner(id){const a=tally(),m=Math.max(...a);return cands(id)[m?a.indexOf(m):0]}
function genDecor(){let sd=mi*977+13;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;DC=[];for(let i=0;i<14;i++)DC.push({x:r()*1600,y:r()*1200,t:4,s:.6+r()});
for(let i=0;i<280;i++){const x=40+r()*1520,y=40+r()*1120,t=r()*4|0,s2=.6+r();if(WL.concat(MAPS[mi].lv||[]).some(w=>x>w[0]-24&&x<w[0]+w[2]+24&&y>w[1]-24&&y<w[1]+w[3]+24))continue;DC.push({x,y,t,s:s2})}}
function setMap(i){mi=i%MAPS.length;WL=MAPS[mi].w;genDecor();Bu=[];DP=[];PLT=(MAPS[mi].pl||[]).map(p=>({x:p[0],y:p[1],s:0,t:0}));orbPicked=new Set()}
let lastPh=null;
function tick(){const p=phase(),l=lastPh;ph=p;if(!l||(l.n==p.n&&l.id==p.id)){lastPh=p;return}lastPh=p;Bu=[];M.d=0;if(l.n==0&&!(p.n==0&&p.id==l.id)){crWin(l.id);rankEnd(l.id)}
if(p.n==0){setMap(winner(l.id));me.k=0;me.ns=0;me.dth=0;me.pl=0;me.late=0;me.brr=0;rkRes=null;bots.forEach(b=>{b.k=0;b.d=0});me.v=null;me.al=0;mode=0;pres()}else if(p.n==1){}else if(p.n==2){me.v=null;pres()}}
function voteClick(){for(let i=0;i<3;i++){const x=60+i*292;if(M.x>x&&M.x<x+268&&M.y>150&&M.y<440){me.v=i;pres()}}}
function overlays(){overlays0();if(psk||st||shop||bp)drawBack();if(quitOk())drawQuit();if(quitAsk&&quitOk())drawQuitAsk();if(!(psk||st||shop||bp||menuOpen)&&ph.n>0)drawReady();if(TV.on&&mode==1&&ph.n==0&&!(psk||st||shop||bp||menuOpen))drawTouch();drawBanner();drawAnn()}
function overlays0(){if(!st)admP=0;if(psk){drawPacks();return}if(st){drawSt();return}if(shop){drawShop();return}if(bp){drawBP();return}if(menuOpen){drawMenu();return}if(ph.n==0)return;g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);g.textAlign='center';const F=' Trebuchet MS,sans-serif';
if(ph.n==1){g.fillStyle='#ffd98a';g.font='bold 54px'+F;g.fillText('Fin de la partie',W/2,80);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Vote de la carte dans '+Math.ceil(ph.left)+' s',W/2,112);drawRankRes();
[['Toi',me.k,1,SV.rk.r],...Object.keys(R).map(k=>[tag(k),R[k].k,0,R[k].rk])].sort((a,b)=>b[1]-a[1]).slice(0,8).forEach((r,i)=>{const y=175+i*42;g.fillStyle=r[3]!=null?rankFill(r[3],340,200):i==0?'#ffd98a':r[2]?'#7ad0ff':'#c5cfe0';g.font=(i==0?'bold 34px':'28px')+F;g.textAlign='left';g.fillText((i+1)+'.  '+r[0],250,y);g.textAlign='right';g.fillText(r[1]+' kills',710,y)})}
else{g.fillStyle='#f0e6d0';g.font='bold 40px'+F;g.fillText('Vote : prochaine carte',W/2,70);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Clique ou touches 1-3 — début dans '+Math.ceil(ph.left)+' s',W/2,104);const a=tally();
cands(ph.id).forEach((mm,i)=>{const m=MAPS[mm],x=60+i*292,y=150;g.fillStyle='#161d2a';g.fillRect(x,y,268,290);g.strokeStyle=me.v===i?'#ffd98a':m.wt;g.lineWidth=me.v===i?4:2;g.strokeRect(x,y,268,290);g.fillStyle=m.fl;g.fillRect(x+14,y+14,240,150);g.fillStyle=m.wa;[...m.w,...(m.lv||[])].forEach(w=>g.fillRect(x+14+w[0]*.15,y+14+w[1]*.125,Math.max(2,w[2]*.15),Math.max(2,w[3]*.125)));
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F;g.fillText((i+1)+'. '+m.n,x+134,y+198);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText(m.d,x+134,y+222);g.fillStyle='#ffd98a';g.font='bold 20px'+F;g.fillText(a[i]+' vote'+(a[i]>1?'s':''),x+134,y+258)})}}
function netEvent(t,d,from){d=d||{};if(t=='shot'){if(ph.n||!Array.isArray(d.as))return;shoot(+d.x||0,+d.y||0,d.as.slice(0,12).map(Number),Math.min((d.c|0)&31,CH.length-1),false,from,d.g?1:0,Math.min(30,+d.d||0),d.lz?1:0,d.gd?1:0,d.sn?1:0,d.mt?1:0);if(d.ct)ctMark(Math.min(12,d.as.length))}else if(t=='kill'){fd(d.by,d.vic||from);if(d.by&&d.by===myPeer){me.k++;necroKill();gain(20,1);pres()}}else if(t=='dep'){addDp(initDp({id:String(d.id).slice(0,30),k:String(d.k),x:+d.x||0,y:+d.y||0,ho:d.ho?1:0,own:from,st:d.st|0,sg:Math.min(3,d.sg|0)}))}else if(t=='act'){const o=DP.find(q=>q.id==d.id&&q.k=='trap');if(o&&!o.act)o.act=5}else if(t=='rm'){if(d.k=='tp')DP=DP.filter(o=>!(o.k=='tp'&&o.own===from));if(d.k=='sum')DP=DP.filter(o=>!(o.k=='sum'&&o.own===from))}else if(t=='sm'){const o=DP.find(q=>q.id==d.id&&q.k=='sum'&&q.own===from);if(o){o.tx=+d.x||0;o.ty=+d.y||0;o.an=+d.a||0;o.pw=d.p?.15:0;const g2=Math.min(3,d.g|0);if(g2!=o.sg){o.sg=g2;o.mh=SUMT[o.st].hp*SUMM(g2)}o.hp=Math.min(o.mh,+d.h||o.hp)}}else if(t=='plate'){const p=PLT[d.i|0];if(p&&p.s==0){p.s=1;p.t=.6}}else if(t=='orb'){orbPicked.add(+d.k||0)}else if(t=='pw'){const o=R[from];if(o){o.px=+d.x||0;o.py=+d.y||0;for(let i=0;i<30;i++)ptc(o.px,o.py,i%2?'#ff8a3c':'#ffd23a')}}else if(t=='melee'){const o=R[from];if(o)o.sw=.25;const s=CH[Math.min((d.c|0)&31,CH.length-1)];if(s.ml&&SV.mode!=2&&from!==myPeer&&me.al){const ax=+d.x||0,ay=+d.y||0,dx=me.x-ax,dy=me.y-ay,di=Math.hypot(dx,dy),r=CH[me.c].r;if(di<s.mr+r&&Math.abs(angd(Math.atan2(dy,dx),+d.a||0))<s.ma+Math.min(.5,r/Math.max(di,1))&&los(ax,ay,me.x,me.y))hurtMe(Math.min(70,+d.dm||s.dmg),from)}}else if(t=='ann'){announce(d.b&&BOSSL.some(q=>q.k==d.b)?'⚔ '+bossName(d.b)+' est apparu — rejoins l\'événement spécial !':undefined)}else if(t=='bmeteor'){bossMeteors(d)}else if(t=='boss'){netBoss(d)}else if(t=='btp'){bossTp(d)}else if(t=='bsummon'){bossSummon(d)}else if(t=='bswing'&&BS.bt=='tong'){tongSwing(d)}else if(t=='bswing'){if(SV.mode==2&&me.al){const dx=me.x-(+d.x||0),dy=me.y-(+d.y||0);if(Math.hypot(dx,dy)<SLR+CH[me.c].r)hurtMe(BDMG,'boss')}for(let i=0;i<36;i++){const an=i/36*6.283,rr=SLR*(.4+Math.random()*.6);ptc((+d.x||0)+Math.cos(an)*rr,(+d.y||0)+Math.sin(an)*rr,i%2?'#ff8a1a':'#ffd23a')}if(AC&&!mute)tone(75,AC.currentTime,.4,'sawtooth',.16)}else if(t=='bossdead'){bossDead(d)}else if(t=='flash'){const dx=me.x-d.x,dy=me.y-d.y,da=Math.abs(((Math.atan2(dy,dx)-d.a+3*Math.PI)%(2*Math.PI))-Math.PI);if(from!==myPeer&&SV.mode!=2&&me.al&&Math.hypot(dx,dy)<750&&da<1&&!inIx(me.x,me.y)&&los(d.x,d.y,me.x,me.y)){me.bl=5;if(d.sc){me.sc=1.3;screech()}}}}
let synced=0;
function netPeers(list,my){myPeer=my;const nn={};for(const p of list){const q=p.presence||{},o=R[p.id]||{x:+q.x||0,y:+q.y||0};const nx=+q.x||0,ny=+q.y||0,tn=performance.now();if(o.t){const dp=(tn-o.t)/1000;if(dp>.004){o.vx=Math.max(-700,Math.min(700,(nx-o.tx)/dp));o.vy=Math.max(-700,Math.min(700,(ny-o.ty)/dp))}}else{o.vx=o.vy=0}o.t=tn;o.ex=0;const wpw=o.pw;Object.assign(o,{tx:nx,ty:ny,a:+q.a||0,hp:+q.hp||0,pw:q.pw?1:0,go:q.go?1:0,sn:q.sn?1:0,cs:q.cs?1:0,c:Math.min((q.c|0)&31,CH.length-1),s:Math.min((q.s|0)&31,SKINS.length-1),b:+q.b||0,n:String(q.n||'').slice(0,14),pk:(q.pk|0)%(PACKS.length+1),cx:String(q.cx||'').slice(0,20),rv:q.rv?1:0,md:(q.md|0)&3,pl:q.pl?1:0,dd:+q.dd||0,rk:(q.rk|0)&7,rd:+q.rd||0,k:+q.k||0,al:q.al,iv:q.iv,sh:q.sh,v:q.v,m:(q.m|0)%MAPS.length});if(wpw&&!o.pw)o.px=null;nn[p.id]=o}R=nn;DP=DP.filter(o=>o.own===(myPeer||'me')||R[o.own]);if(!synced&&list.length){synced=1;setMap(R[list[0].id].m)}}
let DP=[],dpn=0,PLT=[],orbPicked=new Set(),psk=0,st=0,adm=0,admSel=null,admAmt=50,shop=0,bp=0,AC=null,mute=0,mstep=0,mnext=0;
// ===================== ÉVÉNEMENT SPÉCIAL, SALONS, NOUVEAUX PERSOS, EFFETS =====================
// Constantes du boss : à garder identiques à celles de server.js
const EVI=8,BR=80,BREACH=190,BARC=2.1,SLR=230,BDMG=40,MR=85,MDMG=35,METF=1.4,SNB=350,BOSS_XP=500,BOSS_COINS=300;
const BS={al:0,x:800,y:600,tx:800,ty:600,a:0,ta:0,hp:0,mh:1,st:0,tp:0,r:BR,fl:0,bt:'magma',en:0};
// Registre des boss (à garder en phase avec BOSSES de server.js) : k = clé, ch = personnage donné à la victoire
const BOSSL=[{k:'magma',n:'Magmaar',ch:CH.findIndex(c=>c.n=='Magmaar'),col:'#ff5a1a',d1:'Poing écrasant · pluie de météores',d2:'PV : 6000 + 2500 par joueur · rage sous 50 %',draw:(r,st,tp,en,fl,t)=>drawMagma(r,st,tp,en,fl,t)},
{k:'tong',n:'Tong Tong Sahur',ch:CH.findIndex(c=>c.n=='Tong Tong Sahur'),col:'#b9824a',r:75,d1:'Gros coup de batte en arc · téléportation dans ton dos',d2:'PV : 6000 + 2500 par joueur',draw:(r,st,tp,en,fl,t)=>drawTong(r,st,tp,en,fl,t)},
{k:'necro',n:'Nécro-Sire',ch:CH.findIndex(c=>c.n=='Nécro-Sire'),col:'#4be39a',r:68,d1:'Invoque des sbires · onde de mort',d2:"6000 + 2500 PV/joueur · l'arène rétrécit à 35 %",draw:(r,st,tp,en,fl,t)=>drawNecro(r,st,tp,en,fl,t)}];
const bossName=k=>{const b=BOSSL.find(q=>q.k==(k||BS.bt));return b?b.n:'Boss'};
let METS=[],BOSSCUR='magma',admBoss='magma',admBm=0;

let bhAcc=0,bhT=0,BAN=null,LBC=[0,0,0],BOSSUP=0,BOSSAL=0,BOSSRS=0,BOSSRSt=0,ckOk=1,ckT=0;
const angd=(b,a)=>(((b-a)%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI;
function rbw(x,y,w,h){const gr=g.createLinearGradient(x,y,x+w,y+h);for(let i=0;i<=6;i++)gr.addColorStop(i/6,'hsl('+Math.floor((tt*90+i*60)%360)+',100%,62%)');return gr}

// ---- Salons (classique / classé / événement spécial) ----
function joinLobby(i){if(i==2&&!evOpen())return;SV.mode=i;save();menuOpen=0;R={};DP=[];Bu=[];Pa=[];bots=[];BS.al=0;BS.hp=0;METS.length=0;synced=i==2?1:0;lastPh=null;rkDone=-1;rkRes=null;
me.k=0;me.ns=0;me.dth=0;me.pl=0;me.late=0;me.brr=0;me.al=0;me.v=null;me.rdy=0;me.bdm=0;me.pt=null;me.sn=0;mode=0;bhAcc=0;
setMap(i==2?EVI:(mi==EVI?0:mi));
net.send('join',{m:i,uid:SV.uid,n:SV.name});pres()}
function netOpen(){if(ACT.u&&ACT.tok)net.send('acc_tok',{u:ACT.u,t:ACT.tok});if(!menuOpen)net.send('join',{m:SV.mode,uid:SV.uid,n:SV.name})}
function netSync(){ckOk=1;lastPh=null}
function netCounts(l,b,a,r,t){if(BOSSL.some(q=>q.k==t))BOSSCUR=t;if(Array.isArray(l))LBC=[l[0]|0,l[1]|0,l[2]|0];BOSSUP=b?1:0;BOSSAL=a?1:0;BOSSRS=r|0;BOSSRSt=performance.now()}

// ---- Boss (simulé par le serveur) ----
function drum(){if(!AC||mute)return;const t=AC.currentTime;tone(70,t,.5,'sine',.5);tone(55,t+.25,.6,'sine',.5)}
function netBoss(d){const wp=POS;POS=d.al&&d.ct&&d.ct===myPeer?1:0;if(POS&&!wp)posStart();if(!POS&&wp)posEnd();const was=BS.al,php=BS.hp;BS.al=d.al?1:0;if(!BS.al){BS.hp=0;METS.length=0;MINL.length=0;BS.ar=0;return}BS.bt=BOSSL.some(q=>q.k==d.bt)?d.bt:BS.bt;BS.en=d.en?1:0;BS.r=(BOSSL.find(q=>q.k==BS.bt)||BOSSL[0]).r||BR;
BS.tx=+d.x||0;BS.ty=+d.y||0;BS.ta=+d.a||0;BS.hp=+d.hp||0;BS.mh=Math.max(1,+d.mh||1);BS.st=d.st|0;BS.tp=+d.tp||0;netNecro(d);
if(!was){BS.x=BS.tx;BS.y=BS.ty;BS.a=BS.ta;BS.fl=0;feed.push({t:bossName()+" est apparu !",l:6});drum()}else if(BS.hp<php)BS.fl=.05}
function bossHit(d){if(!BS.al||!(d>0))return;bhAcc+=d;me.bdm+=d;ptc(BS.x+(Math.random()-.5)*70,BS.y+(Math.random()-.5)*70,'#ffb347')}
function bossPush(o,r){if(!BS.al)return;const dx=o.x-BS.x,dy=o.y-BS.y,d=Math.hypot(dx,dy),m=BS.r+r;if(d<m){const k=d>.01?1/d:0;o.x=BS.x+(d>.01?dx*k:1)*m;o.y=BS.y+(d>.01?dy*k:0)*m}}
function bossDead(d){if(SV.mode!=2)return;const k=d&&BOSSL.some(q=>q.k==d.b)?d.b:BS.bt,bo=BOSSL.find(q=>q.k==k)||BOSSL[0];for(let i=0;i<90;i++)ptc(BS.x+(Math.random()-.5)*100,BS.y+(Math.random()-.5)*100,i%3?'#ffb347':'#fff3b0');BS.al=0;METS.length=0;if(!Array.isArray(SV.bu))SV.bu=[];const nw=!SV.bu.includes(bo.ch);if(nw)SV.bu.push(bo.ch);gain(BOSS_XP,BOSS_COINS);BAN={t0:performance.now(),dur:11000,nw,bn:bo.n,cn:CH[bo.ch].n};feed.push({t:bo.n+" vaincu !",l:6});drum()}
function evUpd(dt){crocUpd(dt);
if(bhAcc>0&&(bhT-=dt)<=0){bhT=.1;let n=0;while(bhAcc>=1&&n++<4){const x=Math.min(360,Math.floor(bhAcc));bhAcc-=x;net.send('bd',{d:x})}if(bhAcc<1)bhAcc=0}
if(BS.al){const f=1-Math.exp(-dt*14);BS.x+=(BS.tx-BS.x)*f;BS.y+=(BS.ty-BS.y)*f;BS.a+=angd(BS.ta,BS.a)*f;BS.fl-=dt}necroUpd(dt)}
function drawMagma(r,st,tp,en,fl,t){ // repère local : +x = direction du boss
const e=u=>u*u*(3-2*u),pul=.5+.5*Math.sin(t*(en?7:3));
let fx=r*.8+Math.sin(t*3)*3,fy=r*.95,fs=22;
if(st==1){const k=e(tp);fx=r*.8-r*.7*k;fy=r*.95+r*.1*k;fs=22+8*k}
else if(st==2){fx=r*1.05;fy=r*.45;fs=32}
else if(st==3){const k=e(tp);fx=r*1.05-r*.25*k;fy=r*.45+r*.5*k;fs=32-10*k}
else if(st==4){fx=-r*.1;fy=r*1.05;fs=26+3*Math.sin(t*14)}
g.lineCap='round';g.strokeStyle='#2a1a16';g.lineWidth=20;for(const q of[-1,1]){g.beginPath();g.moveTo(r*.2,q*r*.7);g.lineTo(fx,q*fy);g.stroke()}g.lineCap='butt';
if(en||st==4){g.shadowColor='#ff5a1a';g.shadowBlur=22+10*pul}
const gr=g.createRadialGradient(-r*.25,-r*.25,r*.1,0,0,r);gr.addColorStop(0,'#5a3a30');gr.addColorStop(1,'#241512');g.fillStyle=gr;
g.beginPath();for(let i=0;i<16;i++){const an=i/16*6.283,rr=r*(.94+.06*Math.sin(i*2.7));i?g.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):g.moveTo(rr,0)}g.closePath();g.fill();g.shadowBlur=0;
g.strokeStyle='#120a08';g.lineWidth=6;g.stroke();
g.strokeStyle=en?'rgba(255,'+(70+90*pul|0)+',30,.95)':'rgba(255,'+(130+60*pul|0)+',40,.88)';g.lineWidth=3.5;g.lineCap='round';
for(let i=0;i<7;i++){const an=i*.9+.3,r1=r*.18,r2=r*(.7+.2*((i*37)%5)/5);g.beginPath();g.moveTo(Math.cos(an)*r1,Math.sin(an)*r1);g.lineTo(Math.cos(an+.25)*(r1+r2)/2,Math.sin(an+.25)*(r1+r2)/2);g.lineTo(Math.cos(an-.1)*r2,Math.sin(an-.1)*r2);g.stroke()}g.lineCap='butt';
for(const q of[-1,1]){g.fillStyle='#1a0f0c';g.beginPath();g.moveTo(r*.05,q*r*.78);g.lineTo(r*.55,q*r*1.22);g.lineTo(r*.32,q*r*.7);g.closePath();g.fill()}
for(const q of[-1,1]){g.shadowColor=en?'#ff2020':'#ffcc33';g.shadowBlur=12;g.fillStyle=en?'#ff3030':st==1?'#ff6a1a':'#ffe066';g.beginPath();g.arc(r*.45,q*r*.3,r*.12,0,7);g.fill();g.shadowBlur=0;g.fillStyle='#111';g.beginPath();g.arc(r*.5,q*r*.3,r*.045,0,7);g.fill()}
g.strokeStyle='#ff7a1a';g.lineWidth=5;g.lineCap='round';g.beginPath();for(let i=0;i<=6;i++){const yy=-r*.26+i*r*.087,xx=r*.62+(i%2?r*.07:0);i?g.lineTo(xx,yy):g.moveTo(xx,yy)}g.stroke();g.lineCap='butt';
if(fl>0){g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(0,0,r,0,7);g.fill()}
for(const q of[-1,1]){g.fillStyle='#3a2420';g.strokeStyle='#120a08';g.lineWidth=5;g.beginPath();g.arc(fx,q*fy,fs,0,7);g.fill();g.stroke();g.strokeStyle='#ff9a3a';g.lineWidth=3;g.beginPath();g.arc(fx,q*fy,fs*.6,-.6,1.4);g.stroke()}}
function drawBoss(){if(!BS.al)return;const x=BS.x-cam.x,y=BS.y-cam.y;if(x<-320||x>W+320||y<-320||y>H+320)return;
const r=BS.r,tp=BS.tp,bo=BOSSL.find(q=>q.k==BS.bt)||BOSSL[0];g.save();g.translate(x,y);
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(10,14,r,r*.88,0,0,7);g.fill();
if((BS.bt=='magma'||BS.bt=='necro')&&BS.st==1){g.fillStyle='rgba(255,60,20,'+(.08+.22*tp)+')';g.beginPath();g.arc(0,0,SLR,0,7);g.fill();g.strokeStyle='rgba(255,140,80,'+(.5+.4*tp)+')';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(255,220,160,.7)';g.lineWidth=2;g.beginPath();g.arc(0,0,SLR*tp,0,7);g.stroke()}
if((BS.bt=='magma'||BS.bt=='necro')&&BS.st==2){const rr=SLR*(.35+.65*tp);g.strokeStyle='rgba(255,170,60,'+(1-tp)+')';g.lineWidth=16*(1-tp)+2;g.beginPath();g.arc(0,0,rr,0,7);g.stroke();g.fillStyle='rgba(255,120,30,'+(.28*(1-tp))+')';g.beginPath();g.arc(0,0,rr,0,7);g.fill()}
g.rotate(BS.a);const bob=BS.st==0?1+Math.sin(tt*7)*.012:1;g.scale(bob,bob);bo.draw(r,BS.st,tp,BS.en,BS.fl,tt);g.restore()}

// ---- Boss Tong Tong Sahur (batte en arc + téléportation dans le dos) ----
function tongSwing(d){if(SV.mode==2&&me.al){const ax=+d.x||0,ay=+d.y||0,dx=me.x-ax,dy=me.y-ay,di=Math.hypot(dx,dy),r=CH[me.c].r;if(di<BREACH+r&&Math.abs(angd(Math.atan2(dy,dx),+d.a||0))<BARC/2+Math.min(.6,r/Math.max(di,1)))hurtMe(45,'boss')}if(AC&&!mute)tone(100,AC.currentTime,.3,'sawtooth',.14)}
function bossTp(d){for(let i=0;i<30;i++)ptc(BS.x+(Math.random()-.5)*90,BS.y+(Math.random()-.5)*90,i%2?'#d9a766':'#5a3a62');BS.x=BS.tx=+d.x||0;BS.y=BS.ty=+d.y||0;for(let i=0;i<30;i++)ptc(BS.x+(Math.random()-.5)*90,BS.y+(Math.random()-.5)*90,i%2?'#fff3b0':'#ff8ad8');if(AC&&!mute)tone(260,AC.currentTime,.3,'triangle',.14)}
function drawTong(r,st,tp,en,fl,t){ // repère local : +x = direction du boss
const e=u=>u*u*(3-2*u);
if(st==1){g.fillStyle='rgba(255,40,40,'+(.1+.3*tp)+')';g.beginPath();g.moveTo(0,0);g.arc(0,0,BREACH,-BARC/2,BARC/2);g.closePath();g.fill();g.strokeStyle='rgba(255,110,110,'+(.5+.4*tp)+')';g.lineWidth=3;g.stroke()}
let an;if(st==1)an=-.9+(-BARC/2-.5+.9)*e(tp);else if(st==2)an=-BARC/2-.5+(BARC+.5)*tp;else if(st==3)an=BARC/2+(-.9-BARC/2)*e(tp);else an=-.9+Math.sin(t*5)*.05;
if(st==2){g.strokeStyle='rgba(255,230,180,'+(.55*(1-tp))+')';g.lineWidth=18;g.lineCap='round';g.beginPath();g.arc(0,0,BREACH-34,-BARC/2-.5,an);g.stroke();g.lineCap='butt'}
g.save();g.rotate(an);g.fillStyle='#dcae70';g.strokeStyle='#4a2c10';g.lineWidth=4;g.beginPath();g.moveTo(r*.5,-7);g.lineTo(r*.5+70,-9);g.lineTo(BREACH-16,-19);g.arc(BREACH-16,0,19,-Math.PI/2,Math.PI/2);g.lineTo(r*.5+70,9);g.lineTo(r*.5,7);g.closePath();g.fill();g.stroke();
g.strokeStyle='rgba(74,44,16,.55)';g.lineWidth=3;for(const k of[26,44,62]){g.beginPath();g.moveTo(BREACH-16-k,-12);g.lineTo(BREACH-16-k,12);g.stroke()}g.restore();
const gr=g.createRadialGradient(-r*.25,-r*.25,r*.1,0,0,r);gr.addColorStop(0,'#e8bb82');gr.addColorStop(1,'#a56b30');g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,7);g.fill();
g.strokeStyle='rgba(90,50,15,.4)';g.lineWidth=3;for(const k of[.32,.52,.72,.88]){g.beginPath();g.arc(0,0,r*k,0,7);g.stroke()}
g.strokeStyle='#3b2410';g.lineWidth=6;g.beginPath();g.arc(0,0,r,0,7);g.stroke();
if(fl>0){g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(0,0,r,0,7);g.fill()}
for(const q of[-1,1]){g.fillStyle='#fff';g.strokeStyle='#3b2410';g.lineWidth=4;g.beginPath();g.arc(r*.42,q*r*.34,r*.23,0,7);g.fill();g.stroke();g.fillStyle=st==1?'#c01010':'#111';g.beginPath();g.arc(r*.5,q*r*.33,r*.1,0,7);g.fill()}
g.strokeStyle='#2a1508';g.lineWidth=6;g.lineCap='round';g.beginPath();g.arc(r*.35,0,r*.3,-.95,.95);g.stroke();g.lineCap='butt';
g.save();g.rotate(an);g.fillStyle='#c98f50';g.strokeStyle='#3b2410';g.lineWidth=4;g.beginPath();g.arc(r*.92,0,15,0,7);g.fill();g.stroke();g.restore()}
// ---- Boss Nécro-Sire (invoque des sbires · onde de mort · l'arène rétrécit sous 35 % de PV) ----
const MNR=16,NARC={x:800,y:600};
let MINL=[],minAcc={},minT=0;
function netNecro(d){ // sbires et rayon de l'arène envoyés par le serveur
const ar=BS.bt=='necro'?(+d.ar||0):0;if(ar&&!BS.ar)feed.push({t:"⚠ L'arène se referme ! Reste dans le cercle",l:7});BS.ar=ar;
const l=BS.bt=='necro'&&Array.isArray(d.m)?d.m.slice(0,16):[],keep=new Set();
for(const q of l){const id=q[0]|0,x=+q[1]||0,y=+q[2]||0,hp=+q[3]||0;keep.add(id);const m=MINL.find(o=>o.id==id);
if(!m)MINL.push({id,x,y,tx:x,ty:y,hp,mh:Math.max(hp,1),fl:0});else{if(hp<m.hp)m.fl=.08;m.tx=x;m.ty=y;m.hp=hp}}
for(const m of MINL)if(!keep.has(m.id))for(let i=0;i<10;i++)ptc(m.x+(Math.random()-.5)*20,m.y+(Math.random()-.5)*20,i%2?'#9af0c4':'#3a8a64');
MINL=MINL.filter(m=>keep.has(m.id))}
function minHit(m,d){if(!(d>0))return;minAcc[m.id]=(minAcc[m.id]||0)+d;m.hp-=d;m.fl=.08;ptc(m.x+(Math.random()-.5)*16,m.y+(Math.random()-.5)*16,'#9af0c4')}
function minBullet(b,dt){for(const m of MINL)if(segD(m.x,m.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<MNR+(b.gd?22:0)){if(!b.bh)minHit(m,b.sn?SNB:(b.d||0));if(b.gd)b.bh=1;else return true}return false}
function necroUpd(dt){
if(!BS.al||BS.bt!='necro'){if(MINL.length)MINL.length=0;return}
if(!MINL.length)minAcc={};
const f=1-Math.exp(-dt*12);
for(const m of MINL){m.x+=(m.tx-m.x)*f;m.y+=(m.ty-m.y)*f;m.fl-=dt;if(SV.mode==2&&me.al&&Math.hypot(me.x-m.x,me.y-m.y)<MNR+CH[me.c].r)hurtMe(16*dt,'boss')}
if(BS.ar&&SV.mode==2&&me.al&&Math.hypot(me.x-NARC.x,me.y-NARC.y)>BS.ar)hurtMe(14*dt,'boss');
if((minT-=dt)<=0){minT=.1;let n=0;for(const id in minAcc){const a=minAcc[id];if(a<1)continue;if(n++>=6)break;const x=Math.min(120,Math.floor(a));minAcc[id]=a-x;net.send('md',{i:+id,d:x})}}}
function bossSummon(d){const x=+d.x||BS.x,y=+d.y||BS.y;for(let i=0;i<26;i++)ptc(x+(Math.random()-.5)*130,y+(Math.random()-.5)*130,i%2?'#4be39a':'#2a7a58');if(AC&&!mute)tone(150,AC.currentTime,.7,'sine',.14)}
function drawArena(){if(!BS.al||!BS.ar)return;const cx=NARC.x-cam.x,cy=NARC.y-cam.y,pul=.5+.5*Math.sin(tt*5);
g.save();g.beginPath();g.rect(0,0,W,H);g.moveTo(cx+BS.ar,cy);g.arc(cx,cy,BS.ar,0,7);g.fillStyle='rgba(150,10,70,'+(.26+.08*pul)+')';g.fill('evenodd');
g.strokeStyle='rgba(255,90,140,'+(.65+.3*pul)+')';g.lineWidth=5;g.setLineDash([22,14]);g.lineDashOffset=-tt*30;g.beginPath();g.arc(cx,cy,BS.ar,0,7);g.stroke();g.setLineDash([]);
if(SV.mode==2&&me.al&&Math.hypot(me.x-NARC.x,me.y-NARC.y)>BS.ar){g.fillStyle='rgba(255,0,60,'+(.1+.1*pul)+')';g.fillRect(0,0,W,H)}
g.restore()}
function drawMinions(){if(!BS.al)return;for(const m of MINL){const x=m.x-cam.x,y=m.y-cam.y;if(x<-40||x>W+40||y<-40||y>H+40)continue;
g.save();g.translate(x,y);const w=Math.sin(tt*6+m.id)*2;
g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(2,MNR*.95,MNR*.9,MNR*.4,0,0,7);g.fill();
g.shadowColor='#4be39a';g.shadowBlur=10;g.fillStyle=m.fl>0?'#fff':'#9af0c4';g.globalAlpha=.93;
g.beginPath();g.arc(0,-2,MNR*.85,Math.PI,0);g.lineTo(MNR*.85,MNR*.7);for(let i=1;i<=4;i++)g.lineTo(MNR*.85-i*MNR*.425,MNR*.7+(i%2?5:0)+w*(i%2?1:-1)*.5);g.closePath();g.fill();
g.shadowBlur=0;g.globalAlpha=1;g.fillStyle='#10281f';g.beginPath();g.ellipse(-5,-4,3,4.5,0,0,7);g.ellipse(5,-4,3,4.5,0,0,7);g.fill();g.beginPath();g.ellipse(0,5,3,2.5,0,0,7);g.fill();
if(m.hp<m.mh){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(-12,-MNR-8,24,4);g.fillStyle='#4be39a';g.fillRect(-12,-MNR-8,24*Math.max(0,m.hp/m.mh),4)}
g.restore()}}
function drawNecro(r,st,tp,en,fl,t){ // repère local : +x = direction du boss
const pul=.5+.5*Math.sin(t*(en?6:3)),col=en?'#ff4a8a':'#4be39a',rgb=en?'255,74,138':'75,227,154';
for(let i=0;i<6;i++){const an=t*(en?1.6:1)+i*1.047,rr=r*(1.28+.08*Math.sin(t*3+i));g.fillStyle=col;g.globalAlpha=.5+.3*Math.sin(t*4+i);g.beginPath();g.arc(Math.cos(an)*rr,Math.sin(an)*rr,5+2*Math.sin(t*5+i),0,7);g.fill()}g.globalAlpha=1;
if(st==4){g.strokeStyle='rgba('+rgb+','+(.9-.5*tp)+')';g.lineWidth=4;g.beginPath();g.arc(0,0,r*(.9+1.4*tp),0,7);g.stroke();g.strokeStyle='rgba('+rgb+',.45)';g.lineWidth=2;g.beginPath();g.arc(0,0,r*(.6+1*tp),0,7);g.stroke();
for(let i=0;i<8;i++){const an=i*.785-t*2,rr=r*(.9+1.4*tp);g.fillStyle='rgba('+rgb+',.8)';g.fillRect(Math.cos(an)*rr-3,Math.sin(an)*rr-3,6,6)}}
const hx=st==1?r*(.8-.6*tp):st==2?r*1.1:st==4?r*.95+Math.sin(t*16)*2:r*.8,hy=st==4?r*.55:r*.85;
g.lineCap='round';g.strokeStyle='#120a1c';g.lineWidth=16;for(const q of[-1,1]){g.beginPath();g.moveTo(r*.2,q*r*.6);g.lineTo(hx,q*hy);g.stroke()}g.lineCap='butt';
if(en||st==4){g.shadowColor=col;g.shadowBlur=20+10*pul}
const gr=g.createRadialGradient(-r*.25,-r*.25,r*.1,0,0,r);gr.addColorStop(0,'#4a3a68');gr.addColorStop(1,'#160d26');g.fillStyle=gr;
g.beginPath();g.arc(0,0,r*.95,0,7);g.fill();g.shadowBlur=0;g.strokeStyle='#0a0612';g.lineWidth=6;g.stroke();
g.fillStyle='#10091c';g.beginPath();g.moveTo(-r*.55,-r*.5);g.lineTo(-r*1.05,0);g.lineTo(-r*.55,r*.5);g.closePath();g.fill();
g.strokeStyle='rgba('+rgb+','+(.55+.35*pul)+')';g.lineWidth=3;g.lineCap='round';for(let i=0;i<6;i++){const an=i*1.05+.4,r1=r*.2,r2=r*(.55+.2*((i*37)%5)/5);g.beginPath();g.moveTo(Math.cos(an)*r1,Math.sin(an)*r1);g.lineTo(Math.cos(an+.2)*(r1+r2)/2,Math.sin(an+.2)*(r1+r2)/2);g.lineTo(Math.cos(an)*r2,Math.sin(an)*r2);g.stroke()}g.lineCap='butt';
g.fillStyle='#07040d';g.beginPath();g.ellipse(r*.4,0,r*.42,r*.5,0,0,7);g.fill();
for(const q of[-1,1]){g.shadowColor=col;g.shadowBlur=14;g.fillStyle=st==1?'#ffd23a':col;g.beginPath();g.arc(r*.5,q*r*.18,r*.1,0,7);g.fill();g.shadowBlur=0}
if(fl>0){g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(0,0,r,0,7);g.fill()}
for(const q of[-1,1]){g.shadowColor=col;g.shadowBlur=st==4?18:8;g.fillStyle='#2a1a40';g.strokeStyle='#0a0612';g.lineWidth=5;g.beginPath();g.arc(hx,q*hy,15,0,7);g.fill();g.stroke();g.shadowBlur=0;g.fillStyle=col;g.beginPath();g.arc(hx+3,q*hy,5,0,7);g.fill()}}
function bossMeteors(d){if(!d||!Array.isArray(d.p))return;for(const q of d.p.slice(0,14)){const x=+q[0],y=+q[1];if(Number.isFinite(x)&&Number.isFinite(y))METS.push({x,y,t0:tt,h:0})}if(AC&&!mute)tone(120,AC.currentTime,.5,'sawtooth',.14)}
function drawMeteors(){if(!METS.length)return;
for(const m of METS){const e=tt-m.t0,k=Math.min(1,e/METF);
if(e>=METF&&!m.h){m.h=1;if(SV.mode==2&&me.al&&Math.hypot(me.x-m.x,me.y-m.y)<MR+CH[me.c].r)hurtMe(MDMG,'boss');for(let i=0;i<22;i++)ptc(m.x+(Math.random()-.5)*60,m.y+(Math.random()-.5)*60,i%2?'#ff8a1a':'#ffd23a');if(AC&&!mute)tone(70,AC.currentTime,.35,'square',.16)}
const sx=m.x-cam.x,sy=m.y-cam.y;if(sx<-220||sx>W+220||sy<-520||sy>H+220)continue;
g.save();g.translate(sx,sy);
if(e<METF){g.fillStyle='rgba(255,70,20,'+(.1+.22*k)+')';g.beginPath();g.arc(0,0,MR,0,7);g.fill();g.strokeStyle='rgba(255,150,80,'+(.5+.4*k)+')';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(255,220,160,.7)';g.lineWidth=2;g.beginPath();g.arc(0,0,MR*k,0,7);g.stroke();
const fo=(1-k)*(1-k),mx=fo*170,my=-fo*430,gr=g.createLinearGradient(mx,my,mx*1.7,my*1.7);gr.addColorStop(0,'rgba(255,140,30,.9)');gr.addColorStop(1,'rgba(255,60,0,0)');g.strokeStyle=gr;g.lineWidth=18;g.lineCap='round';g.beginPath();g.moveTo(mx,my);g.lineTo(mx*1.7,my*1.7);g.stroke();g.lineCap='butt';
g.fillStyle='#ffb347';g.beginPath();g.arc(mx,my,15,0,7);g.fill();g.fillStyle='#fff3b0';g.beginPath();g.arc(mx,my,8,0,7);g.fill()}
else{const u=(e-METF)/.4;g.globalAlpha=Math.max(0,1-u);g.strokeStyle='#ffb347';g.lineWidth=10*(1-u)+2;g.beginPath();g.arc(0,0,MR*(.5+.7*u),0,7);g.stroke();g.fillStyle='rgba(255,120,30,.35)';g.beginPath();g.arc(0,0,MR*(.5+.5*u),0,7);g.fill()}
g.restore()}
METS=METS.filter(m=>tt-m.t0<METF+.45)}
function drawTop(){
if(SV.mode==2){const bw=420,bx=W/2-bw/2,by=30;g.textAlign='center';
if(BS.al){const f=Math.max(0,Math.min(1,BS.hp/BS.mh));g.font='bold 16px Trebuchet MS,sans-serif';g.fillStyle='#f0e6d0';g.fillText(bossName().toUpperCase(),W/2,24);g.fillStyle='#000a';g.fillRect(bx-3,by-3,bw+6,22);g.fillStyle='#2a0d0d';g.fillRect(bx,by,bw,16);const gr=g.createLinearGradient(bx,0,bx+bw,0);gr.addColorStop(0,'#ff3b3b');gr.addColorStop(1,'#ff9a3c');g.fillStyle=gr;g.fillRect(bx,by,bw*f,16);g.strokeStyle='#e9d9a8';g.lineWidth=2;g.strokeRect(bx,by,bw,16);g.font='bold 12px Trebuchet MS,sans-serif';g.fillStyle='#fff';g.fillText(Math.ceil(BS.hp)+' / '+BS.mh,W/2,by+13)}
else{g.font='bold 15px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText("En attente du boss…"+(rs()?"  (retour dans "+rs()+")":""),W/2,by+12)}
g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n+' — Événement spécial'+(me.bdm>0?'  ·  Tes dégâts : '+Math.round(me.bdm):''),W/2,64);return}
g.textAlign='center';g.font='bold 24px Trebuchet MS,sans-serif';g.fillStyle=ph.left<30?'#ff8a6a':'#f0e6d0';g.fillText(fmt(ph.left),W/2,30);g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n+(SV.mode==1?' — Classé · '+rkName(SV.rk.r,SV.rk.d)+' '+SV.rk.rr+' RR':' — Classique'),W/2,46)}
function drawBanner(){if(!BAN)return;const k=(performance.now()-BAN.t0)/BAN.dur;if(k>=1){BAN=null;return}
g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=Math.min(1,k*10,(1-k)*5);g.fillStyle='rgba(8,6,16,.9)';g.fillRect(130,120,700,230);g.strokeStyle=rbw(130,120,700,230);g.lineWidth=5;g.strokeRect(130,120,700,230);
g.textAlign='center';g.fillStyle=rbw(130,150,700,40);g.font='bold 40px'+F2;g.fillText((BAN.bn||'BOSS').toUpperCase()+' VAINCU !',W/2,184);
g.fillStyle='#ffe58a';g.font='bold 26px'+F2;g.fillText('+'+BOSS_COINS+' pièces   ·   +'+BOSS_XP+' XP',W/2,234);
g.fillStyle='#f0e6d0';g.font='18px'+F2;g.fillText(BAN.nw?'Nouveau personnage secret débloqué : '+(BAN.cn||'?')+' !':'Récompenses reçues pour avoir participé au combat',W/2,278);
if(BAN.nw){g.fillStyle='#9aa7bd';g.font='14px'+F2;g.fillText('Retrouve-le dans l\'onglet Personnages (onglet Exclusif)',W/2,312)}g.restore()}

// ---- Capacités : Magmaar (séisme), Chamber (sniper), batte ----
function tpBehind(s){const on=(x,y)=>x>cam.x+8&&x<cam.x+W-8&&y>cam.y+8&&y<cam.y+H-8;let best=null,bd=1e9;
const c=(x,y,a,r)=>{if(!on(x,y))return;const d=Math.hypot(x-me.x,y-me.y);if(d<bd){bd=d;best={x,y,a,r}}};
if(BS.al)c(BS.x,BS.y,BS.a,BS.r);
if(SV.mode!=2){for(const k in R){const o=R[k];if(o.al&&!o.iv&&!(inBush(o.x,o.y)&&!o.rv&&Math.hypot(o.x-me.x,o.y-me.y)>110))c(o.x,o.y,o.a,CH[o.c].r)}for(const q of bots)if(q.hp>0)c(q.x,q.y,q.a,14)}
if(!best){me.ab=0;feed.push({t:"Aucune cible visible à l'écran",l:2});return}
const dd=best.r+s.r+10,ok=p=>p.x>40&&p.x<MW-40&&p.y>40&&p.y<MH-40&&!hitW(p.x,p.y);let np=null;
for(const da of[0,.7,-.7,1.4,-1.4,2.1,-2.1,Math.PI]){const an=best.a+da,p={x:best.x-Math.cos(an)*dd,y:best.y-Math.sin(an)*dd};if(ok(p)){np=p;break}}
if(!np){me.ab=0;feed.push({t:"Pas de place derrière la cible",l:2});return}
for(let i=0;i<20;i++)ptc(me.x,me.y,'#d9a766');me.x=np.x;me.y=np.y;col(me,s.r);bossPush(me,s.r);me.a=Math.atan2(best.y-me.y,best.x-me.x);me.la=me.a;me.cd=0;for(let i=0;i<20;i++)ptc(me.x,me.y,'#fff3b0')}
function doMelee(s){const dm=Math.min(64,s.dmg*(me.db>0?2:1)),a=me.a;me.sw=.25;
snd('melee',{x:Math.round(me.x),y:Math.round(me.y),a:+a.toFixed(2),c:me.c,dm});
const hitAng=(tx,ty,tol)=>Math.abs(angd(Math.atan2(ty-me.y,tx-me.x),a))<s.ma+tol;
for(const o of bots)if(o.hp>0){const d=Math.hypot(o.x-me.x,o.y-me.y);if(d<s.mr+14&&hitAng(o.x,o.y,.3)&&los(me.x,me.y,o.x,o.y))hitBot(o,dm)}
for(const o of DP)if(['tur','bot','trap','tp','sum'].includes(o.k)&&o.own!==(myPeer||'me')&&Math.hypot(o.x-me.x,o.y-me.y)<s.mr+10&&hitAng(o.x,o.y,.4)){o.hp-=dm;ptc(o.x,o.y,'#ff9')}
if(BS.al){const d=Math.hypot(BS.x-me.x,BS.y-me.y);if(d-BS.r<s.mr&&hitAng(BS.x,BS.y,Math.asin(Math.min(1,BS.r/Math.max(d,1)))))bossHit(dm)}for(const m of MINL){const d=Math.hypot(m.x-me.x,m.y-me.y);if(d-MNR<s.mr&&hitAng(m.x,m.y,.3))minHit(m,dm)}
for(let i=0;i<8;i++)ptc(me.x+Math.cos(a)*50,me.y+Math.sin(a)*50,'#e8c89a')}
function doSniper(s){me.sn=0;me.ab=s.acd;const as=[me.a];shoot(me.x,me.y,as,me.c,true,myPeer||'me',0,0,0,0,1);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0,lz:0,gd:0,d:0,sn:1});for(let i=0;i<14;i++)ptc(me.x+Math.cos(me.a)*30,me.y+Math.sin(me.a)*30,'#ffe066')}

// ---- Dessin : armes (pistolet / sniper / batte), ange du god mode, aura Phénix ----
function wpn(s,ex){ex=ex||{};
if(s.cr){const sw=ex.sw>0?1-ex.sw/.25:-1,open=sw<0?.18+Math.sin(tt*3)*.03:Math.sin(sw*Math.PI)*.8,L=s.r+34;g.save();
for(const q of[-1,1]){g.save();g.rotate(q*open*.5);g.fillStyle='#1a4d27';g.strokeStyle='#0b2a13';g.lineWidth=2;g.beginPath();g.moveTo(s.r-6,0);g.lineTo(s.r+10,q*9);g.lineTo(L-4,q*6);g.lineTo(L,q*2);g.lineTo(L,0);g.closePath();g.fill();g.stroke();g.fillStyle='#fff';for(let i=0;i<5;i++){const x=s.r+12+i*(L-s.r-16)/4;g.beginPath();g.moveTo(x-2,q*2);g.lineTo(x,q*(2+(open>.3?6:3.5)));g.lineTo(x+2,q*2);g.fill()}g.restore()}
g.fillStyle='#1a4d27';g.beginPath();g.moveTo(-s.r+4,-8);g.quadraticCurveTo(-s.r-16,Math.sin(tt*6)*8,-s.r-34,Math.sin(tt*6+1)*6);g.quadraticCurveTo(-s.r-16,Math.sin(tt*6)*8+4,-s.r+4,8);g.fill();g.restore();return}
if(s.ml){const sw=ex.sw>0?1-ex.sw/.25:-1,an=sw<0?.55:-s.ma+sw*2*s.ma;
if(sw>=0){g.save();g.strokeStyle='rgba(255,240,200,'+(.5*(1-sw))+')';g.lineWidth=7;g.lineCap='round';g.beginPath();g.arc(0,0,s.mr-8,-s.ma,an);g.stroke();g.restore()}
g.save();g.rotate(an);if(ex.rs){g.shadowColor='#ffd24a';g.shadowBlur=14}g.fillStyle=ex.rs?'#ffe58a':'#d9a766';g.strokeStyle=ex.rs?'#b8860b':'#5a3a18';g.lineWidth=2;g.beginPath();g.moveTo(s.r-3,-2.5);g.lineTo(s.r+s.L*.55,-3);g.lineTo(s.r+s.L,-7);g.arc(s.r+s.L,0,7,-Math.PI/2,Math.PI/2);g.lineTo(s.r+s.L*.55,3);g.lineTo(s.r-3,2.5);g.closePath();g.fill();g.stroke();g.fillStyle='#8a5a2a';g.fillRect(s.r-3,-3,8,6);if(ex.rs)for(let i=0;i<5;i++){g.fillStyle=i%2?'#fff3b0':'#ff9a1a';g.beginPath();g.arc(s.r+s.L*(.3+i*.17),Math.sin(tt*12+i)*3,3.5-i*.2,0,7);g.fill()}g.restore();return}
g.fillStyle='#1b1f2a';g.fillRect(s.r-4,-3.5,s.L,7);
if(ex.sn){g.fillRect(s.r-4,-3,s.L+34,6);g.fillStyle='#3a4150';g.fillRect(s.r+6,-6,14,4);g.fillStyle='#ffd23a';g.fillRect(s.r+s.L+26,-3,6,6)}}
function spark(x,y,s){g.beginPath();g.moveTo(x,y-s*2);g.lineTo(x+s*.5,y-s*.5);g.lineTo(x+s*2,y);g.lineTo(x+s*.5,y+s*.5);g.lineTo(x,y+s*2);g.lineTo(x-s*.5,y+s*.5);g.lineTo(x-s*2,y);g.lineTo(x-s*.5,y-s*.5);g.closePath();g.fill()}
function wings(r){const f=Math.sin(tt*7)*.2;g.save();for(const q of[-1,1])for(let i=0;i<5;i++){const th=q*(Math.PI/2+(i-2)*.32+f),len=r*(1.7+(2-Math.abs(i-2))*.45);g.save();g.rotate(th);g.fillStyle='rgba(255,255,255,'+(.95-i*.04)+')';g.strokeStyle='rgba(255,214,90,.9)';g.lineWidth=1.5;g.beginPath();g.ellipse(r*.35+len/2,0,len/2,r*.2,0,0,7);g.fill();g.stroke();g.restore()}g.restore()}
function angelFx(r){const ga=g.globalAlpha,t=tt;g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(0,0,r*.5,0,0,r*3.2);gr.addColorStop(0,'rgba(255,240,160,.38)');gr.addColorStop(1,'rgba(255,240,160,0)');g.fillStyle=gr;g.fillRect(-r*3.2,-r*3.2,r*6.4,r*6.4);g.restore();
g.save();g.strokeStyle='#ffe58a';g.shadowColor='#ffd24a';g.shadowBlur=12;g.lineWidth=3.5;g.beginPath();g.ellipse(0,-r*1.2+Math.sin(t*3)*2,r*.75,r*.26,0,0,7);g.stroke();g.restore();
for(let i=0;i<7;i++){const a=t*1.4+i*6.283/7,d=r*(2+.35*Math.sin(t*3+i));g.globalAlpha=ga*(.55+.45*Math.sin(t*6+i*2));g.fillStyle=i%2?'#fff':'#ffe58a';spark(Math.cos(a)*d,Math.sin(a)*d*.8-Math.sin(t*2+i)*3,2.5+i%3)}
for(let i=0;i<4;i++){const p=(t*.5+i/4)%1;g.globalAlpha=ga*(1-p);g.fillStyle='#fff';g.beginPath();g.ellipse(Math.sin(i*5+t)*r*1.2,-p*r*3.4+r*.5,2.5,5,.6+Math.sin(t*3+i),0,7);g.fill()}
g.globalAlpha=ga}
function phAura(x,y,r){g.save();g.translate(x-cam.x,y-cam.y);for(let i=0;i<6;i++){const a=tt*3+i*1.047,f=r*(1.5+Math.sin(tt*9+i)*.25);g.fillStyle=i%2?'#ffd23a':'#ff8a1a';g.globalAlpha=.8;g.beginPath();g.moveTo(Math.cos(a-.25)*r,Math.sin(a-.25)*r);g.lineTo(Math.cos(a)*(r+f),Math.sin(a)*(r+f));g.lineTo(Math.cos(a+.25)*r,Math.sin(a+.25)*r);g.fill()}
g.globalAlpha=.55+.25*Math.sin(tt*8);g.strokeStyle='#ff8a3c';g.lineWidth=4;g.beginPath();g.arc(0,0,r+9,0,7);g.stroke();g.restore()}
function phMark(px,py){g.save();g.translate(px-cam.x,py-cam.y);g.strokeStyle='#ff8a3c';g.lineWidth=3;g.globalAlpha=.8;g.beginPath();g.arc(0,0,16+Math.sin(tt*8)*2,0,7);g.stroke();g.restore()}

// ---- Menu admin : sélecteur de skin / personnage à donner ----
let admP=0,admPT=0,admToast=null;
// admP : 1 skin · 2 perso · 3 skin de caisse · 4 caisse (donner) ; 11 · 12 · 13 · 14 (retirer) ; 15 = retirer un skin de perso (pack)
const admRem=()=>admP>10,admK=()=>admP%10;
const ADMT=['Skin de perso','Skin d\'arme','Effet de pouvoir','Anim. de kill'],ADMTK='bwpk';
const ADMTT={1:'un skin',2:'un personnage',3:'un skin de caisse',4:'une caisse',5:'un skin de perso'};
const ADMACT={1:['givesk','remsk'],2:['givech','remch'],3:['givecw','remcw'],4:['givecr','remcr'],5:['givesk','remsk']};
const admItems=()=>{const k=admK(),rem=admRem();
if(k==1)return[...SKINS.map((s,i)=>[s.n,i]).slice(1),...(rem?[]:PACKS.map((q,i)=>['Pack '+q.n,100+i]))];
if(k==5)return PACKS.map((q,i)=>['Pack '+q.n+' · '+CH[q.ch].n,100+i]);
if(k==3)return typeof CAT!='undefined'?CAT.filter(it=>it.t==ADMTK[admPT]).map(it=>[it.n,it.i,CRT[it.r].c]):[];
if(k==4)return typeof CRC!='undefined'?CRC.map((c,i)=>[c.n,i,c.c1]):[];
return CH.map((c,i)=>[c.n,i])};
const admPk=k=>({x:30+(k%5)*180,y:(admK()==3?136:92)+Math.floor(k/5)*46,w:172,h:38});
const admTabR=i=>({x:30+i*180,y:68,w:172,h:30});
function drawAdmPick(){const rem=admRem(),k=admK();g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.98)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle=rem?'#ff7a7a':'#ffb347';g.font='bold 24px'+F2;
g.fillText((rem?'Retirer ':'Donner ')+ADMTT[k]+' — cible : '+tag(admSel===(myPeer||'me')?'me':admSel),W/2,40);
if(k==3)ADMT.forEach((t,i)=>{const r=admTabR(i),on=admPT==i;g.fillStyle=on?'#2b3a58':'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=on?'#fff':inB(r,M.x,M.y)?'#9ab':'#556';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font=(on?'bold ':'')+'13px'+F2;g.fillText(t,r.x+r.w/2,r.y+20)});
admItems().forEach(([n,v,c],q)=>{const r=admPk(q),h=inB(r,M.x,M.y);g.fillStyle=h?'#222c44':'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=h?'#fff':(c||(rem?'#a33':'#a55'));g.lineWidth=h?3:2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle=rem?'#ffc9c9':'#ffd9c9';g.font='13px'+F2;g.fillText(n,r.x+r.w/2,r.y+24)});
if(admToast&&performance.now()<admToast.u){g.fillStyle='rgba(8,6,16,.92)';g.fillRect(W/2-230,H-70,460,28);g.strokeStyle=admToast.c;g.lineWidth=2;g.strokeRect(W/2-230,H-70,460,28);g.fillStyle='#fff';g.font='bold 14px'+F2;g.fillText(admToast.t,W/2,H-51)}
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('Clique pour '+(rem?'retirer':'donner')+' (le choix reste ouvert) — Échap pour revenir',W/2,H-20)}
function admPickClick(){const k=admK(),rem=admRem();
if(k==3)for(let i=0;i<4;i++)if(inB(admTabR(i),M.x,M.y)){admPT=i;return}
admItems().forEach(([n,v],q)=>{if(inB(admPk(q),M.x,M.y)){admSend(ADMACT[k][rem?1:0],v);admToast={t:(rem?'− retiré : ':'+ donné : ')+n,c:rem?'#ff7a7a':'#7be3a5',u:performance.now()+1800}}})}
const PRICE={1:25,2:25,3:25,4:25,7:25,8:25,9:25,11:25,12:25,13:25,14:40},PASSCH={0:10,5:16,6:22,10:30},ST={1:5,2:12,3:18,4:24,5:28},TIERS=30;
const SKINS=[{n:'Classique',c:null},{n:'Néon',c:'#39ff88'},{n:'Or',c:'#ffd24a'},{n:'Givre',c:'#9fe6ff'},{n:'Lave',c:'#ff5a2a'},{n:'Royal',c:'#c36bff'},
{n:'Rang Argent',c:'#c9d1dc',rk:1},{n:'Rang Or',c:'#ffd24a',rk:2},{n:'Rang Platine',c:'#4fb8ff',rk:3},{n:'Rang Diamant',c:'#b36bff',rk:4},{n:'Rang Ascendant',c:'#3ddc84',rk:5},{n:'Rang Immortal',c:'#ff3b3b',rk:6},{n:'Radiant',c:'#ffe58a',rk:7,an:1}];
const ABN={nsum:'Invocation',behind:'Dans le dos',rewind:'Retour dans le temps',tur:'Tourelle',trap:'Piège',bot:'Mini-bot',flash:'Flash',invis5:'Invisible 5 s',tp:'Téléporteurs',regen:'Régénération',ixz:'Zone anti-pouvoirs',dash:'Dash',inv:'Invincible',salvo:'Salve de roquettes',wall:'Murs cassables',shield4:'Bouclier 25 %',sniper:'Sniper one-shot',quake:'Séisme de lave',swim:'Nage mortelle'};
const ABD={nsum:"Invoque un allié (Assassin, Tank, Archer ou Mage, au choix). Chaque kill sans mourir le renforce sur 3 stades ; au stade 3 il utilise un pouvoir",behind:"Se téléporte dans le dos du joueur ou bot le plus proche visible à l'écran",rewind:'Pose un point : 5 s après, retour au point avec tes PV d\'avant. Mort annulée pendant le pouvoir',tur:'Pose une tourelle fragile qui tire lentement',trap:'Piège : au passage d\'un ennemi, zone de dégâts 5 s',bot:'Mini-bot qui tire sur les autres 5 s',flash:'Aveugle les joueurs dans ton champ de vision 5 s',invis5:'Invisible pendant 5 s',tp:'Pose 2 téléporteurs ; le 3e efface le 1er',regen:'Régénère de la vie pendant 6 s',ixz:'Grande zone qui bloque et détruit tous les pouvoirs',dash:'Dash rapide dans la direction visée',inv:'Invincible 5 s, mais tir impossible',salvo:'Tir principal : roquettes. Pouvoir : salve de 3',wall:'Crée un mur cassable devant toi',shield4:'Bouclier de 25 % de tes PV pendant 10 s',sniper:"Équipe un sniper actif jusqu'au tir de son unique balle, qui tue en un coup",quake:'12 tirs de magma autour de toi + mare de lave (6 s). Passif : tes tirs brûlent, 1 tir sur 4 = météore explosif',swim:"Nage très vite pendant 5 s et tue instantanément tout joueur qu'il touche"};
let SV={coins:25,xp:0,ct:0,bought:[],skin:0,name:'Joueur'+(100+Math.floor(Math.random()*900)),track:0,vol:.6,packs:[],eq:{},ctl:0,mode:0,sel:-1,rk:{r:0,d:0,rr:0},gs:[],xs:0,bu:[],br:0,xc:0,uid:'u'+Math.random().toString(36).slice(2,12)};try{Object.assign(SV,JSON.parse(localStorage.getItem('arena_sv3')||'{}'))}catch(e){}SV.br=Math.max(SV.br|0,SV.rk.r|0);
let ACT={u:'',tok:''},actT=0,actLoaded=0,actTried=0;try{const a=JSON.parse(localStorage.getItem('arena_acc')||'{}');if(a&&a.u&&a.tok)ACT=a}catch(e){}
const actPush=()=>{clearTimeout(actT);if(ACT.u)net.send('acc_save',SV)};
const save=()=>{try{localStorage.setItem('arena_sv3',JSON.stringify(SV))}catch(e){}if(ACT.u){clearTimeout(actT);actT=setTimeout(actPush,1200)}};
addEventListener('visibilitychange',()=>{if(document.hidden)actPush()});addEventListener('pagehide',actPush);
function actStore(){try{if(ACT.u)localStorage.setItem('arena_acc',JSON.stringify(ACT));else localStorage.removeItem('arena_acc')}catch(e){}}
function netAcc(t,d){d=d||{};
if(t=='acc_no'){feed.push({t:d.e||'Connexion refusée',l:6});if(d.bad){ACT={u:'',tok:''};actStore()}return}
ACT={u:d.u,tok:d.tok||ACT.tok};actStore();
if(!d.created&&d.sv&&d.sv.rk&&(!d.tk||!actLoaded)){const md=SV.mode;Object.assign(SV,d.sv);SV.mode=md;SV.bought=SV.bought||[];SV.gs=SV.gs||[];SV.packs=SV.packs||[];SV.eq=SV.eq||{}}
actLoaded=1;SV.uid='a_'+d.u;SV.br=Math.max(SV.br|0,(SV.rk.r|0));
try{localStorage.setItem('arena_sv3',JSON.stringify(SV))}catch(e){}
if(!d.tk){feed.push({t:d.created?'Compte « '+d.u+' » créé : ta progression est sauvegardée ✔':'Connecté à « '+d.u+' » : sauvegarde chargée ✔',l:6});actPush()}
pres();postLB()}
const acR=i=>({x:772,y:80+i*44,w:182,h:38});
function acClick(i){
if(i==0){if(ACT.u){if(confirm('Se déconnecter du compte « '+ACT.u+' » ?')){actPush();net.send('acc_out',{u:ACT.u,t:ACT.tok});ACT={u:'',tok:''};actLoaded=0;actStore();SV.uid='u'+Math.random().toString(36).slice(2,12);save();feed.push({t:'Déconnecté',l:4})}return}
const u=prompt('Pseudo du compte (3 à 16 lettres/chiffres)');if(!u)return;
const p=prompt('Mot de passe (4 caractères min.)\nNouveau pseudo = création du compte avec ta progression actuelle.\nPseudo existant = ta sauvegarde locale sera remplacée par celle du compte.');if(!p)return;
net.send('acc_auth',{u,p,sv:SV})}
else if(i==1){let code='';try{code=btoa(unescape(encodeURIComponent(JSON.stringify(SV))))}catch(e){}try{navigator.clipboard.writeText(code)}catch(e){}prompt('Code de sauvegarde (déjà copié si possible). Garde-le précieusement :',code)}
else{const v=prompt('Colle ici ton code de sauvegarde');if(!v)return;let o=null;try{o=JSON.parse(decodeURIComponent(escape(atob(v.trim()))))}catch(e){}
if(!o||typeof o!='object'||!o.rk){feed.push({t:'Code de sauvegarde invalide',l:5});return}
if(!confirm('Remplacer ta progression actuelle par cette sauvegarde ?'))return;
const uid=SV.uid,md=SV.mode;Object.assign(SV,o);SV.uid=uid;SV.mode=md;SV.br=Math.max(SV.br|0,(SV.rk.r|0));save();actPush();pres();postLB();feed.push({t:'Sauvegarde importée ✔',l:5})}}
const tier=()=>Math.min(TIERS,Math.floor(SV.xp/100));
const owned=i=>!(SV.rc||[]).includes(i)&&(SV.bought.includes(i)||(PASSCH[i]!=null&&tier()>=PASSCH[i])||(CH[i].sec==1&&((SV.bu||[]).includes(i)||(CH[i].n=='Tong Tong Sahur'&&SV.xs==1)))||(CH[i].sec==2&&SV.xc>0));
const ownedSkin=i=>i==0||(!(SV.rs||[]).includes(i)&&((ST[i]!=null&&tier()>=ST[i])||(!!SKINS[i].rk&&(SV.br|0)>=SKINS[i].rk)||SV.gs.includes(i)));
function reward(t){for(const i in PASSCH)if(PASSCH[i]==t)return{k:'ch',l:CH[i].n};for(const i in ST)if(ST[i]==t)return{k:'sk',l:SKINS[i].n};const v=3+(t%4)*2;return{k:'co',v,l:'+'+v}}
function gain(xp,co){SV.coins+=co;SV.xp+=xp;const t=tier();while(SV.ct<t){SV.ct++;const r=reward(SV.ct);if(r.k=='co')SV.coins+=r.v;feed.push({t:'Palier '+SV.ct+' : '+(r.k=='co'?r.l+' pièces':r.l+' débloqué !'),l:6})}save()}
const cardPos=i=>({x:24+(i%5)*184,y:140+Math.floor(i/5)*160,w:176,h:150});
const inB=(p,x,y)=>x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h;
const OL=()=>CH.map((c,i)=>i).filter(owned);
const selCh=()=>{const o=OL();return Number.isInteger(SV.sel)&&o.includes(SV.sel)?SV.sel:(o.length?o[0]:-1)};
const sp=k=>({x:24+(k%6)*154,y:126+Math.floor(k/6)*98,w:148,h:90}),shp=k=>({x:14+(k%7)*136,y:124+Math.floor(k/7)*196,w:130,h:188});
const F2=' Trebuchet MS,sans-serif';
function wrap(t,x,y,lh,n){(t.match(new RegExp('.{1,'+(n||21)+'}(\\s|$)','g'))||[t]).forEach((l,j)=>g.fillText(l.trim(),x,y+j*lh))}
const pkOf=ci=>PACKS.findIndex(q=>q.ch==ci&&SV.packs.includes(q.id)&&SV.eq[q.id]!==0)+1;
function miniChar(x,y,ci,sc,t){const s=CH[ci],pk=pkOf(ci);g.save();g.translate(x,y);g.scale(sc,sc);g.rotate(-.5+Math.sin(t)*.07);const cb=crGet(crCx(),'b'),cw=crGet(crCx(),'w');wpn(s,{rs:!!SKINS[SV.skin].an});if(cw)crWpnFx(s,cw);g.fillStyle=cb?crFill(cb,s.r):pk?PACKS[pk-1].col:SKINS[SV.skin].c||s.col;g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle=s.col=='#2b2b36'?'#aab6d0':'rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();if(s.cr)scales(s);if(cb)crBodyFx(s,cb);else{drawDet(pk,s);if(!pk){rkFx(s,SV.skin);if(SKINS[SV.skin].an)radFx(s)}}g.restore()}
function drawSelScreen(){const o=OL(),dead=mode==2,F=F2;let hov=selCh();
const acc=hov>=0?CH[hov].col:dead?'#ff5a5a':SV.mode==2?'#ff8ad8':SV.mode?'#ffd98a':'#7ad0ff';
g.setTransform(1,0,0,1,0,0);g.fillStyle='#070a12';g.fillRect(0,0,W,H);
let gr=g.createRadialGradient(W/2,H*.35,40,W/2,H*.35,620);gr.addColorStop(0,dead?'rgba(120,20,20,.45)':'rgba(40,60,110,.45)');gr.addColorStop(1,'rgba(7,10,18,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
if(hov>=0){g.globalCompositeOperation='lighter';gr=g.createRadialGradient(W/2,H*.5,20,W/2,H*.5,480);gr.addColorStop(0,acc+'33');gr.addColorStop(1,acc+'00');g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
g.fillStyle=acc;for(let i=0;i<46;i++){g.globalAlpha=.08+.08*Math.sin(tt+i);g.beginPath();g.arc((i*97.3+tt*(8+i%5*5))%W,((i*53.7-tt*(10+i%4*4))%H+H)%H,1.5+i%3,0,7);g.fill()}g.globalAlpha=1;
g.fillStyle='rgba(255,255,255,.04)';g.fillRect(0,0,W,118);g.globalAlpha=.6;g.fillStyle=acc;g.fillRect(0,117,W,2);g.globalAlpha=1;
g.textAlign='left';g.fillStyle=dead?'#ff6a6a':'#f0e6d0';g.font='bold 34px'+F;g.fillText(dead?'ÉLIMINÉ':'LOBBY',30,50);g.font='14px'+F;g.fillStyle='#9aa7bd';g.fillText((dead&&me.kby?'Tué par '+me.kby+'  ·  ':'')+MAPS[mi].n+'  ·  '+(SV.mode==2?'Événement spécial':fmt(ph.left)+' restantes'),30,74);
g.textAlign='right';g.fillStyle='#e9d9a8';g.font='bold 16px'+F;g.fillText('● '+SV.coins+' pièces',W-30,44);
if(SV.mode==2){g.fillStyle='#ff8ad8';g.font='bold 15px'+F;g.fillText('Événement spécial',W-30,76)}else if(SV.mode==1){badge(W-300,70,15,SV.rk.r,SV.rk.d);g.fillStyle=rankFill(SV.rk.r,W-100,120);g.font='bold 15px'+F;g.fillText('Classé · '+rkName(SV.rk.r,SV.rk.d)+' '+SV.rk.rr+' RR',W-30,76)}else{g.fillStyle='#7ad0ff';g.font='bold 15px'+F;g.fillText('Mode Classique',W-30,76)}
g.textAlign='center';
if(dead&&me.dt>0){g.fillStyle='#ffb3b3';g.font='bold 15px'+F;g.fillText('Réapparition dans '+Math.ceil(me.dt)+' s…',W/2,94);g.fillStyle='#2a1414';g.fillRect(W/2-120,102,240,6);g.fillStyle='#ff5a5a';g.fillRect(W/2-120,102,240*Math.max(0,1-me.dt/2),6)}
else if(hov>=0){const s=CH[hov];g.fillStyle=acc;g.font='bold 15px'+F;g.fillText(s.n+' — '+ABN[s.ab],W/2,94);g.fillStyle='#c5cfe0';g.font='13px'+F;g.fillText(ABD[s.ab],W/2,111)}
else{g.fillStyle='#8f9bb3';g.font='14px'+F;g.fillText('Aucun personnage : ouvre Personnages (P) pour en choisir un',W/2,102)}
drawSelect()}
// ---- v4 : quitter l'événement, annonces, crocodile, effets de skins ----
const quitR={x:250,y:H-46,w:132,h:30};
function leaveEvent(){me.al=0;mode=0;me.pt=null;me.sn=0;me.sw2=0;BS.al=0;METS.length=0;R={};DP=[];Bu=[];menuOpen=1;net.send('join',{m:-1,uid:SV.uid,n:SV.name});pres()}
function drawQuit(){const h=inB(quitR,M.x,M.y);g.setTransform(1,0,0,1,0,0);g.fillStyle=h?'#3a2030':'#1d1226';g.fillRect(quitR.x,quitR.y,quitR.w,quitR.h);g.strokeStyle=h?'#fff':'#ff8ad8';g.lineWidth=2;g.strokeRect(quitR.x,quitR.y,quitR.w,quitR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 14px'+F2;g.fillText('← Quitter',quitR.x+quitR.w/2,quitR.y+20)}
let quitAsk=0;
const qcR={x:W/2-160,y:H/2-80,w:320,h:160},qyR={x:W/2-140,y:H/2+20,w:130,h:42},qnR={x:W/2+10,y:H/2+20,w:130,h:42};
const quitOk=()=>!menuOpen&&!(psk||st||shop||bp);
function doQuit(){quitAsk=0;if(SV.mode==1&&me.pl&&!me.late&&ph.n==0&&rkDone!==ph.id){const n=standings().length;if(n>=2)applyRR(rrDelta(n,n));rkDone=ph.id;postLB()}leaveEvent()}
function askQuit(){if(ph.n==0&&(mode==1||(SV.mode==1&&me.pl)))quitAsk=1;else doQuit()}
function drawQuitAsk(){const pen=SV.mode==1&&me.pl&&!me.late&&ph.n==0;g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,0,W,H);g.fillStyle='#161d2a';g.fillRect(qcR.x,qcR.y,qcR.w,qcR.h);g.strokeStyle='#ff8a6a';g.lineWidth=3;g.strokeRect(qcR.x,qcR.y,qcR.w,qcR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F2;g.fillText('Quitter la partie ?',W/2,qcR.y+38);g.font='13px'+F2;g.fillStyle=pen?'#ff9a7a':'#9aa7bd';g.fillText(pen?'En classé, quitter compte comme une défaite (−10 RR)':'Tu reviendras au menu principal',W/2,qcR.y+62);
[[qyR,'Oui, quitter','#ff6a6a'],[qnR,'Rester','#7ad0ff']].forEach(a=>{const r=a[0],h=inB(r,M.x,M.y);g.fillStyle=h?'#2a3550':'#1a2236';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=h?'#fff':a[2];g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font='bold 15px'+F2;g.fillText(a[1],r.x+r.w/2,r.y+27)})}
const rs=()=>{const t=Math.max(0,BOSSRS-(performance.now()-BOSSRSt)/1000);return t>0?Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'):''};
let ANN=null;
function announce(txt){ANN={t0:performance.now(),dur:12000,txt:txt||"⚔ Un boss est apparu — rejoins l'événement spécial !"}}
function drawAnn(){if(!ANN)return;const k=(performance.now()-ANN.t0)/ANN.dur;if(k>=1){ANN=null;return}g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=Math.max(0,Math.min(1,k*8,(1-k)*6));const y=(mode==1&&!(psk||st||shop||bp||menuOpen))?100:14,w=Math.min(W-40,40+ANN.txt.length*8.6),x=W/2-w/2;g.fillStyle='rgba(8,6,16,.78)';g.fillRect(x,y,w,26);g.strokeStyle=rbw(x,y,w,26);g.lineWidth=2;g.strokeRect(x,y,w,26);g.textAlign='center';g.fillStyle=rbw(x,y,w,26);g.font='bold 14px'+F2;g.fillText(ANN.txt,W/2,y+18);g.restore()}
function unlockCroc(){SV.xc=1;save();feed.push({t:'★ Personnage secret débloqué !',l:8});announce('★ Un personnage secret vient d\'être débloqué ! ★')}
function crocUpd(dt){if(!me.al||ph.n)return;
if(me.sw2>0){const rr=CH[me.c].r;for(const o of bots)if(o.hp>0&&Math.hypot(o.x-me.x,o.y-me.y)<rr+14)hitBot(o,9999);if(BS.al&&Math.hypot(BS.x-me.x,BS.y-me.y)<BS.r+rr+4)bossHit(260*dt);for(const m of MINL)if(Math.hypot(m.x-me.x,m.y-me.y)<rr+MNR+4)minHit(m,260*dt)}
if(SV.mode!=2)for(const k in R){const o=R[k];if(o.cs&&o.al&&Math.hypot(o.x-me.x,o.y-me.y)<CH[me.c].r+CH[o.c].r+2)hurtMe(9999,k)}}
const inMud=(x,y)=>(MAPS[mi].mud||[]).some(r=>x>r[0]&&x<r[0]+r[2]&&y>r[1]&&y<r[1]+r[3]);
function drawSnow(){if(!MAPS[mi].snow)return;g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<80;i++){const x=((i*97.7+tt*(20+i%7*6)+Math.sin(tt+i)*15)%W+W)%W,y=((i*61.3+tt*(40+i%5*14))%H+H)%H;g.beginPath();g.arc(x,y,1+i%3*.7,0,7);g.fill()}}
const skR=i=>({x:24+(i%7)*134,y:370+Math.floor(i/7)*74,w:128,h:68});
function scales(s){const r=s.r;g.save();g.beginPath();g.arc(0,0,r,0,7);g.clip();g.strokeStyle='rgba(120,220,140,.45)';g.lineWidth=1.5;for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const x=i*r*.42+(j&1?r*.21:0),y=j*r*.36;if(x*x+y*y>r*r*1.1)continue;g.beginPath();g.arc(x,y,r*.2,.15,Math.PI-.15);g.stroke()}
g.fillStyle='#0e3318';for(let i=0;i<4;i++){const x=-r*.7+i*r*.4;g.beginPath();g.moveTo(x,-3);g.lineTo(x+r*.18,0);g.lineTo(x,3);g.fill()}g.restore()}
function rkFx(s,sk){const k=(SKINS[sk|0]||{}).rk;if(!k||SKINS[sk|0].an)return;const r=s.r,c=RANKS[k].c;g.save();g.strokeStyle=c;g.lineWidth=2.5;g.globalAlpha=.9;g.beginPath();g.arc(0,0,r*.78,0,7);g.stroke();g.fillStyle=c;for(let i=0;i<k;i++){const a=Math.PI+(i-(k-1)/2)*.38;g.beginPath();g.moveTo(Math.cos(a)*r*.55,Math.sin(a)*r*.55);g.lineTo(Math.cos(a+.1)*r*.95,Math.sin(a+.1)*r*.95);g.lineTo(Math.cos(a-.1)*r*.95,Math.sin(a-.1)*r*.95);g.fill()}
if(k>=4){g.globalAlpha=.35+.25*Math.sin(tt*4);g.lineWidth=5;g.beginPath();g.arc(0,0,r+3,0,7);g.stroke()}g.restore()}
function radFx(s){const r=s.r,t=tt,big=s.sec==1;g.save();g.beginPath();g.arc(0,0,r,0,7);g.clip();const o=((t*60)%(r*5))-r*2.5,gr=g.createLinearGradient(o-r,-r,o+r,r);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(-r,-r,r*2,r*2);
for(let i=0;i<3;i++){g.fillStyle='rgba(255,170,40,'+(.25+.15*Math.sin(t*5+i))+')';g.beginPath();g.arc(Math.cos(t*2+i*2.1)*r*.5,Math.sin(t*2+i*2.1)*r*.5,r*.35,0,7);g.fill()}g.restore();
g.save();g.lineWidth=big?4:3;for(let i=0;i<8;i++){g.strokeStyle='hsl('+Math.floor((t*120+i*45)%360)+',100%,65%)';g.beginPath();g.arc(0,0,r+4,i*.785+t*2,i*.785+t*2+.7);g.stroke()}
const n=big?9:5;for(let i=0;i<n;i++){const a=t*(big?2:1.6)+i*6.283/n,d=r*(1.7+.25*Math.sin(t*4+i));g.fillStyle=i%2?'#fff':'#ffd24a';g.globalAlpha=.6+.4*Math.sin(t*7+i);spark(Math.cos(a)*d,Math.sin(a)*d,2+i%3)}g.globalAlpha=1;
if(big)for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.35,f=r*(.8+.35*Math.sin(t*9+i*1.7));g.fillStyle=i%2?'#ff9a1a':'#ffe58a';g.beginPath();g.moveTo(Math.cos(a-.12)*r,Math.sin(a-.12)*r);g.lineTo(Math.cos(a)*(r+f),Math.sin(a)*(r+f));g.lineTo(Math.cos(a+.12)*r,Math.sin(a+.12)*r);g.fill()}
g.restore()}
function wake(r){g.save();g.strokeStyle='rgba(150,220,255,.7)';g.lineWidth=2;for(let i=0;i<3;i++){const p=(tt*1.5+i/3)%1;g.globalAlpha=.7*(1-p);g.beginPath();g.arc(0,0,r*(1.1+p*1.8),0,7);g.stroke()}g.fillStyle='rgba(180,235,255,.8)';for(let i=0;i<5;i++){const p=(tt*2+i*.21)%1;g.globalAlpha=.8*(1-p);g.beginPath();g.arc(-r*(.6+p*2.4),Math.sin(i*3+tt*5)*r*.6,2.5,0,7);g.fill()}g.restore()}
const LK=()=>CH.some((c,i)=>c.sec&&!c.hid&&!owned(i))?1:0;
const backR={x:14,y:10,w:116,h:34};
function drawBack(){g.setTransform(1,0,0,1,0,0);const h=inB(backR,M.x,M.y);g.fillStyle=h?'#2a3550':'#1a2236';g.fillRect(backR.x,backR.y,backR.w,backR.h);g.strokeStyle=h?'#fff':'#7ad0ff';g.lineWidth=2;g.strokeRect(backR.x,backR.y,backR.w,backR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 15px'+F2;g.fillText('← Retour',backR.x+backR.w/2,backR.y+23)}
function backClick(){if(!(psk||st||shop||bp)||!inB(backR,M.x,M.y))return 0;if(admP)admP=0;else bp=shop=st=psk=0;return 1}
const lcR={x:24,y:132,w:330,h:200},lrR={x:378,y:132,w:558,h:200},ltR=k=>({x:24+k*154,y:356,w:148,h:90});
function drawSelect(){const F=F2,dim=mode==2&&me.dt>0,ci=selCh();g.globalAlpha=dim?.45:1;
{const p=lcR,h=inB(p,M.x,M.y)&&!dim,s=ci>=0?CH[ci]:null,c=s?(s.col=='#2b2b36'?'#aab6d0':s.col):'#ffd98a';
g.save();if(h){g.shadowColor=c;g.shadowBlur=22}const gr=g.createLinearGradient(0,p.y,0,p.y+p.h);gr.addColorStop(0,'#1f2a40');gr.addColorStop(1,'#0e1220');g.fillStyle=gr;g.fillRect(p.x,p.y,p.w,p.h);g.restore();
g.fillStyle=c;g.fillRect(p.x,p.y,p.w,4);g.strokeStyle=h?'#fff':c;g.lineWidth=h?3:1.5;g.strokeRect(p.x,p.y,p.w,p.h);
g.textAlign='left';g.fillStyle='#8f9bb3';g.font='bold 11px'+F;g.fillText('TON PERSONNAGE',p.x+14,p.y+22);
if(s){miniChar(p.x+62,p.y+92,ci,1.5,tt*2);g.textAlign='left';g.fillStyle='#f0e6d0';g.font='bold 22px'+F;g.fillText(s.n,p.x+170,p.y+74);g.fillStyle=c;g.font='bold 14px'+F;g.fillText(s.ab=='nsum'?'Invocation · '+SUMT[SV.sm&3].n:ABN[s.ab],p.x+170,p.y+98);
[['PV',s.hp/180,'#6fd16f'],['VIT',s.sp/300,'#7ad0ff']].forEach((b,j)=>{const by=p.y+114+j*16;g.fillStyle='#8f9bb3';g.font='10px'+F;g.fillText(b[0],p.x+170,by+7);g.fillStyle='#0b0f18';g.fillRect(p.x+200,by,110,7);g.fillStyle=b[2];g.fillRect(p.x+200,by,110*Math.min(1,b[1]),7)})}
else{g.textAlign='center';g.fillStyle='#ffd98a';g.font='bold 16px'+F;g.fillText('Aucun personnage',p.x+p.w/2,p.y+100)}
if(s&&s.ab=='nsum')drawSumPick(p);g.textAlign='center';g.fillStyle=h?'#fff':'#7ad0ff';g.font='bold 13px'+F;g.fillText('🛒 Changer de personnage (P)',p.x+p.w/2,p.y+p.h-8)}
{const p=lrR,ok=ci>=0&&!dim,h=ok&&inB(p,M.x,M.y);
g.save();if(h){g.shadowColor='#3fcf5a';g.shadowBlur=26}g.fillStyle=ok?(h?'#2a6a3a':'#1f4a2c'):'#1a1f2a';g.fillRect(p.x,p.y,p.w,p.h);g.restore();
g.strokeStyle=ok?(h?'#fff':'#3fcf5a'):'#445';g.lineWidth=h?4:2.5;g.strokeRect(p.x,p.y,p.w,p.h);
g.textAlign='center';g.fillStyle=ok?'#f0e6d0':'#6b7488';g.font='bold 64px'+F;g.fillText('PRÊT',p.x+p.w/2,p.y+100);
g.font='16px'+F;g.fillStyle=ok?'#bfe8c8':'#6b7488';g.fillText(ci<0?'Choisis d\'abord un personnage':dim?'Réapparition dans '+Math.ceil(me.dt)+' s':'Lancer la partie avec '+CH[ci].n+'  (Entrée)',p.x+p.w/2,p.y+142)}
[['🎨','Skins (K)','#ff9a3c','Packs de skins'],['🎁','Caisses (C)','#ffcf33','Achète et ouvre des caisses'],['✨','Mes objets (V)','#ff6adf','Équipe tes skins de caisses'],['🏆','Battle Pass (B)','#ffd98a','Palier '+tier()+' / '+TIERS],['⚙','Paramètres (O)','#aab6d0','Pseudo, musique…'],['🎮','Mode : '+['Classique','Classé','Événement'][SV.mode|0],'#9be39b','Clic pour changer']].forEach((b,j)=>{const p=ltR(j),h=inB(p,M.x,M.y)&&!dim,y0=p.y-(h?3:0);g.save();if(h){g.shadowColor=b[2];g.shadowBlur=18}g.fillStyle='#161326';g.fillRect(p.x,y0,p.w,p.h);g.restore();g.strokeStyle=b[2];g.lineWidth=h?3:1.5;g.setLineDash([6,4]);g.strokeRect(p.x,y0,p.w,p.h);g.setLineDash([]);g.textAlign='center';g.font='26px'+F;g.fillStyle='#fff';g.fillText(b[0],p.x+74,y0+36);g.fillStyle=b[2];g.font='bold 14px'+F;g.fillText(b[1],p.x+74,y0+62);g.font='11px'+F;g.fillStyle='#9aa7bd';g.fillText(b[3],p.x+74,y0+78);if(j==1){let n=0;try{crInit();n=crTopCount()}catch(e){}if(n>0){g.fillStyle='#ff4a4a';g.beginPath();g.arc(p.x+p.w-12,y0+12,10,0,7);g.fill();g.fillStyle='#fff';g.font='bold 12px'+F;g.textAlign='center';g.fillText(n,p.x+p.w-12,y0+16)}}});
g.globalAlpha=1;
if(ci<0){g.textAlign='center';g.fillStyle='#ffd98a';g.font='bold 16px'+F;g.fillText('Tu n\'as aucun personnage : ouvre « Personnages » (touche P) et achète-en un !',W/2,H-14)}}
function selClick(){const ci=selCh();if(ci>=0&&CH[ci].ab=='nsum')for(let i=0;i<4;i++)if(inB(sumBtn(i),M.x,M.y)){SV.sm=i;save();return}if(inB(lcR,M.x,M.y)){shop=1;return}if(inB(lrR,M.x,M.y)){if(ci>=0)pick(ci);return}if(inB(ltR(0),M.x,M.y))psk=1;if(inB(ltR(1),M.x,M.y)&&typeof crOpenScr=='function')crOpenScr(1);if(inB(ltR(2),M.x,M.y)&&typeof crOpenScr=='function')crOpenScr(2);if(inB(ltR(3),M.x,M.y))bp=1;if(inB(ltR(4),M.x,M.y))st=1;if(inB(ltR(5),M.x,M.y))askQuit()}
let shopTab=0;
const SL=()=>CH.map((c,i)=>i).filter(i=>shopTab==2?(!!CH[i].sec&&(!CH[i].hid||owned(i))):CH[i].sec?false:shopTab?PASSCH[i]!=null:PASSCH[i]==null);
const tabR=i=>({x:80+i*270,y:80,w:260,h:34});
function drawShop(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#7ad0ff';g.font='bold 30px'+F2;g.fillText('Personnages',W/2,38);g.font='15px'+F2;g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+' pièces — 1 kill = 1 pièce'+(shopTab==1?'   ·   Battle Pass : palier '+tier()+' / '+TIERS:shopTab==2?"   ·   Exclusif : bats le boss de l'événement spécial pour le débloquer":''),W/2,64);
['Achetables','Battle Pass · par paliers','★ Exclusif · secret'].forEach((t,i)=>{const r=tabR(i),on=shopTab==i,c=i==2?rbw(r.x,r.y,r.w,r.h):i?'#ffd98a':'#7ad0ff';g.fillStyle=on?(i?'#3a2f10':'#10304a'):'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=on?c:inB(r,M.x,M.y)?'#fff':'#445';g.lineWidth=on?3:2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle=on?'#f0e6d0':'#9aa7bd';g.font=(on?'bold ':'')+'14px'+F2;g.fillText(t,r.x+r.w/2,r.y+22)});
SL().forEach((i,k)=>{const s=CH[i],p=shp(k),ow=owned(i),cx=p.x+65;g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=s.sec?rbw(p.x,p.y,p.w,p.h):ow?(i==selCh()?'#ffd98a':'#3fcf5a'):s.col=='#2b2b36'?'#aab6d0':s.col;g.lineWidth=inB(p,M.x,M.y)||(ow&&i==selCh())?4:2;g.strokeRect(p.x,p.y,p.w,p.h);if(s.sec&&ow)miniChar(cx-10,p.y+34,i,1.25,tt*2);else if(s.sec){g.fillStyle='#0d121c';g.beginPath();g.arc(cx,p.y+30,24,0,7);g.fill();g.strokeStyle=rbw(cx-24,p.y+6,48,48);g.lineWidth=3;g.stroke();g.fillStyle=rbw(cx-24,p.y+6,48,48);g.textAlign='center';g.font='bold 32px'+F2;g.fillText('?',cx,p.y+42)}else{g.fillStyle=s.col;g.beginPath();g.arc(cx,p.y+30,s.r*1.2,0,7);g.fill();g.fillStyle='#1b1f2a';g.fillRect(cx+s.r*.8,p.y+27,s.L*.9,5)}g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 13px'+F2;const lk=s.sec&&!ow;g.fillText(lk?'???':s.n,cx,p.y+66);g.font='11px'+F2;g.fillStyle=lk?'#9aa7bd':s.col=='#2b2b36'?'#aab6d0':s.col;g.fillText(lk?'Pouvoir secret':ABN[s.ab],cx,p.y+82);g.fillStyle='#9aa7bd';wrap(lk?"Bats le boss de l'événement spécial pour le débloquer":ABD[s.ab],cx,p.y+98,13);
if(shopTab==1&&!ow){g.fillStyle='#0d121c';g.fillRect(p.x+15,p.y+158,100,6);g.fillStyle='#ffd98a';g.fillRect(p.x+15,p.y+158,100*Math.min(1,tier()/PASSCH[i]),6)}
g.font='bold 12px'+F2;g.fillStyle=ow?(i==selCh()?'#ffd98a':'#3fcf5a'):'#ffd98a';g.fillText(ow?(i==selCh()?'★ Sélectionné':'✔ Choisir'):shopTab==2?'🔒 Secret':shopTab?'🔒 Palier '+PASSCH[i]:'🔒 '+PRICE[i]+' pièces'+(SV.coins>=PRICE[i]?' — acheter':''),cx,p.y+178)});
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('P ou Échap pour fermer — Tab ou clic sur un onglet pour changer de liste — clique un personnage possédé pour le jouer',W/2,H-10)}
function shopClick(){for(let i=0;i<3;i++)if(inB(tabR(i),M.x,M.y))shopTab=i;SL().forEach((ci,k)=>{if(inB(shp(k),M.x,M.y)&&owned(ci)&&SV.sel!==ci){SV.sel=ci;save()}if(inB(shp(k),M.x,M.y)&&!owned(ci)&&PRICE[ci]&&SV.coins>=PRICE[ci]){SV.coins-=PRICE[ci];SV.bought.push(ci);save()}})}
const los=(x1,y1,x2,y2)=>{const n=Math.ceil(Math.hypot(x2-x1,y2-y1)/24);for(let i=1;i<n;i++)if(hitW(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n))return false;return true};
const inIx=(x,y)=>DP.some(o=>o.k=='ixz'&&o.l>0&&Math.hypot(x-o.x,y-o.y)<170);
function target(o){let b=null,bd=520;const c=(x,y)=>{const d=Math.hypot(x-o.x,y-o.y);if(d<bd&&los(o.x,o.y,x,y)){bd=d;b={x,y}}};if(SV.mode!=2)for(const k in R){const r=R[k];if(r.al&&!r.iv)c(r.x,r.y)}if(BS.al)c(BS.x,BS.y);for(const q of bots)if(q.hp>0)c(q.x,q.y);return b}
function initDp(o){Object.assign(o,{sum:{hp:60,l:30,cd:.5},tur:{hp:40,l:30,cd:.6},bot:{hp:25,l:5,cd:.3},trap:{hp:15,l:90,cd:0},tp:{hp:50,l:180,cd:0},ixz:{hp:9e9,l:8,cd:0},lava:{hp:9e9,l:6,cd:0},bw:{hp:60,l:25,cd:0}}[o.k]);if(o.k=='bw'){o.w=o.ho?110:24;o.h=o.ho?24:110}if(o.k=='sum'){o.st&=3;o.sg=Math.min(3,o.sg|0);o.mh=SUMT[o.st].hp*SUMM(o.sg);o.hp=o.mh;o.pw=0;o.pc=3;o.mt=0;o.sy=0}if(o.k=='lava'){o.rad=o.ho?105:62;o.l=o.ho?6:4}return o}
function addDp(o){if(!['tur','bot','trap','tp','ixz','bw','lava','sum'].includes(o.k))return;if(o.k=='sum')DP=DP.filter(q=>!(q.k=='sum'&&q.own==o.own));if(o.k!='ixz'&&inIx(o.x,o.y))return;if(o.k=='tp'){const m=DP.filter(q=>q.k=='tp'&&q.own==o.own);if(m.length>=2)m[0].l=0}if(DP.length<60)DP.push(o)}
function drawLava(o){const r=o.rad,k=Math.min(1,o.l/1.2),t=tt,pul=.5+.5*Math.sin(t*5+o.x);
const gr=g.createRadialGradient(0,0,r*.1,0,0,r);gr.addColorStop(0,'rgba(255,210,70,'+(.85*k)+')');gr.addColorStop(.55,'rgba(255,100,20,'+(.7*k)+')');gr.addColorStop(1,'rgba(90,20,10,'+(.55*k)+')');
g.fillStyle=gr;g.beginPath();g.arc(0,0,r*(.96+.04*pul),0,7);g.fill();g.strokeStyle='rgba(255,170,60,'+(.8*k)+')';g.lineWidth=3;g.beginPath();g.arc(0,0,r,0,7);g.stroke();
for(let i=0;i<7;i++){const ph2=(i*.61+t*.9)%1,a=i*2.4+o.x,d=r*(.2+.6*((i*.37+t*.25)%1));g.globalAlpha=k*(1-ph2);g.fillStyle='#ffe066';g.beginPath();g.arc(Math.cos(a)*d,Math.sin(a)*d,3+3*ph2,0,7);g.fill()}g.globalAlpha=1}
function drawFire(b){const x=b.x-cam.x,y=b.y-cam.y;if(x<-60||x>W+60||y<-60||y>H+60)return;const l=Math.hypot(b.vx,b.vy)||1,ux=b.vx/l,uy=b.vy/l;
for(let j=5;j>=1;j--){g.fillStyle='rgba(255,'+(90+j*25)+',30,'+(.12*(6-j))+')';g.beginPath();g.arc(x-ux*j*9+(Math.random()-.5)*3,y-uy*j*9+(Math.random()-.5)*3,13-j*1.5,0,7);g.fill()}
const gr=g.createRadialGradient(x,y,2,x,y,17);gr.addColorStop(0,'#fff6c0');gr.addColorStop(.5,'#ff9a1a');gr.addColorStop(1,'rgba(255,60,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,17,0,7);g.fill()}
function dep(k,x,y,ho){const id=(myPeer||'me')+':'+(++dpn),o=initDp({id,k,x,y,ho:ho?1:0,own:myPeer||'me'});addDp(o);snd('dep',{id,k,x,y,ho:ho?1:0})}
function useAb(s,dx,dy,l){const A=s.ab,at=me.a;if(inIx(me.x,me.y)&&A!='ixz'){me.ab=0;return}
if(A=='roll'){me.ro=.22;me.ri=.22;me.rs=640;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='dash'){me.ro=.18;me.rs=1100;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='invis')me.iv=3.5;else if(A=='invis5')me.iv=5;else if(A=='shield')me.sh=2.5;else if(A=='inv')me.inv=5;
else if(A=='shield4'){me.bn=Math.round(s.hp/4);me.bt=10}else if(A=='regen')me.rg=6;
else if(A=='rewind'){me.pt={x:me.x,y:me.y,hp:me.hp,t:5};snd('pw',{x:Math.round(me.x),y:Math.round(me.y)});for(let i=0;i<30;i++)ptc(me.x,me.y,i%2?'#ff8a3c':'#ffd23a')}
else if(A=='flash'){snd('flash',{x:me.x,y:me.y,a:me.a,sc:packId()=='hal'?1:0});for(let i=0;i<30;i++)ptc(me.x,me.y,'#fff')}
else if(A=='salvo'){const as=[at-.22,at,at+.22];shoot(me.x,me.y,as,me.c,true,myPeer||'me',0);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0})}else if(A=='wall'){const hz=Math.abs(Math.cos(at))<Math.abs(Math.sin(at))?1:0;dep('bw',me.x+Math.cos(at)*70,me.y+Math.sin(at)*70,hz)}
else if(A=='sniper'){me.sn=1;me.ab=1e9;me.cd=.5;feed.push({t:'Sniper équipé : une seule balle !',l:3});for(let i=0;i<16;i++)ptc(me.x,me.y,'#ffe066')}else if(A=='behind')tpBehind(s);else if(A=='quake'){dep('lava',me.x,me.y,1);const as=[];for(let i=0;i<12;i++)as.push(at+i*Math.PI/6);shoot(me.x,me.y,as,me.c,true,myPeer||'me',0);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0});for(let i=0;i<30;i++){const an=i/30*6.283;ptc(me.x+Math.cos(an)*24,me.y+Math.sin(an)*24,i%2?'#ff7a1a':'#ffd23a')}}else if(A=='swim'){me.sw2=5;for(let i=0;i<24;i++)ptc(me.x,me.y,i%2?'#7fd8ff':'#2f8f4a')}else if(A=='nsum')depSum();else dep(A,me.x,me.y)}
function drawDP(){for(const o of DP){const sx=o.x-cam.x,sy=o.y-cam.y;if(sx<-200||sx>W+200||sy<-200||sy>H+200)continue;const mine=o.own===(myPeer||'me');g.save();g.translate(sx,sy);if(o.k=='lava'){drawLava(o);g.restore();continue}
if(o.k=='ixz'){g.fillStyle='rgba(63,207,90,'+(.08+.04*Math.sin(tt*4))+')';g.beginPath();g.arc(0,0,170,0,7);g.fill();g.strokeStyle='rgba(63,207,90,.8)';g.lineWidth=3;g.setLineDash([12,10]);g.lineDashOffset=-tt*20;g.beginPath();g.arc(0,0,170,0,7);g.stroke();g.setLineDash([])}
else if(o.k=='tp'){g.fillStyle='#000a';g.fillRect(-12,-24,24,4);g.fillStyle='#c9a0ff';g.fillRect(-12,-24,24*Math.max(0,o.hp/50),4);g.strokeStyle='#c9a0ff';g.lineWidth=3;for(let j=0;j<3;j++){g.beginPath();g.arc(0,0,8+j*5+Math.sin(tt*6+j)*2,0,7);g.stroke()}}
else if(o.k=='trap'){if(o.act>0){g.fillStyle='rgba(58,123,255,'+(.25+.1*Math.sin(tt*10))+')';g.beginPath();g.arc(0,0,70,0,7);g.fill();g.strokeStyle='#8fb4ff';g.lineWidth=2;g.stroke()}else{g.globalAlpha=mine?.9:.3;g.fillStyle='#3a7bff';g.beginPath();g.moveTo(-9,7);g.lineTo(0,-9);g.lineTo(9,7);g.fill()}}
else if(o.k=='bw'){g.fillStyle='#5a4396';g.fillRect(-o.w/2,-o.h/2,o.w,o.h);g.strokeStyle='#c9a3ff';g.lineWidth=2;g.strokeRect(-o.w/2,-o.h/2,o.w,o.h);if(o.hp<40){g.strokeStyle='rgba(0,0,0,.5)';g.beginPath();g.moveTo(-o.w/2+4,-o.h/2+4);g.lineTo(0,2);g.lineTo(o.w/2-4,o.h/2-4);g.stroke()}g.fillStyle='#000a';g.fillRect(-14,-3,28,4);g.fillStyle='#c9a3ff';g.fillRect(-14,-3,28*Math.max(0,o.hp/60),4)}
else if(o.k=='sum')drawSum(o,mine);
else{const bt=o.k=='bot';g.fillStyle=bt?'#8b5a2b':'#ff7ad9';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.arc(0,0,bt?9:13,0,7);g.fill();g.stroke();g.rotate(o.an||0);g.fillStyle='#222';g.fillRect(4,-2.5,bt?9:16,5);g.rotate(-(o.an||0));g.fillStyle='#000a';g.fillRect(-12,-20,24,4);g.fillStyle='#6fd16f';g.fillRect(-12,-20,24*Math.max(0,o.hp/(bt?25:40)),4)}
g.restore()}
if(me.pt){g.save();g.translate(me.pt.x-cam.x,me.pt.y-cam.y);g.strokeStyle='#ff8a3c';g.lineWidth=3;g.beginPath();g.arc(0,0,16+Math.sin(tt*8)*2,0,7);g.stroke();g.fillStyle='#ff8a3c';g.textAlign='center';g.font='bold 14px'+F2;g.fillText(Math.ceil(me.pt.t),0,5);g.restore()}}
function drawBP(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);const F=' Trebuchet MS,sans-serif',t=tier();g.textAlign='center';g.fillStyle='#ffd98a';g.font='bold 32px'+F;g.fillText('Battle Pass — palier '+t+' / '+TIERS,W/2,46);
g.fillStyle='#161d2a';g.fillRect(230,60,500,14);g.fillStyle='#7ad0ff';g.fillRect(230,60,500*(t>=TIERS?1:(SV.xp%100)/100),14);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText('1 kill = 20 XP + 1 pièce — 100 XP par palier — tu as '+SV.coins+' pièces',W/2,96);
for(let i=1;i<=TIERS;i++){const x=30+((i-1)%10)*90,y=108+Math.floor((i-1)/10)*80,r=reward(i);g.fillStyle=t>=i?'#1f3a2a':'#161d2a';g.fillRect(x,y,84,72);g.strokeStyle=r.k=='co'?'#556':'#ffd98a';g.lineWidth=1.5;g.strokeRect(x,y,84,72);g.fillStyle='#8f9bb3';g.font='11px'+F;g.fillText(i,x+42,y+14);g.fillStyle=r.k=='co'?'#e9d9a8':r.k=='sk'?'#7ad0ff':'#ff9a6a';g.font='bold 14px'+F;g.fillText(r.l,x+42,y+42);g.font='10px'+F;g.fillStyle='#8f9bb3';g.fillText(r.k=='co'?'pièces':r.k=='sk'?'skin':'personnage',x+42,y+60)}
g.fillStyle='#f0e6d0';g.font='bold 16px'+F;g.fillText('Skins — clique pour équiper',W/2,364);
SKINS.forEach((k,i)=>{const r=skR(i),ow=ownedSkin(i),an=!!k.an;g.fillStyle='#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=SV.skin==i?'#ffd98a':an?rbw(r.x,r.y,r.w,r.h):'#334';g.lineWidth=SV.skin==i?3:an?2.5:1.5;g.strokeRect(r.x,r.y,r.w,r.h);g.globalAlpha=ow?1:.4;g.fillStyle=k.c||'#5ec27a';g.beginPath();g.arc(r.x+26,r.y+34,18,0,7);g.fill();if(k.rk){g.strokeStyle=an?rbw(r.x,r.y,40,40):RANKS[k.rk].c;g.lineWidth=3;g.beginPath();g.arc(r.x+26,r.y+34,21,0,7);g.stroke()}g.globalAlpha=1;g.textAlign='left';g.fillStyle='#f0e6d0';g.font='bold 12px'+F;g.fillText(k.n,r.x+52,r.y+30);g.font='10px'+F;g.fillStyle=ow?'#7dff9a':'#9aa7bd';g.fillText(ow?(SV.skin==i?'✔ Équipé':'Possédé'):ST[i]!=null?'Palier '+ST[i]:'Rang '+RANKS[k.rk].n,r.x+52,r.y+46)});g.textAlign='center';
g.fillStyle='#9aa7bd';g.font='13px'+F;g.fillText('B ou Échap pour fermer',W/2,H-12)}
function bpClick(){SKINS.forEach((k,i)=>{if(inB(skR(i),M.x,M.y)&&ownedSkin(i)){SV.skin=i;save();pres()}})}
const mf=n=>440*Math.pow(2,(n-69)/12);
function tone(f,t,d,type,v){const o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+.02);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(AC.master);o.start(t);o.stop(t+d+.05)}
const CHORDS=[[45,57,60,64],[41,53,57,60],[48,60,64,67],[43,55,59,62]];
function mnote(t){const T=TRACKS[SV.track];if(!T.ch)return;const ch=T.ch[(mstep>>4)%T.ch.length],q=mstep%16;if(q%4==0)tone(mf(ch[0]),t,.55,T.bs,.2);if(q%2==0)tone(mf(ch[1+((q>>1)%3)]+12),t,.28,T.ld,.025);if(q==0||q==8)tone(mf(ch[2]),t,1.1,'sine',.05)}
function startMusic(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();AC.master=AC.createGain();AC.master.gain.value=mute?0:SV.vol;AC.master.connect(AC.destination);mnext=AC.currentTime+.1;setInterval(()=>{if(AC.state!='running'){AC.resume();return}while(mnext<AC.currentTime+.3){mnote(mnext);mnext+=TRACKS[SV.track].st||.15;mstep++}},100)}catch(e){AC=null}}
const TRACKS=[{n:'Ténèbres',st:.15,ch:[[45,57,60,64],[41,53,57,60],[48,60,64,67],[43,55,59,62]],ld:'square',bs:'triangle'},
{n:'Action',st:.11,ch:[[40,52,55,59],[36,48,52,55],[38,50,54,57],[35,47,51,54]],ld:'sawtooth',bs:'square'},
{n:'Mystère',st:.22,ch:[[50,57,62,65],[46,58,62,65],[43,55,58,62],[45,57,61,64]],ld:'sine',bs:'sine'},
{n:'Épique',st:.17,ch:[[41,53,57,60],[43,55,59,62],[45,57,60,64],[40,52,56,59]],ld:'triangle',bs:'sawtooth'},
{n:'Aucune'}];
function setVol(){if(AC)AC.master.gain.value=mute?0:SV.vol}
function restartMusic(){mstep=0;if(AC)mnext=AC.currentTime+.1}
function cands(id){let sd=(id*2654435761>>>0)%2147483647||7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,a=MAPS.map((m,i)=>i).filter(i=>!MAPS[i].ev);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,3)}
const ORBC={laser:'120,255,255',spd:'80,160,255',dmg:'255,70,70',reg:'80,255,120',shd:'190,110,255'},ORBL={laser:'LASER',spd:'VITESSE',dmg:'DÉGÂTS',reg:'SOIN',shd:'BOUCLIER'};
function orbList(){const m=MAPS[mi];if(!m.orb||ph.n)return[];const e=Math.floor(net.now()/15000),n=m.orb.length,s0=(e*5+3)%n,om=(e*7+1)%4,ty=['laser',...['spd','dmg','reg','shd'].filter((t,i)=>i!=om)],L=[];ty.forEach((t,i)=>{const q=m.orb[(s0+i*2)%n],k=e*10+i;if(!orbPicked.has(k))L.push({x:q[0],y:q[1],t,k})});return L}
function applyOrb(t){const hp=CH[me.c].hp;if(t=='laser'){me.lz=5;feed.push({t:'Rayon laser ! 5 s',l:3})}else if(t=='spd'){me.hs=6;feed.push({t:'Boost de vitesse ! 6 s',l:3})}else if(t=='dmg'){me.db=8;feed.push({t:'Dégâts x2 ! 8 s',l:3})}else if(t=='reg'){me.rg=6;feed.push({t:'Régénération ! 6 s',l:3})}else{me.bn=Math.max(me.bn,Math.round(hp*.3));me.bt=8;feed.push({t:'Bouclier ! 8 s',l:3})}}
function drawHaz(){const m=MAPS[mi];
if(m.mud)for(const r of m.mud){const cx=r[0]+r[2]/2,cy=r[1]+r[3]/2;g.fillStyle='#34301a';g.beginPath();g.ellipse(cx,cy,r[2]/2,r[3]/2,0,0,7);g.fill();g.strokeStyle='#6b6a2e';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(150,150,70,.5)';g.lineWidth=2;for(let i=0;i<3;i++){const p=(tt*.4+i/3)%1;g.globalAlpha=1-p;g.beginPath();g.ellipse(cx,cy,r[2]/2*(.3+.6*p),r[3]/2*(.3+.6*p),0,0,7);g.stroke()}g.globalAlpha=1}
if(m.lv)for(const r of m.lv){g.fillStyle='#6b1a08';g.fillRect(r[0],r[1],r[2],r[3]);g.fillStyle='#e2531a';const n=Math.ceil(r[2]*r[3]/2200);for(let k=0;k<n;k++){const px=r[0]+((k*97+Math.sin(tt*.8+k)*14+r[2]*5)%r[2]+r[2])%r[2],py=r[1]+((k*57+Math.cos(tt*.7+k)*10+r[3]*5)%r[3]+r[3])%r[3];g.globalAlpha=.55;g.beginPath();g.arc(px,py,10+Math.sin(tt*2+k)*4,0,7);g.fill()}g.globalAlpha=1;g.strokeStyle='#ffb347';g.lineWidth=3;g.strokeRect(r[0],r[1],r[2],r[3]);g.globalCompositeOperation='lighter';const cx=r[0]+r[2]/2,cy=r[1]+r[3]/2,gr=g.createRadialGradient(cx,cy,10,cx,cy,Math.max(r[2],r[3])*.9);gr.addColorStop(0,'rgba(255,110,30,.25)');gr.addColorStop(1,'rgba(255,110,30,0)');g.fillStyle=gr;g.fillRect(r[0]-r[2],r[1]-r[3],r[2]*3,r[3]*3);g.globalCompositeOperation='source-over'}
PLT.forEach(p=>{g.save();g.translate(p.x,p.y);g.fillStyle=p.s==3?'#1a1a22':'#2a2a38';g.beginPath();g.arc(0,0,22,0,7);g.fill();g.strokeStyle=p.s==1?'#ff5a4a':'#555a70';g.lineWidth=3;g.stroke();
if(p.s==1){g.fillStyle='rgba(255,70,60,'+(.3+.3*Math.sin(tt*30))+')';g.beginPath();g.arc(0,0,22,0,7);g.fill()}
if(p.s==2){g.fillStyle='#e8e8f0';for(let k=0;k<8;k++){const a=k*Math.PI/4;g.beginPath();g.moveTo(Math.cos(a)*10-Math.sin(a)*4,Math.sin(a)*10+Math.cos(a)*4);g.lineTo(Math.cos(a)*40,Math.sin(a)*40);g.lineTo(Math.cos(a)*10+Math.sin(a)*4,Math.sin(a)*10-Math.cos(a)*4);g.fill()}}
g.restore()});
for(const ob of orbList()){const c=ORBC[ob.t];g.save();g.translate(ob.x,ob.y);g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(0,0,2,0,0,60);gr.addColorStop(0,'rgba('+c+',.6)');gr.addColorStop(1,'rgba('+c+',0)');g.fillStyle=gr;g.fillRect(-60,-60,120,120);g.globalCompositeOperation='source-over';g.fillStyle='rgb('+c+')';g.beginPath();g.arc(0,0,10+Math.sin(tt*6+ob.k)*2,0,7);g.fill();g.strokeStyle='rgb('+c+')';g.lineWidth=2;g.beginPath();g.arc(0,0,20,tt*3,tt*3+4);g.stroke();g.fillStyle='#fff';g.font='bold 10px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(ORBL[ob.t],0,-28);g.restore()}}
const stR=i=>({x:200,y:80+i*44,w:560,h:38});
const admList=()=>[['Moi',myPeer||'me'],...Object.keys(R).map(k=>[tag(k),k])].slice(0,8);
const admBtn=k=>({x:14+(k%6)*156,y:408+Math.floor(k/6)*40,w:150,h:34});

// ---------- Panneau admin (page dédiée) ----------
let admOpen=0,ADL=[],admPg=0;
const LOBN=['Classique','Classé','Événement','Menu'],LOBC=['#7ad0ff','#ffd24a','#d36bff','#8f9bb3'],ADPP=9;
function netAdl(d){ADL=Array.isArray(d)?d.slice(0,200).map(e=>({id:String(e.id),n:String(e.n||'?').slice(0,14),l:(e.l|0)})):[]}
const admSelf=()=>myPeer||'me';
function admRoster(){const s=admSelf(),l=ADL.length?ADL.slice():[{id:s,n:SV.name,l:SV.mode}];l.sort((a,b)=>(a.id===s?-1:b.id===s?1:a.n.localeCompare(b.n)));return l}
const admRowR=k=>({x:20,y:100+k*40,w:310,h:34});
const admPrev={x:20,y:470,w:96,h:30},admNext={x:234,y:470,w:96,h:30},admBack={x:790,y:14,w:150,h:34};
const adRR=(x,y,w,h,r)=>{g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h)};
const ADSEC=[
['Vie & combat','#ff8a6a',[
 {t:()=>'☠ Tuer',c:'#a33',f:()=>admSend('kill',0)},
 {t:()=>'❤ Soigner',c:'#2a8a4a',f:()=>admSend('heal',0)},
 {t:()=>'⚡ God mode'+(admSel===admSelf()?(me.god?' : ON':' : OFF'):' (bascule)'),c:'#b8860b',f:()=>admSend('god',0)}]],
['Économie & progression','#ffd24a',[
 {t:()=>'+100 pièces',c:'#8a6a1a',f:()=>admSend('coins',100)},
 {t:()=>'+1000 pièces',c:'#8a6a1a',f:()=>admSend('coins',1000)},
 {t:()=>'-100 pièces',c:'#6a3a2a',f:()=>admSend('coins',-100)},
 {t:()=>'+100 XP',c:'#2a5a8a',f:()=>admSend('xp',100)},
 {t:()=>'+30 RR',c:'#6a3a9a',f:()=>admSend('rr',30)},
 {t:()=>'-30 RR',c:'#4a2a5a',f:()=>admSend('rr',-30)}]],
['Ajouter (donner)','#7ad0ff',[
 {t:()=>'🛒 + Perso',c:'#2a6a7a',f:()=>{if(admSel)admP=2}},
 {t:()=>'🎨 + Skin',c:'#2a6a7a',f:()=>{if(admSel)admP=1}},
 {t:()=>'✨ + Skin de caisse',c:'#2a6a7a',f:()=>{if(admSel)admP=3}},
 {t:()=>'🎁 + Caisse',c:'#2a6a7a',f:()=>{if(admSel)admP=4}}]],
['Retirer','#ff9a6a',[
 {t:()=>'🛒 − Perso',c:'#7a3a2a',f:()=>{if(admSel)admP=12}},
 {t:()=>'🎨 − Skin',c:'#7a3a2a',f:()=>{if(admSel)admP=11}},
 {t:()=>'🎭 − Skin de perso',c:'#7a3a2a',f:()=>{if(admSel)admP=15}},
 {t:()=>'✨ − Skin de caisse',c:'#7a3a2a',f:()=>{if(admSel)admP=13}},
 {t:()=>'🎁 − Caisse',c:'#7a3a2a',f:()=>{if(admSel)admP=14}}]],
['Événement boss & danger','#d36bff',[
 {t:()=>'Événement : '+(BOSSUP?'ON':'OFF'),c:()=>BOSSUP?'#7a2a9a':'#3a2a4a',f:()=>net.send('ev',{on:BOSSUP?0:1})},
 {t:()=>'👹 Menu boss',c:'#5a2a6a',f:()=>{admBm=1}},
 {t:()=>'⚠ Réinitialiser',c:'#7a1a1a',f:()=>{if(admSel&&(typeof confirm!='function'||confirm('Réinitialiser le compte de ce joueur ? (pièces, XP, rang, personnages, skins, caisses)')))admSend('reset',0)}}]]];
const ADLAY=(()=>{let y=108;const b=[],h=[];for(const[n,col,items]of ADSEC){h.push({n,col,y});y+=20;items.forEach((it,i)=>b.push({...it,x:360+(i%4)*144,y:y+Math.floor(i/4)*38,w:138,h:32}));y+=Math.ceil(items.length/4)*38+6}return{b,h}})();
const bmCard=i=>({x:24+(i%3)*308,y:136+Math.floor(i/3)*286,w:296,h:270});
const bmGo=i=>{const c=bmCard(i);return{x:c.x+16,y:c.y+c.h-50,w:(c.w-32)/2-4,h:36}};const bmPl=i=>{const c=bmCard(i),w=(c.w-32)/2-4;return{x:c.x+16+w+8,y:c.y+c.h-50,w,h:36}};const bmRel={x:444,y:76,w:230,h:34};
const bmEv={x:24,y:76,w:200,h:34},bmKill={x:234,y:76,w:200,h:34};
function drawBossMenu(){
g.setTransform(1,0,0,1,0,0);g.textAlign='center';
let bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0c0f1a');bg.addColorStop(1,'#1a0d1c');g.fillStyle=bg;g.fillRect(0,0,W,H);
bg=g.createLinearGradient(0,0,W,0);bg.addColorStop(0,'#5a1a1a');bg.addColorStop(.5,'#7a3a1a');bg.addColorStop(1,'#3a1a5a');g.fillStyle=bg;g.fillRect(0,0,W,62);g.fillStyle='#ffb347';g.fillRect(0,62,W,3);
g.textAlign='left';g.fillStyle='#fff3d6';g.font='bold 28px'+F2;g.fillText('Menu boss',150,40);g.font='12px'+F2;g.fillStyle='#ffd9b0';g.fillText("Fais apparaître un boss, ou incarne-le toi-même",300,38);
{const r=admBack,h=inB(r,M.x,M.y);g.fillStyle=h?'#3a3050':'#241c36';adRR(r.x,r.y,r.w,r.h,8);g.fill();g.strokeStyle=h?'#fff':'#a98';g.lineWidth=2;g.stroke();g.textAlign='center';g.fillStyle='#f0e6d0';g.font='14px'+F2;g.fillText('← Panneau admin',r.x+r.w/2,r.y+23)}
[[bmEv,'Événement : '+(BOSSUP?'ON':'OFF'),BOSSUP?'#7a2a9a':'#3a2a4a'],[bmKill,'☠ Tuer le boss',BOSSAL?'#7a1a1a':'#2a2a34'],[bmRel,POS?'🎮 Rendre le boss à l\'IA':'🎮 Remplacer le boss',POS?'#1f8a4a':'#1f5a3a']].forEach(([r,t,c])=>{const h=inB(r,M.x,M.y);g.fillStyle=c;g.globalAlpha=h?1:.85;adRR(r.x,r.y,r.w,r.h,8);g.fill();g.globalAlpha=1;g.strokeStyle=h?'#fff':'rgba(255,255,255,.25)';g.lineWidth=2;g.stroke();g.textAlign='center';g.fillStyle='#fff';g.font='bold 13px'+F2;g.fillText(t,r.x+r.w/2,r.y+22)});
g.textAlign='left';g.font='bold 14px'+F2;g.fillStyle=BOSSAL?'#ff9a6a':'#9aa7bd';g.fillText(BOSSAL?'⚔ '+bossName(BOSSCUR)+' est en combat':BOSSUP?(rs()?'Prochain boss dans '+rs():'Aucun boss pour le moment'):'Événement désactivé',690,98);
BOSSL.forEach((b,i)=>{const c=bmCard(i),sel=admBoss==b.k,live=BOSSAL&&BOSSCUR==b.k,hv=inB(c,M.x,M.y),own=owned(b.ch);
g.fillStyle=sel?'#241a22':hv?'#1d2538':'#161d2a';adRR(c.x,c.y,c.w,c.h,12);g.fill();g.strokeStyle=sel?'#ffb347':b.col;g.lineWidth=sel?4:2;g.stroke();
g.save();g.beginPath();g.rect(c.x+4,c.y+4,c.w-8,116);g.clip();g.fillStyle='rgba(0,0,0,.28)';g.fillRect(c.x+4,c.y+4,c.w-8,116);g.translate(c.x+c.w/2-6,c.y+64);g.scale(.52,.52);g.rotate(-.35);b.draw(b.r||BR,0,0,live?BS.en:0,0,tt);g.restore();
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F2;g.fillText(b.n,c.x+c.w/2,c.y+146);
g.fillStyle='#c5cfe0';g.font='12px'+F2;g.fillText(b.d1,c.x+c.w/2,c.y+167);g.fillStyle='#8f9bb3';g.fillText(b.d2,c.x+c.w/2,c.y+183);
g.fillStyle='#ffd98a';g.font='bold 12px'+F2;g.fillText('Récompense : perso '+CH[b.ch].n+(own?'  ✔ débloqué':''),c.x+c.w/2,c.y+206);
const o=bmGo(i),oh=inB(o,M.x,M.y);g.fillStyle=oh?'#8a3ab0':'#6a2a8a';adRR(o.x,o.y,o.w,o.h,8);g.fill();g.strokeStyle='#d9a0ff';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.font='bold 14px'+F2;g.fillText(live?'👹 Relancer':'👹 Apparaître',o.x+o.w/2,o.y+24);{const q=bmPl(i),qh=inB(q,M.x,M.y),mine=POS&&live;g.fillStyle=mine?'#1f8a4a':qh?'#2a9a5a':'#1f7a45';adRR(q.x,q.y,q.w,q.h,8);g.fill();g.strokeStyle='#9fffc0';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.fillText(mine?'🎮 Tu es lui':'🎮 Incarner',q.x+q.w/2,q.y+24)}});
g.textAlign='center';g.fillStyle='#8f9bb3';g.font='12px'+F2;g.fillText("Le boss réapparaît tout seul 10 min après sa mort (même boss) · Échap : retour",W/2,H-14)}
function bmClick(){
if(inB(admBack,M.x,M.y)){admBm=0;return}
if(inB(bmEv,M.x,M.y)){net.send('ev',{on:BOSSUP?0:1});return}
if(inB(bmKill,M.x,M.y)){if(BOSSAL)net.send('evkill',{});return}
if(inB(bmRel,M.x,M.y)){if(POS)net.send('bpos',{on:0});else posReq();return}
BOSSL.forEach((b,i)=>{if(inB(bmGo(i),M.x,M.y)){admBoss=b.k;net.send('evspawn',{b:b.k})}else if(inB(bmPl(i),M.x,M.y)){admBoss=b.k;posReq(b.k)}else if(inB(bmCard(i),M.x,M.y))admBoss=b.k})}
function drawAdmin(){if(admBm){drawBossMenu();return}
const roster=admRoster(),s=admSelf();if(!roster.some(p=>p.id===admSel))admSel=s;
const pages=Math.max(1,Math.ceil(roster.length/ADPP));if(admPg>=pages)admPg=pages-1;if(admPg<0)admPg=0;
g.setTransform(1,0,0,1,0,0);g.textAlign='center';
let bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0c0f1a');bg.addColorStop(1,'#1a0d1c');g.fillStyle=bg;g.fillRect(0,0,W,H);
bg=g.createLinearGradient(0,0,W,0);bg.addColorStop(0,'#5a1a1a');bg.addColorStop(.5,'#6a2a3a');bg.addColorStop(1,'#3a1a5a');g.fillStyle=bg;g.fillRect(0,0,W,62);
g.fillStyle='#ffb347';g.fillRect(0,62,W,3);
g.textAlign='left';g.fillStyle='#fff3d6';g.font='bold 28px'+F2;g.fillText('Panneau admin',150,40);
g.font='12px'+F2;g.fillStyle='#ffd9b0';g.fillText('Visible uniquement par toi · '+roster.length+' joueur'+(roster.length>1?'s':'')+' en ligne',384,38);
{const r=admBack,h=inB(r,M.x,M.y);g.fillStyle=h?'#3a3050':'#241c36';adRR(r.x,r.y,r.w,r.h,8);g.fill();g.strokeStyle=h?'#fff':'#a98';g.lineWidth=2;g.stroke();g.textAlign='center';g.fillStyle='#f0e6d0';g.font='14px'+F2;g.fillText('← Paramètres',r.x+r.w/2,r.y+23)}
// liste des joueurs
g.fillStyle='rgba(22,29,42,.85)';adRR(10,76,330,432,10);g.fill();g.strokeStyle='#334';g.lineWidth=2;g.stroke();
g.textAlign='left';g.fillStyle='#ffd24a';g.font='bold 15px'+F2;g.fillText('Joueurs en ligne',24,96);
roster.slice(admPg*ADPP,admPg*ADPP+ADPP).forEach((p,k)=>{const r=admRowR(k),sel=admSel===p.id,h=inB(r,M.x,M.y);
g.fillStyle=sel?'#3a2a1a':h?'#222c40':'#161d2a';adRR(r.x,r.y,r.w,r.h,7);g.fill();g.strokeStyle=sel?'#ffb347':h?'#889':'#334';g.lineWidth=sel?3:1.5;g.stroke();
const l=p.l>=0&&p.l<=2?p.l:3;g.fillStyle=LOBC[l];g.beginPath();g.arc(r.x+16,r.y+17,6,0,7);g.fill();
g.textAlign='left';g.fillStyle='#f0e6d0';g.font=(sel?'bold ':'')+'15px'+F2;g.fillText((p.id===s?'Toi — ':'')+p.n,r.x+30,r.y+22);
g.textAlign='right';g.fillStyle=LOBC[l];g.font='12px'+F2;g.fillText(LOBN[l],r.x+r.w-10,r.y+21)});
if(pages>1)[[admPrev,'◀ Préc.'],[admNext,'Suiv. ▶']].forEach(([r,t])=>{const h=inB(r,M.x,M.y);g.fillStyle=h?'#2a3550':'#1a2236';adRR(r.x,r.y,r.w,r.h,7);g.fill();g.strokeStyle='#556';g.lineWidth=1.5;g.stroke();g.textAlign='center';g.fillStyle='#c5cfe0';g.font='13px'+F2;g.fillText(t,r.x+r.w/2,r.y+20)});
g.textAlign='center';g.fillStyle='#8f9bb3';g.font='12px'+F2;g.fillText('Page '+(admPg+1)+' / '+pages,175,490);
// cible + actions
const tg=roster.find(p=>p.id===admSel),tn=admSel===s?'Toi':(tg?tg.n:'?');
g.textAlign='left';g.fillStyle='#9aa7bd';g.font='14px'+F2;g.fillText('Cible des actions :',360,92);g.fillStyle='#ffb347';g.font='bold 18px'+F2;g.fillText(tn,500,93);
for(const t of ADLAY.h){g.textAlign='left';g.fillStyle=t.col;g.font='bold 13px'+F2;g.fillText(t.n.toUpperCase(),360,t.y+12);g.fillRect(360+g.measureText(t.n.toUpperCase()).width+10,t.y+8,570-g.measureText(t.n.toUpperCase()).width-10,1.5)}
for(const b of ADLAY.b){const h=inB(b,M.x,M.y);g.fillStyle=typeof b.c=='function'?b.c():b.c;g.globalAlpha=h?1:.85;adRR(b.x,b.y,b.w,b.h,8);g.fill();g.globalAlpha=1;g.strokeStyle=h?'#fff':'rgba(255,255,255,.25)';g.lineWidth=2;g.stroke();g.textAlign='center';g.fillStyle='#fff';g.font='bold 12px'+F2;g.fillText(b.t(),b.x+b.w/2,b.y+b.h/2+4)}
g.textAlign='center';g.fillStyle='#8f9bb3';g.font='12px'+F2;g.fillText('Échap : retour aux paramètres',650,H-12);
if(admP)drawAdmPick()}
function admClick(){if(admBm){bmClick();return}
const roster=admRoster(),pages=Math.max(1,Math.ceil(roster.length/ADPP));
if(inB(admBack,M.x,M.y)){admOpen=0;return}
if(pages>1){if(inB(admPrev,M.x,M.y)){admPg=(admPg+pages-1)%pages;return}if(inB(admNext,M.x,M.y)){admPg=(admPg+1)%pages;return}}
roster.slice(admPg*ADPP,admPg*ADPP+ADPP).forEach((p,k)=>{if(inB(admRowR(k),M.x,M.y))admSel=p.id});
for(const b of ADLAY.b)if(inB(b,M.x,M.y)){b.f();return}}
function drawSt(){if(adm&&admOpen){drawAdmin();return}g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#c5cfe0';g.font='bold 30px'+F2;g.fillText('Paramètres',W/2,48);
['Pseudo : '+SV.name+'   (clic pour changer)','Musique : '+TRACKS[SV.track].n+'   (clic pour changer)','Volume : '+Math.round(SV.vol*100)+' %   (clic pour changer)','Mode admin : '+(adm?'✔ actif':'entrer la clé secrète'),'Contrôles : '+(SV.ctl?'Clavier — tir dans la direction de marche (J / F)':'Souris — viser avec la souris')].forEach((t,i)=>{const r=stR(i);g.fillStyle='#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=inB(r,M.x,M.y)?'#fff':'#334';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font='16px'+F2;g.fillText(t,W/2,r.y+27)});
[ACT.u?'👤 '+ACT.u.slice(0,12)+' (déconnexion)':'👤 Compte / connexion','Exporter ma sauvegarde','Importer une sauvegarde',...(adm?['🛡 Panneau admin']:[])].forEach((t,i)=>{const r=acR(i),on=i==0&&ACT.u;g.fillStyle=on?'#1f3a2a':'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=inB(r,M.x,M.y)?'#fff':on?'#3fcf5a':'#334';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font='13px'+F2;g.fillText(t,r.x+r.w/2,r.y+24)});

g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('O ou Échap pour fermer',W/2,H-10)}
function admSend(a,v){if(!admSel)return;if(admSel===(myPeer||'me'))netAdm({act:a,v});else net.adm(admSel,a,v)}
function stClick(){if(admP){admPickClick();return}if(admOpen&&adm){admClick();return}const A0=[0,1,2,3].findIndex(i=>(i<3||adm)&&inB(acR(i),M.x,M.y));if(A0>=0){if(A0==3)admOpen=1;else acClick(A0);return}const R0=[0,1,2,3,4].findIndex(i=>inB(stR(i),M.x,M.y));
if(R0==0){const v=prompt('Ton pseudo (14 caractères max)',SV.name);if(v&&v.trim()){SV.name=v.trim().slice(0,14);save();pres()}}
else if(R0==1){SV.track=(SV.track+1)%TRACKS.length;save();restartMusic()}
else if(R0==2){SV.vol=SV.vol>=1?.2:Math.round((SV.vol+.2)*10)/10;save();setVol()}
else if(R0==3&&!adm){const k=prompt('Clé admin');if(k)net.adminLogin(k)}else if(R0==4){SV.ctl=SV.ctl?0:1;save()}
}
function netAdmin(ok){adm=ok;feed.push({t:ok?'Mode admin activé':'Clé refusée',l:4})}
function netAdm(d){const a=d.act,v=+d.v||0;if(a=='god'){me.god=me.god?0:1;feed.push({t:me.god?'God mode activé (admin)':'God mode désactivé',l:4});pres()}else if(a=='givech'){const i=v|0;if(i>=0&&i<CH.length){if(SV.rc)SV.rc=SV.rc.filter(x=>x!==i);if(!owned(i))SV.bought.push(i);save()}feed.push({t:'Personnage offert : '+(CH[i]?CH[i].n:'?'),l:5})}else if(a=='givesk'){const i=v|0;if(i>=100&&PACKS[i-100]){const q=PACKS[i-100];if(!SV.packs.includes(q.id))SV.packs.push(q.id);SV.eq[q.id]=1;feed.push({t:'Skin offert : Pack '+q.n,l:5})}else if(SKINS[i]&&i>0){SV.rs=(SV.rs||[]).filter(x=>x!==i);if(!SV.gs.includes(i))SV.gs.push(i);SV.skin=i;feed.push({t:'Skin offert : '+SKINS[i].n,l:5})}save();pres()}else if(a=='givecr'){const i=v|0;if(typeof CRC!='undefined'&&CRC[i]){crInit();SV.ci[i]=(SV.ci[i]|0)+1;save();feed.push({t:'Caisse offerte : '+CRC[i].n+' (touche C)',l:5})}}else if(a=='remcr'){const i=v|0;if(typeof CRC!='undefined'&&CRC[i]){crInit();const n=SV.ci[i]|0;SV.ci[i]=Math.max(0,n-1);save();feed.push({t:n>0?'Caisse retirée : '+CRC[i].n:'Tu n\'avais aucune '+CRC[i].n,l:5})}}else if(a=='givecw'){const it=typeof CAT!='undefined'?CAT[v|0]:null;if(it){crInit();if(!SV.cw.includes(it.i))SV.cw.push(it.i);save();feed.push({t:'Skin de caisse offert : '+it.n,l:5})}}else if(a=='remcw'){const it=typeof CAT!='undefined'?CAT[v|0]:null;if(it){crInit();const k=SV.cw.indexOf(it.i);if(k>=0)SV.cw.splice(k,1);if(SV.cq[it.t]==it.i)SV.cq[it.t]=-1;save();pres();feed.push({t:'Skin de caisse retiré : '+it.n,l:5})}}else if(a=='remch'){const i=v|0;if(CH[i]){SV.bought=SV.bought.filter(x=>x!==i);if(!SV.rc)SV.rc=[];if(!SV.rc.includes(i))SV.rc.push(i);if(SV.sel===i)SV.sel=-1;if(me.al&&me.c===i){me.al=0;mode=0;clrTp()}save();pres();feed.push({t:'Personnage retiré : '+CH[i].n,l:5})}}else if(a=='remsk'){const i=v|0;if(i>=100&&PACKS[i-100]){const q=PACKS[i-100];SV.packs=SV.packs.filter(x=>x!==q.id);delete SV.eq[q.id];feed.push({t:'Skin de perso retiré : Pack '+q.n,l:5})}else if(SKINS[i]&&i>0){SV.gs=SV.gs.filter(x=>x!==i);if(!SV.rs)SV.rs=[];if(!SV.rs.includes(i))SV.rs.push(i);if(SV.skin==i)SV.skin=0;feed.push({t:'Skin retiré : '+SKINS[i].n,l:5})}save();pres()}else if(a=='kill'){me.pt=null;me.inv=0;me.ri=0;if(me.al)hurtMe(9999,'env')}else if(a=='heal'){if(me.al)me.hp=CH[me.c].hp}else if(a=='coins'){SV.coins=Math.max(0,SV.coins+v);save()}else if(a=='xp'){if(v>=0)gain(v,0);else{SV.xp=Math.max(0,SV.xp+v);save()}}else if(a=='rr'){applyRR(v);feed.push({t:(v>=0?'+':'')+v+' RR (admin)',l:4});postLB()}else if(a=='reset'){SV.coins=25;SV.xp=0;SV.ct=0;SV.bought=[];SV.skin=0;SV.packs=[];SV.eq={};SV.gs=[];SV.xs=0;SV.bu=[];SV.xc=0;SV.br=0;SV.cw=[];SV.cq={};SV.ci={};SV.rc=[];SV.rs=[];SV.rk={r:0,d:0,rr:0};save();if(me.al){me.al=0;mode=0;clrTp()}me.pt=null;feed.push({t:'Ton compte a été réinitialisé',l:5});pres()}}
const PACKS=[
{id:'hal',n:'Halloween',ch:4,p:60,col:'#ff7a1a',d:'Citrouille maudite. Le flash de Corona affiche un SCREAMER !'},
{id:'cyb',n:'Cyber',ch:1,p:40,col:'#16c7e8',d:'Nitro cybernétique : visière et néons'},
{id:'sam',n:'Samouraï',ch:9,p:40,col:'#d9d9e8',d:'Casque kabuto à cornes dorées'},
{id:'spe',n:'Spectral',ch:5,p:40,col:'#e8f4ff',d:'Fantôme lumineux avec une traîne'},
{id:'tox',n:'Toxique',ch:12,p:40,col:'#7be04a',d:'Masque squelette et coulures'},
{id:'gol',n:'Royal',ch:13,p:40,col:'#ffe066',d:'Anneau et éclats dorés'},
{id:'mil',n:'Militaire',ch:11,p:40,col:'#556b3a',d:'Camouflage et casque'},
{id:'fla',n:'Flammes',ch:0,p:40,col:'#ff4a1a',d:'Phénix enflammé'}];
const curPk=()=>PACKS.findIndex(q=>q.ch==me.c&&SV.packs.includes(q.id)&&SV.eq[q.id]!==0)+1;
const packId=()=>{const i=curPk();return i?PACKS[i-1].id:''};
function clrTp(){DP=DP.filter(o=>!((o.k=='tp'||o.k=='sum')&&o.own===(myPeer||'me')));snd('rm',{k:'tp'});snd('rm',{k:'sum'})}
const inBush=(x,y)=>(MAPS[mi].bu||[]).some(r=>x>r[0]&&x<r[0]+r[2]&&y>r[1]&&y<r[1]+r[3]);
function drawBush(){const m=MAPS[mi];if(!m.bu)return;const C=['#2f7a3a','#3a8f45','#276b32','#44a050','#2c7236','#389040','#2a6e34'];for(const r of m.bu){const x=r[0]-cam.x,y=r[1]-cam.y;if(x>W||y>H||x+r[2]<0||y+r[3]<0)continue;const inn=me.x>r[0]&&me.x<r[0]+r[2]&&me.y>r[1]&&me.y<r[1]+r[3];g.globalAlpha=inn?.5:.93;for(let i=0;i<r[2];i+=26)for(let j=0;j<r[3];j+=26){g.fillStyle=C[(i*31+j*17+r[0])%7];g.beginPath();g.arc(x+i+13+Math.sin(tt*1.5+i+j)*1.5,y+j+13,19,0,7);g.fill()}}g.globalAlpha=1}
let FOG=null,fg=null;
function drawFog(){if(!MAPS[mi].vis||!me.al||ph.n)return;if(!FOG){FOG=document.createElement('canvas');FOG.width=W;FOG.height=H;fg=FOG.getContext('2d')}
const px=me.x-cam.x,py=me.y-cam.y;fg.globalCompositeOperation='source-over';fg.clearRect(0,0,W,H);fg.fillStyle='rgba(0,0,0,.97)';fg.fillRect(0,0,W,H);fg.globalCompositeOperation='destination-out';
let gr=fg.createRadialGradient(px,py,20,px,py,110);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');fg.fillStyle=gr;fg.beginPath();fg.arc(px,py,110,0,7);fg.fill();
gr=fg.createRadialGradient(px,py,40,px,py,520);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.8,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');fg.fillStyle=gr;fg.beginPath();fg.moveTo(px,py);fg.arc(px,py,520,me.a-.45,me.a+.45);fg.closePath();fg.fill();
fg.globalCompositeOperation='source-over';g.drawImage(FOG,0,0)}
function screech(){if(!AC||mute)return;const t=AC.currentTime;for(const f of[880,1240]){const o=AC.createOscillator(),gn=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f/4,t+.9);gn.gain.setValueAtTime(.35,t);gn.gain.exponentialRampToValueAtTime(.0001,t+1);o.connect(gn);gn.connect(AC.master);o.start(t);o.stop(t+1)}}
function drawScream(){const k=me.sc,z=1+(1.3-k)*.6,sh=(Math.random()-.5)*16;g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=k%.2<.1?'#200':'#000';g.fillRect(0,0,W,H);g.translate(W/2+sh,H/2+sh);g.scale(z,z);
g.fillStyle='#46513a';g.beginPath();g.ellipse(0,0,190,230,0,0,7);g.fill();g.fillStyle='#2a3322';for(const q of[-1,1]){g.beginPath();g.moveTo(q*90,-210);g.lineTo(q*150,-330);g.lineTo(q*150,-170);g.fill()}
g.fillStyle='#000';for(const q of[-1,1]){g.beginPath();g.ellipse(q*72,-55,52,64,q*.25,0,7);g.fill()}g.fillStyle='#ff1a1a';for(const q of[-1,1]){g.beginPath();g.ellipse(q*72,-50,18,28,0,0,7);g.fill()}
g.fillStyle='#000';g.beginPath();g.ellipse(0,40,16,30,0,0,7);g.fill();g.beginPath();g.moveTo(-120,95);for(let i=0;i<=12;i++)g.lineTo(-120+i*20,95+(i%2?40:-10));g.lineTo(120,185);g.quadraticCurveTo(0,250,-120,185);g.fill();
g.fillStyle='#e8e8d0';for(let i=0;i<12;i++){g.beginPath();g.moveTo(-110+i*18,100+(i%2?0:6));g.lineTo(-101+i*18,150);g.lineTo(-92+i*18,100+(i%2?0:6));g.fill()}
g.strokeStyle='#8a1a1a';g.lineWidth=3;for(let i=0;i<6;i++){g.beginPath();g.moveTo(-60+i*24,-190);g.lineTo(-40+i*20,-110);g.stroke()}g.restore()}
function drawDet(pk,s){if(!pk)return;const id=PACKS[pk-1].id,r=s.r;g.save();
if(id=='hal'){g.strokeStyle='rgba(120,50,0,.6)';g.lineWidth=2;for(const k of[-.5,0,.5]){g.beginPath();g.ellipse(0,0,r*(.95-Math.abs(k)*.3),r*.95,0,-1.4,1.4);g.stroke()}g.fillStyle='#2c7a2c';g.fillRect(-r*.95,-3,7,6);g.fillStyle='#ffd23a';for(const q of[-1,1]){g.beginPath();g.moveTo(r*.2,q*r*.15);g.lineTo(r*.6,q*r*.5);g.lineTo(r*.62,q*r*.1);g.fill()}g.strokeStyle='#ffd23a';g.beginPath();g.moveTo(r*.3,-r*.45);for(let i=0;i<5;i++)g.lineTo(r*(.3+(i%2)*.2),-r*.45+i*r*.225);g.stroke()}
else if(id=='cyb'){g.strokeStyle='#39f0ff';g.lineWidth=2;g.beginPath();g.arc(0,0,r*.72,0,7);g.stroke();g.fillStyle='rgba(10,30,50,.85)';g.fillRect(r*.05,-r*.5,r*.7,r);g.fillStyle='#39f0ff';g.fillRect(r*.15,-1.5,r*.55,3);g.beginPath();g.moveTo(-r*.6,-r*.5);g.lineTo(-r*1.1,-r*.9);g.stroke()}
else if(id=='sam'){g.strokeStyle='#ffd24a';g.lineWidth=3;for(const q of[-1,1]){g.beginPath();g.moveTo(r*.3,q*r*.3);g.quadraticCurveTo(r*1.1,q*r*.5,r*1.3,q*r*1.1);g.stroke()}g.fillStyle='#8a1a1a';g.fillRect(-r*.1,-r*.95,r*.35,r*1.9);g.fillStyle='#1a1a22';g.fillRect(r*.35,-r*.4,r*.5,r*.8)}
else if(id=='spe'){g.fillStyle='rgba(232,244,255,.45)';g.beginPath();g.moveTo(0,-r);g.quadraticCurveTo(-r*1.6,Math.sin(tt*5)*r*.6,-r*2.2,Math.sin(tt*5+1)*r*.4);g.quadraticCurveTo(-r*1.2,Math.sin(tt*5+2)*r,0,r);g.fill();g.strokeStyle='rgba(160,220,255,.8)';g.lineWidth=2;g.beginPath();g.arc(0,0,r+4,0,7);g.stroke()}
else if(id=='tox'){g.fillStyle='#0a1a05';for(const q of[-1,1]){g.beginPath();g.ellipse(r*.35,q*r*.4,r*.28,r*.22,0,0,7);g.fill()}g.fillStyle='#4fa030';for(let k=0;k<3;k++){g.beginPath();g.ellipse(-r*.3+k*r*.4,r*(1+Math.sin(tt*3+k)*.12),3,5,0,0,7);g.fill()}g.strokeStyle='#b6ff6a';g.lineWidth=2;g.setLineDash([4,4]);g.beginPath();g.arc(0,0,r*.75,0,7);g.stroke()}
else if(id=='gol'){g.strokeStyle='#fff2a0';g.lineWidth=3;g.beginPath();g.arc(0,0,r+3,0,7);g.stroke();g.fillStyle='#fff2a0';for(let k=0;k<3;k++){g.beginPath();g.moveTo(-r*.7,(k-1)*r*.5-4);g.lineTo(-r*1.25,(k-1)*r*.6);g.lineTo(-r*.7,(k-1)*r*.5+4);g.fill()}g.fillStyle='#fff';g.fillRect(Math.cos(tt*3)*r*.6-1,Math.sin(tt*3)*r*.6-1,3,3)}
else if(id=='mil'){g.fillStyle='#3a4a28';g.beginPath();g.arc(-r*.3,-r*.4,r*.3,0,7);g.arc(r*.1,r*.5,r*.25,0,7);g.fill();g.fillStyle='#7a8a50';g.beginPath();g.arc(r*.2,-r*.2,r*.22,0,7);g.arc(-r*.5,r*.4,r*.2,0,7);g.fill();g.strokeStyle='#2a3320';g.lineWidth=4;g.beginPath();g.arc(0,0,r*.9,-1.6,1.6);g.stroke()}
else if(id=='fla'){for(let k=0;k<5;k++){g.fillStyle=k%2?'#ffd23a':'#ff8a1a';const a=Math.PI+(k-2)*.5,f=r*(1.1+Math.sin(tt*10+k)*.3);g.beginPath();g.moveTo(Math.cos(a-.2)*r*.8,Math.sin(a-.2)*r*.8);g.lineTo(Math.cos(a)*(r+f*.9),Math.sin(a)*(r+f*.9));g.lineTo(Math.cos(a+.2)*r*.8,Math.sin(a+.2)*r*.8);g.fill()}}
g.restore()}
const pkp=k=>({x:24+(k%4)*234,y:96+Math.floor(k/4)*208,w:222,h:196});
function drawPacks(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#ff9a3c';g.font='bold 32px'+F2;g.fillText('Skins',W/2,44);g.font='15px'+F2;g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+' pièces — packs de skins par personnage',W/2,72);
PACKS.forEach((q,k)=>{const p=pkp(k),s=CH[q.ch],ow=SV.packs.includes(q.id),on=SV.eq[q.id]!==0,cx=p.x+p.w/2;g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=ow?'#3fcf5a':q.col;g.lineWidth=inB(p,M.x,M.y)?4:2;g.strokeRect(p.x,p.y,p.w,p.h);
g.save();g.translate(cx,p.y+58);g.scale(1.7,1.7);g.rotate(-.5);g.fillStyle='#1b1f2a';g.fillRect(s.r-4,-3.5,s.L,7);g.fillStyle=q.col;g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();drawDet(k+1,s);g.restore();
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 17px'+F2;g.fillText('Pack '+q.n,cx,p.y+120);g.font='12px'+F2;g.fillStyle=q.col;g.fillText('Skin pour '+s.n,cx,p.y+138);g.fillStyle='#9aa7bd';g.font='11px'+F2;wrap(q.d,cx,p.y+154,13,34);g.font='bold 12px'+F2;g.fillStyle=ow?'#3fcf5a':'#ffd98a';g.fillText(ow?(on?'✔ Équipé — clic pour retirer':'Retiré — clic pour équiper'):'🔒 '+q.p+' pièces'+(SV.coins>=q.p?' — acheter':''),cx,p.y+p.h-8)});
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('K ou Échap pour fermer',W/2,H-10)}
function pkClick(){PACKS.forEach((q,k)=>{if(!inB(pkp(k),M.x,M.y))return;if(SV.packs.includes(q.id)){SV.eq[q.id]=SV.eq[q.id]===0?1:0;save();pres()}else if(SV.coins>=q.p){SV.coins-=q.p;SV.packs.push(q.id);SV.eq[q.id]=1;save();pres()}})}
let menuOpen=1,rkRes=null,rkDone=-1,LB=[],lbT=-99;
const RANKS=[{n:'Bronze',c:'#cd7f32'},{n:'Argent',c:'#c9d1dc'},{n:'Or',c:'#ffd24a'},{n:'Platine',c:'#4fb8ff'},{n:'Diamant',c:'#b36bff'},{n:'Ascendant',c:'#3ddc84'},{n:'Immortal',c:'#ff3b3b'},{n:'Radiant',c:null}];
const RKD=['I','II','III'],rkName=(r,d)=>RANKS[r].n+(r<7?' '+RKD[d|0]:''),rkIx=o=>o.r*3+(o.r<7?(o.d|0):0);
const segD=(px,py,x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;let t=((px-x1)*dx+(py-y1)*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(px-x1-dx*t,py-y1-dy*t)};
const hitS=(x1,y1,x2,y2)=>{const n=Math.max(3,Math.ceil(Math.hypot(x2-x1,y2-y1)/20));for(let i=0;i<=n;i++)if(hitW(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n))return 1;return 0};
function rankFill(r,x,w){if(r<7)return RANKS[r].c;const o=(tt*70)%80,gr=g.createLinearGradient(x-w/2-80+o,0,x+w/2+80+o,0);for(let i=0;i<=8;i++)gr.addColorStop(i/8,i%2?'#ffd24a':'#ffffff');return gr}
function badge(x,y,z,r,d){g.save();g.translate(x,y);g.fillStyle=rankFill(r,0,z*2);g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.beginPath();g.moveTo(0,-z);g.lineTo(z*.85,-z*.35);g.lineTo(z*.85,z*.35);g.lineTo(0,z);g.lineTo(-z*.85,z*.35);g.lineTo(-z*.85,-z*.35);g.closePath();g.fill();g.stroke();g.fillStyle='rgba(0,0,0,.55)';g.font='bold '+Math.round(z*.9)+'px'+F2;g.textAlign='center';g.fillText(String(r+1),0,z*.32);if(d!=null&&r<7&&z>=14){for(let i=0;i<3;i++){g.fillStyle=i<=(d|0)?rankFill(r,0,z*2):'rgba(255,255,255,.18)';g.beginPath();g.arc((i-1)*z*.42,z+z*.3,Math.max(2,z*.11),0,7);g.fill()}}g.restore()}
function applyRR(d){const k=SV.rk;k.d=k.d|0;k.rr+=d;while(k.rr>=100&&k.r<7){k.rr-=100;if(k.d<2)k.d++;else{k.r++;k.d=0}}while(k.rr<0){if(k.r==0&&k.d==0)k.rr=0;else{if(k.d>0)k.d--;else{k.r--;k.d=2}k.rr+=100}}if(k.r>(SV.br|0))SV.br=k.r;save()}
function rrDelta(n,p){if(n<=1)n=4;if(n==2)return p==1?30:-10;if(n==3)return p==1?30:p==2?20:-10;return p==1?30:p==2?20:p==3?10:-10}
function standings(){const L=[{id:myPeer||'me',k:me.k,d:me.dth||0,me:1}];for(const k in R){const o=R[k];if(o.md==1&&o.pl)L.push({id:k,k:o.k,d:o.dd||0})}if(L.length==1)bots.forEach((b,i)=>L.push({id:'bot:'+i,k:b.k||0,d:b.d||0}));L.sort((a,b)=>b.k-a.k||a.d-b.d||(String(a.id)<String(b.id)?-1:1));return L}
function botRR(){if(SV.mode!=1||!me.pl||(me.brr||0)>=10)return;me.brr=(me.brr||0)+2;applyRR(2);feed.push({t:'+2 RR (bot tué)',l:3})}
function postLB(){if(SV.rk.r+(SV.rk.d|0)+SV.rk.rr>0)net.send('lb_post',{uid:SV.uid,name:SV.name,r:SV.rk.r,d:SV.rk.d|0,rr:SV.rk.rr})}
function rankEnd(id){id=id==null?ph.id:id;if(SV.mode!=1||!me.pl||rkDone===id)return;rkDone=id;const L=standings(),pos=L.findIndex(x=>x.me)+1,n=L.length;let d=rrDelta(n,pos);if(n<2||(me.late&&d<0))d=0;const old={r:SV.rk.r,d:SV.rk.d|0,rr:SV.rk.rr};applyRR(d);rkRes={pos,n,d,old,bot:me.brr||0,nw:{r:SV.rk.r,d:SV.rk.d|0,rr:SV.rk.rr}};postLB()}
function netLB(l){LB=Array.isArray(l)?l.slice(0,10).map(e=>({n:String(e.n||'?').slice(0,14),r:+e.r||0,b:+e.b||0})):[]}
function drawRankRes(){const F=F2;if(!rkRes){if(SV.mode==1&&!me.pl){g.textAlign='center';g.fillStyle='#9aa7bd';g.font='14px'+F;g.fillText('Match non compté',130,300)}return}const q=rkRes,c=q.d>=0?'#7dff9a':'#ff7a7a';g.textAlign='center';g.fillStyle='#c5cfe0';g.font='bold 18px'+F;g.fillText('Classé',130,160);badge(130,240,48,q.nw.r,q.nw.d);g.fillStyle=rankFill(q.nw.r,130,160);g.font='bold 24px'+F;g.fillText(rkName(q.nw.r,q.nw.d),130,324);g.fillStyle=c;g.font='bold 30px'+F;g.fillText((q.d>=0?'+':'')+q.d+' RR',130,364);g.fillStyle='#c5cfe0';g.font='15px'+F;g.fillText('Place '+q.pos+' / '+q.n+(q.bot?' · bots +'+q.bot:''),130,390);g.fillStyle='#161d2a';g.fillRect(40,404,180,12);g.fillStyle=rankFill(q.nw.r,130,180);g.fillRect(40,404,180*Math.min(1,q.nw.rr/100),12);g.fillStyle='#9aa7bd';g.font='13px'+F;g.fillText(q.nw.rr+' RR'+(rkIx(q.nw)>rkIx(q.old)?'  — Promotion !':rkIx(q.nw)<rkIx(q.old)?'  — Rétrogradation':''),130,436)}
const mmR=i=>({x:30,y:118+i*108,w:500,h:98}),mbR=k=>({x:30+k*132,y:446,w:126,h:46});
const evOpen=()=>BOSSUP||adm;
function drawMenu(){g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);if(tt-lbT>10){lbT=tt;net.send('lb_get');postLB()}
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 52px'+F2;g.fillText('ARÈNE',280,72);g.font='16px'+F2;g.fillStyle='#9aa7bd';g.fillText('Choisis ton mode de jeu (touches 1 / 2 / 3)',280,102);
[['1. Classique','Parties libres, sans classement','#7ad0ff'],['2. Classé','Gagne des RR : 3 stades par rang, de Bronze I à Radiant','#ffd98a'],['3. Événement spécial',"Toute l'équipe contre un boss géant",'#ff8ad8']].forEach((m,i)=>{
const p=mmR(i),hv=inB(p,M.x,M.y),lock=i==2&&!evOpen();g.globalAlpha=lock?.55:1;g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=i==2?rbw(p.x,p.y,p.w,p.h):m[2];g.lineWidth=hv&&!lock?5:2;g.strokeRect(p.x,p.y,p.w,p.h);
g.textAlign='left';g.fillStyle=m[2];g.font='bold 27px'+F2;g.fillText(m[0],p.x+22,p.y+38);g.font='14px'+F2;g.fillStyle='#c5cfe0';g.fillText(m[1],p.x+22,p.y+60);
g.textAlign='right';g.fillStyle='#9be39b';g.font='bold 15px'+F2;g.fillText('● '+LBC[i]+' en ligne',p.x+p.w-18,p.y+28);
if(i==1){badge(p.x+472,p.y+58,22,SV.rk.r,SV.rk.d);g.fillStyle='#0d121c';g.fillRect(p.x+22,p.y+74,250,10);g.fillStyle=rankFill(SV.rk.r,p.x+162,280);g.fillRect(p.x+22,p.y+74,250*Math.min(1,SV.rk.rr/100),10);g.textAlign='left';g.fillStyle=rankFill(SV.rk.r,p.x+360,120);g.font='bold 14px'+F2;g.fillText(rkName(SV.rk.r,SV.rk.d)+' · '+SV.rk.rr+' RR',p.x+282,p.y+84)}
if(i==2){g.textAlign='left';g.font='bold 14px'+F2;g.fillStyle=BOSSUP?'#ff7a6a':'#8f9bb3';g.fillText(BOSSUP?(BOSSAL?'⚔ Le boss est là : rejoins le combat !':rs()?'☠ Boss vaincu — retour dans '+rs():'⚔ Événement ouvert'):"🔒 Événement inactif — un admin doit l'activer",p.x+22,p.y+84)}
g.globalAlpha=1});
['Personnages (P)','Skins (K)','Battle Pass (B)','Paramètres (O)'].forEach((t,k)=>{const p=mbR(k);g.fillStyle='#1d1a2e';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=inB(p,M.x,M.y)?'#fff':'#556';g.lineWidth=2;g.strokeRect(p.x,p.y,p.w,p.h);g.textAlign='center';g.fillStyle='#c5cfe0';g.font='13px'+F2;g.fillText(t,p.x+63,p.y+28)});
g.fillStyle='#161d2a';g.fillRect(560,110,370,382);g.strokeStyle='#ffd24a';g.lineWidth=2;g.strokeRect(560,110,370,382);g.textAlign='center';g.fillStyle=rankFill(7,745,260);g.font='bold 22px'+F2;g.fillText('Top 10 — tous les rangs',745,144);
if(!LB.length){g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText("Personne n'est encore classé",745,300)}
LB.forEach((e,i)=>{const y=182+i*30,ix=Math.min(22,Math.floor(e.b/100)),r=ix>=22?7:Math.floor(ix/3),dv=ix>=22?0:ix%3,rr=e.b-ix*100;g.textAlign='left';g.fillStyle='#8f9bb3';g.font='bold 15px'+F2;g.fillText('#'+(i+1),574,y);badge(618,y-5,10,r);g.fillStyle=rankFill(r,700,200);g.fillText(e.n,636,y);g.textAlign='right';g.fillStyle='#c5cfe0';g.font='13px'+F2;g.fillText(rkName(r,dv)+' · '+rr+' RR',914,y)});drawMenuQuit()}
const mqR={x:W-146,y:14,w:132,h:34},byeR={x:W/2-80,y:H/2+40,w:160,h:42};let bye=0;
function exitApp(){try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen();if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}bye=1;try{window.close()}catch(e){}}
function drawMenuQuit(){g.setTransform(1,0,0,1,0,0);const h=inB(mqR,M.x,M.y);g.fillStyle=h?'#3a2030':'#1d1226';g.fillRect(mqR.x,mqR.y,mqR.w,mqR.h);g.strokeStyle=h?'#fff':'#ff8a6a';g.lineWidth=2;g.strokeRect(mqR.x,mqR.y,mqR.w,mqR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 15px'+F2;g.fillText('✕ Quitter',mqR.x+mqR.w/2,mqR.y+23);
if(bye){g.fillStyle='rgba(5,7,11,.96)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 34px'+F2;g.fillText('À bientôt !',W/2,H/2-20);g.font='15px'+F2;g.fillStyle='#9aa7bd';g.fillText('Tu peux fermer cet onglet.',W/2,H/2+10);const h2=inB(byeR,M.x,M.y);g.fillStyle=h2?'#2a3550':'#1a2236';g.fillRect(byeR.x,byeR.y,byeR.w,byeR.h);g.strokeStyle=h2?'#fff':'#7ad0ff';g.lineWidth=2;g.strokeRect(byeR.x,byeR.y,byeR.w,byeR.h);g.fillStyle='#f0e6d0';g.font='bold 16px'+F2;g.fillText('Revenir au jeu',byeR.x+byeR.w/2,byeR.y+27)}}
function menuQuitClick(){if(bye){if(inB(byeR,M.x,M.y))bye=0;return 1}if(inB(mqR,M.x,M.y)){exitApp();return 1}return 0}
function menuClick(){if(menuQuitClick())return;if(crMenuClick())return;for(let i=0;i<3;i++)if(inB(mmR(i),M.x,M.y)){joinLobby(i);return}for(let k=0;k<4;k++)if(inB(mbR(k),M.x,M.y)){if(k==0)shop=1;else if(k==1)psk=1;else if(k==2)bp=1;else st=1}}
save();
const rdR={x:750,y:452,w:190,h:48};
const rdTok=()=>ph.id*3+ph.n+1;
function rdCount(){const t=rdTok();return [(me.rdy===t?1:0)+Object.values(R).filter(o=>o.rd===t).length,1+Object.keys(R).length]}
function setReady(){me.rdy=rdTok();pres()}
function drawReady(){const [c,n]=rdCount(),on=me.rdy===rdTok();g.setTransform(1,0,0,1,0,0);g.fillStyle=on?'#1f3a2a':'#243a5a';g.fillRect(rdR.x,rdR.y,rdR.w,rdR.h);g.strokeStyle=on?'#3fcf5a':inB(rdR,M.x,M.y)?'#fff':'#7ad0ff';g.lineWidth=3;g.strokeRect(rdR.x,rdR.y,rdR.w,rdR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 20px'+F2;g.fillText(on?'✔ Prêt':'Prêt (Entrée)',rdR.x+95,rdR.y+31);g.font='13px'+F2;g.fillStyle='#9aa7bd';g.fillText('Prêts : '+c+' / '+n,rdR.x+95,rdR.y-8)}
const TV={on:0,mx:0,my:0,aim:0,L:null,Rt:null,fs:0},ABTN={x:W-62,y:H-215};
const tPos=t=>{const r=c.getBoundingClientRect();return{x:(t.clientX-r.left)*W/r.width,y:(t.clientY-r.top)*H/r.height}};
const playing=()=>mode==1&&ph.n==0&&!(psk||st||shop||bp||menuOpen);
function updTV(){TV.mx=TV.my=0;if(TV.L){const dx=TV.L.x-TV.L.x0,dy=TV.L.y-TV.L.y0,l=Math.hypot(dx,dy);if(l>14){TV.mx=dx/l;TV.my=dy/l}}if(TV.Rt){const dx=TV.Rt.x-TV.Rt.x0,dy=TV.Rt.y-TV.Rt.y0;if(Math.hypot(dx,dy)>10)TV.aim=Math.atan2(dy,dx);M.d=1}}
function tStart(e){e.preventDefault();TV.on=1;startMusic();
if(!TV.fs){TV.fs=1;try{const d=document.documentElement;if(!document.fullscreenElement&&d.requestFullscreen)d.requestFullscreen().then(()=>{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}).catch(()=>{})}catch(x){}}
for(const t of e.changedTouches){const p=tPos(t);
if(!playing()){M.x=p.x;M.y=p.y;c.dispatchEvent(new MouseEvent('mousedown',{clientX:t.clientX,clientY:t.clientY,button:0,bubbles:true}));continue}
if(quitAsk){if(inB(qyR,p.x,p.y))doQuit();else quitAsk=0;continue}if(inB(quitR,p.x,p.y)){askQuit();continue}if(Math.hypot(p.x-ABTN.x,p.y-ABTN.y)<48){AB=1;continue}
if(p.x<W*.45&&!TV.L)TV.L={id:t.identifier,x0:p.x,y0:p.y,x:p.x,y:p.y};else if(p.x>=W*.45&&!TV.Rt){TV.Rt={id:t.identifier,x0:p.x,y0:p.y,x:p.x,y:p.y};M.d=1}}
updTV()}
function tMove(e){e.preventDefault();for(const t of e.changedTouches){const p=tPos(t);if(TV.L&&TV.L.id==t.identifier){TV.L.x=p.x;TV.L.y=p.y}if(TV.Rt&&TV.Rt.id==t.identifier){TV.Rt.x=p.x;TV.Rt.y=p.y}}updTV()}
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(TV.L&&TV.L.id==t.identifier)TV.L=null;if(TV.Rt&&TV.Rt.id==t.identifier){TV.Rt=null;M.d=0}}if(!e.touches.length){TV.L=TV.Rt=null;M.d=0;c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}))}updTV()}
[['touchstart',tStart],['touchmove',tMove],['touchend',tEnd],['touchcancel',tEnd]].forEach(a=>c.addEventListener(a[0],a[1],{passive:false}));
function drawTouch(){g.setTransform(1,0,0,1,0,0);
const stick=(S,col)=>{if(!S)return;g.strokeStyle=col;g.lineWidth=3;g.globalAlpha=.55;g.beginPath();g.arc(S.x0,S.y0,52,0,7);g.stroke();const dx=S.x-S.x0,dy=S.y-S.y0,l=Math.min(52,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);g.fillStyle=col;g.beginPath();g.arc(S.x0+Math.cos(a)*l,S.y0+Math.sin(a)*l,24,0,7);g.fill();g.globalAlpha=1};
stick(TV.L,'#7ad0ff');stick(TV.Rt,'#ff8a6a');
const ok=me.ab<=0;g.globalAlpha=.85;g.fillStyle=ok?'#243a5a':'#1a1f2a';g.beginPath();g.arc(ABTN.x,ABTN.y,42,0,7);g.fill();g.strokeStyle=ok?'#7ad0ff':'#445';g.lineWidth=4;g.stroke();g.fillStyle='#f0e6d0';g.font='bold 13px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(me.sn?'SNIPER':ok?'POUVOIR':Math.ceil(me.ab)+' s',ABTN.x,ABTN.y+5);g.globalAlpha=1;
if(!TV.L&&!TV.Rt){g.fillStyle='rgba(255,255,255,.28)';g.font='14px Trebuchet MS,sans-serif';g.fillText('◀ glisser pour bouger',W*.2,H-24);g.fillText('glisser pour viser et tirer ▶',W*.68,H-24)}}
setMap(0);

let last=performance.now();function fr(t){const dt=Math.min(.05,(t-last)/1000);last=t;upd(dt);draw();overlays();requestAnimationFrame(fr)}requestAnimationFrame(fr);
addEventListener('keydown',e=>{K[e.code]=1;startMusic();if(e.code=='Tab'&&shop){shopTab=(shopTab+1)%3;e.preventDefault()}if(e.code=='Enter'&&ph.n>0&&!menuOpen&&!st&&!shop&&!bp&&!psk)setReady();else if(e.code=='Enter'&&ph.n==0&&mode!=1&&!menuOpen&&!st&&!shop&&!bp&&!psk&&selCh()>=0)pick(selCh());if(e.code=='KeyB'){bp=!bp;shop=st=psk=0}if(e.code=='KeyP'){shop=!shop;bp=st=psk=0}if(e.code=='KeyO'){st=!st;bp=shop=psk=0;admP=0;admOpen=0;admBm=0}if(e.code=='KeyK'){psk=!psk;bp=shop=st=0}if(e.code=='Escape'){if(admP)admP=0;else if(admBm)admBm=0;else if(admOpen&&st)admOpen=0;else if(psk||st||shop||bp)bp=shop=st=psk=0;else if(quitAsk)quitAsk=0;else if(!menuOpen)askQuit()}if(e.code=='KeyM'){mute=!mute;setVol()}if(/^Digit[1-9]$/.test(e.code)&&!bp&&!shop&&!st&&!psk){const n=+e.code[5]-1;if(menuOpen){if(n<3)joinLobby(n);return}if(ph.n==2){if(n<3){me.v=n;pres()}}}if(['ShiftLeft','Space','KeyE'].includes(e.code)){AB=1;e.preventDefault()}});
addEventListener('keyup',e=>K[e.code]=0);
const mp=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.addEventListener('mousemove',mp);c.addEventListener('mousedown',e=>{mp(e);startMusic();if(backClick())return;if(quitAsk&&quitOk()){if(inB(qyR,M.x,M.y))doQuit();else quitAsk=0;return}if(quitOk()&&inB(quitR,M.x,M.y)){askQuit();return}if(psk){if(crS)crClick();else pkClick();return}if(st){stClick();return}if(shop){shopClick();return}if(bp){bpClick();return}if(menuOpen){menuClick();return}if(ph.n>0&&inB(rdR,M.x,M.y)){setReady();return}if(ph.n==2){voteClick();return}if(ph.n==1)return;if(mode!=1){selClick()}else if(e.button==2)AB=1;else M.d=1});
addEventListener('mouseup',()=>M.d=0);c.addEventListener('contextmenu',e=>e.preventDefault());
