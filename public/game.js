const c=document.getElementById('c'),g=c.getContext('2d'),W=960,H=540,MW=1600,MH=1200;
const CH=[{n:'Ranger',hp:100,sp:230,col:'#5ec27a',cd:.13,dmg:11,bs:780,spr:.05,pel:1,life:.9,r:14,L:22,acd:3.5,ds:'Fusil équilibré',da:'Roulade : esquive invulnérable'},
{n:'Ombre',hp:70,sp:285,col:'#9b7bd8',cd:.65,dmg:12,bs:900,spr:.2,pel:5,life:.32,r:12,L:16,acd:9,ds:'Fusil à pompe, très rapide',da:'Invisibilité pendant 3,5 s'},
{n:'Titan',hp:180,sp:165,col:'#d88a4a',cd:.08,dmg:6,bs:680,spr:.13,pel:1,life:.8,r:19,L:30,acd:8,ds:'Mitrailleuse, très résistant',da:'Bouclier : -80 % de dégâts, 2,5 s'},
{n:'Artificier',hp:90,sp:215,col:'#e0c04a',cd:.5,dmg:22,bs:560,spr:.02,pel:1,life:.9,r:15,L:24,acd:6,ds:'Tirs lourds',da:'Grenade explosive à zone'}];
const B4=[[0,0,1600,24],[0,1176,1600,24],[0,0,24,1200],[1576,0,24,1200]];
const MAPS=[
{n:'Ruines',d:'Pierres, mousse et bloc central',fl:'#10151d',gr:'#18202c',wa:'#2a3446',wt:'#3c4a63',dc:['#2f5a45','#4a5568'],w:[...B4,[700,500,200,200],[220,220,220,36],[220,220,36,220],[1160,944,220,36],[1344,760,36,220],[1160,220,220,36],[1344,220,36,220],[220,944,220,36],[220,760,36,220],[760,180,80,120],[760,900,80,120],[300,560,60,80],[1240,560,60,80]]},
{n:'Forteresse',d:'Couloirs et murs épais',fl:'#161316',gr:'#241d22',wa:'#4a3a3a',wt:'#6b5252',dc:['#6b3030','#554a4a'],w:[...B4,[200,200,36,300],[200,700,36,300],[1364,200,36,300],[1364,700,36,300],[400,350,300,36],[900,350,300,36],[400,814,300,36],[900,814,300,36],[760,450,80,300],[500,560,120,80],[980,560,120,80]]},
{n:'Marais',d:'Piliers épars, terrain dégagé',fl:'#0f1a16',gr:'#15261f',wa:'#26402f',wt:'#3a5d44',dc:['#2e6b44','#3a7a6a'],w:[...B4,[300,300,70,70],[1230,300,70,70],[300,830,70,70],[1230,830,70,70],[765,200,70,70],[765,930,70,70],[520,565,70,70],[1010,565,70,70],[200,560,50,80],[1350,560,50,80]]}];
let WL=MAPS[0].w,mi=0;
const SP=[[100,100],[1500,100],[100,1100],[1500,1100],[800,120],[800,1080],[120,600],[1480,600]];
const net={now:()=>Date.now(),send(){},presence(){}};
let myPeer='',R={},bots=[],Bu=[],Pa=[],feed=[],cam={x:0,y:0},mode=0,AB=0,pt=0,tt=0,ph={n:0,left:300,id:0},DC=[];
const K={},M={x:480,y:270,d:0};
const me={x:800,y:1000,a:0,hp:0,c:0,k:0,cd:0,ab:0,iv:0,sh:0,al:0,ro:0,fl:0,dt:0,rx:0,ry:0,v:null};
const snd=(t,d)=>net.send(t,d);
const tag=p=>p===myPeer||p==='me'?'Toi':p==='bot'?'Bot':'J-'+String(p).slice(0,3);
const fd=(a,b)=>feed.push({t:tag(a)+' ▸ '+tag(b),l:5});
const ptc=(x,y,col)=>Pa.push({x,y,vx:(Math.random()-.5)*300,vy:(Math.random()-.5)*300,l:.5,col});
function col(o,r){for(const w of WL){const cx=Math.max(w[0],Math.min(o.x,w[0]+w[2])),cy=Math.max(w[1],Math.min(o.y,w[1]+w[3])),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);if(d<r){if(d>.01){o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}else o.y-=r}}}
const hitW=(x,y)=>WL.some(w=>x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3]);
function spawnPos(){let best=SP[0],bd=-1;for(let i=0;i<8;i++){const s=SP[Math.random()*8|0];let d=1e9;for(const k in R)d=Math.min(d,Math.hypot(R[k].x-s[0],R[k].y-s[1]));d=Math.min(d,Math.hypot(me.x-s[0],me.y-s[1]));if(d>bd){bd=d;best=s}}return best}
function pick(i){if(mode==2&&me.dt>0)return;const p=spawnPos();me.c=i;me.hp=CH[i].hp;me.x=p[0];me.y=p[1];me.al=1;me.cd=.5;me.ab=0;me.iv=me.sh=me.ro=0;mode=1;pres()}
function shoot(x,y,as,ci,mine,own,gr){const s=CH[ci];as.forEach(a=>Bu.push({x:x+Math.cos(a)*20,y:y+Math.sin(a)*20,vx:Math.cos(a)*(gr?460:s.bs),vy:Math.sin(a)*(gr?460:s.bs),l:gr?.75:s.life,d:gr?0:s.dmg,mine,own,gr}))}
function boom(b){for(let i=0;i<24;i++)ptc(b.x,b.y,i%2?'#ffb347':'#fff3b0');if(!b.mine&&me.al){const d=Math.hypot(b.x-me.x,b.y-me.y);if(d<95)hurtMe(48*(1-d/190),b.own)}
if(b.mine)for(const o of bots)if(o.hp>0){const d=Math.hypot(b.x-o.x,b.y-o.y);if(d<95)hitBot(o,48*(1-d/190))}}
function hitBot(o,d){o.hp-=d;o.fl=.1;if(o.hp<=0){o.dt=3;me.k++;fd('me','bot');for(let i=0;i<14;i++)ptc(o.x,o.y,'#c55')}}
function hurtMe(d,by){if(!me.al||me.ro>0)return;if(me.sh>0)d*=.2;me.hp-=d;me.fl=.12;if(me.hp<=0){me.al=0;mode=2;me.dt=2;snd('kill',{by,vic:myPeer});fd(by,'me');for(let i=0;i<20;i++)ptc(me.x,me.y,CH[me.c].col);pres()}}
function pres(){net.presence({x:Math.round(me.x),y:Math.round(me.y),a:+me.a.toFixed(2),hp:Math.round(me.hp),c:me.c,k:me.k,al:me.al,iv:me.iv>0?1:0,sh:me.sh>0?1:0,v:me.v,m:mi})}
function upd(dt){tick();tt+=dt;me.fl-=dt;me.dt-=dt;
if(me.al&&ph.n==0){const s=CH[me.c],dx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.KeyQ||K.ArrowLeft?1:0),dy=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.KeyZ||K.ArrowUp?1:0),l=Math.hypot(dx,dy)||1;
me.a=Math.atan2(M.y+cam.y-me.y,M.x+cam.x-me.x);me.cd-=dt;me.ab-=dt;me.iv-=dt;me.sh-=dt;
if(me.ro>0){me.ro-=dt;me.x+=me.rx*640*dt;me.y+=me.ry*640*dt;if(Math.random()<.5)ptc(me.x,me.y,'#8f8')}else{const sp=s.sp*(me.sh>0?.6:1);me.x+=dx/l*sp*dt;me.y+=dy/l*sp*dt}
col(me,s.r);
if(M.d&&me.cd<=0&&me.ro<=0){me.cd=s.cd;const as=[];for(let i=0;i<s.pel;i++)as.push(me.a+(Math.random()-.5)*s.spr*2);shoot(me.x,me.y,as,me.c,true,myPeer||'me',0);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0})}
if(AB&&me.ab<=0){me.ab=s.acd;if(me.c==0){me.ro=.22;me.rx=dx?dx/l:Math.cos(me.a);me.ry=dx||dy?dy/l:Math.sin(me.a)}else if(me.c==1)me.iv=3.5;else if(me.c==2)me.sh=2.5;else{shoot(me.x,me.y,[me.a],3,true,myPeer||'me',1);snd('shot',{x:me.x,y:me.y,as:[me.a],c:3,g:1})}}
AB=0;cam.x=Math.max(0,Math.min(MW-W,me.x-W/2));cam.y=Math.max(0,Math.min(MH-H,me.y-H/2))}
if((pt+=dt)>.066){pt=0;pres()}
const nr=Object.keys(R).length;if(nr)bots=[];else while(bots.length<2){const p=SP[Math.random()*8|0];bots.push({x:p[0],y:p[1],hp:60,a:0,cd:1,fl:0,dt:0})}
for(const o of bots){if(o.hp<=0){if(o.dt-=dt,o.dt<=0){const p=SP[Math.random()*8|0];Object.assign(o,{x:p[0],y:p[1],hp:60})}continue}
o.fl-=dt;const d=Math.hypot(me.x-o.x,me.y-o.y);o.a=Math.atan2(me.y-o.y,me.x-o.x);const m=d>280?1:-.3;o.x+=Math.cos(o.a+Math.sin(tt*2)*.5)*90*m*dt;o.y+=Math.sin(o.a+Math.sin(tt*2)*.5)*90*m*dt;col(o,14);
o.cd-=dt;if(me.al&&ph.n==0&&d<560&&o.cd<=0){o.cd=.7;shoot(o.x,o.y,[o.a+(Math.random()-.5)*.3],0,false,'bot',0);Bu[Bu.length-1].d=8}}
for(const b of Bu){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;let dead=b.l<=0;
if(hitW(b.x,b.y))dead=true;
if(!dead&&!b.gr){if(!b.mine&&me.al&&me.ro<=0&&Math.hypot(b.x-me.x,b.y-me.y)<CH[me.c].r){hurtMe(b.d,b.own);dead=true}
if(b.mine)for(const o of bots)if(o.hp>0&&Math.hypot(b.x-o.x,b.y-o.y)<15){hitBot(o,b.d);dead=true;break}}
if(dead){b.x-=b.vx*dt;b.y-=b.vy*dt;if(b.gr)boom(b);else ptc(b.x,b.y,'#ffd');b.l=-1}}
Bu=Bu.filter(b=>b.l>0);for(const q of Pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt}Pa=Pa.filter(q=>q.l>0);
for(const k in R){const o=R[k];o.x+=(o.tx-o.x)*.3;o.y+=(o.ty-o.y)*.3}
feed.forEach(f=>f.l-=dt);feed=feed.filter(f=>f.l>0)}
function pl(x,y,a,ci,hp,tg,iv,sh,isMe,fl){const s=CH[ci];g.save();g.translate(x-cam.x,y-cam.y);g.globalAlpha=iv?(isMe?.35:0):1;if(!g.globalAlpha){g.restore();return}
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(4,6,s.r,s.r*.85,0,0,7);g.fill();g.rotate(a);g.fillStyle='#1b1f2a';g.fillRect(s.r-4,-3.5,s.L,7);
g.fillStyle=fl>0?'#fff':s.col;g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();g.rotate(-a);
if(sh){g.strokeStyle='rgba(120,220,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,s.r+7,0,7);g.stroke()}
g.fillStyle='#000a';g.fillRect(-18,-s.r-14,36,5);g.fillStyle=hp/s.hp>.35?'#6fd16f':'#e25a4a';g.fillRect(-18,-s.r-14,36*Math.max(0,hp/s.hp),5);g.fillStyle='#e6ecf5';g.font='11px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(tg,0,-s.r-18);g.restore()}
function draw(){g.setTransform(1,0,0,1,0,0);g.fillStyle=MAPS[mi].fl;g.fillRect(0,0,W,H);g.save();g.translate(-cam.x,-cam.y);
g.strokeStyle=MAPS[mi].gr;g.lineWidth=1;for(let x=0;x<=MW;x+=80){g.beginPath();g.moveTo(x,0);g.lineTo(x,MH);g.stroke()}for(let y=0;y<=MH;y+=80){g.beginPath();g.moveTo(0,y);g.lineTo(MW,y);g.stroke()}
for(const d of DC){if(d.x<cam.x-150||d.x>cam.x+W+150||d.y<cam.y-100||d.y>cam.y+H+100)continue;const m=MAPS[mi];g.save();g.translate(d.x,d.y);g.scale(d.s,d.s);
if(d.t==0){g.strokeStyle=m.dc[0];g.lineWidth=2;for(let j=-1;j<2;j++){g.beginPath();g.moveTo(j*5,0);g.quadraticCurveTo(j*5+Math.sin(tt+d.x)*2,-8,j*7,-14);g.stroke()}}
else if(d.t==1){g.fillStyle=m.dc[1];g.beginPath();g.ellipse(0,0,10,7,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.08)';g.beginPath();g.ellipse(-2,-2,5,3,0,0,7);g.fill()}
else if(d.t==2){g.fillStyle='rgba(90,140,200,.13)';g.beginPath();g.ellipse(0,0,26,13,0,0,7);g.fill()}
else if(d.t==4){g.fillStyle='rgba(255,255,255,.025)';g.beginPath();g.ellipse(0,0,140,90,0,0,7);g.fill()}
else{g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(-14,0);g.lineTo(-3,4);g.lineTo(4,-3);g.lineTo(15,2);g.stroke()}g.restore()}
for(const w of WL){g.fillStyle='#000';g.fillRect(w[0]+6,w[1]+8,w[2],w[3]);g.fillStyle=MAPS[mi].wa;g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle=MAPS[mi].wt;g.fillRect(w[0],w[1],w[2],5)}
g.globalCompositeOperation='lighter';WL.slice(4).forEach((w,i)=>{const gx=w[0],gy=w[1],f=.13+.05*Math.sin(tt*5+i*2),r=g.createRadialGradient(gx,gy,2,gx,gy,110);r.addColorStop(0,'rgba(255,170,80,'+f+')');r.addColorStop(1,'rgba(255,170,80,0)');g.fillStyle=r;g.fillRect(gx-110,gy-110,220,220)});g.globalCompositeOperation='source-over';
g.restore();
for(const b of bots)if(b.hp>0)pl(b.x,b.y,b.a,0,b.hp*100/60,'Bot',0,0,0,b.fl);
for(const k in R){const o=R[k];if(o.al)pl(o.x,o.y,o.a,o.c,o.hp,tag(k),o.iv,o.sh,0,0)}
if(me.al)pl(me.x,me.y,me.a,me.c,me.hp,'Toi',me.iv>0,me.sh>0,1,me.fl);
for(const b of Bu){g.fillStyle=b.gr?'#ffb347':'#fff6c0';g.beginPath();g.arc(b.x-cam.x,b.y-cam.y,b.gr?6:3,0,7);g.fill()}
for(const q of Pa){g.globalAlpha=Math.max(0,q.l*2);g.fillStyle=q.col;g.fillRect(q.x-cam.x,q.y-cam.y,3,3)}g.globalAlpha=1;
{const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=v;g.fillRect(0,0,W,H)}
g.textAlign='center';g.font='bold 24px Trebuchet MS,sans-serif';g.fillStyle=ph.left<30?'#ff8a6a':'#f0e6d0';g.fillText(fmt(ph.left),W/2,30);g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n,W/2,46);
g.textAlign='left';g.font='13px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(nr()?('En ligne : '+(Object.keys(R).length+1)+' joueurs'):'Seul : 2 bots t\'attendent. Partage le lien pour jouer à plusieurs.',14,22);
const sc=[['Toi',me.k],...Object.keys(R).map(k=>[tag(k),R[k].k])].sort((a,b)=>b[1]-a[1]);g.textAlign='right';sc.slice(0,6).forEach((s,i)=>{g.fillStyle=s[0]=='Toi'?'#ffd98a':'#c5cfe0';g.fillText(s[0]+'  '+s[1],W-14,22+i*17)});
g.textAlign='left';feed.forEach((f,i)=>{g.fillStyle='rgba(240,225,200,'+Math.min(1,f.l)+')';g.fillText(f.t,14,46+i*16)});
if(me.al){const s=CH[me.c];g.fillStyle='#000a';g.fillRect(14,H-44,220,12);g.fillStyle='#6fd16f';g.fillRect(14,H-44,220*Math.max(0,me.hp/s.hp),12);g.fillStyle='#000a';g.fillRect(14,H-26,220,8);g.fillStyle=me.ab<=0?'#7ad0ff':'#456';g.fillRect(14,H-26,220*(me.ab<=0?1:1-me.ab/s.acd),8);g.fillStyle='#e6ecf5';g.fillText(s.n+(me.ab<=0?' — capacité prête (Maj / Espace / clic droit)':''),14,H-52)}
if(mode!=1){g.fillStyle='rgba(5,7,11,.82)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 38px Trebuchet MS,sans-serif';g.fillText(mode==0?'ARÈNE':'Éliminé',W/2,80);g.font='15px Trebuchet MS,sans-serif';g.fillStyle='#9aa7bd';g.fillText(mode==0?'ZQSD/WASD : bouger — Souris : viser et tirer — Maj, Espace ou clic droit : capacité':(me.dt>0?'Réapparition dans '+Math.ceil(me.dt)+' s…':'Choisis ton personnage'),W/2,110);
CH.forEach((s,i)=>{const x=40+i*224,y=150;g.fillStyle='#161d2a';g.fillRect(x,y,208,300);g.strokeStyle=s.col;g.lineWidth=2;g.strokeRect(x,y,208,300);g.fillStyle=s.col;g.beginPath();g.arc(x+104,y+70,s.r*1.8,0,7);g.fill();g.fillStyle='#1b1f2a';g.fillRect(x+104+s.r*1.2,y+66,s.L*1.5,8);g.fillStyle='#f0e6d0';g.font='bold 20px Trebuchet MS,sans-serif';g.fillText((i+1)+'. '+s.n,x+104,y+140);g.font='13px Trebuchet MS,sans-serif';g.fillStyle='#c5cfe0';g.fillText(s.ds,x+104,y+170);g.fillText('Vie '+s.hp+'   Vitesse '+s.sp,x+104,y+196);g.fillStyle=s.col;const w=s.da.match(/.{1,26}(\s|$)/g)||[s.da];w.forEach((t,j)=>g.fillText(t.trim(),x+104,y+232+j*18));if(M.x>x&&M.x<x+208&&M.y>y&&M.y<y+300){g.strokeStyle='#fff';g.strokeRect(x-3,y-3,214,306)}})}}
function nr(){return Object.keys(R).length}
const PL=300,SC=10,VT=15,CY=PL+SC+VT;
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
function phase(){const t=net.now()/1000,e=t%CY,id=Math.floor(t/CY);return e<PL?{n:0,left:PL-e,id}:e<PL+SC?{n:1,left:PL+SC-e,id}:{n:2,left:CY-e,id}}
function tally(){const a=[0,0,0];if(me.v!=null)a[me.v]++;for(const k in R){const v=R[k].v;if(v!=null&&v>=0&&v<3)a[v]++}return a}
function winner(){const a=tally(),m=Math.max(...a);return m?a.indexOf(m):(mi+1)%3}
function genDecor(){let sd=mi*977+13;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;DC=[];for(let i=0;i<14;i++)DC.push({x:r()*1600,y:r()*1200,t:4,s:.6+r()});
for(let i=0;i<280;i++){const x=40+r()*1520,y=40+r()*1120,t=r()*4|0,s2=.6+r();if(WL.some(w=>x>w[0]-24&&x<w[0]+w[2]+24&&y>w[1]-24&&y<w[1]+w[3]+24))continue;DC.push({x,y,t,s:s2})}}
function setMap(i){mi=i%3;WL=MAPS[mi].w;genDecor();Bu=[]}
let lastPh=null;
function tick(){const p=phase(),l=lastPh;ph=p;if(!l||(l.n==p.n&&l.id==p.id)){lastPh=p;return}lastPh=p;Bu=[];M.d=0;
if(p.n==0){setMap(winner());me.k=0;me.v=null;me.al=0;mode=0;pres()}else if(p.n==2){me.v=null;pres()}}
function voteClick(){for(let i=0;i<3;i++){const x=60+i*292;if(M.x>x&&M.x<x+268&&M.y>150&&M.y<440){me.v=i;pres()}}}
function overlays(){if(ph.n==0)return;g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);g.textAlign='center';const F=' Trebuchet MS,sans-serif';
if(ph.n==1){g.fillStyle='#ffd98a';g.font='bold 54px'+F;g.fillText('Fin de la partie',W/2,80);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Vote de la carte dans '+Math.ceil(ph.left)+' s',W/2,112);
[['Toi',me.k,1],...Object.keys(R).map(k=>[tag(k),R[k].k,0])].sort((a,b)=>b[1]-a[1]).slice(0,8).forEach((r,i)=>{const y=175+i*42;g.fillStyle=i==0?'#ffd98a':r[2]?'#7ad0ff':'#c5cfe0';g.font=(i==0?'bold 34px':'28px')+F;g.textAlign='left';g.fillText((i+1)+'.  '+r[0],250,y);g.textAlign='right';g.fillText(r[1]+' kills',710,y)})}
else{g.fillStyle='#f0e6d0';g.font='bold 40px'+F;g.fillText('Vote : prochaine carte',W/2,70);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Clique ou touches 1-3 — début dans '+Math.ceil(ph.left)+' s',W/2,104);const a=tally();
MAPS.forEach((m,i)=>{const x=60+i*292,y=150;g.fillStyle='#161d2a';g.fillRect(x,y,268,290);g.strokeStyle=me.v===i?'#ffd98a':m.wt;g.lineWidth=me.v===i?4:2;g.strokeRect(x,y,268,290);g.fillStyle=m.fl;g.fillRect(x+14,y+14,240,150);g.fillStyle=m.wa;m.w.forEach(w=>g.fillRect(x+14+w[0]*.15,y+14+w[1]*.125,Math.max(2,w[2]*.15),Math.max(2,w[3]*.125)));
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F;g.fillText((i+1)+'. '+m.n,x+134,y+198);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText(m.d,x+134,y+222);g.fillStyle='#ffd98a';g.font='bold 20px'+F;g.fillText(a[i]+' vote'+(a[i]>1?'s':''),x+134,y+258)})}}
function netEvent(t,d,from){d=d||{};if(t=='shot'){if(ph.n||!Array.isArray(d.as))return;shoot(+d.x||0,+d.y||0,d.as.slice(0,6).map(Number),(d.c|0)&3,false,from,d.g?1:0)}else if(t=='kill'){fd(d.by,d.vic||from);if(d.by&&d.by===myPeer){me.k++;pres()}}}
let synced=0;
function netPeers(list,my){myPeer=my;const nn={};for(const p of list){const q=p.presence||{},o=R[p.id]||{x:+q.x||0,y:+q.y||0};Object.assign(o,{tx:+q.x||0,ty:+q.y||0,a:+q.a||0,hp:+q.hp||0,c:(q.c|0)&3,k:+q.k||0,al:q.al,iv:q.iv,sh:q.sh,v:q.v,m:(q.m|0)%3});nn[p.id]=o}R=nn;if(!synced&&list.length){synced=1;setMap(R[list[0].id].m)}}
setMap(0);

let last=performance.now();function fr(t){const dt=Math.min(.05,(t-last)/1000);last=t;upd(dt);draw();overlays();requestAnimationFrame(fr)}requestAnimationFrame(fr);
addEventListener('keydown',e=>{K[e.code]=1;if(/^Digit[1-4]$/.test(e.code)){const n=+e.code[5]-1;if(ph.n==2){if(n<3){me.v=n;pres()}}else if(mode!=1&&ph.n==0)pick(n)}if(['ShiftLeft','Space','KeyE'].includes(e.code)){AB=1;e.preventDefault()}});
addEventListener('keyup',e=>K[e.code]=0);
const mp=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.addEventListener('mousemove',mp);c.addEventListener('mousedown',e=>{mp(e);if(ph.n==2){voteClick();return}if(ph.n==1)return;if(mode!=1){CH.forEach((s,i)=>{const x=40+i*224;if(M.x>x&&M.x<x+208&&M.y>150&&M.y<450)pick(i)})}else if(e.button==2)AB=1;else M.d=1});
addEventListener('mouseup',()=>M.d=0);c.addEventListener('contextmenu',e=>e.preventDefault());
