/* Writing prototype: drafts, cast, editor, preview and publish demo. */
const writerCovers=["books/write-cover-glass-garden.webp", "books/shelf-cover-crown-can-wait.webp", "books/shelf-cover-fallen-upwards.webp", "books/shelf-cover-dear-future-ex.webp", "books/shelf-cover-detective.webp", "books/shelf-cover-bodyguard.webp", "books/shelf-cover-hall-monitors.webp", "books/shelf-cover-flashlight-club.webp", "books/shelf-cover-heist-911.webp", "books/shelf-cover-ink-and-ruin.webp"];
const writerGenres=["Romance","Fantasy","Mystery","Drama","Adventure","Slice of life"];
const writerTones=["Slow burn","Emotional","Funny","Dark","Cozy"];
const writerCast=["Elias","Aurelian", "Cleo", "Dani", "Dante", "Ilvara", "Jaylen", "Kai", "Kestrel", "Lucian", "Noor", "Soren", "Wren", "Wyatt"];
const writerProfiles={"Elias":{"role":"Academy confidant","tags":"Mystery · Slow burn","quote":"You weren’t supposed to find this.","img":"books/story-elias-card.webp","t":"books/story-elias-thumb.webp"},"Aurelian": {"role": "Crown prince", "tags": "Royal romance · Yearning", "quote": "Kneel if you like. I won’t ask twice.", "img": "people/cast-aurelian.webp", "t": "people/pick-cast-aurelian.webp"}, "Cleo": {"role": "Rooftop regular", "tags": "Friends to lovers · Fluff", "quote": "You’re late, and I saved you a seat.", "img": "people/cast-cleo.webp", "t": "people/pick-cast-cleo.webp"}, "Dani": {"role": "Night owl", "tags": "Late-night talks · Yearning", "quote": "Keep your voice down. People listen here.", "img": "people/cast-dani.webp", "t": "people/pick-cast-dani.webp"}, "Dante": {"role": "Bad influence", "tags": "Forbidden · Mafia romance", "quote": "Careful. I’m exactly the mistake you’re looking for.", "img": "people/cast-dante.webp", "t": "people/pick-cast-dante.webp"}, "Ilvara": {"role": "Elven ranger", "tags": "Fantasy · Enemies to lovers", "quote": "You walk loudly for someone being followed.", "img": "people/cast-ilvara.webp", "t": "people/pick-cast-ilvara.webp"}, "Jaylen": {"role": "Team captain", "tags": "College · Friends to lovers", "quote": "Don’t look now, but everyone’s watching us.", "img": "people/cast-jaylen.webp", "t": "people/pick-cast-jaylen.webp"}, "Kai": {"role": "The quiet one", "tags": "Neighbours · Pining", "quote": "I wasn’t going to say anything. Then you walked in.", "img": "people/cast-kai.webp", "t": "people/pick-cast-kai.webp"}, "Kestrel": {"role": "Neon courier", "tags": "Cyberpunk · Sci-fi", "quote": "Package for you. I didn’t read it. Much.", "img": "people/cast-kestrel.webp", "t": "people/pick-cast-kestrel.webp"}, "Lucian": {"role": "Old rival", "tags": "Rivals to lovers · Tension", "quote": "Of course it’s you. It’s always you.", "img": "people/cast-lucian.webp", "t": "people/pick-cast-lucian.webp"}, "Noor": {"role": "Keeper of secrets", "tags": "Fake dating · Slow burn", "quote": "You weren’t supposed to find this place.", "img": "people/cast-noor.webp", "t": "people/pick-cast-noor.webp"}, "Soren": {"role": "Fae lord", "tags": "Dark fantasy · Slow burn", "quote": "Someone is already here. It’s me.", "img": "people/cast-soren.webp", "t": "people/pick-cast-soren.webp"}, "Wren": {"role": "Bookshop regular", "tags": "Dark academia · Pining", "quote": "You found my favourite chapter. Sit and read it with me.", "img": "people/cast-wren.webp", "t": "people/pick-cast-wren.webp"}, "Wyatt": {"role": "Ranch hand", "tags": "Cowboy romance · Comfort", "quote": "Storm’s coming. Stay, if you want.", "img": "people/cast-wyatt.webp", "t": "people/pick-cast-wyatt.webp"}};
const writerPrompts=[{title:"Masks at Midnight",scene:"The ballroom goes silent when you remove your mask. Across the room, someone begins walking towards you.",choices:["Hold their gaze","Slip outside"]},{title:"Rooftop Rules",scene:"You're late. He's waiting with two coffees and a grudge. The bet is still on the table.",choices:["Take the coffee","Double the bet"]}];
const writerInitial=()=>({title:"",cover:0,genres:[],tones:[],perspective:"2nd person",scene:"",cast:[],question:"What do you do?",choices:["", ""],notes:"",audience:"Community",visibility:"Public",selected:null});
let writer=writerInitial(),writerStage="home",writerTool="cast",protoMode="play",writerPromptIndex=0,writerHomeTab="create",writerMineTab="Stories",writerTimer=0;
const writerSafe=value=>escapeHtml(value||"");
const writerPills=(items,selected,field)=>`<div class="writer-row">${items.map(value=>`<button type="button" class="writer-chip" data-w-pick="${field}" data-w-value="${value}" aria-pressed="${Array.isArray(selected)?selected.includes(value):selected===value}">${value}</button>`).join("")}</div>`;
const writerCastGrid=()=>{
const people=writerCast.map(name=>{
const c=writerProfiles[name],picked=writer.cast.includes(name);
return `<div class="writer-person"><button type="button" class="writer-cast-pick" data-w-pick="cast" data-w-value="${name}" aria-pressed="${picked}" aria-label="${picked?'Remove':'Select'} ${name}"><img src="${c.t}" loading="lazy" alt=""><span>${name}</span></button><button type="button" class="writer-profile-open" data-w-profile="${name}" aria-label="View ${name}'s character profile" title="View profile">i</button></div>`}).join('');
const chosen=writer.cast.length?writer.cast.map((name,i)=>`<span>${i===0?'★ Lead: ':''}${name}</span>`).join(''):'<span>Choose your first character</span>';
return `<div class="writer-cast-grid">${people}</div><div class="writer-selected">${chosen}</div>`};
const writerProfileSheet=name=>{
const c=writerProfiles[name],picked=writer.cast.includes(name);
const tags=c.tags.split(' · ').map(t=>`<span>${t}</span>`).join('');
return `<div class="writer-profile-overlay" data-w-overlay><div class="writer-profile-sheet" role="dialog" aria-modal="true" aria-label="${name} character profile"><div class="writer-profile-hero"><img src="${c.img}" alt=""><button type="button" class="writer-profile-close" data-w-close aria-label="Close character profile">×</button><div class="writer-profile-title"><span class="writer-profile-role">${c.role}</span><h3>${name}</h3></div></div><div class="writer-profile-body"><div class="writer-profile-tags">${tags}</div><blockquote class="writer-profile-quote"><p>${c.quote}</p></blockquote><button class="go" type="button" data-w-profile-pick="${name}" data-picked="${picked}">${picked?'✓ In your cast · Remove':'Add to my cast'}</button></div></div></div>`};
// The publish action is a local demo, but its checklist must still be honest.
const writerPublishChecks=()=>[
 ['Story title',!!writer.title.trim()],
 ['Opening scene',!!writer.scene.trim()],
 ['Character selected',writer.cast.length>0],
 ['Two reader choices',writer.choices.filter(value=>value.trim()).length>=2]
];
const writerReadyToPublish=()=>writerPublishChecks().every(([,done])=>done);
const writerDrafts=[{title:'The Glass Garden',meta:'Draft · edited 2h ago',cover:0,start:'draft'},{title:'Masks at Midnight',meta:'Draft · edited yesterday',cover:1,prompt:0},{title:'Rooftop Rules',meta:'Draft · edited 3 days ago',cover:2,prompt:1}];
const writerSetupCard=()=>`<button type="button" class="writer-setup-card" data-w-stage="setup"><span class="writer-setup-head"><b>Story setup</b><small>Step 1 of 3</small></span><span class="writer-dots" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="writer-setup-row"><img src="${writerCovers[writer.cover]}" alt=""><span><b>${writerSafe(writer.title)||'Untitled story'}</b><small>${writerSafe(writer.genres.join(' · '))||'Pick a genre to begin'}</small></span></span></button>`;
const writerDraftList=()=>`<h4 class="writer-title">Your drafts</h4><div class="writer-list">${writerDrafts.map(d=>`<button type="button" class="writer-item" ${d.start?`data-w-start="${d.start}"`:`data-w-draft="${d.prompt}" data-w-cover="${d.cover}"`}><img src="${writerCovers[d.cover]}" alt=""><span><b>${d.title}</b><small>${d.meta}</small></span></button>`).join('')}</div>`;
const writerDock=active=>{const i=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;return `<nav class="writer-dock" aria-label="App navigation"><span aria-hidden="true">${i('<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>')}Home</span><span aria-hidden="true">${i('<path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5V19c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5z"/><path d="M12 6v13.5"/>')}Library</span><button type="button" class="${active==='create'?'on':''}" data-w-stage="home">${i('<path d="M12 6v12M6 12h12"/>')}Create</button><button type="button" class="${active==='profile'?'on':''}" data-w-stage="mine">${i('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6"/>')}Profile</button></nav>`};
const writerMineList=()=>{const covers=[writerCovers[4],writerCovers[2]];const mine=writer.published?`<li class="writer-item is-new"><img src="${writerCovers[writer.cover]}" alt=""><span><b>${writerSafe(writer.title)||'Untitled story'}</b><small id="w-meta">1 chapter · Just now · 0 plays</small><em id="w-feed" aria-live="polite"></em></span></li>`:'';return `<h4 class="writer-title">My Stories</h4><ul class="writer-list">${mine}<li class="writer-item"><img src="${covers[0]}" alt=""><span><b>A Quiet Place</b><small>3 chapters · Updated 2d ago</small><small>1.4K plays · 120 hearts</small></span></li><li class="writer-item"><img src="${covers[1]}" alt=""><span><b>Velvet &amp; Steel</b><small>5 chapters · Updated 1w ago</small><small>3.2K plays · 310 hearts</small></span></li></ul>`};
function writerAnimatePlays(){
clearTimeout(writerTimer);
const meta=document.getElementById('w-meta'),feed=document.getElementById('w-feed');if(!meta)return;
const notes={2:'Dev started reading',5:'Priya loved your opening line',9:'Jo wants chapter 2',14:'Marguerite shared your story'};
const draw=n=>{meta.textContent=`1 chapter · Just now · ${n} ${n===1?'play':'plays'}`;if(notes[n])feed.textContent=notes[n];};
if(reduce){draw(14);return}
let n=0;const tick=()=>{draw(++n);if(n<14)writerTimer=setTimeout(tick,120+n*15)};tick();
}
const writerToggleCast=name=>{const pos=writer.cast.indexOf(name);if(pos>=0)writer.cast.splice(pos,1);else if(writer.cast.length<3)writer.cast.push(name);};
const writerTop=(title,back)=>`<div class="writer-top"><button type="button" data-w-stage="${back}" aria-label="Back">←</button><strong>${title}</strong></div>`;
const writerActions=(main,stage,secondary='',other='')=>`<div class="writer-actions"><button type="button" class="go" data-w-stage="${stage}">${main}</button>${secondary?`<button type="button" class="writer-secondary" data-w-stage="${other}">${secondary}</button>`:''}</div>`;
const writerContent=()=>{
let head='',body='',buttons='';
if(writerStage==='home'){
head='<div class="writer-top"><strong>Your next story starts here</strong></div>';
const homeTabs=[['create','Create'],['drafts','Drafts']].map(([key,title])=>`<button type="button" role="tab" aria-selected="${writerHomeTab===key}" data-w-home="${key}">${title}</button>`).join('');
const create=`<div class="writer-banner"><img src="books/write-hero-create.webp" alt=""><div><h3>Create something unforgettable.</h3><p>Build a world. Give readers a choice.</p></div></div><h4 class="writer-title">Start with</h4><div class="writer-card"><button type="button" class="writer-secondary" data-w-start="blank">＋ Blank story</button><button type="button" class="writer-secondary" data-w-start="prompt">✧ Writing prompt</button><button type="button" class="writer-secondary" data-w-start="draft">Open example draft</button></div>${writerSetupCard()}<p class="writer-hint">A hands-on preview of Y/n's writing tools. Nothing is published from this page.</p>`;
body=`<div class="writer-tabs" role="tablist">${homeTabs}</div>${writerHomeTab==='drafts'?writerDraftList():create}`;
buttons=(writerHomeTab==='create'?writerActions('Create a story','setup'):'')+writerDock('create');
}else if(writerStage==='setup'){
head=writerTop('01 / Story setup','home');
body=`<label class="writer-label">Story title<input data-w-field="title" maxlength="50" placeholder="Name your story" value="${writerSafe(writer.title)}"></label><h4 class="writer-title">Choose a cover</h4><div class="writer-covers">${writerCovers.map((src,i)=>`<button type="button" data-w-cover="${i}" aria-pressed="${writer.cover===i}"><img src="${src}" alt="Cover option ${i+1}" loading="lazy"></button>`).join('')}</div><label class="writer-label">Genre · up to 3</label>${writerPills(writerGenres,writer.genres,'genres',3)}<label class="writer-label">Tone · up to 2</label>${writerPills(writerTones,writer.tones,'tones',2)}<label class="writer-label">Perspective</label>${writerPills(['1st person','2nd person','3rd person'],writer.perspective,'perspective',1)}`;
buttons=writerActions('Write the opening scene','editor');
}else if(writerStage==='editor'){
head=writerTop('02 / The writing desk','setup');
body=`<div class="writer-card"><strong>${writerSafe(writer.title)||'Untitled story'}</strong><small class="writer-small">Chapter 01 · Opening scene</small><label class="writer-label">Scene draft<textarea data-w-field="scene" maxlength="1800" placeholder="Where does your story begin?">${writerSafe(writer.scene)}</textarea></label><span class="writer-small">${writer.scene.trim().split(/\s+/).filter(Boolean).length} words</span></div><h4 class="writer-title">Story tools</h4><div class="writer-tabs" role="tablist">${[['cast','Characters'],['branches','Branches'],['notes','Notes']].map(([key,title])=>`<button type="button" role="tab" aria-selected="${writerTool===key}" data-w-tool="${key}">${title}</button>`).join('')}</div>`;
if(writerTool==='cast')body+=`<div class="writer-card"><p class="writer-hint">Choose up to 3 characters. The first appears in your reader preview.</p>${writerCastGrid()}</div>`;
if(writerTool==='branches')body+=`<div class="writer-card"><label class="writer-label">Reader question<input data-w-field="question" maxlength="80" value="${writerSafe(writer.question)}"></label>${writer.choices.map((choice,i)=>`<div class="writer-choice"><input aria-label="Choice ${i+1}" data-w-option="${i}" maxlength="80" value="${writerSafe(choice)}"><button type="button" data-w-del="${i}" aria-label="Delete choice ${i+1}">×</button></div>`).join('')}<button type="button" class="writer-secondary" data-w-add ${writer.choices.length>=4?'disabled':''}>+ Add another choice</button></div>`;
if(writerTool==='notes')body+=`<div class="writer-card"><label class="writer-label">Private notes<textarea data-w-field="notes" placeholder="Plot twists, secrets, things to remember…">${writerSafe(writer.notes)}</textarea></label></div>`;
buttons=writerActions('Preview as a reader','preview','Review publishing','publish');
}else if(writerStage==='preview'){
head=writerTop('Reader preview','editor');
body=`<h4 class="writer-title">${writerSafe(writer.title)||'Untitled story'}</h4><div class="writer-scene">${writerSafe(writer.scene)||'Write an opening scene to see it here.'}</div>${writer.cast[0]?`<div class="writer-card writer-preview-character"><img src="${writerProfiles[writer.cast[0]].img}" alt=""><div><strong>${writer.cast[0]}</strong><p class="writer-hint">Your first character is waiting for the reader's choice.</p></div></div>`:''}<b class="writer-small">${writerSafe(writer.question)}</b>${writer.choices.filter(Boolean).map((choice,i)=>`<button type="button" class="writer-secondary ${writer.selected===i?'writer-selection':''}" data-w-select="${i}">${writerSafe(choice)}</button>`).join('')}${writer.selected!==null?'<p class="writer-reply">That choice could take the story down a different branch.</p>':''}`;
buttons=writerActions('Back to the editor','editor','Review publishing','publish');
}else if(writerStage==='publish'){
head=writerTop('03 / Review & publish','editor');
const checks=writerPublishChecks();
body=`<div class="writer-banner"><img src="${writerCovers[writer.cover]}" alt=""><div><h3>${writerSafe(writer.title)||'Untitled story'}</h3><p>${writerSafe(writer.genres.join(' · '))||'Choose a genre'}</p></div></div><h4 class="writer-title">Publishing details</h4><div class="writer-card"><label class="writer-label">Audience</label>${writerPills(['Community','Friends only'],writer.audience,'audience',1)}<label class="writer-label">Visibility</label>${writerPills(['Public','Unlisted'],writer.visibility,'visibility',1)}</div><h4 class="writer-title">Before you publish</h4><div class="writer-card">${checks.map(([label,done])=>`<div class="writer-small">${done?'✓':'○'} ${label}</div>`).join('')}</div><p class="writer-hint">Website demo: nothing is really published.</p>`;
buttons=`<div class="writer-actions"><button type="button" class="go" data-w-publish ${writerReadyToPublish()?"":"disabled aria-disabled=\"true\""}>Publish story</button><button type="button" class="writer-secondary" data-w-stage="editor">Keep editing</button></div>`;
}else if(writerStage==='mine'){
head=writerTop('Profile','home');
const author=you.trim()||'You';
const tabs=['Stories','Bookmarks','Following'].map(title=>`<button type="button" role="tab" aria-selected="${writerMineTab===title}" data-w-mine="${title}">${title}</button>`).join('');
body=`<div class="writer-author"><img class="writer-avatar" src="people/avatar-w1.webp" alt=""><span><b>${escapeHtml(author)}</b><small>Author</small></span></div><div class="writer-tabs" role="tablist">${tabs}</div>${writerMineTab==='Stories'?writerMineList():`<p class="writer-empty">Nothing here yet. Get the app to build your library.</p>`}`;
buttons=`<div class="writer-actions"><a class="go" href="#get" style="text-decoration:none">Get the app and publish yours</a></div>${writerDock('profile')}`;
}
return `<div class="writer-screen">${head}<div class="writer-scroll">${body}</div>${buttons}</div>`;
};
function showWriter(stage){writerStage=stage;phoneEl.dataset.tone='dark';clearTimeout(writerTimer);screen.innerHTML=writerContent();const lit=stage==='mine'?'publish':stage;document.querySelectorAll('#write-steps li').forEach(item=>item.classList.toggle('on',item.dataset.writeStep===lit));if(stage==='mine')writerAnimatePlays();}
function setProtoMode(mode){protoMode=mode;document.querySelectorAll('[data-proto-mode]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.protoMode===mode)));document.getElementById('steps').hidden=mode==='write';document.getElementById('write-steps').hidden=mode!=='write';if(mode==='write')showWriter(writerStage);else show(currentStep);}
document.querySelector('.proto-modes').addEventListener('click',event=>{const button=event.target.closest('[data-proto-mode]');if(button)setProtoMode(button.dataset.protoMode);});
const writerSet=(key,value)=>{writer[key]=value;};
function writerLoadPrompt(i,cover=0){const p=writerPrompts[i%writerPrompts.length];writer.title=p.title;writer.scene=p.scene;writer.choices=[...p.choices];writer.cover=cover;}
function writerStart(which){
writer=writerInitial();
if(which==='draft'){writer={...writer,title:'The Glass Garden',genres:['Romance','Fantasy'],tones:['Slow burn'],cast:['Elias'],scene:'You arrive at the conservatory just after dusk. Every flower seems to lean toward you. A sealed note waits beneath a climbing rose.',choices:['Pick up the note','Call into the dark'],cover:0};}
if(which==='prompt')writerLoadPrompt(writerPromptIndex++);
showWriter('setup');
}
screen.addEventListener('click',event=>{
if(protoMode!=='write')return;
const button=event.target.closest('button');if(!button)return;
const d=button.dataset;
if(d.wProfile){screen.insertAdjacentHTML('beforeend',writerProfileSheet(d.wProfile));screen.querySelector('[data-w-close]')?.focus();return}
if(d.wClose!==undefined){screen.querySelector('[data-w-overlay]')?.remove();return}
if(d.wProfilePick){writerToggleCast(d.wProfilePick);showWriter('editor');return}
if(d.wStart){writerStart(d.wStart);return}
if(d.wDraft!==undefined){writer=writerInitial();writerLoadPrompt(+d.wDraft,+d.wCover);showWriter('setup');return}
if(d.wHome){writerHomeTab=d.wHome;showWriter('home');return}
if(d.wMine){writerMineTab=d.wMine;showWriter('mine');return}
if(d.wPublish!==undefined){if(!writerReadyToPublish())return;writer.published=true;showWriter('mine');return}
if(d.wStage){showWriter(d.wStage);return}
if(d.wTool){writerTool=d.wTool;showWriter('editor');return}
if(d.wCover!==undefined){writer.cover=+d.wCover;showWriter('setup');return}
if(d.wPick){const f=d.wPick,v=d.wValue,limits={genres:3,tones:2,cast:3};if(Array.isArray(writer[f])){const a=writer[f],i=a.indexOf(v);if(i>=0)a.splice(i,1);else if(a.length<limits[f])a.push(v);}else writer[f]=v;showWriter(writerStage);return}
if(d.wAdd!==undefined){if(writer.choices.length<4)writer.choices.push('');showWriter('editor');return}
if(d.wDel!==undefined){writer.choices.splice(+d.wDel,1);if(writer.choices.length<2)writer.choices.push('');showWriter('editor');return}
if(d.wSelect!==undefined){writer.selected=+d.wSelect;showWriter('preview');}
});
screen.addEventListener('input',event=>{if(protoMode!=='write')return;const {dataset,value}=event.target;if(dataset.wField)writerSet(dataset.wField,value);if(dataset.wOption!==undefined)writer.choices[+dataset.wOption]=value;});
