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
{n:'Tong Tong Sahur',hp:130,sp:225,col:'#b9824a',cd:.6,dmg:32,bs:0,spr:0,pel:0,life:0,r:15,L:46,acd:9,ab:'behind',ml:1,mr:84,ma:.95,sec:1}];
const B4=[[0,0,1600,24],[0,1176,1600,24],[0,0,24,1200],[1576,0,24,1200]];
const MAPS=[
{n:'Ruines',d:'Pierres, mousse et bloc central',fl:'#2b3a4a',gr:'#34475a',wa:'#56688a',wt:'#7e92b8',dc:['#2f5a45','#4a5568'],w:[...B4,[700,500,200,200],[220,220,220,36],[220,220,36,220],[1160,944,220,36],[1344,760,36,220],[1160,220,220,36],[1344,220,36,220],[220,944,220,36],[220,760,36,220],[760,180,80,120],[760,900,80,120],[300,560,60,80],[1240,560,60,80]]},
{n:'Forteresse',d:'Couloirs et murs épais',fl:'#3a3238',gr:'#4a4048',wa:'#7a6060',wt:'#a08080',dc:['#6b3030','#554a4a'],w:[...B4,[200,200,36,300],[200,700,36,300],[1364,200,36,300],[1364,700,36,300],[400,350,300,36],[900,350,300,36],[400,814,300,36],[900,814,300,36],[760,450,80,300],[500,560,120,80],[980,560,120,80]]},
{n:'Marais',d:'Piliers épars, terrain dégagé',fl:'#1f3a2c',gr:'#2a4b39',wa:'#3f6e4d',wt:'#5f9a70',dc:['#2e6b44','#3a7a6a'],w:[...B4,[300,300,70,70],[1230,300,70,70],[300,830,70,70],[1230,830,70,70],[765,200,70,70],[765,930,70,70],[520,565,70,70],[1010,565,70,70],[200,560,50,80],[1350,560,50,80]]},
{n:'Fournaise',d:'Les flaques de lave brûlent !',fl:'#3a1f18',gr:'#4a2a20',wa:'#5e4a44',wt:'#826860',dc:['#7a3a20','#4a3028'],w:[...B4,[760,560,80,80]],lv:[[300,250,260,140],[1040,250,260,140],[300,810,260,140],[1040,810,260,140],[700,420,200,100],[700,680,200,100],[200,440,70,320],[1330,440,70,320]]},
{n:'Catacombes',d:'Plaques piégées : des pointes sortent !',fl:'#25253a',gr:'#30304a',wa:'#4d4872',wt:'#6f6a9a',dc:['#4a3a6a','#3a3a4a'],w:[...B4,[400,300,36,260],[1164,300,36,260],[400,640,36,260],[1164,640,36,260],[600,200,400,36],[600,964,400,36],[740,560,120,80]],pl:[[300,600],[800,300],[800,900],[1300,600],[560,450],[1040,450],[560,750],[1040,750],[800,480],[800,720],[200,300],[1400,900],[200,900],[1400,300]]},
{n:'Laboratoire',d:'Laser et bonus apparaissent toutes les 15 s',fl:'#18313b',gr:'#214452',wa:'#2c5a6c',wt:'#4a8aa0',dc:['#2f7a8a','#3a5a66'],w:[...B4,[660,420,80,40],[860,420,80,40],[660,740,80,40],[860,740,80,40],[300,520,40,160],[1260,520,40,160],[560,300,36,160],[1004,300,36,160],[560,740,36,160],[1004,740,36,160]],orb:[[800,600],[400,300],[1200,300],[400,900],[1200,900],[800,250],[800,950],[250,600],[1350,600]]},
{n:'Jungle',d:'Cache-toi dans les buissons',fl:'#2a4a2a',gr:'#356035',wa:'#4a6a3a',wt:'#6a9050',dc:['#3f9a3f','#6a8a5a'],w:[...B4,[500,300,60,60],[1040,300,60,60],[500,840,60,60],[1040,840,60,60],[780,560,40,80]],bu:[[250,200,260,200],[1090,200,260,200],[250,800,260,200],[1090,800,260,200],[650,450,300,300],[100,520,120,160],[1380,520,120,160],[700,100,200,100],[700,1000,200,100]]},
{n:'Nuit noire',d:'Tu ne vois que devant toi',fl:'#2a2a3e',gr:'#36364e',wa:'#4a4a6a',wt:'#6a6a92',dc:['#4a4a7a','#3a3a52'],vis:1,w:[...B4,[300,300,36,300],[1264,300,36,300],[300,640,300,36],[1000,640,300,36],[700,300,200,36],[700,860,200,36],[560,880,36,200],[1004,100,36,200],[800,560,60,60]]},
{n:'Antre du Boss',d:'Événement spécial : tous contre le boss',fl:'#241526',gr:'#2e1c34',wa:'#5a3a62',wt:'#8a5a96',dc:['#6a2a5a','#4a3a4a'],ev:1,w:[...B4,[500,340,70,70],[1030,340,70,70],[500,790,70,70],[1030,790,70,70]]}];
let WL=MAPS[0].w,mi=0;
const SP=[[100,100],[1500,100],[100,1100],[1500,1100],[800,120],[800,1080],[120,600],[1480,600]];
const net={now:()=>Date.now(),send(){},presence(){},adminLogin(){},adm(){},up(){return 0}};
let myPeer='',R={},bots=[],Bu=[],Pa=[],feed=[],cam={x:0,y:0},mode=0,AB=0,pt=0,tt=0,ph={n:0,left:300,id:0},DC=[];
const K={},M={x:480,y:270,d:0};
const me={x:800,y:1000,a:0,hp:0,c:0,k:0,cd:0,ab:0,iv:0,sh:0,al:0,ro:0,fl:0,dt:0,rx:0,ry:0,v:null,ri:0,rs:640,bn:0,bt:0,inv:0,pt:null,tc:0,bl:0,lz:0,rg:0,sc:0,fr:0,pl:0,dth:0,god:0,rdy:0,db:0,hs:0,sw:0,sn:0,bdm:0};
const snd=(t,d)=>net.send(t,d);
const tag=p=>p===myPeer||p==='me'?'Toi':String(p).startsWith('bot')?'Bot '+((+String(p).slice(4)||0)+1):p==='env'?'Environnement':p==='boss'?'Tong Tong Sahur':(R[p]&&R[p].n)||'J-'+String(p).slice(0,3);
const fd=(a,b)=>feed.push({t:tag(a)+' ▸ '+tag(b),l:5});
const ptc=(x,y,col)=>Pa.push({x,y,vx:(Math.random()-.5)*300,vy:(Math.random()-.5)*300,l:.5,col});
function col(o,r){for(const w of WL.concat(DP.filter(q=>q.k=='bw').map(q=>[q.x-q.w/2,q.y-q.h/2,q.w,q.h]))){const cx=Math.max(w[0],Math.min(o.x,w[0]+w[2])),cy=Math.max(w[1],Math.min(o.y,w[1]+w[3])),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);if(d<r){if(d>.01){o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}else o.y-=r}}}
const hitW=(x,y)=>WL.some(w=>x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3])||DP.some(o=>o.k=='bw'&&x>o.x-o.w/2&&x<o.x+o.w/2&&y>o.y-o.h/2&&y<o.y+o.h/2);
function spawnPos(){let best=SP[0],bd=-1;for(let i=0;i<8;i++){const s=SP[Math.random()*8|0];let d=1e9;for(const k in R)d=Math.min(d,Math.hypot(R[k].x-s[0],R[k].y-s[1]));d=Math.min(d,Math.hypot(me.x-s[0],me.y-s[1]));if(d>bd){bd=d;best=s}}return best}
function pick(i){if(mode==2&&me.dt>0)return;if(i>=CH.length||!owned(i))return;clrTp();if(ph.n==0&&!me.pl){me.pl=1;me.late=ph.left<=PL-60;if(SV.mode==1&&me.late)feed.push({t:'Partie en cours : tu peux gagner des RR mais pas en perdre',l:5})}const p=spawnPos();me.c=i;me.hp=CH[i].hp;me.x=p[0];me.y=p[1];me.al=1;me.cd=.5;me.ab=0;me.iv=me.sh=me.ro=me.ri=me.inv=me.bn=me.bl=0;me.lz=me.rg=me.db=0;me.sn=me.sw=0;me.pt=null;mode=1;pres()}
function shoot(x,y,as,ci,mine,own,gr,dm,lz,gd,sn){const s=CH[ci],sp=sn?3400:gd?3000:lz?2200:gr?460:s.bs;as.forEach(a=>Bu.push({x:x+Math.cos(a)*20,y:y+Math.sin(a)*20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:sn?.9:gd?.7:lz?.45:gr?.75:s.life,d:sn?999:gd?60:lz?6:gr?0:s.rk?0:(dm||s.dmg),mine,own,gr,rk:!gr&&!lz&&!gd&&!sn&&s.rk?1:0,lz:lz?1:0,gd:gd?1:0,sn:sn?1:0,bo:dm&&dm>s.dmg?1:0}))}
function boom(b){const R0=b.rk?60:95,DM=b.rk?34:48;for(let i=0;i<24;i++)ptc(b.x,b.y,i%2?'#ffb347':'#fff3b0');if(!b.mine&&me.al&&SV.mode!=2){const d=Math.hypot(b.x-me.x,b.y-me.y);if(d<R0)hurtMe(DM*(1-d/(2*R0)),b.own)}
if(b.mine)for(const o of bots)if(o.hp>0){const d=Math.hypot(b.x-o.x,b.y-o.y);if(d<R0)hitBot(o,DM*(1-d/(2*R0)))}
if(b.mine&&BS.al){const d=Math.max(0,Math.hypot(b.x-BS.x,b.y-BS.y)-BS.r);if(d<R0)bossHit(DM*(1-d/(2*R0)))}}
function hitBot(o,d){o.hp-=d;o.fl=.1;if(o.hp<=0){o.dt=3;o.d=(o.d||0)+1;me.k++;gain(20,1);botRR();fd('me','bot:'+bots.indexOf(o));for(let i=0;i<14;i++)ptc(o.x,o.y,'#c55')}}
function hurtMe(d,by){if(!me.al||me.ri>0||me.inv>0)return;if(me.sh>0)d*=.2;if(me.bn>0){const a=Math.min(me.bn,d);me.bn-=a;d-=a}me.hp-=d;me.fl=.12;if(me.hp<=0){if(me.pt){me.hp=me.pt.hp;me.x=me.pt.x;me.y=me.pt.y;me.pt=null;me.ri=.6;for(let i=0;i<20;i++)ptc(me.x,me.y,'#ff8a3c');return}me.al=0;mode=2;me.dt=2;clrTp();me.kby=tag(by);me.dth++;if(String(by).startsWith('bot:')){const bb=bots[+String(by).slice(4)];if(bb)bb.k=(bb.k||0)+1}snd('kill',{by,vic:myPeer});fd(by,'me');for(let i=0;i<20;i++)ptc(me.x,me.y,CH[me.c].col);pres()}}
function pres(){net.presence({x:Math.round(me.x),y:Math.round(me.y),a:+me.a.toFixed(2),hp:Math.round(me.hp),c:me.c,k:me.k,al:me.al,iv:me.iv>0?1:0,sh:(me.sh>0||me.inv>0)?1:0,v:me.v,m:mi,s:SV.skin,b:Math.round(me.bn),n:SV.name,pk:curPk(),rv:me.fr>0?1:0,md:SV.mode,pl:me.pl?1:0,dd:me.dth||0,rk:SV.rk.r,rd:me.rdy,pw:me.pt?1:0,go:me.god?1:0,sn:(me.sn&&me.al)?1:0})}
function upd(dt){tick();tt+=dt;me.sc-=dt;me.fl-=dt;me.dt-=dt;me.sw-=dt;
if(me.al&&ph.n==0){const s=CH[me.c],dx=((K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.KeyQ||K.ArrowLeft?1:0))+TV.mx,dy=((K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.KeyZ||K.ArrowUp?1:0))+TV.my,l=Math.hypot(dx,dy)||1;
if(TV.on)me.a=TV.aim;else if(SV.ctl){if(dx||dy)me.la=Math.atan2(dy,dx);me.a=me.la||0}else me.a=Math.atan2(M.y+cam.y-me.y,M.x+cam.x-me.x);me.cd-=dt;me.ab-=dt;me.iv-=dt;me.sh-=dt;me.hs-=dt;me.db-=dt;me.lz-=dt;me.fr-=dt;if(me.god){me.ri=Math.max(me.ri,.3);me.hp=CH[me.c].hp}if(me.rg>0){me.rg-=dt;me.hp=Math.min(CH[me.c].hp,me.hp+7*dt);if(Math.random()<.2)ptc(me.x,me.y,'#7dff9a')}const mp=MAPS[mi];if(mp.lv&&mp.lv.some(r=>me.x>r[0]-4&&me.x<r[0]+r[2]+4&&me.y>r[1]-4&&me.y<r[1]+r[3]+4))hurtMe(22*dt,'env');for(const ob of orbList()){if(Math.hypot(me.x-ob.x,me.y-ob.y)<30){orbPicked.add(ob.k);snd('orb',{k:ob.k});applyOrb(ob.t)}}me.ri-=dt;me.bt-=dt;if(me.bt<=0)me.bn=0;me.bl-=dt;me.tc-=dt;me.inv-=dt;if(inIx(me.x,me.y)){me.iv=me.sh=me.inv=me.bn=0;me.pt=null}if(me.pt){me.pt.t-=dt;if(me.pt.t<=0){me.x=me.pt.x;me.y=me.pt.y;me.hp=me.pt.hp;me.pt=null;me.ri=.3;for(let i=0;i<24;i++)ptc(me.x,me.y,'#ff8a3c')}}
if(me.ro>0){me.ro-=dt;me.x+=me.rx*me.rs*dt;me.y+=me.ry*me.rs*dt;if(Math.random()<.5)ptc(me.x,me.y,'#8f8')}else{const sp=s.sp*(me.sh>0?.6:1)*(me.hs>0?1.6:1);me.x+=dx/l*sp*dt;me.y+=dy/l*sp*dt}
col(me,s.r);bossPush(me,s.r);
if((M.d||(SV.ctl&&(K.KeyJ||K.KeyF)))&&me.cd<=0&&me.ro<=0&&me.inv<=0){const lz=me.lz>0,gd=me.god?1:0;me.fr=.6;if(s.ml&&!lz&&!gd){me.cd=s.cd;doMelee(s)}else if(me.sn&&!lz&&!gd){me.cd=.5;doSniper(s)}else{me.cd=gd?.12:lz?.06:s.cd;const as=[];if(lz||gd)as.push(me.a);else for(let i=0;i<s.pel;i++)as.push(me.a+(Math.random()-.5)*s.spr*2);const dm=me.db>0&&!s.rk?Math.min(30,s.dmg*2):0;shoot(me.x,me.y,as,me.c,true,myPeer||'me',0,dm,lz,gd);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0,lz:lz?1:0,gd,d:dm})}}
if(AB&&me.ab<=0){me.ab=s.acd;useAb(s,dx,dy,l)}
AB=0;cam.x=Math.max(0,Math.min(MW-W,me.x-W/2));cam.y=Math.max(0,Math.min(MH-H,me.y-H/2))}
evUpd(dt);if((pt+=dt)>.033){pt=0;pres()}
const nr=Object.keys(R).length,rkn=Object.values(R).filter(o=>o.md==1).length,want=SV.mode==2?0:SV.mode?(rkn?0:3):(nr?0:2);if(!want)bots=[];else{bots.length=Math.min(bots.length,want);while(bots.length<want){const p=SP[Math.random()*8|0];bots.push({x:p[0],y:p[1],hp:60,a:0,cd:1,fl:0,dt:0,k:0,d:0})}}
for(const o of bots){if(o.hp<=0){if(o.dt-=dt,o.dt<=0){const p=SP[Math.random()*8|0];Object.assign(o,{x:p[0],y:p[1],hp:60})}continue}
o.fl-=dt;const d=Math.hypot(me.x-o.x,me.y-o.y);o.a=Math.atan2(me.y-o.y,me.x-o.x);const m=d>280?1:-.3;o.x+=Math.cos(o.a+Math.sin(tt*2)*.5)*90*m*dt;o.y+=Math.sin(o.a+Math.sin(tt*2)*.5)*90*m*dt;col(o,14);
o.cd-=dt;if(me.al&&ph.n==0&&d<560&&o.cd<=0){o.cd=.7;shoot(o.x,o.y,[o.a+(Math.random()-.5)*.3],0,false,'bot:'+bots.indexOf(o),0);Bu[Bu.length-1].d=8}}
PLT.forEach((p,i)=>{p.t-=dt;if(p.s==0){if(me.al&&ph.n==0&&Math.hypot(me.x-p.x,me.y-p.y)<24){p.s=1;p.t=.6;snd('plate',{i})}}else if(p.s==1&&p.t<=0){p.s=2;p.t=.7;p.h=0}else if(p.s==2){if(me.al&&!p.h&&Math.hypot(me.x-p.x,me.y-p.y)<46){p.h=1;hurtMe(32,'env')}if(p.t<=0){p.s=3;p.t=5}}else if(p.s==3&&p.t<=0)p.s=0});
const myId=myPeer||'me';
for(const o of DP){o.l-=dt;const mine=o.own===myId;
if((o.k=='tur'||o.k=='bot')&&mine&&ph.n==0){o.cd-=dt;if(o.cd<=0){const tg=target(o);if(tg){o.cd=o.k=='tur'?1.1:.3;const an=Math.atan2(tg.y-o.y,tg.x-o.x)+(Math.random()-.5)*.1,dm=o.k=='tur'?8:5;o.an=an;shoot(o.x,o.y,[an],0,true,myId,0,dm);snd('shot',{x:o.x,y:o.y,as:[an],c:0,g:0,d:dm})}else o.cd=.2}}
if(o.k=='trap'){if(!o.act&&!mine&&SV.mode!=2&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<45){o.act=5;snd('act',{id:o.id})}if(!o.act&&mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<45)o.act=5;if(!o.act&&mine&&BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+45)o.act=5;
if(o.act>0){o.act-=dt;if(!mine&&SV.mode!=2&&me.al&&Math.hypot(me.x-o.x,me.y-o.y)<70)hurtMe(14*dt,o.own);if(mine)for(const q of bots)if(q.hp>0&&Math.hypot(q.x-o.x,q.y-o.y)<70)hitBot(q,14*dt);if(mine&&BS.al&&Math.hypot(BS.x-o.x,BS.y-o.y)<BS.r+70)bossHit(28*dt);if(o.act<=0)o.l=0}}
if(o.k=='tp'&&mine&&me.al&&me.tc<=0){const ps=DP.filter(q=>q.k=='tp'&&q.own==myId);if(ps.length==2&&Math.hypot(me.x-o.x,me.y-o.y)<22){const q=ps[0]==o?ps[1]:ps[0];me.x=q.x;me.y=q.y;me.tc=1;for(let i=0;i<14;i++)ptc(q.x,q.y,'#c9a0ff')}}
if(o.k=='ixz'){for(const q of DP)if(q.k!='ixz'&&Math.hypot(q.x-o.x,q.y-o.y)<170)q.l=0;for(const b of Bu)if(b.gr&&Math.hypot(b.x-o.x,b.y-o.y)<170){b.l=-1;b.nb=1}}}
DP=DP.filter(o=>o.l>0&&o.hp>0);
for(const b of Bu){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;let dead=b.l<=0;
for(const o of DP)if(o.k=='bw'&&Math.abs(b.x-o.x)<o.w/2&&Math.abs(b.y-o.y)<o.h/2){o.hp-=b.d||25;ptc(o.x,o.y,'#c9a3ff');dead=true;break}
if(hitS(b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y))dead=true;
if(!dead&&!b.gr){if(!b.mine&&SV.mode!=2&&me.al&&!b.hm&&me.ri<=0&&me.inv<=0&&segD(me.x,me.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<CH[me.c].r+(b.gd?22:0)){hurtMe(b.d,b.own);if(b.gd)b.hm=1;else dead=true}
if(b.mine)for(const o of bots)if(o.hp>0&&segD(o.x,o.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<15+(b.gd?22:0)){hitBot(o,b.d);if(!b.gd)dead=true;break}}
if(!dead&&BS.al&&!b.gr&&segD(BS.x,BS.y,b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y)<BS.r+(b.gd?22:0)){if(b.mine&&!b.bh)bossHit(b.sn?SNB:(b.d||0));if(b.gd)b.bh=1;else dead=true}
if(!dead&&!b.gr&&SV.mode!=2)for(const o of DP)if((o.k=='tur'||o.k=='bot'||o.k=='trap'||o.k=='tp')&&o.own!==b.own&&Math.hypot(b.x-o.x,b.y-o.y)<14){o.hp-=b.d;dead=true;ptc(o.x,o.y,'#ff9');break}
if(dead){b.x-=b.vx*dt;b.y-=b.vy*dt;if(b.gr||b.rk){if(!b.nb)boom(b)}else ptc(b.x,b.y,'#ffd');b.l=-1}}
Bu=Bu.filter(b=>b.l>0);for(const q of Pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt}Pa=Pa.filter(q=>q.l>0);
for(const k in R){const o=R[k];o.ex=Math.min(.1,(o.ex||0)+dt);if(o.sw>0)o.sw-=dt;const px=o.tx+(o.vx||0)*o.ex,py=o.ty+(o.vy||0)*o.ex;if(Math.hypot(px-o.x,py-o.y)>260){o.x=px;o.y=py}else{const f=1-Math.exp(-dt*22);o.x+=(px-o.x)*f;o.y+=(py-o.y)*f}}
feed.forEach(f=>f.l-=dt);feed=feed.filter(f=>f.l>0)}
function pl(x,y,a,ci,hp,tg,iv,sh,isMe,fl,sk,bn,pk,rk,ex){const s=CH[ci];g.save();g.translate(x-cam.x,y-cam.y);g.globalAlpha=iv?(isMe?.35:0):1;if(!g.globalAlpha){g.restore();return}
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(4,6,s.r,s.r*.85,0,0,7);g.fill();g.rotate(a);ex=ex||{};if(ex.go)wings(s.r);wpn(s,ex);
g.fillStyle=fl>0?'#fff':ex.go?'#fff7dc':(pk?PACKS[pk-1].col:SKINS[sk|0].c||s.col);g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle=s.col=='#2b2b36'?'#aab6d0':'rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();if(!ex.go)drawDet(pk,s);g.rotate(-a);if(ex.go)angelFx(s.r);
if(sh){g.strokeStyle='rgba(120,220,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,s.r+7,0,7);g.stroke()}
g.fillStyle='#000a';g.fillRect(-18,-s.r-14,36,5);g.fillStyle=hp/s.hp>.35?'#6fd16f':'#e25a4a';g.fillRect(-18,-s.r-14,36*Math.max(0,hp/s.hp),5);if(bn>0){g.fillStyle='#b070ff';g.fillRect(-18+36*Math.min(1,Math.max(0,hp)/s.hp),-s.r-14,36*bn/s.hp,5)}g.fillStyle=rk==null?'#e6ecf5':rankFill(rk,0,90);g.font='bold 12px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(tg,0,-s.r-18);g.restore()}
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
drawDP();drawBoss();for(const b of bots)if(b.hp>0)pl(b.x,b.y,b.a,0,b.hp*100/60,'Bot',0,0,0,b.fl);
for(const k in R){const o=R[k];if(o.al&&!(inBush(o.x,o.y)&&!o.rv&&Math.hypot(o.x-me.x,o.y-me.y)>110)){if(o.pw){phAura(o.x,o.y,CH[o.c].r);if(o.px!=null)phMark(o.px,o.py)}pl(o.x,o.y,o.a,o.c,o.hp,tag(k),o.iv,o.sh,0,0,o.s,o.b,o.pk,o.rk,{sw:o.sw,go:o.go,sn:o.sn})}}
if(me.al){if(me.pt)phAura(me.x,me.y,CH[me.c].r);pl(me.x,me.y,me.a,me.c,me.hp,SV.name,me.iv>0,me.sh>0||me.inv>0,1,me.fl,SV.skin,me.bn,curPk(),SV.rk.r,{sw:me.sw,go:me.god,sn:me.sn})}
drawBush();for(const b of Bu){if(b.gd){const x0=b.x-cam.x,y0=b.y-cam.y;g.lineCap='round';g.strokeStyle='rgba(255,60,255,.35)';g.lineWidth=40;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0-b.vx*.08,y0-b.vy*.08);g.stroke();g.strokeStyle='#fff';g.lineWidth=12;g.stroke();g.lineCap='butt';continue}if(b.sn){const x0=b.x-cam.x,y0=b.y-cam.y;g.lineCap='round';g.strokeStyle='rgba(255,210,60,.35)';g.lineWidth=14;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0-b.vx*.06,y0-b.vy*.06);g.stroke();g.strokeStyle='#fff6c0';g.lineWidth=4;g.stroke();g.lineCap='butt';continue}if(b.lz){g.strokeStyle='rgba(120,255,255,.9)';g.lineWidth=3;g.beginPath();g.moveTo(b.x-cam.x,b.y-cam.y);g.lineTo(b.x-cam.x-b.vx*.03,b.y-cam.y-b.vy*.03);g.stroke();continue}g.fillStyle=b.gr?'#ffb347':b.rk?'#ff6a3a':b.bo?'#ff4a4a':'#fff6c0';g.beginPath();g.arc(b.x-cam.x,b.y-cam.y,b.gr?6:b.rk?5:b.bo?4:3,0,7);g.fill()}
for(const q of Pa){g.globalAlpha=Math.max(0,q.l*2);g.fillStyle=q.col;g.fillRect(q.x-cam.x,q.y-cam.y,3,3)}g.globalAlpha=1;
drawFog();{const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=v;g.fillRect(0,0,W,H)}
if(me.bl>0){g.fillStyle='rgba(255,255,255,'+(me.bl>4?1:.1+.11*me.bl)+')';g.fillRect(0,0,W,H)}
if(me.sc>0)drawScream();
drawTop();g.textAlign='right';g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+'  ·  Palier '+tier()+'  ·  B : Battle Pass  ·  M : musique',W-14,H-14);
g.textAlign='left';g.font='13px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(SV.mode==2?"Événement spécial — équipe : "+(nr()+1)+" joueur"+(nr()?"s":""):nr()?('En ligne : '+(Object.keys(R).length+1)+' joueurs'):'Seul : 2 bots t\'attendent. Partage le lien pour jouer à plusieurs.',14,22);
const sc=[['Toi',me.k,SV.rk.r],...Object.keys(R).map(k=>[tag(k),R[k].k,R[k].rk])].sort((a,b)=>b[1]-a[1]);g.textAlign='right';sc.slice(0,6).forEach((s,i)=>{g.fillStyle=s[2]!=null?rankFill(s[2],W-70,130):'#c5cfe0';g.fillText(s[0]+(SV.mode==2?'':'  '+s[1]),W-14,22+i*17)});
g.textAlign='left';feed.forEach((f,i)=>{g.fillStyle='rgba(240,225,200,'+Math.min(1,f.l)+')';g.fillText(f.t,14,46+i*16)});
if(me.al){const s=CH[me.c];g.fillStyle='#000a';g.fillRect(14,H-44,220,12);g.fillStyle='#6fd16f';g.fillRect(14,H-44,220*Math.max(0,me.hp/s.hp),12);if(me.bn>0){g.fillStyle='#b070ff';g.fillRect(14+220*Math.min(1,Math.max(0,me.hp)/s.hp),H-44,220*me.bn/s.hp,12)}g.fillStyle='#000a';g.fillRect(14,H-26,220,8);g.fillStyle=me.sn?'#ffd23a':me.ab<=0?'#7ad0ff':'#456';g.fillRect(14,H-26,220*(me.ab<=0||me.sn?1:Math.max(0,1-me.ab/s.acd)),8);g.fillStyle='#e6ecf5';g.fillText(s.n+(me.sn?' — 🎯 SNIPER ÉQUIPÉ : une seule balle':me.ab<=0?' — capacité prête (Maj / Espace / clic droit)':'')+(me.lz>0?'   ⚡ LASER '+Math.ceil(me.lz)+' s':'')+(me.hs>0?'   » VITESSE '+Math.ceil(me.hs)+' s':'')+(me.db>0?'   ✦ DÉGÂTS x2 '+Math.ceil(me.db)+' s':''),14,H-52)}
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
function tick(){const p=phase(),l=lastPh;ph=p;if(!l||(l.n==p.n&&l.id==p.id)){lastPh=p;return}lastPh=p;Bu=[];M.d=0;if(l.n==0&&!(p.n==0&&p.id==l.id))rankEnd(l.id);
if(p.n==0){setMap(winner(l.id));me.k=0;me.dth=0;me.pl=0;me.late=0;me.brr=0;rkRes=null;bots.forEach(b=>{b.k=0;b.d=0});me.v=null;me.al=0;mode=0;pres()}else if(p.n==1){}else if(p.n==2){me.v=null;pres()}}
function voteClick(){for(let i=0;i<3;i++){const x=60+i*292;if(M.x>x&&M.x<x+268&&M.y>150&&M.y<440){me.v=i;pres()}}}
function overlays(){overlays0();if(psk||st||shop||bp)drawBack();if(!(psk||st||shop||bp||menuOpen)&&ph.n>0)drawReady();if(TV.on&&mode==1&&ph.n==0&&!(psk||st||shop||bp||menuOpen))drawTouch();drawBanner()}
function overlays0(){if(!st)admP=0;if(psk){drawPacks();return}if(st){drawSt();return}if(shop){drawShop();return}if(bp){drawBP();return}if(menuOpen){drawMenu();return}if(ph.n==0)return;g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);g.textAlign='center';const F=' Trebuchet MS,sans-serif';
if(ph.n==1){g.fillStyle='#ffd98a';g.font='bold 54px'+F;g.fillText('Fin de la partie',W/2,80);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Vote de la carte dans '+Math.ceil(ph.left)+' s',W/2,112);drawRankRes();
[['Toi',me.k,1,SV.rk.r],...Object.keys(R).map(k=>[tag(k),R[k].k,0,R[k].rk])].sort((a,b)=>b[1]-a[1]).slice(0,8).forEach((r,i)=>{const y=175+i*42;g.fillStyle=r[3]!=null?rankFill(r[3],340,200):i==0?'#ffd98a':r[2]?'#7ad0ff':'#c5cfe0';g.font=(i==0?'bold 34px':'28px')+F;g.textAlign='left';g.fillText((i+1)+'.  '+r[0],250,y);g.textAlign='right';g.fillText(r[1]+' kills',710,y)})}
else{g.fillStyle='#f0e6d0';g.font='bold 40px'+F;g.fillText('Vote : prochaine carte',W/2,70);g.font='18px'+F;g.fillStyle='#9aa7bd';g.fillText('Clique ou touches 1-3 — début dans '+Math.ceil(ph.left)+' s',W/2,104);const a=tally();
cands(ph.id).forEach((mm,i)=>{const m=MAPS[mm],x=60+i*292,y=150;g.fillStyle='#161d2a';g.fillRect(x,y,268,290);g.strokeStyle=me.v===i?'#ffd98a':m.wt;g.lineWidth=me.v===i?4:2;g.strokeRect(x,y,268,290);g.fillStyle=m.fl;g.fillRect(x+14,y+14,240,150);g.fillStyle=m.wa;[...m.w,...(m.lv||[])].forEach(w=>g.fillRect(x+14+w[0]*.15,y+14+w[1]*.125,Math.max(2,w[2]*.15),Math.max(2,w[3]*.125)));
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 22px'+F;g.fillText((i+1)+'. '+m.n,x+134,y+198);g.font='13px'+F;g.fillStyle='#9aa7bd';g.fillText(m.d,x+134,y+222);g.fillStyle='#ffd98a';g.font='bold 20px'+F;g.fillText(a[i]+' vote'+(a[i]>1?'s':''),x+134,y+258)})}}
function netEvent(t,d,from){d=d||{};if(t=='shot'){if(ph.n||!Array.isArray(d.as))return;shoot(+d.x||0,+d.y||0,d.as.slice(0,12).map(Number),Math.min((d.c|0)&31,CH.length-1),false,from,d.g?1:0,Math.min(30,+d.d||0),d.lz?1:0,d.gd?1:0,d.sn?1:0)}else if(t=='kill'){fd(d.by,d.vic||from);if(d.by&&d.by===myPeer){me.k++;gain(20,1);pres()}}else if(t=='dep'){addDp(initDp({id:String(d.id).slice(0,30),k:String(d.k),x:+d.x||0,y:+d.y||0,ho:d.ho?1:0,own:from}))}else if(t=='act'){const o=DP.find(q=>q.id==d.id&&q.k=='trap');if(o&&!o.act)o.act=5}else if(t=='rm'){if(d.k=='tp')DP=DP.filter(o=>!(o.k=='tp'&&o.own===from))}else if(t=='plate'){const p=PLT[d.i|0];if(p&&p.s==0){p.s=1;p.t=.6}}else if(t=='orb'){orbPicked.add(+d.k||0)}else if(t=='pw'){const o=R[from];if(o){o.px=+d.x||0;o.py=+d.y||0;for(let i=0;i<30;i++)ptc(o.px,o.py,i%2?'#ff8a3c':'#ffd23a')}}else if(t=='melee'){const o=R[from];if(o)o.sw=.25;const s=CH[Math.min((d.c|0)&31,CH.length-1)];if(s.ml&&SV.mode!=2&&from!==myPeer&&me.al){const ax=+d.x||0,ay=+d.y||0,dx=me.x-ax,dy=me.y-ay,di=Math.hypot(dx,dy),r=CH[me.c].r;if(di<s.mr+r&&Math.abs(angd(Math.atan2(dy,dx),+d.a||0))<s.ma+Math.min(.5,r/Math.max(di,1))&&los(ax,ay,me.x,me.y))hurtMe(Math.min(70,+d.dm||s.dmg),from)}}else if(t=='btp'){bossTp(d)}else if(t=='boss'){netBoss(d)}else if(t=='bswing'){if(SV.mode==2&&me.al){const ax=+d.x||0,ay=+d.y||0,dx=me.x-ax,dy=me.y-ay,di=Math.hypot(dx,dy),r=CH[me.c].r;if(di<BREACH+r&&Math.abs(angd(Math.atan2(dy,dx),+d.a||0))<BARC/2+Math.min(.6,r/Math.max(di,1)))hurtMe(BDMG,'boss')}if(AC&&!mute)tone(100,AC.currentTime,.3,'sawtooth',.14)}else if(t=='bossdead'){bossDead()}else if(t=='flash'){const dx=me.x-d.x,dy=me.y-d.y,da=Math.abs(((Math.atan2(dy,dx)-d.a+3*Math.PI)%(2*Math.PI))-Math.PI);if(from!==myPeer&&SV.mode!=2&&me.al&&Math.hypot(dx,dy)<750&&da<1&&!inIx(me.x,me.y)&&los(d.x,d.y,me.x,me.y)){me.bl=5;if(d.sc){me.sc=1.3;screech()}}}}
let synced=0;
function netPeers(list,my){myPeer=my;const nn={};for(const p of list){const q=p.presence||{},o=R[p.id]||{x:+q.x||0,y:+q.y||0};const nx=+q.x||0,ny=+q.y||0,tn=performance.now();if(o.t){const dp=(tn-o.t)/1000;if(dp>.004){o.vx=Math.max(-700,Math.min(700,(nx-o.tx)/dp));o.vy=Math.max(-700,Math.min(700,(ny-o.ty)/dp))}}else{o.vx=o.vy=0}o.t=tn;o.ex=0;const wpw=o.pw;Object.assign(o,{tx:nx,ty:ny,a:+q.a||0,hp:+q.hp||0,pw:q.pw?1:0,go:q.go?1:0,sn:q.sn?1:0,c:Math.min((q.c|0)&31,CH.length-1),s:(q.s|0)&7,b:+q.b||0,n:String(q.n||'').slice(0,14),pk:(q.pk|0)%(PACKS.length+1),rv:q.rv?1:0,md:(q.md|0)&3,pl:q.pl?1:0,dd:+q.dd||0,rk:(q.rk|0)&7,rd:+q.rd||0,k:+q.k||0,al:q.al,iv:q.iv,sh:q.sh,v:q.v,m:(q.m|0)%MAPS.length});if(wpw&&!o.pw)o.px=null;nn[p.id]=o}R=nn;DP=DP.filter(o=>o.own===(myPeer||'me')||R[o.own]);if(!synced&&list.length){synced=1;setMap(R[list[0].id].m)}}
let DP=[],dpn=0,PLT=[],orbPicked=new Set(),psk=0,st=0,adm=0,admSel=null,admAmt=50,shop=0,bp=0,AC=null,mute=0,mstep=0,mnext=0;
// ===================== ÉVÉNEMENT SPÉCIAL, SALONS, NOUVEAUX PERSOS, EFFETS =====================
// Constantes du boss : à garder identiques à celles de server.js
const EVI=8,BR=75,BREACH=190,BARC=2.1,BDMG=45,SNB=350,BOSS_XP=500,BOSS_COINS=300;
const BS={al:0,x:800,y:600,tx:800,ty:600,a:0,ta:0,hp:0,mh:1,st:0,tp:0,r:BR,fl:0};
let bhAcc=0,bhT=0,BAN=null,LBC=[0,0,0],BOSSUP=0,ckOk=1,ckT=0;
const angd=(b,a)=>(((b-a)%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI;
function rbw(x,y,w,h){const gr=g.createLinearGradient(x,y,x+w,y+h);for(let i=0;i<=6;i++)gr.addColorStop(i/6,'hsl('+Math.floor((tt*90+i*60)%360)+',100%,62%)');return gr}

// ---- Salons (classique / classé / événement spécial) ----
function joinLobby(i){if(i==2&&!evOpen())return;SV.mode=i;save();menuOpen=0;R={};DP=[];Bu=[];Pa=[];bots=[];BS.al=0;BS.hp=0;synced=i==2?1:0;lastPh=null;rkDone=-1;rkRes=null;
me.k=0;me.dth=0;me.pl=0;me.late=0;me.brr=0;me.al=0;me.v=null;me.rdy=0;me.bdm=0;me.pt=null;me.sn=0;mode=0;bhAcc=0;
setMap(i==2?EVI:(mi==EVI?0:mi));
net.send('join',{m:i,uid:SV.uid});pres()}
function netOpen(){if(!menuOpen)net.send('join',{m:SV.mode,uid:SV.uid})}
function netSync(){ckOk=1;lastPh=null}
function netCounts(l,b){if(Array.isArray(l))LBC=[l[0]|0,l[1]|0,l[2]|0];BOSSUP=b?1:0}

// ---- Boss Tong Tong Sahur (simulé par le serveur) ----
function drum(){if(!AC||mute)return;const t=AC.currentTime;tone(70,t,.5,'sine',.5);tone(55,t+.25,.6,'sine',.5)}
function netBoss(d){const was=BS.al,php=BS.hp;BS.al=d.al?1:0;if(!BS.al){BS.hp=0;return}
BS.tx=+d.x||0;BS.ty=+d.y||0;BS.ta=+d.a||0;BS.hp=+d.hp||0;BS.mh=Math.max(1,+d.mh||1);BS.st=d.st|0;BS.tp=+d.tp||0;
if(!was){BS.x=BS.tx;BS.y=BS.ty;BS.a=BS.ta;BS.fl=0;feed.push({t:"Le Tong Tong Sahur est apparu !",l:6});drum()}else if(BS.hp<php)BS.fl=.05}
function bossHit(d){if(!BS.al||!(d>0))return;bhAcc+=d;me.bdm+=d;ptc(BS.x+(Math.random()-.5)*70,BS.y+(Math.random()-.5)*70,'#ffb347')}
function bossPush(o,r){if(!BS.al)return;const dx=o.x-BS.x,dy=o.y-BS.y,d=Math.hypot(dx,dy),m=BS.r+r;if(d<m){const k=d>.01?1/d:0;o.x=BS.x+(d>.01?dx*k:1)*m;o.y=BS.y+(d>.01?dy*k:0)*m}}
function bossDead(){if(SV.mode!=2)return;for(let i=0;i<90;i++)ptc(BS.x+(Math.random()-.5)*100,BS.y+(Math.random()-.5)*100,i%3?'#ffb347':'#fff3b0');BS.al=0;const nw=!SV.xs;SV.xs=1;gain(BOSS_XP,BOSS_COINS);BAN={t0:performance.now(),dur:11000,nw};feed.push({t:"Tong Tong Sahur vaincu !",l:6});drum()}
function evUpd(dt){
if(bhAcc>0&&(bhT-=dt)<=0){bhT=.1;let n=0;while(bhAcc>=1&&n++<4){const x=Math.min(360,Math.floor(bhAcc));bhAcc-=x;net.send('bd',{d:x})}if(bhAcc<1)bhAcc=0}
if(BS.al){const f=1-Math.exp(-dt*14);BS.x+=(BS.tx-BS.x)*f;BS.y+=(BS.ty-BS.y)*f;BS.a+=angd(BS.ta,BS.a)*f;BS.fl-=dt}}
function bossTp(d){for(let i=0;i<30;i++)ptc(BS.x+(Math.random()-.5)*90,BS.y+(Math.random()-.5)*90,i%2?'#d9a766':'#5a3a62');BS.x=BS.tx=+d.x||0;BS.y=BS.ty=+d.y||0;for(let i=0;i<30;i++)ptc(BS.x+(Math.random()-.5)*90,BS.y+(Math.random()-.5)*90,i%2?'#fff3b0':'#ff8ad8');if(AC&&!mute)tone(260,AC.currentTime,.3,'triangle',.14)}
function drawBoss(){if(!BS.al)return;const x=BS.x-cam.x,y=BS.y-cam.y;if(x<-320||x>W+320||y<-320||y>H+320)return;
const r=BS.r,e=t=>t*t*(3-2*t),tp=BS.tp;g.save();g.translate(x,y);
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(10,14,r,r*.88,0,0,7);g.fill();
if(BS.st==1){g.fillStyle='rgba(255,40,40,'+(.1+.3*tp)+')';g.beginPath();g.moveTo(0,0);g.arc(0,0,BREACH,BS.a-BARC/2,BS.a+BARC/2);g.closePath();g.fill();g.strokeStyle='rgba(255,110,110,'+(.5+.4*tp)+')';g.lineWidth=3;g.stroke()}
g.rotate(BS.a);
let an;if(BS.st==1)an=-.9+(-BARC/2-.5+.9)*e(tp);else if(BS.st==2)an=-BARC/2-.5+(BARC+.5)*tp;else if(BS.st==3)an=BARC/2+(-.9-BARC/2)*e(tp);else an=-.9+Math.sin(tt*5)*.05;
if(BS.st==2){g.strokeStyle='rgba(255,230,180,'+(.55*(1-tp))+')';g.lineWidth=18;g.lineCap='round';g.beginPath();g.arc(0,0,BREACH-34,-BARC/2-.5,an);g.stroke();g.lineCap='butt'}
g.save();g.rotate(an);g.fillStyle='#dcae70';g.strokeStyle='#4a2c10';g.lineWidth=4;g.beginPath();g.moveTo(r*.5,-7);g.lineTo(r*.5+70,-9);g.lineTo(BREACH-16,-19);g.arc(BREACH-16,0,19,-Math.PI/2,Math.PI/2);g.lineTo(r*.5+70,9);g.lineTo(r*.5,7);g.closePath();g.fill();g.stroke();
g.strokeStyle='rgba(74,44,16,.55)';g.lineWidth=3;for(const k of[26,44,62]){g.beginPath();g.moveTo(BREACH-16-k,-12);g.lineTo(BREACH-16-k,12);g.stroke()}g.restore();
const bob=BS.st==0?1+Math.sin(tt*9)*.014:1;g.scale(bob,bob);
const gr=g.createRadialGradient(-r*.25,-r*.25,r*.1,0,0,r);gr.addColorStop(0,'#e8bb82');gr.addColorStop(1,'#a56b30');g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,7);g.fill();
g.strokeStyle='rgba(90,50,15,.4)';g.lineWidth=3;for(const k of[.32,.52,.72,.88]){g.beginPath();g.arc(0,0,r*k,0,7);g.stroke()}
g.strokeStyle='#3b2410';g.lineWidth=6;g.beginPath();g.arc(0,0,r,0,7);g.stroke();
if(BS.fl>0){g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(0,0,r,0,7);g.fill()}
for(const q of[-1,1]){g.fillStyle='#fff';g.strokeStyle='#3b2410';g.lineWidth=4;g.beginPath();g.arc(r*.42,q*r*.34,r*.23,0,7);g.fill();g.stroke();g.fillStyle=BS.st==1?'#c01010':'#111';g.beginPath();g.arc(r*.5,q*r*.33,r*.1,0,7);g.fill()}
g.strokeStyle='#2a1508';g.lineWidth=6;g.lineCap='round';g.beginPath();g.arc(r*.35,0,r*.3,-.95,.95);g.stroke();g.lineCap='butt';
g.save();g.rotate(an);g.fillStyle='#c98f50';g.strokeStyle='#3b2410';g.lineWidth=4;g.beginPath();g.arc(r*.92,0,15,0,7);g.fill();g.stroke();g.restore();
g.restore()}
function drawTop(){
if(SV.mode==2){const bw=420,bx=W/2-bw/2,by=30;g.textAlign='center';
if(BS.al){const f=Math.max(0,Math.min(1,BS.hp/BS.mh));g.font='bold 16px Trebuchet MS,sans-serif';g.fillStyle='#f0e6d0';g.fillText('TONG TONG SAHUR',W/2,24);g.fillStyle='#000a';g.fillRect(bx-3,by-3,bw+6,22);g.fillStyle='#2a0d0d';g.fillRect(bx,by,bw,16);const gr=g.createLinearGradient(bx,0,bx+bw,0);gr.addColorStop(0,'#ff3b3b');gr.addColorStop(1,'#ff9a3c');g.fillStyle=gr;g.fillRect(bx,by,bw*f,16);g.strokeStyle='#e9d9a8';g.lineWidth=2;g.strokeRect(bx,by,bw,16);g.font='bold 12px Trebuchet MS,sans-serif';g.fillStyle='#fff';g.fillText(Math.ceil(BS.hp)+' / '+BS.mh,W/2,by+13)}
else{g.font='bold 15px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText("En attente du boss…",W/2,by+12)}
g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n+' — Événement spécial'+(me.bdm>0?'  ·  Tes dégâts : '+Math.round(me.bdm):''),W/2,64);return}
g.textAlign='center';g.font='bold 24px Trebuchet MS,sans-serif';g.fillStyle=ph.left<30?'#ff8a6a':'#f0e6d0';g.fillText(fmt(ph.left),W/2,30);g.font='12px Trebuchet MS,sans-serif';g.fillStyle='#8f9bb3';g.fillText(MAPS[mi].n+(SV.mode==1?' — Classé · '+RANKS[SV.rk.r].n+' '+SV.rk.rr+' RR':' — Classique'),W/2,46)}
function drawBanner(){if(!BAN)return;const k=(performance.now()-BAN.t0)/BAN.dur;if(k>=1){BAN=null;return}
g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=Math.min(1,k*10,(1-k)*5);g.fillStyle='rgba(8,6,16,.9)';g.fillRect(130,120,700,230);g.strokeStyle=rbw(130,120,700,230);g.lineWidth=5;g.strokeRect(130,120,700,230);
g.textAlign='center';g.fillStyle=rbw(130,150,700,40);g.font='bold 40px'+F2;g.fillText('TONG TONG SAHUR VAINCU !',W/2,184);
g.fillStyle='#ffe58a';g.font='bold 26px'+F2;g.fillText('+'+BOSS_COINS+' pièces   ·   +'+BOSS_XP+' XP',W/2,234);
g.fillStyle='#f0e6d0';g.font='18px'+F2;g.fillText(BAN.nw?'Nouveau personnage secret débloqué : Tong Tong Sahur !':'Récompenses reçues pour avoir participé au combat',W/2,278);
if(BAN.nw){g.fillStyle='#9aa7bd';g.font='14px'+F2;g.fillText('Retrouve-le dans le choix du personnage et dans la boutique (onglet Exclusif)',W/2,312)}g.restore()}

// ---- Capacités : Tong Tong Sahur (dans le dos), Chamber (sniper), batte ----
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
for(const o of DP)if(['tur','bot','trap','tp'].includes(o.k)&&o.own!==(myPeer||'me')&&Math.hypot(o.x-me.x,o.y-me.y)<s.mr+10&&hitAng(o.x,o.y,.4)){o.hp-=dm;ptc(o.x,o.y,'#ff9')}
if(BS.al){const d=Math.hypot(BS.x-me.x,BS.y-me.y);if(d-BS.r<s.mr&&hitAng(BS.x,BS.y,Math.asin(Math.min(1,BS.r/Math.max(d,1)))))bossHit(dm)}
for(let i=0;i<8;i++)ptc(me.x+Math.cos(a)*50,me.y+Math.sin(a)*50,'#e8c89a')}
function doSniper(s){me.sn=0;me.ab=s.acd;const as=[me.a];shoot(me.x,me.y,as,me.c,true,myPeer||'me',0,0,0,0,1);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0,lz:0,gd:0,d:0,sn:1});for(let i=0;i<14;i++)ptc(me.x+Math.cos(me.a)*30,me.y+Math.sin(me.a)*30,'#ffe066')}

// ---- Dessin : armes (pistolet / sniper / batte), ange du god mode, aura Phénix ----
function wpn(s,ex){ex=ex||{};
if(s.ml){const sw=ex.sw>0?1-ex.sw/.25:-1,an=sw<0?.55:-s.ma+sw*2*s.ma;
if(sw>=0){g.save();g.strokeStyle='rgba(255,240,200,'+(.5*(1-sw))+')';g.lineWidth=7;g.lineCap='round';g.beginPath();g.arc(0,0,s.mr-8,-s.ma,an);g.stroke();g.restore()}
g.save();g.rotate(an);g.fillStyle='#d9a766';g.strokeStyle='#5a3a18';g.lineWidth=2;g.beginPath();g.moveTo(s.r-3,-2.5);g.lineTo(s.r+s.L*.55,-3);g.lineTo(s.r+s.L,-7);g.arc(s.r+s.L,0,7,-Math.PI/2,Math.PI/2);g.lineTo(s.r+s.L*.55,3);g.lineTo(s.r-3,2.5);g.closePath();g.fill();g.stroke();g.fillStyle='#8a5a2a';g.fillRect(s.r-3,-3,8,6);g.restore();return}
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
let admP=0;
const admItems=()=>admP==1?[...SKINS.map((k,i)=>[k.n,i]).slice(1),...PACKS.map((q,i)=>['Pack '+q.n,100+i])]:CH.map((c,i)=>[c.n,i]);
const admPk=k=>({x:30+(k%5)*180,y:92+Math.floor(k/5)*46,w:172,h:38});
function drawAdmPick(){g.fillStyle='rgba(5,7,11,.98)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#ffb347';g.font='bold 24px'+F2;
g.fillText((admP==1?'Donner un skin à ':'Donner un personnage à ')+tag(admSel===(myPeer||'me')?'me':admSel),W/2,52);
admItems().forEach(([n,v],k)=>{const r=admPk(k);g.fillStyle='#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=inB(r,M.x,M.y)?'#fff':'#a55';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#ffd9c9';g.font='14px'+F2;g.fillText(n,r.x+r.w/2,r.y+24)});
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('Clique pour donner — Échap pour revenir',W/2,H-34)}
const PRICE={1:25,2:25,3:25,4:25,7:25,8:25,9:25,11:25,12:25,13:25,14:40},PASSCH={0:10,5:16,6:22,10:30},ST={1:5,2:12,3:18,4:24,5:28},TIERS=30;
const SKINS=[{n:'Classique',c:null},{n:'Néon',c:'#39ff88'},{n:'Or',c:'#ffd24a'},{n:'Givre',c:'#9fe6ff'},{n:'Lave',c:'#ff5a2a'},{n:'Royal',c:'#c36bff'}];
const ABN={rewind:'Retour dans le temps',tur:'Tourelle',trap:'Piège',bot:'Mini-bot',flash:'Flash',invis5:'Invisible 5 s',tp:'Téléporteurs',regen:'Régénération',ixz:'Zone anti-pouvoirs',dash:'Dash',inv:'Invincible',salvo:'Salve de roquettes',wall:'Murs cassables',shield4:'Bouclier 25 %',sniper:'Sniper one-shot',behind:'Dans le dos'};
const ABD={rewind:'Pose un point : 5 s après, retour au point avec tes PV d\'avant. Mort annulée pendant le pouvoir',tur:'Pose une tourelle fragile qui tire lentement',trap:'Piège : au passage d\'un ennemi, zone de dégâts 5 s',bot:'Mini-bot qui tire sur les autres 5 s',flash:'Aveugle les joueurs dans ton champ de vision 5 s',invis5:'Invisible pendant 5 s',tp:'Pose 2 téléporteurs ; le 3e efface le 1er',regen:'Régénère de la vie pendant 6 s',ixz:'Grande zone qui bloque et détruit tous les pouvoirs',dash:'Dash rapide dans la direction visée',inv:'Invincible 5 s, mais tir impossible',salvo:'Tir principal : roquettes. Pouvoir : salve de 3',wall:'Crée un mur cassable devant toi',shield4:'Bouclier de 25 % de tes PV pendant 10 s',sniper:"Équipe un sniper actif jusqu'au tir de son unique balle, qui tue en un coup",behind:"Se téléporte dans le dos du joueur ou bot le plus proche visible à l'écran"};
let SV={coins:25,xp:0,ct:0,bought:[],skin:0,name:'Joueur'+(100+Math.floor(Math.random()*900)),track:0,vol:.6,packs:[],eq:{},ctl:0,mode:0,rk:{r:0,rr:0},gs:[],xs:0,uid:'u'+Math.random().toString(36).slice(2,12)};try{Object.assign(SV,JSON.parse(localStorage.getItem('arena_sv3')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('arena_sv3',JSON.stringify(SV))}catch(e){}};
const tier=()=>Math.min(TIERS,Math.floor(SV.xp/100));
const owned=i=>SV.bought.includes(i)||(PASSCH[i]!=null&&tier()>=PASSCH[i])||(!!CH[i].sec&&SV.xs>0);
const ownedSkin=i=>i==0||tier()>=ST[i]||SV.gs.includes(i);
function reward(t){for(const i in PASSCH)if(PASSCH[i]==t)return{k:'ch',l:CH[i].n};for(const i in ST)if(ST[i]==t)return{k:'sk',l:SKINS[i].n};const v=3+(t%4)*2;return{k:'co',v,l:'+'+v}}
function gain(xp,co){SV.coins+=co;SV.xp+=xp;const t=tier();while(SV.ct<t){SV.ct++;const r=reward(SV.ct);if(r.k=='co')SV.coins+=r.v;feed.push({t:'Palier '+SV.ct+' : '+(r.k=='co'?r.l+' pièces':r.l+' débloqué !'),l:6})}save()}
const cardPos=i=>({x:24+(i%5)*184,y:140+Math.floor(i/5)*160,w:176,h:150});
const inB=(p,x,y)=>x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h;
const OL=()=>CH.map((c,i)=>i).filter(owned);
const sp=k=>({x:24+(k%6)*154,y:126+Math.floor(k/6)*98,w:148,h:90}),shp=k=>({x:14+(k%7)*136,y:124+Math.floor(k/7)*196,w:130,h:188});
const F2=' Trebuchet MS,sans-serif';
function wrap(t,x,y,lh,n){(t.match(new RegExp('.{1,'+(n||21)+'}(\\s|$)','g'))||[t]).forEach((l,j)=>g.fillText(l.trim(),x,y+j*lh))}
const pkOf=ci=>PACKS.findIndex(q=>q.ch==ci&&SV.packs.includes(q.id)&&SV.eq[q.id]!==0)+1;
function miniChar(x,y,ci,sc,t){const s=CH[ci],pk=pkOf(ci);g.save();g.translate(x,y);g.scale(sc,sc);g.rotate(-.5+Math.sin(t)*.07);wpn(s,{});g.fillStyle=pk?PACKS[pk-1].col:SKINS[SV.skin].c||s.col;g.beginPath();g.arc(0,0,s.r,0,7);g.fill();g.strokeStyle=s.col=='#2b2b36'?'#aab6d0':'rgba(0,0,0,.5)';g.lineWidth=3;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(s.r*.35,-s.r*.35,2.4,0,7);g.arc(s.r*.35,s.r*.35,2.4,0,7);g.fill();drawDet(pk,s);g.restore()}
function drawSelScreen(){const o=OL(),dead=mode==2,F=F2;let hov=-1;o.forEach((ci,k)=>{if(inB(sp(k),M.x,M.y))hov=ci});
const acc=hov>=0?CH[hov].col:dead?'#ff5a5a':SV.mode==2?'#ff8ad8':SV.mode?'#ffd98a':'#7ad0ff';
g.setTransform(1,0,0,1,0,0);g.fillStyle='#070a12';g.fillRect(0,0,W,H);
let gr=g.createRadialGradient(W/2,H*.35,40,W/2,H*.35,620);gr.addColorStop(0,dead?'rgba(120,20,20,.45)':'rgba(40,60,110,.45)');gr.addColorStop(1,'rgba(7,10,18,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
if(hov>=0){g.globalCompositeOperation='lighter';gr=g.createRadialGradient(W/2,H*.5,20,W/2,H*.5,480);gr.addColorStop(0,acc+'33');gr.addColorStop(1,acc+'00');g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
g.fillStyle=acc;for(let i=0;i<46;i++){g.globalAlpha=.08+.08*Math.sin(tt+i);g.beginPath();g.arc((i*97.3+tt*(8+i%5*5))%W,((i*53.7-tt*(10+i%4*4))%H+H)%H,1.5+i%3,0,7);g.fill()}g.globalAlpha=1;
g.fillStyle='rgba(255,255,255,.04)';g.fillRect(0,0,W,118);g.globalAlpha=.6;g.fillStyle=acc;g.fillRect(0,117,W,2);g.globalAlpha=1;
g.textAlign='left';g.fillStyle=dead?'#ff6a6a':'#f0e6d0';g.font='bold 34px'+F;g.fillText(dead?'ÉLIMINÉ':'CHOIX DU PERSONNAGE',30,50);g.font='14px'+F;g.fillStyle='#9aa7bd';g.fillText((dead&&me.kby?'Tué par '+me.kby+'  ·  ':'')+MAPS[mi].n+'  ·  '+(SV.mode==2?'Événement spécial':fmt(ph.left)+' restantes'),30,74);
g.textAlign='right';g.fillStyle='#e9d9a8';g.font='bold 16px'+F;g.fillText('● '+SV.coins+' pièces',W-30,44);
if(SV.mode==2){g.fillStyle='#ff8ad8';g.font='bold 15px'+F;g.fillText('Événement spécial',W-30,76)}else if(SV.mode==1){badge(W-230,70,15,SV.rk.r);g.fillStyle=rankFill(SV.rk.r,W-100,120);g.font='bold 15px'+F;g.fillText('Classé · '+RANKS[SV.rk.r].n+' '+SV.rk.rr+' RR',W-30,76)}else{g.fillStyle='#7ad0ff';g.font='bold 15px'+F;g.fillText('Mode Classique',W-30,76)}
g.textAlign='center';
if(dead&&me.dt>0){g.fillStyle='#ffb3b3';g.font='bold 15px'+F;g.fillText('Réapparition dans '+Math.ceil(me.dt)+' s…',W/2,94);g.fillStyle='#2a1414';g.fillRect(W/2-120,102,240,6);g.fillStyle='#ff5a5a';g.fillRect(W/2-120,102,240*Math.max(0,1-me.dt/2),6)}
else if(hov>=0){const s=CH[hov];g.fillStyle=acc;g.font='bold 15px'+F;g.fillText(s.n+' — '+ABN[s.ab],W/2,94);g.fillStyle='#c5cfe0';g.font='13px'+F;g.fillText(ABD[s.ab],W/2,111)}
else{g.fillStyle='#8f9bb3';g.font='14px'+F;g.fillText('Passe la souris sur un personnage pour voir son pouvoir',W/2,102)}
drawSelect()}
const LK=()=>CH.some((c,i)=>c.sec&&!owned(i))?1:0;
const backR={x:14,y:10,w:116,h:34};
function drawBack(){g.setTransform(1,0,0,1,0,0);const h=inB(backR,M.x,M.y);g.fillStyle=h?'#2a3550':'#1a2236';g.fillRect(backR.x,backR.y,backR.w,backR.h);g.strokeStyle=h?'#fff':'#7ad0ff';g.lineWidth=2;g.strokeRect(backR.x,backR.y,backR.w,backR.h);g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 15px'+F2;g.fillText('← Retour',backR.x+backR.w/2,backR.y+23)}
function backClick(){if(!(psk||st||shop||bp)||!inB(backR,M.x,M.y))return 0;if(admP)admP=0;else bp=shop=st=psk=0;return 1}
function drawSelect(){const o=OL(),F=F2,dim=mode==2&&me.dt>0;g.globalAlpha=dim?.45:1;
o.forEach((ci,k)=>{const s=CH[ci],p=sp(k),h=inB(p,M.x,M.y)&&!dim,c=s.col=='#2b2b36'?'#aab6d0':s.col,y0=p.y-(h?3:0);
g.save();if(h){g.shadowColor=c;g.shadowBlur=22}const gr=g.createLinearGradient(0,y0,0,y0+p.h);gr.addColorStop(0,'#1f2a40');gr.addColorStop(1,'#0e1220');g.fillStyle=gr;g.fillRect(p.x,y0,p.w,p.h);g.restore();
const rb=s.sec?rbw(p.x,y0,p.w,p.h):0;g.fillStyle=rb||c;g.fillRect(p.x,y0,p.w,4);g.strokeStyle=rb||(h?'#fff':c);g.lineWidth=s.sec?(h?5:3.5):h?3:1.5;g.strokeRect(p.x,y0,p.w,p.h);if(s.sec){g.textAlign='left';g.fillStyle=rb;g.font='bold 9px'+F;g.fillText('★ SECRET',p.x+8,y0+16)}
miniChar(p.x+36,y0+40,ci,1.25,tt*2+k);
g.textAlign='right';g.fillStyle='#8f9bb3';g.font='bold 11px'+F;g.fillText(k<9?String(k+1):'',p.x+p.w-8,y0+18);
[['PV',s.hp/180,'#6fd16f'],['VIT',s.sp/300,'#7ad0ff']].forEach((b,j)=>{const by=y0+26+j*14;g.textAlign='left';g.fillStyle='#8f9bb3';g.font='9px'+F;g.fillText(b[0],p.x+72,by+7);g.fillStyle='#0b0f18';g.fillRect(p.x+94,by,44,6);g.fillStyle=b[2];g.fillRect(p.x+94,by,44*Math.min(1,b[1]),6)});
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 14px'+F;g.fillText(s.n,p.x+74,y0+70);g.font='11px'+F;g.fillStyle=c;g.fillText(ABN[s.ab],p.x+74,y0+84)});
if(LK()){const p=sp(o.length),y0=p.y;g.fillStyle='#120c1c';g.fillRect(p.x,y0,p.w,p.h);const rb=rbw(p.x,y0,p.w,p.h);g.fillStyle=rb;g.fillRect(p.x,y0,p.w,4);g.strokeStyle=rb;g.lineWidth=3.5;g.strokeRect(p.x,y0,p.w,p.h);g.textAlign='left';g.fillStyle=rb;g.font='bold 9px'+F;g.fillText('★ SECRET',p.x+8,y0+16);g.textAlign='center';g.fillStyle=rb;g.font='bold 44px'+F;g.fillText('?',p.x+40,y0+52);g.fillStyle='#f0e6d0';g.font='bold 14px'+F;g.fillText('???',p.x+74,y0+70);g.font='11px'+F;g.fillStyle='#9aa7bd';g.fillText('Bats le boss pour le débloquer',p.x+74,y0+84)}
[['🛒','Personnages (P)','#7ad0ff','Achète des personnages'],['🎨','Skins (K)','#ff9a3c','Packs de skins'],['🏆','Battle Pass (B)','#ffd98a','Palier '+tier()+' / '+TIERS],['⚙','Paramètres (O)','#aab6d0','Pseudo, musique…'],['🎮','Mode : '+['Classique','Classé','Événement'][SV.mode|0],'#9be39b','Clic pour changer']].forEach((b,j)=>{const p=sp(o.length+LK()+j),h=inB(p,M.x,M.y)&&!dim,y0=p.y-(h?3:0);g.save();if(h){g.shadowColor=b[2];g.shadowBlur=18}g.fillStyle='#161326';g.fillRect(p.x,y0,p.w,p.h);g.restore();g.strokeStyle=b[2];g.lineWidth=h?3:1.5;g.setLineDash([6,4]);g.strokeRect(p.x,y0,p.w,p.h);g.setLineDash([]);g.textAlign='center';g.font='26px'+F;g.fillStyle='#fff';g.fillText(b[0],p.x+74,y0+36);g.fillStyle=b[2];g.font='bold 14px'+F;g.fillText(b[1],p.x+74,y0+62);g.font='11px'+F;g.fillStyle='#9aa7bd';g.fillText(b[3],p.x+74,y0+78)});
g.globalAlpha=1;
if(!o.length){g.textAlign='center';g.fillStyle='#ffd98a';g.font='bold 16px'+F;g.fillText('Tu n\'as aucun personnage : ouvre « Personnages » (touche P) et achète-en un !',W/2,H-14)}}
function selClick(){const o=OL();o.forEach((ci,k)=>{if(inB(sp(k),M.x,M.y))pick(ci)});if(inB(sp(o.length+LK()),M.x,M.y))shop=1;if(inB(sp(o.length+LK()+1),M.x,M.y))psk=1;if(inB(sp(o.length+LK()+2),M.x,M.y))bp=1;if(inB(sp(o.length+LK()+3),M.x,M.y))st=1;if(inB(sp(o.length+LK()+4),M.x,M.y)){menuOpen=1;R={};net.send('join',{m:-1,uid:SV.uid})}}
let shopTab=0;
const SL=()=>CH.map((c,i)=>i).filter(i=>shopTab==2?!!CH[i].sec:CH[i].sec?false:shopTab?PASSCH[i]!=null:PASSCH[i]==null);
const tabR=i=>({x:80+i*270,y:80,w:260,h:34});
function drawShop(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#7ad0ff';g.font='bold 30px'+F2;g.fillText('Personnages',W/2,38);g.font='15px'+F2;g.fillStyle='#e9d9a8';g.fillText('● '+SV.coins+' pièces — 1 kill = 1 pièce'+(shopTab==1?'   ·   Battle Pass : palier '+tier()+' / '+TIERS:shopTab==2?"   ·   Exclusif : bats le boss de l'événement spécial pour le débloquer":''),W/2,64);
['Achetables','Battle Pass · par paliers','★ Exclusif · secret'].forEach((t,i)=>{const r=tabR(i),on=shopTab==i,c=i==2?rbw(r.x,r.y,r.w,r.h):i?'#ffd98a':'#7ad0ff';g.fillStyle=on?(i?'#3a2f10':'#10304a'):'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=on?c:inB(r,M.x,M.y)?'#fff':'#445';g.lineWidth=on?3:2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle=on?'#f0e6d0':'#9aa7bd';g.font=(on?'bold ':'')+'14px'+F2;g.fillText(t,r.x+r.w/2,r.y+22)});
SL().forEach((i,k)=>{const s=CH[i],p=shp(k),ow=owned(i),cx=p.x+65;g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=s.sec?rbw(p.x,p.y,p.w,p.h):ow?'#3fcf5a':s.col=='#2b2b36'?'#aab6d0':s.col;g.lineWidth=inB(p,M.x,M.y)?4:2;g.strokeRect(p.x,p.y,p.w,p.h);if(s.sec&&ow)miniChar(cx-10,p.y+34,i,1.25,tt*2);else if(s.sec){g.fillStyle='#0d121c';g.beginPath();g.arc(cx,p.y+30,24,0,7);g.fill();g.strokeStyle=rbw(cx-24,p.y+6,48,48);g.lineWidth=3;g.stroke();g.fillStyle=rbw(cx-24,p.y+6,48,48);g.textAlign='center';g.font='bold 32px'+F2;g.fillText('?',cx,p.y+42)}else{g.fillStyle=s.col;g.beginPath();g.arc(cx,p.y+30,s.r*1.2,0,7);g.fill();g.fillStyle='#1b1f2a';g.fillRect(cx+s.r*.8,p.y+27,s.L*.9,5)}g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 13px'+F2;const lk=s.sec&&!ow;g.fillText(lk?'???':s.n,cx,p.y+66);g.font='11px'+F2;g.fillStyle=lk?'#9aa7bd':s.col=='#2b2b36'?'#aab6d0':s.col;g.fillText(lk?'Pouvoir secret':ABN[s.ab],cx,p.y+82);g.fillStyle='#9aa7bd';wrap(lk?"Bats le boss de l'événement spécial pour le débloquer":ABD[s.ab],cx,p.y+98,13);
if(shopTab==1&&!ow){g.fillStyle='#0d121c';g.fillRect(p.x+15,p.y+158,100,6);g.fillStyle='#ffd98a';g.fillRect(p.x+15,p.y+158,100*Math.min(1,tier()/PASSCH[i]),6)}
g.font='bold 12px'+F2;g.fillStyle=ow?'#3fcf5a':'#ffd98a';g.fillText(ow?'✔ '+(shopTab?'Débloqué':'Possédé'):shopTab==2?'🔒 Secret':shopTab?'🔒 Palier '+PASSCH[i]:'🔒 '+PRICE[i]+' pièces'+(SV.coins>=PRICE[i]?' — acheter':''),cx,p.y+178)});
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('P ou Échap pour fermer — Tab ou clic sur un onglet pour changer de liste',W/2,H-10)}
function shopClick(){for(let i=0;i<3;i++)if(inB(tabR(i),M.x,M.y))shopTab=i;SL().forEach((ci,k)=>{if(inB(shp(k),M.x,M.y)&&!owned(ci)&&PRICE[ci]&&SV.coins>=PRICE[ci]){SV.coins-=PRICE[ci];SV.bought.push(ci);save()}})}
const los=(x1,y1,x2,y2)=>{const n=Math.ceil(Math.hypot(x2-x1,y2-y1)/24);for(let i=1;i<n;i++)if(hitW(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n))return false;return true};
const inIx=(x,y)=>DP.some(o=>o.k=='ixz'&&o.l>0&&Math.hypot(x-o.x,y-o.y)<170);
function target(o){let b=null,bd=520;const c=(x,y)=>{const d=Math.hypot(x-o.x,y-o.y);if(d<bd&&los(o.x,o.y,x,y)){bd=d;b={x,y}}};if(SV.mode!=2)for(const k in R){const r=R[k];if(r.al&&!r.iv)c(r.x,r.y)}if(BS.al)c(BS.x,BS.y);for(const q of bots)if(q.hp>0)c(q.x,q.y);return b}
function initDp(o){Object.assign(o,{tur:{hp:40,l:30,cd:.6},bot:{hp:25,l:5,cd:.3},trap:{hp:15,l:90,cd:0},tp:{hp:50,l:180,cd:0},ixz:{hp:9e9,l:8,cd:0},bw:{hp:60,l:25,cd:0}}[o.k]);if(o.k=='bw'){o.w=o.ho?110:24;o.h=o.ho?24:110}return o}
function addDp(o){if(!['tur','bot','trap','tp','ixz','bw'].includes(o.k))return;if(o.k!='ixz'&&inIx(o.x,o.y))return;if(o.k=='tp'){const m=DP.filter(q=>q.k=='tp'&&q.own==o.own);if(m.length>=2)m[0].l=0}if(DP.length<60)DP.push(o)}
function dep(k,x,y,ho){const id=(myPeer||'me')+':'+(++dpn),o=initDp({id,k,x,y,ho:ho?1:0,own:myPeer||'me'});addDp(o);snd('dep',{id,k,x,y,ho:ho?1:0})}
function useAb(s,dx,dy,l){const A=s.ab,at=me.a;if(inIx(me.x,me.y)&&A!='ixz'){me.ab=0;return}
if(A=='roll'){me.ro=.22;me.ri=.22;me.rs=640;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='dash'){me.ro=.18;me.rs=1100;me.rx=dx?dx/l:Math.cos(at);me.ry=dx||dy?dy/l:Math.sin(at)}
else if(A=='invis')me.iv=3.5;else if(A=='invis5')me.iv=5;else if(A=='shield')me.sh=2.5;else if(A=='inv')me.inv=5;
else if(A=='shield4'){me.bn=Math.round(s.hp/4);me.bt=10}else if(A=='regen')me.rg=6;
else if(A=='rewind'){me.pt={x:me.x,y:me.y,hp:me.hp,t:5};snd('pw',{x:Math.round(me.x),y:Math.round(me.y)});for(let i=0;i<30;i++)ptc(me.x,me.y,i%2?'#ff8a3c':'#ffd23a')}
else if(A=='flash'){snd('flash',{x:me.x,y:me.y,a:me.a,sc:packId()=='hal'?1:0});for(let i=0;i<30;i++)ptc(me.x,me.y,'#fff')}
else if(A=='salvo'){const as=[at-.22,at,at+.22];shoot(me.x,me.y,as,me.c,true,myPeer||'me',0);snd('shot',{x:me.x,y:me.y,as,c:me.c,g:0})}else if(A=='wall'){const hz=Math.abs(Math.cos(at))<Math.abs(Math.sin(at))?1:0;dep('bw',me.x+Math.cos(at)*70,me.y+Math.sin(at)*70,hz)}
else if(A=='sniper'){me.sn=1;me.ab=1e9;me.cd=.5;feed.push({t:'Sniper équipé : une seule balle !',l:3});for(let i=0;i<16;i++)ptc(me.x,me.y,'#ffe066')}else if(A=='behind')tpBehind(s);else dep(A,me.x,me.y)}
function drawDP(){for(const o of DP){const sx=o.x-cam.x,sy=o.y-cam.y;if(sx<-200||sx>W+200||sy<-200||sy>H+200)continue;const mine=o.own===(myPeer||'me');g.save();g.translate(sx,sy);
if(o.k=='ixz'){g.fillStyle='rgba(63,207,90,'+(.08+.04*Math.sin(tt*4))+')';g.beginPath();g.arc(0,0,170,0,7);g.fill();g.strokeStyle='rgba(63,207,90,.8)';g.lineWidth=3;g.setLineDash([12,10]);g.lineDashOffset=-tt*20;g.beginPath();g.arc(0,0,170,0,7);g.stroke();g.setLineDash([])}
else if(o.k=='tp'){g.fillStyle='#000a';g.fillRect(-12,-24,24,4);g.fillStyle='#c9a0ff';g.fillRect(-12,-24,24*Math.max(0,o.hp/50),4);g.strokeStyle='#c9a0ff';g.lineWidth=3;for(let j=0;j<3;j++){g.beginPath();g.arc(0,0,8+j*5+Math.sin(tt*6+j)*2,0,7);g.stroke()}}
else if(o.k=='trap'){if(o.act>0){g.fillStyle='rgba(58,123,255,'+(.25+.1*Math.sin(tt*10))+')';g.beginPath();g.arc(0,0,70,0,7);g.fill();g.strokeStyle='#8fb4ff';g.lineWidth=2;g.stroke()}else{g.globalAlpha=mine?.9:.3;g.fillStyle='#3a7bff';g.beginPath();g.moveTo(-9,7);g.lineTo(0,-9);g.lineTo(9,7);g.fill()}}
else if(o.k=='bw'){g.fillStyle='#5a4396';g.fillRect(-o.w/2,-o.h/2,o.w,o.h);g.strokeStyle='#c9a3ff';g.lineWidth=2;g.strokeRect(-o.w/2,-o.h/2,o.w,o.h);if(o.hp<40){g.strokeStyle='rgba(0,0,0,.5)';g.beginPath();g.moveTo(-o.w/2+4,-o.h/2+4);g.lineTo(0,2);g.lineTo(o.w/2-4,o.h/2-4);g.stroke()}g.fillStyle='#000a';g.fillRect(-14,-3,28,4);g.fillStyle='#c9a3ff';g.fillRect(-14,-3,28*Math.max(0,o.hp/60),4)}
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
if(m.lv)for(const r of m.lv){g.fillStyle='#6b1a08';g.fillRect(r[0],r[1],r[2],r[3]);g.fillStyle='#e2531a';const n=Math.ceil(r[2]*r[3]/2200);for(let k=0;k<n;k++){const px=r[0]+((k*97+Math.sin(tt*.8+k)*14+r[2]*5)%r[2]+r[2])%r[2],py=r[1]+((k*57+Math.cos(tt*.7+k)*10+r[3]*5)%r[3]+r[3])%r[3];g.globalAlpha=.55;g.beginPath();g.arc(px,py,10+Math.sin(tt*2+k)*4,0,7);g.fill()}g.globalAlpha=1;g.strokeStyle='#ffb347';g.lineWidth=3;g.strokeRect(r[0],r[1],r[2],r[3]);g.globalCompositeOperation='lighter';const cx=r[0]+r[2]/2,cy=r[1]+r[3]/2,gr=g.createRadialGradient(cx,cy,10,cx,cy,Math.max(r[2],r[3])*.9);gr.addColorStop(0,'rgba(255,110,30,.25)');gr.addColorStop(1,'rgba(255,110,30,0)');g.fillStyle=gr;g.fillRect(r[0]-r[2],r[1]-r[3],r[2]*3,r[3]*3);g.globalCompositeOperation='source-over'}
PLT.forEach(p=>{g.save();g.translate(p.x,p.y);g.fillStyle=p.s==3?'#1a1a22':'#2a2a38';g.beginPath();g.arc(0,0,22,0,7);g.fill();g.strokeStyle=p.s==1?'#ff5a4a':'#555a70';g.lineWidth=3;g.stroke();
if(p.s==1){g.fillStyle='rgba(255,70,60,'+(.3+.3*Math.sin(tt*30))+')';g.beginPath();g.arc(0,0,22,0,7);g.fill()}
if(p.s==2){g.fillStyle='#e8e8f0';for(let k=0;k<8;k++){const a=k*Math.PI/4;g.beginPath();g.moveTo(Math.cos(a)*10-Math.sin(a)*4,Math.sin(a)*10+Math.cos(a)*4);g.lineTo(Math.cos(a)*40,Math.sin(a)*40);g.lineTo(Math.cos(a)*10+Math.sin(a)*4,Math.sin(a)*10-Math.cos(a)*4);g.fill()}}
g.restore()});
for(const ob of orbList()){const c=ORBC[ob.t];g.save();g.translate(ob.x,ob.y);g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(0,0,2,0,0,60);gr.addColorStop(0,'rgba('+c+',.6)');gr.addColorStop(1,'rgba('+c+',0)');g.fillStyle=gr;g.fillRect(-60,-60,120,120);g.globalCompositeOperation='source-over';g.fillStyle='rgb('+c+')';g.beginPath();g.arc(0,0,10+Math.sin(tt*6+ob.k)*2,0,7);g.fill();g.strokeStyle='rgb('+c+')';g.lineWidth=2;g.beginPath();g.arc(0,0,20,tt*3,tt*3+4);g.stroke();g.fillStyle='#fff';g.font='bold 10px Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(ORBL[ob.t],0,-28);g.restore()}}
const stR=i=>({x:200,y:80+i*44,w:560,h:38});
const admList=()=>[['Moi',myPeer||'me'],...Object.keys(R).map(k=>[tag(k),k])].slice(0,8);
const admBtn=k=>({x:14+(k%6)*156,y:408+Math.floor(k/6)*40,w:150,h:34});
function drawSt(){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(5,7,11,.97)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#c5cfe0';g.font='bold 30px'+F2;g.fillText('Paramètres',W/2,48);
['Pseudo : '+SV.name+'   (clic pour changer)','Musique : '+TRACKS[SV.track].n+'   (clic pour changer)','Volume : '+Math.round(SV.vol*100)+' %   (clic pour changer)','Mode admin : '+(adm?'✔ actif':'entrer la clé secrète'),'Contrôles : '+(SV.ctl?'Clavier — tir dans la direction de marche (J / F)':'Souris — viser avec la souris')].forEach((t,i)=>{const r=stR(i);g.fillStyle='#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=inB(r,M.x,M.y)?'#fff':'#334';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font='16px'+F2;g.fillText(t,W/2,r.y+27)});
if(adm){if(!admSel)admSel=myPeer||'me';g.fillStyle='#ff9a6a';g.font='bold 15px'+F2;g.fillText('Panneau admin — visible uniquement pour toi : choisis un joueur',W/2,304);
admList().forEach(([n,id],k)=>{const r={x:40+(k%4)*224,y:312+Math.floor(k/4)*38,w:212,h:32};g.fillStyle=admSel===id?'#3a2a1a':'#161d2a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=admSel===id?'#ffb347':'#334';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle='#f0e6d0';g.font='14px'+F2;g.fillText(n,r.x+106,r.y+21)});
['Tuer','Soigner','+100 pièces','+100 XP','+30 RR','God mode'+(admSel===(myPeer||'me')?(me.god?' : ON':' : OFF'):' (bascule)'),'-100 pièces','-100 XP','-30 RR','Réinitialiser','Événement : '+(BOSSUP?'ON':'OFF'),'Respawn boss','Donner un skin','Donner un perso'].forEach((t,k)=>{const r=admBtn(k),ev=k>=10&&k<=11;g.fillStyle=ev?'#2a1a30':'#2a1a1a';g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=inB(r,M.x,M.y)?'#fff':ev?'#d36bff':'#a55';g.lineWidth=2;g.strokeRect(r.x,r.y,r.w,r.h);g.fillStyle=ev?'#f3d0ff':'#ffd9c9';g.font='13px'+F2;g.fillText(t,r.x+r.w/2,r.y+22)});
if(admP)drawAdmPick()}
g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText('O ou Échap pour fermer',W/2,H-10)}
function admSend(a,v){if(!admSel)return;if(admSel===(myPeer||'me'))netAdm({act:a,v});else net.adm(admSel,a,v)}
function stClick(){if(admP){admItems().forEach(([n,v],k)=>{if(inB(admPk(k),M.x,M.y)){admSend(admP==1?'givesk':'givech',v);admP=0}});return}const R0=[0,1,2,3,4].findIndex(i=>inB(stR(i),M.x,M.y));
if(R0==0){const v=prompt('Ton pseudo (14 caractères max)',SV.name);if(v&&v.trim()){SV.name=v.trim().slice(0,14);save();pres()}}
else if(R0==1){SV.track=(SV.track+1)%TRACKS.length;save();restartMusic()}
else if(R0==2){SV.vol=SV.vol>=1?.2:Math.round((SV.vol+.2)*10)/10;save();setVol()}
else if(R0==3&&!adm){const k=prompt('Clé admin');if(k)net.adminLogin(k)}else if(R0==4){SV.ctl=SV.ctl?0:1;save()}
if(adm){admList().forEach(([n,id],k)=>{if(inB({x:40+(k%4)*224,y:312+Math.floor(k/4)*38,w:212,h:32},M.x,M.y))admSel=id});
const B=k=>inB(admBtn(k),M.x,M.y);
if(B(0))admSend('kill',0);if(B(1))admSend('heal',0);if(B(2))admSend('coins',100);if(B(3))admSend('xp',100);if(B(4))admSend('rr',30);if(B(5))admSend('god',0);if(B(6))admSend('coins',-100);if(B(7))admSend('xp',-100);if(B(8))admSend('rr',-30);
if(B(9)&&admSel&&(typeof confirm!='function'||confirm('Réinitialiser le compte de ce joueur ? (pièces, XP, rang, personnages, skins)')))admSend('reset',0);
if(B(10))net.send('ev',{on:BOSSUP?0:1});if(B(11))net.send('evspawn',{});if(B(12)&&admSel)admP=1;if(B(13)&&admSel)admP=2}}
function netAdmin(ok){adm=ok;feed.push({t:ok?'Mode admin activé':'Clé refusée',l:4})}
function netAdm(d){const a=d.act,v=+d.v||0;if(a=='god'){me.god=me.god?0:1;feed.push({t:me.god?'God mode activé (admin)':'God mode désactivé',l:4});pres()}else if(a=='givech'){const i=v|0;if(i>=0&&i<CH.length&&!owned(i)){SV.bought.push(i);save()}feed.push({t:'Personnage offert : '+(CH[i]?CH[i].n:'?'),l:5})}else if(a=='givesk'){const i=v|0;if(i>=100&&PACKS[i-100]){const q=PACKS[i-100];if(!SV.packs.includes(q.id))SV.packs.push(q.id);SV.eq[q.id]=1;feed.push({t:'Skin offert : Pack '+q.n,l:5})}else if(SKINS[i]&&i>0){if(!SV.gs.includes(i))SV.gs.push(i);SV.skin=i;feed.push({t:'Skin offert : '+SKINS[i].n,l:5})}save();pres()}else if(a=='kill'){me.pt=null;me.inv=0;me.ri=0;if(me.al)hurtMe(9999,'env')}else if(a=='heal'){if(me.al)me.hp=CH[me.c].hp}else if(a=='coins'){SV.coins=Math.max(0,SV.coins+v);save()}else if(a=='xp'){if(v>=0)gain(v,0);else{SV.xp=Math.max(0,SV.xp+v);save()}}else if(a=='rr'){applyRR(v);feed.push({t:(v>=0?'+':'')+v+' RR (admin)',l:4});postLB()}else if(a=='reset'){SV.coins=25;SV.xp=0;SV.ct=0;SV.bought=[];SV.skin=0;SV.packs=[];SV.eq={};SV.gs=[];SV.xs=0;SV.rk={r:0,rr:0};save();if(me.al){me.al=0;mode=0;clrTp()}me.pt=null;feed.push({t:'Ton compte a été réinitialisé',l:5});pres()}}
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
function clrTp(){DP=DP.filter(o=>!(o.k=='tp'&&o.own===(myPeer||'me')));snd('rm',{k:'tp'})}
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
const segD=(px,py,x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;let t=((px-x1)*dx+(py-y1)*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(px-x1-dx*t,py-y1-dy*t)};
const hitS=(x1,y1,x2,y2)=>{const n=Math.max(3,Math.ceil(Math.hypot(x2-x1,y2-y1)/20));for(let i=0;i<=n;i++)if(hitW(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n))return 1;return 0};
function rankFill(r,x,w){if(r<7)return RANKS[r].c;const o=(tt*70)%80,gr=g.createLinearGradient(x-w/2-80+o,0,x+w/2+80+o,0);for(let i=0;i<=8;i++)gr.addColorStop(i/8,i%2?'#ffd24a':'#ffffff');return gr}
function badge(x,y,z,r){g.save();g.translate(x,y);g.fillStyle=rankFill(r,0,z*2);g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.beginPath();g.moveTo(0,-z);g.lineTo(z*.85,-z*.35);g.lineTo(z*.85,z*.35);g.lineTo(0,z);g.lineTo(-z*.85,z*.35);g.lineTo(-z*.85,-z*.35);g.closePath();g.fill();g.stroke();g.fillStyle='rgba(0,0,0,.55)';g.font='bold '+Math.round(z*.9)+'px'+F2;g.textAlign='center';g.fillText(String(r+1),0,z*.32);g.restore()}
function applyRR(d){const k=SV.rk;k.rr+=d;while(k.rr>=100&&k.r<7){k.rr-=100;k.r++}while(k.rr<0){if(k.r==0)k.rr=0;else{k.r--;k.rr+=100}}save()}
function rrDelta(n,p){if(n<=1)n=4;if(n==2)return p==1?30:-10;if(n==3)return p==1?30:p==2?20:-10;return p==1?30:p==2?20:p==3?10:-10}
function standings(){const L=[{id:myPeer||'me',k:me.k,d:me.dth||0,me:1}];for(const k in R){const o=R[k];if(o.md==1&&o.pl)L.push({id:k,k:o.k,d:o.dd||0})}if(L.length==1)bots.forEach((b,i)=>L.push({id:'bot:'+i,k:b.k||0,d:b.d||0}));L.sort((a,b)=>b.k-a.k||a.d-b.d||(String(a.id)<String(b.id)?-1:1));return L}
function botRR(){if(SV.mode!=1||!me.pl||(me.brr||0)>=10)return;me.brr=(me.brr||0)+2;applyRR(2);feed.push({t:'+2 RR (bot tué)',l:3})}
function postLB(){if(SV.rk.r+SV.rk.rr>0)net.send('lb_post',{uid:SV.uid,name:SV.name,r:SV.rk.r,rr:SV.rk.rr})}
function rankEnd(id){id=id==null?ph.id:id;if(SV.mode!=1||!me.pl||rkDone===id)return;rkDone=id;const L=standings(),pos=L.findIndex(x=>x.me)+1,n=L.length;let d=rrDelta(n,pos);if(n<2||(me.late&&d<0))d=0;const old={r:SV.rk.r,rr:SV.rk.rr};applyRR(d);rkRes={pos,n,d,old,bot:me.brr||0,nw:{r:SV.rk.r,rr:SV.rk.rr}};postLB()}
function netLB(l){LB=Array.isArray(l)?l.slice(0,10).map(e=>({n:String(e.n||'?').slice(0,14),r:+e.r||0,b:+e.b||0})):[]}
function drawRankRes(){const F=F2;if(!rkRes){if(SV.mode==1&&!me.pl){g.textAlign='center';g.fillStyle='#9aa7bd';g.font='14px'+F;g.fillText('Match non compté',130,300)}return}const q=rkRes,c=q.d>=0?'#7dff9a':'#ff7a7a';g.textAlign='center';g.fillStyle='#c5cfe0';g.font='bold 18px'+F;g.fillText('Classé',130,160);badge(130,240,48,q.nw.r);g.fillStyle=rankFill(q.nw.r,130,160);g.font='bold 24px'+F;g.fillText(RANKS[q.nw.r].n,130,324);g.fillStyle=c;g.font='bold 30px'+F;g.fillText((q.d>=0?'+':'')+q.d+' RR',130,364);g.fillStyle='#c5cfe0';g.font='15px'+F;g.fillText('Place '+q.pos+' / '+q.n+(q.bot?' · bots +'+q.bot:''),130,390);g.fillStyle='#161d2a';g.fillRect(40,404,180,12);g.fillStyle=rankFill(q.nw.r,130,180);g.fillRect(40,404,180*Math.min(1,q.nw.rr/100),12);g.fillStyle='#9aa7bd';g.font='13px'+F;g.fillText(q.nw.rr+' RR'+(q.nw.r>q.old.r?'  — Promotion !':q.nw.r<q.old.r?'  — Rétrogradation':''),130,436)}
const mmR=i=>({x:30,y:118+i*108,w:500,h:98}),mbR=k=>({x:30+k*132,y:446,w:126,h:46});
const evOpen=()=>BOSSUP||adm;
function drawMenu(){g.setTransform(1,0,0,1,0,0);g.fillStyle='#05070b';g.fillRect(0,0,W,H);if(tt-lbT>10){lbT=tt;net.send('lb_get');postLB()}
g.textAlign='center';g.fillStyle='#f0e6d0';g.font='bold 52px'+F2;g.fillText('ARÈNE',280,72);g.font='16px'+F2;g.fillStyle='#9aa7bd';g.fillText('Choisis ton mode de jeu (touches 1 / 2 / 3)',280,102);
[['1. Classique','Parties libres, sans classement','#7ad0ff'],['2. Classé','Gagne des RR et monte de Bronze à Radiant','#ffd98a'],['3. Événement spécial',"Toute l'équipe contre le Tong Tong Sahur géant",'#ff8ad8']].forEach((m,i)=>{
const p=mmR(i),hv=inB(p,M.x,M.y),lock=i==2&&!evOpen();g.globalAlpha=lock?.55:1;g.fillStyle='#161d2a';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=i==2?rbw(p.x,p.y,p.w,p.h):m[2];g.lineWidth=hv&&!lock?5:2;g.strokeRect(p.x,p.y,p.w,p.h);
g.textAlign='left';g.fillStyle=m[2];g.font='bold 27px'+F2;g.fillText(m[0],p.x+22,p.y+38);g.font='14px'+F2;g.fillStyle='#c5cfe0';g.fillText(m[1],p.x+22,p.y+60);
g.textAlign='right';g.fillStyle='#9be39b';g.font='bold 15px'+F2;g.fillText('● '+LBC[i]+' en ligne',p.x+p.w-18,p.y+28);
if(i==1){badge(p.x+450,p.y+62,22,SV.rk.r);g.fillStyle='#0d121c';g.fillRect(p.x+22,p.y+74,280,10);g.fillStyle=rankFill(SV.rk.r,p.x+162,280);g.fillRect(p.x+22,p.y+74,280*Math.min(1,SV.rk.rr/100),10);g.textAlign='left';g.fillStyle=rankFill(SV.rk.r,p.x+360,120);g.font='bold 14px'+F2;g.fillText(RANKS[SV.rk.r].n+' · '+SV.rk.rr+' RR',p.x+312,p.y+84)}
if(i==2){g.textAlign='left';g.font='bold 14px'+F2;g.fillStyle=BOSSUP?'#ff7a6a':'#8f9bb3';g.fillText(BOSSUP?'⚔ Événement ouvert : rejoins le combat !':"🔒 Événement inactif — un admin doit l'activer",p.x+22,p.y+84)}
g.globalAlpha=1});
['Personnages (P)','Skins (K)','Battle Pass (B)','Paramètres (O)'].forEach((t,k)=>{const p=mbR(k);g.fillStyle='#1d1a2e';g.fillRect(p.x,p.y,p.w,p.h);g.strokeStyle=inB(p,M.x,M.y)?'#fff':'#556';g.lineWidth=2;g.strokeRect(p.x,p.y,p.w,p.h);g.textAlign='center';g.fillStyle='#c5cfe0';g.font='13px'+F2;g.fillText(t,p.x+63,p.y+28)});
g.fillStyle='#161d2a';g.fillRect(560,110,370,382);g.strokeStyle='#ffd24a';g.lineWidth=2;g.strokeRect(560,110,370,382);g.textAlign='center';g.fillStyle=rankFill(7,745,260);g.font='bold 22px'+F2;g.fillText('Top 10 — tous les rangs',745,144);
if(!LB.length){g.fillStyle='#9aa7bd';g.font='13px'+F2;g.fillText("Personne n'est encore classé",745,300)}
LB.forEach((e,i)=>{const y=182+i*30,r=Math.min(7,Math.floor(e.b/100)),rr=e.b-r*100;g.textAlign='left';g.fillStyle='#8f9bb3';g.font='bold 15px'+F2;g.fillText('#'+(i+1),574,y);badge(618,y-5,10,r);g.fillStyle=rankFill(r,700,200);g.fillText(e.n,636,y);g.textAlign='right';g.fillStyle='#c5cfe0';g.font='13px'+F2;g.fillText(RANKS[r].n+' · '+rr+' RR',914,y)})}
function menuClick(){for(let i=0;i<3;i++)if(inB(mmR(i),M.x,M.y)){joinLobby(i);return}for(let k=0;k<4;k++)if(inB(mbR(k),M.x,M.y)){if(k==0)shop=1;else if(k==1)psk=1;else if(k==2)bp=1;else st=1}}
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
if(Math.hypot(p.x-ABTN.x,p.y-ABTN.y)<48){AB=1;continue}
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
addEventListener('keydown',e=>{K[e.code]=1;startMusic();if(e.code=='Tab'&&shop){shopTab=(shopTab+1)%3;e.preventDefault()}if(e.code=='Enter'&&ph.n>0&&!menuOpen&&!st&&!shop&&!bp&&!psk)setReady();if(e.code=='KeyB'){bp=!bp;shop=st=psk=0}if(e.code=='KeyP'){shop=!shop;bp=st=psk=0}if(e.code=='KeyO'){st=!st;bp=shop=psk=0;admP=0}if(e.code=='KeyK'){psk=!psk;bp=shop=st=0}if(e.code=='Escape'){if(admP)admP=0;else bp=shop=st=psk=0}if(e.code=='KeyM'){mute=!mute;setVol()}if(/^Digit[1-9]$/.test(e.code)&&!bp&&!shop&&!st&&!psk){const n=+e.code[5]-1;if(menuOpen){if(n<3)joinLobby(n);return}if(ph.n==2){if(n<3){me.v=n;pres()}}else if(mode!=1&&ph.n==0&&n<OL().length)pick(OL()[n])}if(['ShiftLeft','Space','KeyE'].includes(e.code)){AB=1;e.preventDefault()}});
addEventListener('keyup',e=>K[e.code]=0);
const mp=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.addEventListener('mousemove',mp);c.addEventListener('mousedown',e=>{mp(e);startMusic();if(backClick())return;if(psk){pkClick();return}if(st){stClick();return}if(shop){shopClick();return}if(bp){bpClick();return}if(menuOpen){menuClick();return}if(ph.n>0&&inB(rdR,M.x,M.y)){setReady();return}if(ph.n==2){voteClick();return}if(ph.n==1)return;if(mode!=1){selClick()}else if(e.button==2)AB=1;else M.d=1});
addEventListener('mouseup',()=>M.d=0);c.addEventListener('contextmenu',e=>e.preventDefault());
