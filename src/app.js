/* Journeyasya — pembaca novel vanilla JavaScript, tanpa akun/tracker. */
(()=>{'use strict';
const story=window.JOURNEY_STORY;
if(!story||!Array.isArray(story.chapters)){document.body.insertAdjacentHTML('afterbegin','<p role="alert">Cerita belum dapat dimuat. Muat ulang halaman.</p>');return;}
const chapters=story.chapters,moments=story.milestones;
const q=(id)=>document.getElementById(id);
const h=(t)=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const id=(n)=>String(n).padStart(2,'0');
const key='journeyasya-book-v3';
let saved={favorites:[],read:[],last:0,mode:'day',font:19,ending:0,positions:{}};
try{saved={...saved,...JSON.parse(localStorage.getItem(key)||'{}')}}catch(_){}
if(!Array.isArray(saved.read))saved.read=[];if(!Array.isArray(saved.favorites))saved.favorites=[];if(!saved.positions||typeof saved.positions!=='object')saved.positions={};
let active=null;
const persist=()=>{try{localStorage.setItem(key,JSON.stringify(saved))}catch(_){}};
const sc=q('reader-scroll');
const imageFor=i=>i<=3?'/assets/cafe-night.svg':i<=8?'/assets/dawn.svg':'/assets/cafe-night.svg';
function renderChapters(){
q('chapters').innerHTML=chapters.map((c,i)=>'<button type="button" class="book-card" data-chapter="'+i+'" aria-label="Baca bab '+c.id+': '+h(c.title)+'"><div class="book-image"><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 2l3 17 17 5-17 5-3 17-5-17-17-5 17-5z"/></svg></div><div class="book-content"><span class="book-number">BAB '+id(c.id)+' · '+h(c.month.toUpperCase())+' 2026 <span class="chapter-mark '+(saved.favorites.includes(i)?'visible':'')+'">♥</span></span><h3>'+h(c.title)+'</h3><p>'+h(c.subtitle)+'</p><div class="book-foot"><span>'+Math.max(2,c.minutes)+' menit baca '+(saved.read.includes(i)?'<b class="done">✓ Selesai</b>':'')+'</span><span class="book-read">BACA →</span></div></div></button>').join('');
q('chapters').querySelectorAll('[data-chapter]').forEach(btn=>btn.addEventListener('click',()=>navigateChapter(+btn.dataset.chapter)));
const n=saved.read.length;
q('completion-label').firstChild.textContent=n+' dari '+chapters.length+' bab selesai ';
q('completion-bar').style.width=(n/chapters.length*100)+'%';
q('resume-reading').textContent=saved.last?'Lanjut bab '+id(saved.last+1)+' →':'Baca dari awal →';
}
const months=['Semua','Juli','Agustus','September','Oktober','November'];
let currentMonth='Semua';
function renderTimeline(){
q('month-filters').innerHTML=months.map(m=>'<button type="button" data-month="'+m+'" aria-pressed="'+(m===currentMonth)+'">'+m+'</button>').join('');
q('month-filters').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{currentMonth=btn.dataset.month;renderTimeline()}));
const visible=moments.filter(m=>currentMonth==='Semua'||chapters[m.chapter-1]?.month===currentMonth);
q('timeline').innerHTML=visible.map(m=>'<button class="moment" type="button" data-moment="'+(m.chapter-1)+'"><span class="moment-date">'+h(m.day)+'</span><span class="moment-name">'+h(m.name)+'</span><span class="moment-arrow">↗</span></button>').join('');
q('timeline').querySelectorAll('[data-moment]').forEach(b=>b.addEventListener('click',()=>navigateChapter(+b.dataset.moment)));
}
function renderToc(){
q('toc').innerHTML=chapters.map((c,i)=>'<button class="side-item" data-toc="'+i+'" aria-current="'+(i===active)+'"><span>'+id(i+1)+'</span><b>'+h(c.title)+(saved.favorites.includes(i)?' ♡':'')+'</b></button>').join('');
q('toc').querySelectorAll('[data-toc]').forEach(b=>b.addEventListener('click',()=>{navigateChapter(+b.dataset.toc);toggleToc(false)}));
q('read-progress-all').textContent=saved.read.length+' dari 12 bab selesai';
}
function updateSettings(){
q('reader').classList.toggle('day',saved.mode==='day');q('reader').classList.toggle('night',saved.mode==='night');
q('reader-mode').textContent=saved.mode==='day'?'☾':'☀';
sc.style.setProperty('--reading-size',saved.font+'px');
q('font-down').disabled=saved.font<=16;q('font-up').disabled=saved.font>=25;
q('reader-favorite').textContent=saved.favorites.includes(active)?'♥':'♡';
q('reader-favorite').setAttribute('aria-pressed',saved.favorites.includes(active));
}
function showChapter(index){
active=Math.min(chapters.length-1,Math.max(0,index));saved.last=active;persist();
const c=chapters[active];
q('reader').hidden=false;document.body.classList.add('reading-lock');
q('reader-bar-title').textContent=c.title;
q('reader-image').src=imageFor(active);q('reader-image').alt='Ilustrasi suasana: '+c.place;
q('reader-scene').textContent=c.place.toUpperCase();
q('chapter-heading').textContent='BAB '+id(c.id)+'  ·  '+c.date.toUpperCase();
q('reader-title').textContent=c.title;q('chapter-subtitle').textContent=c.subtitle;q('chapter-quote').textContent='“'+c.quote+'”';
q('chapter-body').innerHTML=c.paragraphs.map(p=>'<p>'+h(p)+'</p>').join('');
q('reader-count').textContent=id(c.id)+' / '+id(chapters.length);
q('previous-chapter').disabled=active===0;q('next-chapter').disabled=false;
q('next-chapter').textContent=active===chapters.length-1?'Selesai membaca ✓':'Berikutnya →';
renderToc();updateSettings();toggleToc(false);
sc.scrollTop=0;q('reader-pct-bar').style.width='0%';requestAnimationFrame(()=>{sc.scrollTop=Math.min(Number(saved.positions[active]||0),Math.max(0,sc.scrollHeight-sc.clientHeight));const max=Math.max(1,sc.scrollHeight-sc.clientHeight);q('reader-pct-bar').style.width=Math.round(sc.scrollTop/max*100)+'%';});
q('reader-close').focus({preventScroll:true});
}
function navigateChapter(n){
if(n<0||n>=chapters.length)return;
const hash='#baca/'+id(n+1);
if(location.hash!==hash)location.hash=hash;else showChapter(n);
}
function closeReader(){
q('reader').hidden=true;document.body.classList.remove('reading-lock');active=null;toggleToc(false);renderChapters();
}
function route(){
const m=location.hash.match(/^#baca\/(\d{1,2})$/);
if(m){let n=+m[1]-1;if(n>=0&&n<chapters.length){showChapter(n);return;}}
closeReader();
}
function toggleToc(open){q('reader').classList.toggle('show-toc',open);q('toc-shade').hidden=!open;q('toc-toggle').setAttribute('aria-expanded',open)}
function completeChapter(){
if(active===null)return;
if(!saved.read.includes(active)){saved.read.push(active);persist();renderToc();}
}
function toNext(step){if(active===null)return;completeChapter();let next=active+step;if(next>=chapters.length){location.hash='#bab';return;}navigateChapter(Math.max(0,next))}
q('reader-close').addEventListener('click',()=>location.hash='#bab');
q('toc-toggle').addEventListener('click',()=>toggleToc(!q('reader').classList.contains('show-toc')));
q('toc-shade').addEventListener('click',()=>toggleToc(false));
q('previous-chapter').addEventListener('click',()=>toNext(-1));
q('next-chapter').addEventListener('click',()=>toNext(1));
q('reader-favorite').addEventListener('click',()=>{let pos=saved.favorites.indexOf(active);pos<0?saved.favorites.push(active):saved.favorites.splice(pos,1);persist();updateSettings();renderToc()});
q('font-up').addEventListener('click',()=>{saved.font=Math.min(25,saved.font+1);persist();updateSettings()});
q('font-down').addEventListener('click',()=>{saved.font=Math.max(16,saved.font-1);persist();updateSettings()});
q('reader-mode').addEventListener('click',()=>{saved.mode=saved.mode==='day'?'night':'day';persist();updateSettings()});
let readingTick=null;
sc.addEventListener('scroll',()=>{
if(active===null)return;
if(readingTick)cancelAnimationFrame(readingTick);
readingTick=requestAnimationFrame(()=>{if(active!==null){saved.positions[active]=Math.round(sc.scrollTop);persist();}const max=sc.scrollHeight-sc.clientHeight;const p=max>0?Math.min(100,Math.round(sc.scrollTop/max*100)):100;q('reader-pct-bar').style.width=p+'%';if(p>=94)completeChapter()});
},{passive:true});
document.addEventListener('keydown',e=>{
if(active===null)return;
if(e.key==='Escape'){e.preventDefault();location.hash='#bab'}
if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
if(e.key==='ArrowRight'&&active<11)toNext(1);if(e.key==='ArrowLeft'&&active>0)toNext(-1);
});
q('start-reading').addEventListener('click',()=>navigateChapter(saved.last));
q('resume-reading').addEventListener('click',()=>navigateChapter(saved.last));
const nav=q('nav-toggle');
nav.addEventListener('click',()=>{const open=q('mobile-menu').hidden;q('mobile-menu').hidden=!open;nav.setAttribute('aria-expanded',String(open))});
q('mobile-menu').querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{q('mobile-menu').hidden=true;nav.setAttribute('aria-expanded','false')}));
function toggleLetter(force){const el=q('letter-content'),open=typeof force==='boolean'?force:el.hidden;el.hidden=!open;q('toggle-letter').setAttribute('aria-expanded',String(open));q('toggle-letter').textContent=open?'✉ Tutup surat':'✉ Buka surat';q('envelope').setAttribute('aria-expanded',String(open));}
q('toggle-letter').addEventListener('click',()=>toggleLetter());q('envelope').addEventListener('click',()=>toggleLetter());
const reflections=['Aku akan mensyukuri kebaikan yang pernah ada, tanpa menuntut kepastian.','Aku ingin menjadi seseorang yang menghormati ruang dan pilihan, bahkan ketika jalannya berbeda.','Aku memilih tumbuh; kisah yang berakhir tidak membuat hidup berhenti.'];
const labels=['Bersyukur','Menghargai ruang','Terus bertumbuh'];
function showReflection(){
q('choices').innerHTML=labels.map((a,i)=>'<button class="'+(saved.ending===i?'pill':'quiet-btn')+'" data-choice="'+i+'" type="button" aria-pressed="'+(saved.ending===i)+'">'+h(a)+'</button>').join('');
q('ending-text').textContent='“'+reflections[saved.ending]+'”';
q('choices').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{saved.ending=+b.dataset.choice;persist();showReflection()}));
}
function updatePageProgress(){const d=document.documentElement,max=d.scrollHeight-d.clientHeight;q('scroll-progress').style.width=(max>0?d.scrollTop/max*100:0)+'%'}
window.addEventListener('scroll',updatePageProgress,{passive:true});
window.addEventListener('hashchange',route);
renderChapters();renderTimeline();showReflection();route();
if('IntersectionObserver' in window){const observer=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));}else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('show'));
})();