const c=document.getElementById('c'),g=c.getContext('2d'),W=960,H=540,MW=1600,MH=1200;
const CH=[{n:'Ranger',hp:100,sp:230,col:'#5ec27a',cd:.13,dmg:11,bs:780,spr:.05,pel:1,life:.9,r:14,L:22,acd:3.5,ds:'Fusil équilibré',da:'Roulade : esquive invulnérable'},
{n:'Ombre',hp:70,sp:285,col:'#9b7bd8',cd:.65,dmg:12,bs:900,spr:.2,pel:5,life:.32,r:12,L:16,acd:9,ds:'Fusil à pompe, très rapide',da:'Invisibilité pendant 3,5 s'},
{n:'Titan',hp:180,sp:165,col:'#d88a4a',cd:.08,dmg:6,bs:680,spr:.13,pel:1,life:.8,r:19,L:30,acd:8,ds:'Mitrailleuse, très résistant',da:'Bouclier : -80 % de dégâts, 2,5 s'},
{n:'Artificier',hp:90,sp:215,col:'#e0c04a',cd:.5,dmg:22,bs:560,spr:.02,pel:1,life:.9,r:15,L:24,acd:6,ds:'Tirs lourds',da:'Grenade explosive à zone'}];
CH[0].ab='roll';CH[1].ab='invis';CH[2].ab='shield';CH[3].ab='gren';
CH.push(
{n:'Phénix',hp:120,sp:250,col:'#ff8a3c',cd:.11,dmg:9,bs:800,spr:.09,pel:1,life:.7,r:15,L:24,acd:14,ab:'rewind'},
{n:'Nitro',hp:100,sp:225,col:'#ff7ad9',cd:.14,dmg:10,bs:780,spr:.08,pel:1,life:.8,r:14,L:22,acd:12,ab:'tur'},
{n:'Jaguar',hp:100,sp:245,col:'#3a7bff',cd:.3,dmg:14,bs:820,spr:.04,pel:1,life:.9,r:14,L:22,acd:10,ab:'trap'},
{n:'Chum',hp:110,sp:220,col:'#8b5a2b',cd:.2,dmg:10,bs:760,spr:.06,pel:1,life:.8,r:15,L:22,acd:14,ab:'bot'},
{n:'Corona',hp:100,sp:230,col:'#e33a3a',cd:.6,dmg:11,bs:850,spr:.14,pel:3,life:.4,r:14,L:20,acd:14,ab:'flash'},
{n:'Zéphir',hp:75,sp:270,col:'#f5f5f5',cd:.22,dmg:9,bs:850,spr:.05,pel:1,life:.8,r:12,L:20,acd:14,ab:'invis5'},
{n:'Spider',hp:95,sp:235,col:'#9b59ff',cd:.22,dmg:10,bs:800,spr:.05,pel:1,life:.8,r:13,L:20,acd:6,ab:'tp'},
{n:'Aura',hp:100,sp:230,col:'#2de0e0',cd:.18,dmg:9,bs:780,spr:.06,pel:1,life:.8,r:14,L:20,acd:12,ab:'aura'},
{n:'Ixchel',hp:120,sp:215,col:'#3fcf5a',cd:.2,dmg:10,bs:760,spr:.06,pel:1,life:.8,r:16,L:22,acd:16,ab:'ixz'},
{n:'Voyageur du Vent',hp:85,sp:260,col:'#9fd8ff',cd:.17,dmg:9,bs:820,spr:.05,pel:1,life:.8,r:13,L:20,acd:3,ab:'dash'},
{n:'Calamité',hp:120,sp:225,col:'#c04bd8',cd:.15,dmg:11,bs:780,spr:.06,pel:1,life:.8,r:15,L:22,acd:16,ab:'inv'});
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
const me={x:800,y:1000,a:0,hp:0,c:0,k:0,cd:0,ab:0,iv:0,sh:0,al:0,ro:0,fl:0,dt:0,rx:0,ry:0,v:null,ri:0,rs:640,bn:0,bt:0,inv:0,pt:null,tc:0,bl:0};
const snd=(t,d)=>net.send(t,d);
const tag=p=>p===myPeer||p==='me'?'Toi':p==='bot'?'Bot':'J-'+String(p).slice(0,3);
const fd=(a,b)=>feed.push({t:tag(a)+' ▸ '+tag(b),l:5});
const ptc=(x,y,col)=>Pa.push({x,y,vx:(Math.random()-.5)*300,vy:(Math.random()-.5)*300,l:.5,col});
function col(o,r){for(const w of WL){const cx=Math.max(w[0],Math.min(o.x,w[0]+w[2])),cy=Math.max(w[1],Math.min(o.y,w[1]+w[3])),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);if(d<r){if(d>.01){o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}else o.y-=r}}}
const hitW=(x,y)=>WL.some(w=>x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3]);
function spawnPos(){let best=SP[0],bd=-1;for(let i=0;i<8;i++){const s=SP[Math.random()*8|0];let d=1e9;for(const k in R)d=Math.min(d,Math.hypot(R[k].x-s[0],R[k].y-s[1]));d=Math.min(d,Math.hypot(me.x-s[0],me.y-s[1]));if(d>bd){bd=d;best=s}}return best}
function pick(i){if(mode==2&&me.dt>0)return;if(i>=CH.length||!owned(i))return;const p=spawnPos();me.c=i;me.hp=CH[i].hp;me.x=p[0];me.y=p[1];me.al=1;me.cd=.5;me.ab=0;me.iv=me.sh=me.ro=me.ri=me.inv=me.bn=me.bl=0;me.pt=null;mode=1;pres()}
function shoot(x,y,as,ci,mine,own,gr,dm){const s=CH[ci];as.forEach(a=>Bu.push({x:x+Math.cos(a)*20,y:y+Math.sin(a)*20,vx:Math.cos(a)*(gr?460:s.bs),vy:Math.sin(a)*(gr?460:s.bs),l:gr?.75:s.life,d:gr?0:(dm||s.dmg),mine,own,gr}))}
function boom(b){for(let i=0;i<24;i++)ptc(b.x,b.y,i%2?'#ffb347':'#fff3b0');if(!b.mine&&me.al){const d=Math.hypot(b.x-me.x,b.y-me.y);if(d<95)hurtMe(48*(1-d/190),b.own)}
if(b.mine)for(const o of bots)if(o.hp>0){const d=Math.hypot(b.x-o.x,b.y-o.y);if(d<95)hitBot(o,48*(1-d/190))}}
function hitBot(o,d){o.hp-=d;o.fl=.1;if(o.hp<=0){o.dt=3;me.k++;gain(20,1);fd('me','bot');for(let i=0;i<14;i++)ptc(o.x,o.y,'#c55')}}
function hurtMe(d,by){if(!me.al||me.ri>0||me.inv>0)return;if(me.sh>0)d*=.2;if(me.bn>0){const a=Math.min(me.bn,d);me.bn-=a;d-=a}me.hp-=d;me.fl=.12;if(me.hp<=0){if(me.pt){me.hp=me.pt.hp;me.x=me.pt.x;me.y=me.pt.y;me.pt=null;me.ri=.6;for(let i=0;i<20;i++)ptc(me.x,me.y,'#ff8a3c');return}me.al=0;mode=2;me.dt=2;snd('kill',{by,vic:myPeer});fd(by,'me');for(let i=0;i<20;i++)ptc(me.x,me.y,CH[me.c].col);pres()}}
function pres(){net.presence({x:Math.round(me.x),y:Math.round(me.y),a:+me.a.toFixed(2),hp:Math.round(me.hp),c:me.c,k:me.k,al:me.al,iv:me.iv>0?1:0,sh:(me.sh>0||me.inv>0)?1:0,v:me.v,m:mi,s:SV.skin,b:Math.round(me.bn)})}
function upd(dt){tick();tt+=dt;me.fl-=dt;me.dt-=dt;
if(me.al&&ph.n==0){const s=CH[me.c],dx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.KeyQ||K.ArrowLeft?1:0),dy=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.KeyZ||K.ArrowUp?1:0),l=Math.hypot(dx,dy)||1;
me.a=Math.atan2(M.y+cam.y-me.y,M.x+cam.x-me.x);me.cd-=dt;me.ab-=dt;me.iv-=dt;me.sh-=dt;me.hs-=dt;me.ri-=dt;me.bt-=dt;if(me.bt<=0)me.bn=0;me.bl-=dt;me.tc-=dt;me.inv-=dt;if(inIx(me.x,me.y)){me.iv=me.sh=me.inv=me.bn=0;me.pt=null}if(me.pt){me.pt.t-=dt;if(me.pt.t<=0){me.x=me.pt.x;me.y=me.pt.y;me.hp=me.pt.hp;me.pt=null;me.ri=.3;for(let i=0;i<24;i++)ptc(me.x,me.y,'#ff8a3c')}}
if(me.ro>0){me.ro-=dt;me.x+=me.rx*me.rs*dt;me.y+=me.ry*me.rs*dt;if(Math.random()<.5)ptc(me.x,me.y,'#8f8')}else{const sp=s.sp*(me.sh>0?.6:1)*(me.hs>0?1.6:1);me.x+=dx/l*sp*dt;me.y+=dy/l*sp*dt}
col(me,s.r);
if(M.d&&me.cd<=0&&me.ro<=0&&me.inv<=0){me.cd=s.cd;const as=[];for(let i=0;i<s.pel;i++)as.push(me.a+(Math.random()-.5)*s.spr*2);shoot(me.x,me.y,as,me.c,true,myPeer||'me',0);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0})}
if(AB&&me.ab<=0){me.ab=s.acd;useAb(s,dx,dy,l)}
AB=0;cam.x=Math.max(0,Math.min(MW-W,me.x-W/2));cam.y=Math.max(0,Math.min(MH-H,me.y-H/2))}
if((pt+=dt)>.033){pt=0;pres()}
const nr=Object.keys(R).length;if(nr)bots=[];else while(bots.length<2){const p=SP[Math.random()*8|0];bots.push({x:p[0],y:p[1],hp:60,a:0,cd:1,fl:0,dt:0})}
for(const o of bots){if(o.hp<=0){if(o.dt-=dt,o.dt<=0){const p=SP[Math.random()*8|0];Object.assign(o,{x:p[0],y:p[1],hp:60})}continue}
o.fl-=dt;const d=Math.hypot(me.x-o.x,me.y-o.y);o.a=Math.atan2(me.y-o.y,me.x-o.x);const m=d>280?1:-.3;o.x+=Math.cos(o.a+Math.sin(tt*2)*.5)*90*m*dt;o.y+=Math.sin(o.a+Math.sin(tt*2)*.5)*90*m*dt;col(o,14);
o.cd-=dt;if(me.al&&ph.n==0&&d<560&&o.cd<=0){o.cd=.7;shoot(o.x,o.y,[o.a+(Math.random()-.5)*.3],0,false,'bot',0);Bu[Bu.length-1].d=8}}
const myId=myPeer||'me';
for(const o of DP){o.l-=dt;const mine=o.own===myId;
if((o.k=='tur'||o.k=='bot')&&mine&&ph.n==0){o.cd-=dt;if(o.cd<=0){const tg=target(o);if(tg){o.cd=o.k=='tur'?1.1:.3;const an=Math.atan2(tg.y-o.y,tg.x-o.x)+(Math.random()-.5)*.1,dm=o.k=='tur'?8:5;o.an=an;shoot(o.x,o.y,[an],0,true,myId,0,dm);snd('shot',{x:o.x,y:o.y,as:[an],c:0,g:0,d:dm})}else o.cd=.2}}
if(o.k=='trap'){if(!o.act&&!mine&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<45){o.act=5;snd('act',{id:o.id})}if(!o.act&&mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<45)o.act=5;
if(o.act>0){o.act-=dt;if(!mine&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<70)hurtMe(14*dt,o.own);if(mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<70)hitBot(q,14*dt);if(o.act<=0)o.l=0}}
if(o.k=='tp'&&mine&&me.al&&me.tc<=0){const ps=DP.filter(q=>q.k=='tp'&&q.own==myId);if(ps.length==2&&Math.hypot(me.x-o.x,me.y-o.y)<22){const q=ps[0]==o?ps[1]:ps[0];me.x=q.x;me.y=q.y;me.tc=1;for(let i=0;i<14;i++)ptc(q.x,q.y,'#c9a0ff')}}
if(o.k=='ixz'){for(const q of DP)if(q.k!='ixz'&&Math.hypot(q.x-o.x,q.y-o.y)<170)q.l=0;for(const b of Bu)if(b.gr&&Math.hypot(b.x-o.x,b.y-o.y)<170){b.l=-1;b.nb=1}}}
DP=DP.filter(o=>o.l>0&&o.hp>0);
for(const b of Bu){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;let dead=b.l<=0;
if(hitW(b.x,b.y))dead=true;
if(!dead&&!b.gr){if(!b.mine&&me.al&&me.ri<=0&&me.inv<=0&&Math.hypot(b.x-me.x,b.y-me.y)<CH[me.c].r){hurtMe(b.d,b.own);dead=true}
if(b.mine)for(const o of bots)if(o.hp>0&&Math.hypot(b.x-o.x,b.y-o.y)<15){hitBot(o,b.d);dead=true;break}}
if(!dead&&!b.gr)for(const o of DP)if((o.k=='tur'||o.k=='bot'||o.k=='trap')&&o.own!==b.own&&Math.hypot(b.x-o.x,b.y-o.y)<14){o.hp-=b.d;dead=true;ptc(o.x,o.y,'#ff9');break}
if(dead){b.x-=b.vx*dt;b.y-=b.vy*dt;if(b.gr){if(!b.nb)boom(b)}else ptc(b.x,b.y,'#ffd');b.l=-1}}
Bu=Bu.filter(b=>b.l>0);for(const q of Pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt}Pa=Pa.filter(q=>q.l>0);
for(const k in R){const o=R[k];o.ex=Math.min(.1,(o.ex||0)+dt);const px=o.tx+(o.vx||0)*o.ex,py=o.ty+(o.vy||0)*o.ex;if(Math.hypot(px-o.x,py-o.y)>260){o.x=px;o.y=py}else{const f=1-Math.exp(-dt*22);o.x+=(px-o.x)*f;o.y+=(py-o.y)*f}}
feed.forEach(f=>f.l-=dt);feed=feed.filter(f=>f.l>0)}
function pl(x,y,a,ci,hp,tg,iv,sh,isMe,fl,sk,bn){const s=CH[ci];g.save();g.translate(x-cam.x,y-cam.y);g.globalAlpha=iv?(isMe?.35:0):1;if(!g.globalAlpha){g.restore();return}
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(4,6,s.r,s.r*.85,0,0,7);g.fill();g.rotate(a);g.fillStyle='#1b1f2a';g.fillRect(s.r-4,-3.5,s.L,7);
g.fillStyle=fl>0?'#fff':(SKINS[sk|0].c||s.col);g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();g.rotate(-a);
if(sh){g.strokeStyle='rgba(120,220,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,s.r+7,0,7);g.stroke()}
g.fillStyle='#000a';g.fillRect(-18,-s.r-14,36,5);g.fillStyle=hp/s.hp>.35?'#6fd16f':'#e25a4a';g.fillRect(-18,-s.r-14,36*Math.max(0,hp/s.hp),5);if(bn>0){g.fillStyle='#b070ff';g.fillRect(-18+36*Math.min(1,Math.max(0,hp)/s.hp),-s.r-14,36*bn/s.hp,5)}g.fillStyle='#e6ecf5';g.font='11px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(tg,0,-s.r-18);g.restore()}
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
drawDP();for(const b of bots)if(b.hp>0)pl(b.x,b.y,b.a,0,b.hp*100/60,'Bot',0,0,0,b.fl);
for(const k in R){const o=R[k];if(o.al)pl(o.x,o.y,o.a,o.c,o.hp,tag(k),o.iv,o.sh,0,0,o.s,o.b)}
if(me.al)pl(me.x,me.y,me.a,me.c,me.hp,'Toi',me.iv>0,me.sh>0||me.inv>0,1,me.fl,SV.skin,me.bn);
for(const b of Bu){g.fillStyle=b.gr?'#ffb347':'#fff6c0';g.beginPath();g.arc(b.x-cam.x,b.y-cam.y,b.gr?6:3,0,7);g.fill()}
for(const q of Pa){g.globalAlpha=Math.max(0,q.l*2);g.fillStyle=q.col;g.fillRect(q.x-cam.x,q.y-cam.y,3,3)}g.globalAlpha=1;
{const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=v;g.fillRect(0,0,W,H)}
if(me.bl>0){g.fillStyle='rgba(255,255,255,'+(me.bl>4?1:.1+.11*me.bl)+')';g.fillRect(0,0,W,H)}
g.textAlign='center';g.font='bold 24px Trebuchet MS,sans-serif';g.fillStyle=ph.left<30?'#ff8a6a':'#f0e6d0';g.fillText(fmt(ph.left),W/2,30);g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n,W/2,46);g.textAlign='right';g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+'  ·  Palier '+tier()+'  ·  B : Battle Pass  ·  M : musique',W-14,H-14);
g.textAlign='left';g.font='13px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(nr()?('En ligne : '+(Object.keys(R).length+1)+' joueurs'):'Seul : 2 bots t\'attendent. Partage le lien pour jouer à plusieurs.',14,22);
const sc=[['Toi',me.k],...Object.keys(R).map(k=>[tag(k),R[k].k])].sort((a,b)=>b[1]-a[1]);g.textAlign='right';sc.slice(0,6).forEach((s,i)=>{g.fillStyle=s[0]=='Toi'?'#ffd98a':'#c5cfe0';g.fillText(s[0]+'  '+s[1],W-14,22+i*17)});
g.textAlign='left';feed.forEach((f,i)=>{g.fillStyle='rgba(240,225,200,'+Math.min(1,f.l)+')';g.fillText(f.t,14,46+i*16)});
if(me.al){const s=CH[me.c];g.fillStyle='#000a';g.fillRect(14,H-44,220,12);g.fillStyle='#6fd16f';g.fillRect(14,H-44,220*Math.max(0,me.hp/s.hp),12);if(me.bn>0){g.fillStyle='#b070ff';g.fillRect(14+220*Math.min(1,Math.max(0,me.hp)/s.hp),H-44,220*me.bn/s.hp,12)}g.fillStyle='#000a';g.fillRect(14,H-26,220,8);g.fillStyle=me.ab<=0?'#7ad0ff':'#456';g.fillRect(14,H-26,220*(me.ab<=0?1:1-me.ab/s.acd),8);g.fillStyle='#e6ecf5';g.fillText(s.n+(me.ab<=0?' — capacité prête (Maj / Espace / clic droit)':''),14,H-52)}
if(mode!=1){g.fillStyle='rgba(5,7,11,.82)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 38px Trebuchet MS,sans-serif';g.fillText(mode==0?'ARÈNE':'Éliminé',W/2,80);g.font='15px Trebuchet MS,sans-serif';g.fillStyle='#9aa7bd';g.fillText(mode==0?'ZQSD/WASD : bouger — Souris : viser et tirer — Maj, Espace ou clic droit : capacité':(me.dt>0?'Réapparition dans '+Math.ceil(me.dt)+' s…':'Choisis ton personnage'),W/2,110);
drawSelect()}}
function nr(){return Object.keys(R).length}
const PL=300,SC=10,VT=15,CY=PL+SC+VT;
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
function phase(){const t=net.now()/1000,e=t%CY,id=Math.floor(t/CY);return e<PL?{n:0,left:PL-e,id}:e<PL+SC?{n:1,left:PL+SC-e,id}:{n:2,left:CY-e,id}}
function tally(){const a=[0,0,0];if(me.v!=null)a[me.v]++;for(const k in R){const v=R[k].v;if(v!=null&&v>=0&&v<3)a[v]++}return a}
function winner(){const a=tally(),m=Math.max(...a);return m?a.indexOf(m):(mi+1)%3}
function genDecor(){let sd=mi*977+13;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;DC=[];for(let i=0;i<14;i++)DC.push({x:r()*1600,y:r()*1200,t:4,s:.6+r()});
for(let i=0;i<280;i++){const x=40+r()*1520,y=40+r()*1120,t=r()*4|0,s2=.6+r();if(WL.some(w=>x>w[0]-24&&x<w[0]+w[2]+24&&y>w[1]-24&&y<w[1]+w[3]+24))continue;DC.push({x,y,t,s:s2})}}
function setMap(i){mi=i%3;WL=MAPS[mi].w;genDecor();Bu=[];DP=[]}
let lastPh=null;
function tick(){const p=phase(),l=lastPh;ph=p;if(!l||(l.n==p.n&&l.id==p.id)){lastPh=p;return}lastPh=p;Bu=[];M.d=0;
if(p.n==0){setMap(winner());me.k=0;me.v=null;me.al=0;mode=0;pres()}else if(p.n==2){me.v=null;pres()}}
function voteClick(){for(let i=0;i<3;i++){const x=60+i*292;if(M.x>x&&M.x<x+268&&M.y>150&&M.y<440){me.v=i;pres()}}}
function overlays(){if(shop){drawShop();return}if(bp){drawBP();return}if(ph.n==0)return;g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);g.textAlign='center';const F=' Trebuchet MS,sans-serif';
if(ph.n==1){g.fillStyle='#ffd98a';g.font='bold 54px'+F;g.fillText('Fin de la partie',W/2,80);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Vote de la carte dans '+Math.ceil(ph.left)+' s',W/2,112);
[['Toi',me.k,1],...Object.keys(R).map(k=>[tag(k),R[k].k,0])].sort((a,b)=>b[1]-a[1]).slice(0,8).forEach((r,i)=>{const y=175+i*42;g.fillStyle=i==0?'#ffd98a':r[2]?'#7ad0ff':'#c5cfe0';g.font=(i==0?'bold 34px':'28px')+F;g.textAlign='left';g.fillText((i+1)+'.  '+r[0],250,y);g.textAlign='right';g.fillText(r[1]+' kills',710,y)})}
else{g.fillStyle='#f0e6d0';g.font='bold 40px'+F;g.fillText('Vote : prochaine carte',W/2,70);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Clique ou touches 1-3 — début dans '+Math.ceil(ph.left)+' s',W/2,104);const a=tally();
MAPS.forEach((m,i)=>{const x=60+i*292,y=150;g.fillStyle='#161d2a';g.fillRect(x,y,268,290);g.strokeStyle=me.v===i?'#ffd98a':m.wt;g.lineWidth=me.v===i?4:2;g.strokeRect(x,y,268,290);g.fillStyle=m.fl;g.fillRect(x+14,y+14,240,150);g.fillStyle=m.wa;m.w.forEach(w=>g.fillRect(x+14+w[0]*.15,y+14+w[1]*.125,Math.max(2,w[2]*.15),Math.max(2,w[3]*.125)));
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F;g.fillText((i+1)+'. '+m.n,x+134,y+198);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText(m.d,x+134,y+222);g.fillStyle='#ffd98a';g.font='bold 20px'+F;g.fillText(a[i]+' vote'+(a[i]>1?'s':''),x+134,y+258)})}}
function netEvent(t,d,from){d=d||{};if(t=='shot'){if(ph.n||!Array.isArray(d.as))return;shoot(+d.x||0,+d.y||0,d.as.slice(0,12).map(Number),(d.c|0)&15,false,from,d.g?1:0,Math.min(30,+d.d||0))}else if(t=='kill'){fd(d.by,d.vic||from);if(d.by&&d.by===myPeer){me.k++;gain(20,1);pres()}}else if(t=='dep'){addDp(initDp({id:String(d.id).slice(0,30),k:String(d.k),x:+d.x||0,y:+d.y||0,own:from}))}else if(t=='act'){const o=DP.find(q=>q.id==d.id&&q.k=='trap');if(o&&!o.act)o.act=5}else if(t=='flash'){const dx=me.x-d.x,dy=me.y-d.y,da=Math.abs(((Math.atan2(dy,dx)-d.a+3*Math.PI)%(2*Math.PI))-Math.PI);if(from!==myPeer&&me.al&&Math.hypot(dx,dy)<750&&da<1&&!inIx(me.x,me.y)&&los(d.x,d.y,me.x,me.y))me.bl=5}}
let synced=0;
function netPeers(list,my){myPeer=my;const nn={};for(const p of list){const q=p.presence||{},o=R[p.id]||{x:+q.x||0,y:+q.y||0};const nx=+q.x||0,ny=+q.y||0,tn=performance.now();if(o.t){const dp=(tn-o.t)/1000;if(dp>.004){o.vx=Math.max(-700,Math.min(700,(nx-o.tx)/dp));o.vy=Math.max(-700,Math.min(700,(ny-o.ty)/dp))}}else{o.vx=o.vy=0}o.t=tn;o.ex=0;Object.assign(o,{tx:nx,ty:ny,a:+q.a||0,hp:+q.hp||0,c:(q.c|0)&15,s:(q.s|0)&7,b:+q.b||0,k:+q.k||0,al:q.al,iv:q.iv,sh:q.sh,v:q.v,m:(q.m|0)%3});nn[p.id]=o}R=nn;if(!synced&&list.length){synced=1;setMap(R[list[0].id].m)}}
let DP=[],dpn=0,shop=0,bp=0,AC=null,mute=0,mstep=0,mnext=0;
const PRICE={5:25,6:25,7:25,8:25,11:25,12:25,13:25},PASSCH={4:10,9:16,10:22,14:30},ST={1:5,2:12,3:18,4:24,5:28},TIERS=30;
const SKINS=[{n:'Classique',c:null},{n:'Néon',c:'#39ff88'},{n:'Or',c:'#ffd24a'},{n:'Givre',c:'#9fe6ff'},{n:'Lave',c:'#ff5a2a'},{n:'Royal',c:'#c36bff'}];
const ABN={roll:'Roulade',invis:'Invisible',shield:'Bouclier',gren:'Grenade',rewind:'Retour dans le temps',tur:'Tourelle',trap:'Piège',bot:'Mini-bot',flash:'Flash',invis5:'Invisible 5 s',tp:'Téléporteurs',aura:'Aura',ixz:'Zone anti-pouvoirs',dash:'Dash',inv:'Invincible'};
const ABD={roll:'Esquive rapide et invulnérable',invis:'Invisible 3,5 s',shield:'Bouclier -80 % dégâts, 2,5 s',gren:'Grenade explosive à zone',rewind:'Pose un point : 5 s après, retour au point avec tes PV d\'avant. Mort pendant le pouvoir annulée',tur:'Pose une tourelle fragile qui tire lentement',trap:'Piège : au passage d\'un ennemi, zone de dégâts pendant 5 s',bot:'Mini-bot qui tire sur les autres pendant 5 s',flash:'Aveugle les joueurs dans ton champ de vision pendant 5 s',invis5:'Invisible pendant 5 s',tp:'Pose 2 téléporteurs ; le 3e efface le 1er',aura:'+25 % de PV violets, disparaissent après 5 s',ixz:'Grande zone qui bloque et détruit tous les pouvoirs',dash:'Dash rapide dans la direction visée',inv:'Invincible 5 s, mais tir impossible'};
let SV={coins:0,xp:0,ct:0,bought:[],skin:0};try{Object.assign(SV,JSON.parse(localStorage.getItem('arena_sv2')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('arena_sv2',JSON.stringify(SV))}catch(e){}};
const tier=()=>Math.min(TIERS,Math.floor(SV.xp/100));
const owned=i=>i<4||SV.bought.includes(i)||(PASSCH[i]&&tier()>=PASSCH[i]);
const ownedSkin=i=>i==0||tier()>=ST[i];
function reward(t){for(const i in PASSCH)if(PASSCH[i]==t)return{k:'ch',l:CH[i].n};for(const i in ST)if(ST[i]==t)return{k:'sk',l:SKINS[i].n};const v=3+(t%4)*2;return{k:'co',v,l:'+'+v}}
function gain(xp,co){SV.coins+=co;SV.xp+=xp;const t=tier();while(SV.ct<t){SV.ct++;const r=reward(SV.ct);if(r.k=='co')SV.coins+=r.v;feed.push({t:'Palier '+SV.ct+' : '+(r.k=='co'?r.l+' pièces':r.l+' débloqué !'),l:6})}save()}
const cardPos=i=>({x:24+(i%5)*184,y:140+Math.floor(i/5)*160,w:176,h:150});
const inB=(p,x,y)=>x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h;
const OL=()=>CH.map((c,i)=>i).filter(owned);
const sp=k=>({x:24+(k%6)*154,y:130+Math.floor(k/6)*108,w:148,h:100}),shp=k=>({x:24+(k%6)*154,y:100+Math.floor(k/6)*200,w:148,h:190});
const F2=' Trebuchet MS,sans-serif';
function wrap(t,x,y,lh){(t.match(/.{1,24}(\s|$)/g)||[t]).forEach((l,j)=>g.fillText(l.trim(),x,y+j*lh))}
function drawSelect(){const o=OL();o.forEach((ci,k)=>{const s=CH[ci],p=sp(k);g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=s.col;g.lineWidth=inB(p,M.x,M.y)?4:2;g.strokeRect(p.x,p.y,p.w,p.h);g.fillStyle=SKINS[SV.skin].c||s.col;g.beginPath();g.arc(p.x+74,p.y+28,s.r*1.2,0,7);g.fill();g.fillStyle='#1b1f2a';g.fillRect(p.x+74+s.r*.8,p.y+25,s.L*.9,5);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 14px'+F2;g.fillText((k+1)+'. '+s.n,p.x+74,p.y+62);g.font='11px'+F2;g.fillStyle=s.col;g.fillText(ABN[s.ab],p.x+74,p.y+78);g.fillStyle='#9aa7bd';g.fillText('Vie '+s.hp+' · Vitesse '+s.sp,p.x+74,p.y+93)});
[['Boutique (P)','#7ad0ff','Achète des personnages'],['Battle Pass (B)','#ffd98a','Palier '+tier()+' / '+TIERS]].forEach((b,j)=>{const p=sp(o.length+j);g.fillStyle='#1d1a2e';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=b[1];g.lineWidth=inB(p,M.x,M.y)?4:2;g.strokeRect(p.x,p.y,p.w,p.h);g.textAlign='center';g.fillStyle=b[1];g.font='bold 15px'+F2;g.fillText(b[0],p.x+74,p.y+44);g.font='12px'+F2;g.fillStyle='#c5cfe0';g.fillText(b[2],p.x+74,p.y+68)});
g.textAlign='right';g.fillStyle='#e9d9a8';g.font='15px'+F2;g.fillText('● '+SV.coins+' pièces',W-24,118)}
function selClick(){const o=OL();o.forEach((ci,k)=>{if(inB(sp(k),M.x,M.y))pick(ci)});if(inB(sp(o.length),M.x,M.y))shop=1;if(inB(sp(o.length+1),M.x,M.y))bp=1}
function drawShop(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#7ad0ff';g.font='bold 32px'+F2;g.fillText('Boutique',W/2,46);g.font='15px'+F2;g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+' pièces — 1 kill = 1 pièce',W/2,76);
for(let k=0;k<11;k++){const i=k+4,s=CH[i],p=shp(k),ow=owned(i);g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=ow?'#3fcf5a':s.col;g.lineWidth=inB(p,M.x,M.y)?4:2;g.strokeRect(p.x,p.y,p.w,p.h);g.fillStyle=s.col;g.beginPath();g.arc(p.x+74,p.y+32,s.r*1.3,0,7);g.fill();g.fillStyle='#1b1f2a';g.fillRect(p.x+74+s.r,p.y+29,s.L*.9,5);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 14px'+F2;g.fillText(s.n,p.x+74,p.y+72);g.font='12px'+F2;g.fillStyle=s.col;g.fillText(ABN[s.ab],p.x+74,p.y+89);g.font='11px'+F2;g.fillStyle='#9aa7bd';wrap(ABD[s.ab],p.x+74,p.y+108,14);g.font='bold 12px'+F2;g.fillStyle=ow?'#3fcf5a':'#ffd98a';g.fillText(ow?'✔ Possédé':PRICE[i]?'🔒 '+PRICE[i]+' pièces'+(SV.coins>=PRICE[i]?' — acheter':''):'🔒 Pass : palier '+PASSCH[i],p.x+74,p.y+178)}
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('P ou Échap pour fermer',W/2,H-10)}
function shopClick(){for(let k=0;k<11;k++){const i=k+4;if(inB(shp(k),M.x,M.y)&&!owned(i)&&PRICE[i]&&SV.coins>=PRICE[i]){SV.coins-=PRICE[i];SV.bought.push(i);save()}}}
const los=(x1,y1,x2,y2)=>{const n=Math.ceil(Math.hypot(x2-x1,y2-y1)/24);for(let i=1;i<n;i++)if(hitW(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n))return false;return true};
const inIx=(x,y)=>DP.some(o=>o.k=='ixz'&&o.l>0&&Math.hypot(x-o.x,y-o.y)<170);
function target(o){let b=null,bd=520;const c=(x,y)=>{const d=Math.hypot(x-o.x,y-o.y);if(d<bd&&los(o.x,o.y,x,y)){bd=d;b={x,y}}};for(const k in R){const r=R[k];if(r.al&&!r.iv)c(r.x,r.y)}for(const q of bots)if(q.hp>0)c(q.x,q.y);return b}
function initDp(o){Object.assign(o,{tur:{hp:40,l:30,cd:.6},bot:{hp:25,l:5,cd:.3},trap:{hp:15,l:90,cd:0},tp:{hp:9e9,l:180,cd:0},ixz:{hp:9e9,l:8,cd:0}}[o.k]);return o}
function addDp(o){if(!['tur','bot','trap','tp','ixz'].includes(o.k))return;if(o.k!='ixz'&&inIx(o.x,o.y))return;if(o.k=='tp'){const m=DP.filter(q=>q.k=='tp'&&q.own==o.own);if(m.length>=2)m[0].l=0}if(DP.length<60)DP.push(o)}
function dep(k,x,y){const id=(myPeer||'me')+':'+(++dpn),o=initDp({id,k,x,y,own:myPeer||'me'});addDp(o);snd('dep',{id,k,x,y})}
function useAb(s,dx,dy,l){const A=s.ab,at=me.a;if(inIx(me.x,me.y)&&A!='ixz'){me.ab=0;return}
if(A=='roll'){me.ro=.22;me.ri=.22;me.rs=640;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='dash'){me.ro=.18;me.rs=1100;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='invis')me.iv=3.5;else if(A=='invis5')me.iv=5;else if(A=='shield')me.sh=2.5;else if(A=='inv')me.inv=5;
else if(A=='aura'){me.bn=Math.round(s.hp*.25);me.bt=5}
else if(A=='rewind')me.pt={x:me.x,y:me.y,hp:me.hp,t:5};
else if(A=='flash'){snd('flash',{x:me.x,y:me.y,a:me.a});for(let i=0;i<30;i++)ptc(me.x,me.y,'#fff')}
else if(A=='gren'){shoot(me.x,me.y,[me.a],3,true,myPeer||'me',1);snd('shot',{x:me.x,y:me.y,as:[me.a],c:3,g:1})}
else dep(A,me.x,me.y)}
function drawDP(){for(const o of DP){const sx=o.x-cam.x,sy=o.y-cam.y;if(sx<-200||sx>W+200||sy<-200||sy>H+200)continue;const mine=o.own===(myPeer||'me');g.save();g.translate(sx,sy);
if(o.k=='ixz'){g.fillStyle='rgba(63,207,90,'+(.08+.04*Math.sin(tt*4))+')';g.beginPath();g.arc(0,0,170,0,7);g.fill();g.strokeStyle='rgba(63,207,90,.8)';g.lineWidth=3;g.setLineDash([12,10]);g.lineDashOffset=-tt*20;g.beginPath();g.arc(0,0,170,0,7);g.stroke();g.setLineDash([])}
else if(o.k=='tp'){g.strokeStyle='#c9a0ff';g.lineWidth=3;for(let j=0;j<3;j++){g.beginPath();g.arc(0,0,8+j*5+Math.sin(tt*6+j)*2,0,7);g.stroke()}}
else if(o.k=='trap'){if(o.act>0){g.fillStyle='rgba(58,123,255,'+(.25+.1*Math.sin(tt*10))+')';g.beginPath();g.arc(0,0,70,0,7);g.fill();g.strokeStyle='#8fb4ff';g.lineWidth=2;g.stroke()}else{g.globalAlpha=mine?.9:.3;g.fillStyle='#3a7bff';g.beginPath();g.moveTo(-9,7);g.lineTo(0,-9);g.lineTo(9,7);g.fill()}}
else{const bt=o.k=='bot';g.fillStyle=bt?'#8b5a2b':'#ff7ad9';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.arc(0,0,bt?9:13,0,7);g.fill();g.stroke();g.rotate(o.an||0);g.fillStyle='#222';g.fillRect(4,-2.5,bt?9:16,5);g.rotate(-(o.an||0));g.fillStyle='#000a';g.fillRect(-12,-20,24,4);g.fillStyle='#6fd16f';g.fillRect(-12,-20,24*Math.max(0,o.hp/(bt?25:40)),4)}
g.restore()}
if(me.pt){g.save();g.translate(me.pt.x-cam.x,me.pt.y-cam.y);g.strokeStyle='#ff8a3c';g.lineWidth=3;g.beginPath();g.arc(0,0,16+Math.sin(tt*8)*2,0,7);g.stroke();g.fillStyle='#ff8a3c';g.textAlign='center';g.font='bold 14px'+F2;g.fillText(Math.ceil(me.pt.t),0,5);g.restore()}}
function drawBP(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);const F=' Trebuchet MS,sans-serif',t=tier();g.textAlign='center';g.fillStyle='#ffd98a';g.font='bold 32px'+F;g.fillText('Battle Pass — palier '+t+' / '+TIERS,W/2,46);
g.fillStyle='#161d2a';g.fillRect(230,60,500,14);g.fillStyle='#7ad0ff';g.fillRect(230,60,500*(t>=TIERS?1:(SV.xp%100)/100),14);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText('1 kill = 20 XP + 1 pièce — 100 XP par palier — tu as '+SV.coins+' pièces',W/2,96);
for(let i=1;i<=TIERS;i++){const x=30+((i-1)%10)*90,y=108+Math.floor((i-1)/10)*80,r=reward(i);g.fillStyle=t>=i?'#1f3a2a':'#161d2a';g.fillRect(x,y,84,72);g.strokeStyle=r.k=='co'?'#556':'#ffd98a';g.lineWidth=1.5;g.strokeRect(x,y,84,72);g.fillStyle='#8f9bb3';g.font='11px'+F;g.fillText(i,x+42,y+14);g.fillStyle=r.k=='co'?'#e9d9a8':r.k=='sk'?'#7ad0ff':'#ff9a6a';g.font='bold 14px'+F;g.fillText(r.l,x+42,y+42);g.font='10px'+F;g.fillStyle='#8f9bb3';g.fillText(r.k=='co'?'pièces':r.k=='sk'?'skin':'personnage',x+42,y+60)}
g.fillStyle='#f0e6d0';g.font='bold 16px'+F;g.fillText('Skins — clique pour équiper',W/2,364);
SKINS.forEach((k,i)=>{const x=30+i*150,y=376,ow=ownedSkin(i);g.fillStyle='#161d2a';g.fillRect(x,y,140,100);g.strokeStyle=SV.skin==i?'#ffd98a':'#334';g.lineWidth=SV.skin==i?3:1.5;g.strokeRect(x,y,140,100);g.globalAlpha=ow?1:.35;g.fillStyle=k.c||'#5ec27a';g.beginPath();g.arc(x+70,y+38,20,0,7);g.fill();g.globalAlpha=1;g.fillStyle='#f0e6d0';g.font='13px'+F;g.fillText(k.n+(ow?'':' (palier '+ST[i]+')'),x+70,y+86)});
g.fillStyle='#9aa7bd';g.font='13px'+F;g.fillText('B ou Échap pour fermer',W/2,H-12)}
function bpClick(){SKINS.forEach((k,i)=>{const x=30+i*150;if(M.x>x&&M.x<x+140&&M.y>376&&M.y<476&&ownedSkin(i)){SV.skin=i;save();pres()}})}
const mf=n=>440*Math.pow(2,(n-69)/12);
function tone(f,t,d,type,v){const o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+.02);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(AC.master);o.start(t);o.stop(t+d+.05)}
const CHORDS=[[45,57,60,64],[41,53,57,60],[48,60,64,67],[43,55,59,62]];
function mnote(t){const ch=CHORDS[(mstep>>4)%4],q=mstep%16;if(q%4==0)tone(mf(ch[0]),t,.55,'triangle',.22);if(q%2==0)tone(mf(ch[1+((q>>1)%3)]+12),t,.28,'square',.025);if(q==0||q==8)tone(mf(ch[2]),t,1.1,'sine',.05)}
function startMusic(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();AC.master=AC.createGain();AC.master.gain.value=mute?0:.5;AC.master.connect(AC.destination);mnext=AC.currentTime+.1;setInterval(()=>{if(AC.state!='running'){AC.resume();return}while(mnext<AC.currentTime+.3){mnote(mnext);mnext+=.15;mstep++}},100)}catch(e){AC=null}}
setMap(0);

let last=performance.now();function fr(t){const dt=Math.min(.05,(t-last)/1000);last=t;upd(dt);draw();overlays();requestAnimationFrame(fr)}requestAnimationFrame(fr);
addEventListener('keydown',e=>{K[e.code]=1;startMusic();if(e.code=='KeyB'){bp=!bp;shop=0}if(e.code=='KeyP'){shop=!shop;bp=0}if(e.code=='Escape'){bp=0;shop=0}if(e.code=='KeyM'){mute=!mute;if(AC)AC.master.gain.value=mute?0:.5}if(/^Digit[1-9]$/.test(e.code)&&!bp&&!shop){const n=+e.code[5]-1;if(ph.n==2){if(n<3){me.v=n;pres()}}else if(mode!=1&&ph.n==0&&n<OL().length)pick(OL()[n])}if(['ShiftLeft','Space','KeyE'].includes(e.code)){AB=1;e.preventDefault()}});
addEventListener('keyup',e=>K[e.code]=0);
const mp=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.addEventListener('mousemove',mp);c.addEventListener('mousedown',e=>{mp(e);startMusic();if(shop){shopClick();return}if(bp){bpClick();return}if(ph.n==2){voteClick();return}if(ph.n==1)return;if(mode!=1){selClick()}else if(e.button==2)AB=1;else M.d=1});
addEventListener('mouseup',()=>M.d=0);c.addEventListener('contextmenu',e=>e.preventDefault());