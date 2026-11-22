(()=>{
const $=s=>document.querySelector(s),app=$('#app');
let L=localStorage.kssLang||'ko';try{localStorage.kssLang=L}catch(e){}const T=o=>o?(o[L]||o.en||o.ko||o.vn||''):'';
const UI={ko:{home:'홈',watch:'유튜브에서 보기',lecture:'강의',song:'노래',ost:'OST',songlesson:'노래 강의',lesson:'복습 HTML',audiobook:'오디오북',soon:'준비 중',eps:'회차',latest:'시리즈',done:'학습 완료',prev:'이전',next:'다음',cm:'댓글',cmph:'댓글을 남겨 보세요',send:'등록',needlogin:'로그인하면 댓글을 쓸 수 있어요.',nofb:'댓글/게시판은 Firebase 설정 후 열립니다 (assets/config.js).',none:'아직 없어요',board:'게시판',library:'자료실',dl:'다운로드',intro:'소개 영상',extra:'특강',guide:'코스 가이드',cont:'이어서 학습'},
en:{home:'Home',watch:'Watch on YouTube',lecture:'Lecture',song:'Song',ost:'OST',songlesson:'Song lesson',lesson:'Review page',audiobook:'Audiobook',soon:'Coming soon',eps:'episodes',latest:'Series',done:'Mark as done',prev:'Prev',next:'Next',cm:'Comments',cmph:'Leave a comment',send:'Post',needlogin:'Sign in to comment.',nofb:'Comments/board open after Firebase setup (assets/config.js).',none:'Nothing yet',board:'Board',library:'Library',dl:'Download',intro:'Introduction',extra:'Extra',guide:'Course guide',cont:'Continue'},
vn:{home:'Trang chủ',watch:'Xem trên YouTube',lecture:'Bài giảng',song:'Bài hát',ost:'OST',songlesson:'Giải thích bài hát',lesson:'Trang ôn tập',audiobook:'Sách nói',soon:'Sắp ra mắt',eps:'tập',latest:'Loạt bài',done:'Đã học xong',prev:'Trước',next:'Sau',cm:'Bình luận',cmph:'Viết bình luận',send:'Gửi',needlogin:'Đăng nhập để bình luận.',nofb:'Bình luận/bảng tin mở sau khi cài Firebase (assets/config.js).',none:'Chưa có',board:'Bảng tin',library:'Thư viện',dl:'Tải xuống',intro:'Giới thiệu',extra:'Chuyên đề',guide:'Hướng dẫn khóa học',cont:'Tiếp tục'}};
const t=k=>UI[L][k]||k;
const store={get:(k,d)=>{try{return JSON.parse(localStorage['kss_'+k])}catch{return d}},set:(k,v)=>localStorage['kss_'+k]=JSON.stringify(v)};
const cache={};const J=async u=>cache[u]||(cache[u]=(window.KSS_DATA&&window.KSS_DATA[u])||await (await fetch(u)).json());
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const yurl=id=>'https://www.youtube.com/watch?v='+id;
const embed=id=>'<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe></div><div class="row"><a class="btn" target="_blank" rel="noopener" href="'+yurl(id)+'">▶ '+t('watch')+'</a></div>';
let CL=localStorage.kssCL||(L==='vn'?'vn':'en');const vlang=()=>CL;
const clsw=()=>'<div class="clsw"><span class="mut">'+({ko:'강의 언어',en:'Lesson language',vn:'Ngôn ngữ bài giảng'}[L])+'</span><button data-cl="en" class="tab '+(CL==='en'?'on':'')+'">English</button><button data-cl="vn" class="tab '+(CL==='vn'?'on':'')+'">Tiếng Việt</button></div>';
const bindcl=()=>app.querySelectorAll('[data-cl]').forEach(b=>b.onclick=()=>{CL=b.dataset.cl;localStorage.kssCL=CL;route()}); // 영상/강의 언어: KO 선택 시 EN
// ---- Firebase Firestore (public, no login)
let fb=null;
async function initFB(){if(fb||!window.KSS_FIREBASE)return fb;const ld=s=>new Promise(r=>{const e=document.createElement('script');e.src=s;e.onload=r;document.head.appendChild(e)});
const v='10.12.2';await ld('https://www.gstatic.com/firebasejs/'+v+'/firebase-app-compat.js');await ld('https://www.gstatic.com/firebasejs/'+v+'/firebase-firestore-compat.js');
firebase.initializeApp(window.KSS_FIREBASE);fb={db:firebase.firestore()};return fb}
const loginBtn=$('#login');if(loginBtn)loginBtn.style.display='none';
if(window.KSS_FIREBASE)initFB();
async function comments(box,key){box.innerHTML='<h2>'+t('cm')+'</h2>';
if(!window.KSS_FIREBASE){box.innerHTML+='<div class="empty">'+t('nofb')+'</div>';return}
await initFB();const list=document.createElement('div');const form=document.createElement('div');box.append(form,list);
const nm=({ko:'닉네임',en:'Nickname',vn:'Biệt danh'})[L]||'Nickname';
const wait=({ko:'잠시 후 다시 올려 주세요.',en:'Please wait a moment before posting again.',vn:'Vui lòng đợi một lát rồi đăng lại.'})[L];
form.innerHTML='<input class="nick" maxlength="30" placeholder="'+nm+'" style="width:100%;max-width:260px;margin-bottom:8px;padding:8px;border:1px solid var(--line,#ccc);border-radius:8px;background:transparent;color:inherit"><textarea rows="3" maxlength="1000" placeholder="'+t('cmph')+'"></textarea><div class="row"><button class="btn small">'+t('send')+'</button></div>';
const nick=form.querySelector('.nick');nick.value=localStorage.kssNick||'';
const load=async()=>{const s=await fb.db.collection('comments').where('key','==',key).limit(300).get().catch(e=>({docs:[],err:e}));if(s.docs)s.docs.sort((a,b)=>b.data().ts-a.data().ts);
list.innerHTML=s.docs.map(d=>{const c=d.data();return '<div class="post"><b>'+esc(c.name||'guest')+'</b> <span class="mut">'+new Date(c.ts).toLocaleDateString()+'</span><div>'+esc(c.text)+'</div></div>'}).join('')||'<p class="mut">'+t('none')+'</p>'};
form.querySelector('button').onclick=async()=>{const x=form.querySelector('textarea').value.trim();if(!x)return;
if(Date.now()-(+localStorage.kssLastPost||0)<20000)return alert(wait);
const name=(nick.value.trim()||'guest').slice(0,30);localStorage.kssNick=nick.value.trim();
try{await fb.db.collection('comments').add({key,text:x.slice(0,1000),name,ts:Date.now()});localStorage.kssLastPost=Date.now();form.querySelector('textarea').value='';await load()}catch(e){alert('Error: '+e.message)}};
await load()}
// ---- pages
const done=()=>store.get('done',{});
async function home(){const S=await J('data/series.json');
const pins=[
['hangeul',12,24,'#/s/hangeul',{ko:'한글 기본',en:'Hangeul basics',vn:'Hangeul cơ bản'}],
['factory',44,42,'#/s/factory',{ko:'공장 한국어',en:'Factory Korean',vn:'Tiếng Hàn nhà máy'}],
['song',84,82,'#/s/dasibom',{ko:'다시, 봄',en:'Again, Spring',vn:'Xuân lại về'}],
['story',82,22,'#/s/light',{ko:'빛이 머물던 자리',en:'Where the Light Stayed',vn:'Nơi ánh sáng ở lại'}],
['lib',10,80,'#/library',{ko:'자료실',en:'Library',vn:'Thư viện'}],
['board',54,18,'#/board',{ko:'게시판',en:'Board',vn:'Bảng tin'}]];
const wide=!/hero=a/.test(location.search+location.hash);
const chips=pins.map(p=>'<a class="gchip" href="'+p[3]+'">'+esc(T(p[4]))+'</a>').join('');
const ttl=({ko:'이야기와 <em>노래</em>로 배우는 한국어',en:'Learn Korean with <em>stories</em> and <em>songs</em>',vn:'Học tiếng Hàn qua <em>truyện</em> và <em>bài hát</em>'}[L]);
const sub=({ko:'한글부터 공장 한국어, 소설 오디오북과 노래까지. 영상은 유튜브에서, 복습은 여기서.',en:'From Hangeul to factory Korean, audiobook novels and songs. Watch on YouTube, review here.',vn:'Từ Hangeul đến tiếng Hàn nhà máy, tiểu thuyết âm thanh và bài hát. Xem trên YouTube, ôn tập tại đây.'}[L]);
const btns='<div class="row"><a class="btn" href="#/s/hangeul">'+({ko:'한글부터 시작',en:'Start with Hangeul',vn:'Bắt đầu với Hangeul'}[L])+'</a><a class="btn ghost" href="#/guide">'+({ko:'사용 안내',en:'Guide',vn:'Hướng dẫn'}[L])+'</a><a class="btn ytbtn" target="_blank" rel="noopener" href="'+S.site.youtube+'?sub_confirmation=1">▶ YouTube</a></div>';
if(wide){app.innerHTML='<section class="whero"><div class="whero-in"><span class="eyebrow">K-Story Song</span><h1>'+ttl+'</h1><p>'+sub+'</p>'+btns+'</div><div class="gchips">'+chips+'</div></section>'
+'<h2>'+t('latest')+'</h2><div class="grid">'+S.series.map(s=>'<a class="card series" style="--c:'+s.color+'" href="#/s/'+s.id+'"><div class="ic">'+s.icon+'</div><h3>'+esc(T(s.title))+'</h3><p>'+esc(T(s.desc))+'</p><p style="margin-top:10px"><span class="badge '+s.status+'">'+(s.status==='live'?'● LIVE':t('soon'))+'</span></p></a>').join('')+'</div>'}else{app.innerHTML='<section class="hero2"><div class="htxt"><span class="eyebrow">K-Story Song</span><h1>'+({ko:'이야기와 <em>노래</em>로 배우는 한국어',en:'Learn Korean with <em>stories</em> and <em>songs</em>',vn:'Học tiếng Hàn qua <em>truyện</em> và <em>bài hát</em>'}[L])+'</h1><p>'+({ko:'한글부터 공장 한국어, 소설 오디오북과 노래까지. 영상은 유튜브에서, 복습은 여기서.',en:'From Hangeul to factory Korean, audiobook novels and songs. Watch on YouTube, review here.',vn:'Từ Hangeul đến tiếng Hàn nhà máy, tiểu thuyết âm thanh và bài hát. Xem trên YouTube, ôn tập tại đây.'}[L])+'</p><div class="row"><a class="btn" href="#/s/hangeul">'+({ko:'한글부터 시작',en:'Start with Hangeul',vn:'Bắt đầu với Hangeul'}[L])+'</a><a class="btn ghost" target="_blank" rel="noopener" href="'+S.site.youtube+'?sub_confirmation=1">▶ YouTube</a></div></div>'
+'<div class="scene"><img src="assets/hero_A.png" alt="library and record shop">'+pins.map(p=>'<a class="pin" style="left:'+p[1]+'%;top:'+p[2]+'%" href="'+p[3]+'"><i></i><span>'+esc(T(p[4]))+'</span></a>').join('')+'</div></section>'
+'<h2>'+t('latest')+'</h2><div class="grid">'+S.series.map(s=>'<a class="card series" style="--c:'+s.color+'" href="#/s/'+s.id+'"><div class="ic">'+s.icon+'</div><h3>'+esc(T(s.title))+'</h3><p>'+esc(T(s.desc))+'</p><p style="margin-top:10px"><span class="badge '+s.status+'">'+(s.status==='live'?'● LIVE':t('soon'))+'</span></p></a>').join('')+'</div>'}}
function epCard(sid,e,c){const d=done()[sid+'/'+e.id];const y=e.youtube||{};const has={l:y.lecture&&(y.lecture.en||y.lecture.vn),s:(y.song&&(y.song.en||y.song.vn))||e.song,h:e.lesson&&(e.lesson.en||e.lesson.vn),a:e.audiobook};
return '<a class="card ep" style="--c:'+c+'" href="#/e/'+sid+'/'+e.id+'"><span class="no">'+(e.intro?'INTRO':(sid==='dasibom'||sid==='hangeul'?'EP ':'')+String(e.no).padStart(2,'0'))+(d?' ✓':'')+'</span><h4>'+esc(T(e.title)||e.title.en)+'</h4><div class="sub">'+esc(e.title.ko&&L!=='ko'?e.title.ko:(L==='ko'?(e.title.en||''):''))+'</div><div class="chips"><span class="chip '+(has.l?'on':'')+'">▶ '+t('lecture')+'</span>'+(sid==='hangeul'?'':'<span class="chip '+(has.s?'on':'')+'">♪ '+t('song')+'</span>')+(e.noLesson?'':'<span class="chip '+(has.h?'on':'')+'">📖 '+t('lesson')+'</span>')+(has.a?'<span class="chip on">🎧</span>':'')+'</div></a>'}
async function seriesPage(sid){const S=await J('data/series.json');const s=S.series.find(x=>x.id===sid);if(!s)return home();
let h='<div class="crumb"><a href="#/">'+t('home')+'</a> / '+esc(T(s.title))+'</div><h1 style="margin:0">'+esc(T(s.title))+'</h1><p class="mut">'+esc(T(s.desc))+'</p>';
if(!s.file){app.innerHTML=h+'<div class="empty">'+t('soon')+'</div>';return}
h+=clsw();
const D=await J(s.file);const eps=D.episodes;

if(D.departments){const io=eps.filter(e=>e.intro);if(io.length)h+='<div class="grid" style="margin-top:16px">'+io.map(e=>epCard(sid,e,s.color)).join('')+'</div>';for(const d of D.departments){const list=eps.filter(e=>e.no>=d.from&&e.no<=d.to);h+='<div class="dept">'+esc(d[L]||d.en)+' <span class="mut">('+d.from+'–'+d.to+')</span></div><div class="grid">'+list.map(e=>epCard(sid,e,s.color)).join('')+'</div>'}}
else h+='<div class="grid" style="margin-top:16px">'+eps.map(e=>epCard(sid,e,s.color)).join('')+'</div>';
if(D.extras)h+='<h2>'+t('extra')+'</h2><div class="grid">'+D.extras.map(x=>'<a class="card ep" href="#/v/'+x.youtube.lecture[vlang()]+'"><h4>'+esc(T(x.title))+'</h4></a>').join('')+'</div>';
if(D.songs)h+='<h2>OST</h2><div class="grid">'+D.songs.map(x=>'<a class="card ep" style="--c:'+s.color+'" href="#/v/'+x.youtube.ost[vlang()]+'"><span class="no">♪ '+String(x.no).padStart(2,'0')+' · EP '+x.episodes.join('-')+'</span><h4>'+esc(x.title[vlang()])+'</h4></a>').join('')+'</div>';
app.innerHTML=h;bindcl()}
async function videoPage(id){app.innerHTML='<div class="crumb"><a href="#/">'+t('home')+'</a></div>'+embed(id)}
async function epPage(sid,eid){const S=await J('data/series.json');const s=S.series.find(x=>x.id===sid);const D=await J(s.file);const i=D.episodes.findIndex(e=>e.id===eid);const e=D.episodes[i];if(!e)return home();
const vl=vlang();const src=[];const y=e.youtube||{};
if(y.lecture)src.push(['lecture',t('lecture'),y.lecture[vl]||y.lecture.en||y.lecture.vn]);
if(y.song)src.push(['song',t('song'),y.song[vl]||y.song.en||y.song.vn]);
if(D.songs&&e.song){const sg=D.songs.find(x=>x.no===e.song);if(sg){src.push(['ost',t('ost'),sg.youtube.ost[vl]]);src.push(['songlesson',t('songlesson'),sg.youtube.songLesson[vl]])}}
const les=e.lesson&&(e.lesson[vl]||e.lesson.en||e.lesson.vn);if(les)src.push(['lesson',t('lesson'),les,true]);
if(e.audiobook)src.push(['audiobook',t('audiobook'),e.audiobook[vl]||e.audiobook.en]);
const ok=src.filter(x=>x[2]);let cur=ok[0]?ok[0][0]:null;
const draw=()=>{const a=ok.find(x=>x[0]===cur);
app.innerHTML='<div class="crumb"><a href="#/">'+t('home')+'</a> / <a href="#/s/'+sid+'">'+esc(T(s.title))+'</a></div><h1 style="margin:0">'+(e.intro?'':(sid==='dasibom'?'EP '+e.no+' · ':''))+esc(T(e.title)||e.title.en)+'</h1><p class="mut">'+esc(e.title.ko||'')+'</p>'
+clsw()+'<div class="tabs" style="--c:'+s.color+'">'+ok.map(x=>'<button class="tab '+(x[0]===cur?'on':'')+'" data-k="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'
+(a?(a[3]?'<iframe class="lessonframe" src="'+esc(a[2])+'"></iframe><div class="row"><a class="btn ghost" target="_blank" href="'+esc(a[2])+'">↗</a></div>':embed(a[2])):'<div class="empty">'+t('soon')+'</div>')
+'<div class="row"><label><input type="checkbox" id="dn" '+(done()[sid+'/'+e.id]?'checked':'')+'> '+t('done')+'</label></div>'
+'<div class="nav2">'+(D.episodes[i-1]?'<a class="btn ghost" href="#/e/'+sid+'/'+D.episodes[i-1].id+'">← '+t('prev')+'</a>':'<span></span>')+(D.episodes[i+1]?'<a class="btn ghost" href="#/e/'+sid+'/'+D.episodes[i+1].id+'">'+t('next')+' →</a>':'')+'</div><div id="cm"></div>';
app.querySelectorAll('.tab[data-k]').forEach(b=>b.onclick=()=>{cur=b.dataset.k;draw()});bindcl();$('#dn').onchange=ev=>{const d=done();d[sid+'/'+e.id]=ev.target.checked;store.set('done',d)};comments($('#cm'),sid+'/'+e.id)};draw()}
async function library(){const D=await J('data/library.json');app.innerHTML='<h1>'+t('library')+'</h1>'+(D.items.length?'<div class="grid">'+D.items.map(x=>'<a class="card" href="'+esc(x.file)+'" download><h4>'+esc(T(x.title))+'</h4><p class="mut">'+esc(T(x.desc))+'</p><span class="btn small">⬇ '+t('dl')+'</span></a>').join('')+'</div>':'<div class="empty">'+t('none')+'</div>')}
async function board(){const box=document.createElement('div');app.innerHTML='<h1>'+t('board')+'</h1>';app.append(box);const c=document.createElement('div');box.append(c);await comments(c,'board');c.querySelector('h2').remove()}
// ---- guide page
const GUIDE={"ko":{"h":"사용 안내","intro":"K-Story Song은 영상과 복습 페이지를 함께 쓰는 학습 사이트예요. 영상은 유튜브에서 보고, 단어와 문장 복습은 여기서 해요. 로그인은 필요 없어요.","who":"무엇을 배우고 싶으세요?","whoL":[["한국어를 배우고 싶어요<br><small class=\"mut\">영어·베트남어를 쓰는 분</small>","① 사이트 언어를 EN 또는 VN으로 두세요.<br>② 강의 언어를 English 또는 Tiếng Việt로 고르세요. 베트남어를 쓰는 분도 English를 고르면 영어 설명과 함께 볼 수 있어요.<br>③ 영상을 본 뒤 복습 HTML에서 단어에 마우스를 올려 뜻·발음·문법을 확인하세요."],["영어를 배우고 싶어요<br><small class=\"mut\">한국어를 하시는 분</small>","① 사이트 언어를 KO로 두세요.<br>② 강의 언어를 English로 고르세요.<br>③ 복습 HTML에서 \"번역 자막\"을 켜고, 문장 끝의 번역 버튼으로 영어 문장 소리를 들어 보세요.<br>④ \"한국어 → 영어 순서로 듣기\"로 한국어 다음에 영어를 이어서 들을 수 있어요."],["베트남어를 배우고 싶어요<br><small class=\"mut\">한국어를 하시는 분</small>","① 사이트 언어를 KO로 두세요.<br>② 강의 언어를 Tiếng Việt로 고르세요.<br>③ 복습 HTML에서 \"번역 자막\"을 켜고, 문장 끝의 번역 버튼으로 베트남어 문장 소리를 들어 보세요.<br>④ \"한국어 → 베트남어 순서로 듣기\"로 한국어 다음에 베트남어를 이어서 들을 수 있어요."]],"steps":"따라 해 보기","S":[["홈 화면","img/home",["위쪽 메뉴: 홈, 사용 안내, 게시판, 자료실","\"한글부터 시작\" 버튼","시리즈 바로가기","언어(KO/EN/VN)와 화면 밝기 바꾸기"]],["시리즈 화면","img/series",["강의 언어 고르기: English 또는 Tiếng Việt","회차 카드. 카드 안의 칩은 ▶ 강의, ♪ 노래, 📖 복습 HTML, 🎧 오디오북이 있다는 표시예요."]],["회차 화면","img/episode",["강의 언어는 여기서도 바꿀 수 있어요.","탭: 강의, OST, 노래 강의, 복습 HTML","영상이 바로 재생돼요. 아래의 \"완료\" 체크와 이전/다음 버튼으로 진도를 관리해요."]],["복습 HTML","img/lesson",["전체 이야기 듣기","로마자 발음 보기","퀴즈 모드(뜻 가리기)","번역 숨기기"]],["게시판","img/board",["닉네임과 하고 싶은 말을 적어요.","등록 버튼을 누르면 바로 올라가요. 로그인은 필요 없어요."]]],"lessonTip":"복습 페이지에서는 단어에 마우스를 올리면 뜻·발음·문법이 보이고, 단어나 ▶ 아이콘을 누르면 소리가 나와요. 문장 끝의 번역 아이콘을 누르면 번역이 보여요.","notes":["자료실에서는 학습 자료를 내려받을 수 있어요.","화면이 어색하면 새로고침(Ctrl+F5)을 해 보세요."],"home":"홈으로","whoNote":"같은 수업, 방향만 반대예요. 한국어 모드(사이트 언어 KO)에서는 강의 언어가 내가 배우려는 언어가 됩니다."},"en":{"h":"How to use this site","intro":"K-Story Song pairs videos with review pages. Watch the videos on YouTube, then review words and sentences here. No login needed.","who":"What do you want to learn?","whoL":[["I want to learn Korean<br><small class=\"mut\">English or Vietnamese speakers</small>","① Keep the site language on EN or VN.<br>② Choose English or Tiếng Việt as the lesson language. Vietnamese speakers can also choose English to see English explanations.<br>③ After the video, hover over words on the review page to see the meaning, pronunciation and grammar."],["I want to learn English<br><small class=\"mut\">Korean speakers</small>","① Set the site language to KO.<br>② Choose English as the lesson language.<br>③ On the review page, turn on \"번역 자막\" (translation captions) and press the translation button at the end of a sentence to hear the English sentence.<br>④ \"한국어 → 영어 순서로 듣기\" plays Korean followed by English."],["I want to learn Vietnamese<br><small class=\"mut\">Korean speakers</small>","① Set the site language to KO.<br>② Choose Tiếng Việt as the lesson language.<br>③ On the review page, turn on \"번역 자막\" and press the translation button at the end of a sentence to hear the Vietnamese sentence.<br>④ \"한국어 → 베트남어 순서로 듣기\" plays Korean followed by Vietnamese."]],"steps":"Try it step by step","S":[["Home","img/home",["Top menu: Home, Guide, Board, Library","The \"Start with Hangeul\" button","Shortcuts to each series","Switch language (KO/EN/VN) and light/dark mode"]],["Series page","img/series",["Choose your lesson language: English or Tiếng Việt","Episode cards. The chips show what each episode has: ▶ Lecture, ♪ Song, 📖 Review page, 🎧 Audiobook."]],["Episode page","img/episode",["You can switch the lesson language here too.","Tabs: Lecture, OST, Song lesson, Review HTML","The video plays right here. Use the \"Done\" checkbox and the Prev/Next buttons below it to track your progress."]],["Review page","img/lesson",["Play the whole story","Show romanization","Quiz mode (hides the meanings)","Hide translations"]],["Board","img/board",["Type a nickname and your message.","Press the button and it is posted right away. No login needed."]]],"lessonTip":"On a review page, hover over a word to see its meaning, pronunciation and grammar. Click a word or the ▶ icon to hear it, and click the translation icon at the end of a sentence to see the translation.","notes":["The Library has study materials you can download.","If something looks odd, refresh with Ctrl+F5."],"home":"Back to Home","whoNote":"Same lessons, opposite direction. In Korean mode (site language KO), the lesson language becomes the language you want to learn."}};
async function guide(){const g=GUIDE[L==='ko'?'ko':'en'];
const vnNote=L==='vn'?'<p class="mut">Bản hướng dẫn tiếng Việt sẽ sớm có. Tạm thời hiển thị bản tiếng Anh.</p>':'';
let h='<div class="crumb"><a href="#/">'+t('home')+'</a> / '+g.h+'</div><h1 style="margin:0">'+g.h+'</h1><p class="mut">'+g.intro+'</p>'+vnNote;
h+='<h2>'+g.who+'</h2><p class="mut">'+g.whoNote+'</p><div class="grid">'+g.whoL.map(w=>'<div class="card"><h3>'+w[0]+'</h3><p>'+w[1]+'</p></div>').join('')+'</div>';
h+='<h2>'+g.steps+'</h2>';
g.S.forEach((s,i)=>{const img='assets/guide/'+s[1].split('/')[1]+'.jpg';h+='<section class="gstep"><h3><span class="gno">'+(i+1)+'</span> '+s[0]+'</h3><img class="gimg" loading="lazy" src="'+img+'" alt="'+s[0]+'"><ol class="gmarks">'+s[2].map(x=>'<li>'+x+'</li>').join('')+'</ol>'+(s[1]==='img/lesson'?'<p>'+g.lessonTip+'</p>':'')+'</section>'});
h+='<ul class="gnotes">'+g.notes.map(n=>'<li>'+n+'</li>').join('')+'</ul><div class="row"><a class="btn" href="#/">'+g.home+'</a></div>';
app.innerHTML=h}
// ---- first-visit hint
(function(){if(localStorage.kssGuideSeen)return;const m={ko:['처음 오셨나요? 사용 안내를 먼저 보세요.','사용 안내 보기','닫기'],en:['First time here? Take a look at the Guide first.','Open Guide','Close'],vn:['Lần đầu ghé thăm? Hãy xem Hướng dẫn trước.','Xem hướng dẫn','Đóng']}[L]||null;if(!m)return;
const d=document.createElement('div');d.className='ghint';d.innerHTML='<span>'+m[0]+'</span><a class="btn small" href="#/guide">'+m[1]+'</a><button class="gx" aria-label="close">'+m[2]+'</button>';document.body.appendChild(d);
const close=()=>{localStorage.kssGuideSeen='1';d.remove()};d.querySelector('a').onclick=close;d.querySelector('.gx').onclick=close})();
async function route(){const h=location.hash.replace(/^#\/?/,'').split('/');window.__refresh=null;
try{if(!h[0])await home();else if(h[0]==='s')await seriesPage(h[1]);else if(h[0]==='e')await epPage(h[1],h[2]);else if(h[0]==='v')await videoPage(h[1]);else if(h[0]==='library')await library();else if(h[0]==='board')await board();else if(h[0]==='guide')await guide();else await home()}catch(err){app.innerHTML='<div class="empty">Error: '+esc(err.message)+'</div>'}
window.scrollTo(0,0)}
$('#lang').value=L;$('#lang').onchange=e=>{L=e.target.value;localStorage.kssLang=L;if(L!=='ko'){CL=L;localStorage.kssCL=L}document.documentElement.lang=L==='vn'?'vi':L;route()};
$('#theme').onclick=()=>{const d=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=d;localStorage.kssTheme=d};
document.documentElement.dataset.theme=localStorage.kssTheme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
addEventListener('hashchange',route);route();
})();
