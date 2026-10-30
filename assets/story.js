/* Interactive Elias reader: dialogue, choices, rewind and relationship state. */
const IM={"books/story-cover.webp":"books/story-cover.webp","books/story-stage.webp":"books/story-stage.webp","books/story-elias-card.webp":"books/story-elias-card.webp","books/story-rowan-card.webp":"books/story-rowan-card.webp","books/story-seraphine-card.webp":"books/story-seraphine-card.webp","books/story-elias-thumb.webp":"books/story-elias-thumb.webp","books/story-rowan-thumb.webp":"books/story-rowan-thumb.webp","books/story-seraphine-thumb.webp":"books/story-seraphine-thumb.webp"};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let you="";
const nm=()=>you.trim()||"you",Nm=()=>you.trim()||"stranger";
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);

const phoneEl=$(".phone"),screen=$("#screen"),reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const CH={elias:["Elias","The one who knew about the letter",["slow burn","guarded"],"Guarded, watchful, quietly protective.","He warns you off the truth. You can’t stop wanting it.","“You weren’t supposed to find this.”","50% 22%"],rowan:["Rowan","The stranger who knows your name",["mystery","stranger"],"Easy smile, sharp eyes, answers he never quite gives.","You’ve barely met. He acts like you haven’t.","“Funny. I thought you’d open it sooner.”","50% 12%"],seraphine:["Seraphine","The one who is always watching",["secrets","wary"],"Poised, perceptive, slow to trust.","She has already decided who you are. Prove her wrong.","“Someone is always watching. I’d rather it were me.”","50% 14%"]};
const mood=
["guarded","wary","curious","warm","devoted"];
const ASK=[["What is this letter about?",1],["Why were you hiding it?",0],["I can\u2019t ignore this.",1]];
let st={reply:null,d:0,m:1,totalDelta:0,approach:null,revelation:null,sheet:null};
const hd=(t,s,img)=>`<div class="s-top" style="background-image:linear-gradient(#0003,#5a1530e6),url(${IM[`books/${img||"story-stage.webp"}`]})"><small>${s}</small><b>${t}</b></div>`;
const V=[
()=>`<div class="s-cover" style="background-image:linear-gradient(#0000 40%,#5a1530f0),url(${IM[`books/story-cover.webp`]})"><div><small>by caelune</small><b>The Midnight Letter</b></div></div><div class="s-body"><div class="stats3"><span>\u25B6 1.2M</span><span>\u2665 98K</span><span>\u2691 12K</span></div><div class="chips"><span>Romance</span><span>Mystery</span><span>Academy</span><span>Slow burn</span></div><p>${nm()==="you"?"You arrive":escapeHtml(nm())+", you arrive"} at a secluded academy where someone is always watching. A letter changes everything.</p><h6>Meet the cast</h6><div class="cast">${Object.entries(CH).map(([k,c])=>`<button data-c="${k}"><img src="${IM[`books/story-${k}-thumb.webp`]}" alt="" style="object-position:${c[6]}"><span>${c[0]}</span></button>`).join("")}</div></div><div class="s-foot"><button class="go" data-n="1">Start reading</button><button class="save" type="button" data-save aria-pressed="${!!st.saved}" aria-label="${st.saved?'Remove from saved':'Save story'}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg></button></div>${st.sheet?sheet(st.sheet):""}`,
()=>`${hd("Chapter 03","The Midnight Letter")}<div class="story-rewind-bar" id="story-rewind-bar" hidden><button type="button" class="story-rewind" data-rewind aria-label="Rewind to your previous choice">↶ Rewind choice</button></div><div class="s-body story-log" id="log" role="log" aria-live="polite" aria-relevant="additions"></div><div class="story-dock" id="story-dock"><div class="story-question" id="story-question">What would you say?</div><div class="story-options" id="story-options"></div><form class="story-entry" id="own"><input maxlength="180" placeholder="Say anything…" aria-label="What would you say to Elias?" autocomplete="off"><button aria-label="Send reply" type="submit">↑</button></form></div>`,
()=>`${hd("Your impact","Replies shape the story")}<div class="s-body"><p class="you">You: \u201c${escapeHtml(st.reply||"No reply yet")}\u201d</p><div class="imp"><span><b>Elias</b> trusts you <em>${st.totalDelta>0?"+"+st.totalDelta:st.totalDelta===0?"0":String(st.totalDelta)}</em></span><div class="meter"><i id="m" style="width:0"></i></div><small>${mood[st.m]}</small></div><div class="imp"><span><b>Your approach</b> ${escapeHtml(st.approach||"Undecided")}</span></div><div class="imp"><span><b>The letter</b> ${escapeHtml(st.revelation||"Still a mystery")}</span></div></div><button class="go" data-n="3">See your path</button>`,
()=>{
const tab=st.tab||"path";
const rel=[["elias","Elias",mood[st.m],(st.m+1)/5],["rowan","Rowan","a stranger",.2],["seraphine","Seraphine","wary",.3]];
const path=`<ol class="path"><li class="d"><small>Ch 01</small><b>A New Arrival</b></li><li class="d"><small>Ch 02</small><b>Whispers</b></li><li class="n"><small>Ch 03 \u00B7 now</small><b>The Letter</b><em>You: ${escapeHtml(st.reply||ASK[0][0])}</em></li><li class="l"><small>Ch 04</small><b>Hidden Motives</b></li></ol>`;
const people=`<ul class="rel">${rel.map(([k,n,l,p])=>`<li><img src="${IM[`books/story-${k}-thumb.webp`]}" alt=""><span><b>${n}<small>${l}</small></b><i style="--p:${Math.round(p*100)}%"></i></span></li>`).join("")}</ul>`;
const tabs=[["path","Your path"],["rel","Relationships"]].map(([k,t])=>`<button type="button" role="tab" aria-selected="${tab===k}" data-tab="${k}">${t}</button>`).join("");
return `${hd("Your path","Chapter 03 of 12")}<div class="s-body"><div class="s-tabs" role="tablist">${tabs}</div>${tab==="path"?path:people}</div><a class="go" href="#get">Play the rest in the app</a>`}];
const sheet=k=>{const c=CH[k];return `<div class="scrim" data-x></div><div class="sheet"><div class="sh-img" style="background-image:url(${IM[`books/story-${k}-card.webp`]});background-position:${c[6]}"><button data-x aria-label="Close">\u2715</button></div><div class="sh-b"><h3>${c[0]}</h3><p class="tg">${c[1]}</p><div class="chips">${c[2].map(t=>`<span>${t}</span>`).join("")}</div><p><b>The vibe</b> ${c[3]}</p><p><b>Your dynamic</b> ${c[4]}</p><blockquote>${c[5]}</blockquote><button class="go" data-n="1">Start reading</button></div></div>`};
const STORY={
start:{nar:["The letter feels heavier than you expected.","The wax seal is unfamiliar, but the handwriting is unmistakable.","You hear footsteps behind you.","Elias stops in the doorway, his gaze lingering on the letter in your hands."],say:"You weren’t supposed to find this, {name}.",ask:["What is this letter about?","Why were you hiding it?","I can’t ignore this."]},
warn:{nar:["Elias steps closer, his voice low."],say:"Be careful, {name}. Some truths are dangerous.",ask:["Tell me anyway.","Why are you protecting me?","I don’t trust you."]},
reveal:{nar:["He glances toward the corridor before closing the door.","For a moment, the only sound is the paper shifting between your fingers."],say:"The seal belongs to the people who took my brother. I thought I had destroyed their last letter.",ask:["Then we find your brother together.","What does this have to do with me?","You should have told me sooner."]}
};
const STORY_ORDER=["start","warn","reveal"];
let currentStep=0,storyGen=0,storyBeat="start",storyReplies=[],storyHistory=[],storyEnding=false,storyFinished=false;
const storyName=t=>t.replaceAll("{name}",Nm());
const storyScroll=()=>{const l=$("#log");if(l)requestAnimationFrame(()=>l.scrollTo({top:l.scrollHeight,behavior:reduce?"instant":"smooth"}))};
const storySleep=ms=>new Promise(resolve=>setTimeout(resolve,reduce?0:ms));
function storyAdd(html){const l=$("#log");if(!l)return;l.insertAdjacentHTML("beforeend",html);storyScroll()}
function storyDock(open){const d=$("#story-dock");if(d)d.hidden=!open}
function storyRewindVisibility(){const bar=$("#story-rewind-bar");if(bar)bar.hidden=!storyHistory.length}
function storyOptions(){const opts=$("#story-options");if(!opts)return;opts.replaceChildren();STORY[storyBeat].ask.forEach(t=>{const b=document.createElement("button");b.type="button";b.dataset.r=t;b.textContent=t;opts.appendChild(b)})}
function storySnapshot(){return {html:$("#log").innerHTML,beat:storyBeat,m:st.m,reply:st.reply,d:st.d,totalDelta:st.totalDelta,approach:st.approach,revelation:st.revelation,replies:storyReplies.slice()}}
function rewindStory(){
 if(!storyHistory.length||currentStep!==1)return;
 ++storyGen;storyEnding=false;storyFinished=false;
 const previous=storyHistory.pop();
 Object.assign(st,{m:previous.m,reply:previous.reply,d:previous.d,totalDelta:previous.totalDelta,approach:previous.approach,revelation:previous.revelation});
 storyReplies=previous.replies.slice();storyBeat=previous.beat;
 const log=$("#log");if(!log)return;log.innerHTML=previous.html;
 storyOptions();$("#story-question").textContent="What would you say?";
 const input=$("#own input");if(input)input.value="";
 storyDock(true);storyRewindVisibility();storyScroll();
}
function storySay(t){storyAdd(`<div class="say"><img src="${IM[`books/story-elias-thumb.webp`]}" alt=""><span><b>Elias <em>${mood[st.m]}</em></b>${escapeHtml(storyName(t))}</span></div>`)}
async function playStory(beat){
 const token=++storyGen;storyBeat=beat;storyDock(false);
 for(const line of STORY[beat].nar){await storySleep(beat==="start"?510:560);if(token!==storyGen||currentStep!==1)return;storyAdd(`<p class="nar">${escapeHtml(line)}</p>`)}
 await storySleep(430);if(token!==storyGen||currentStep!==1)return;
 let lead="";
 if(beat!=="start"){
  const previous=storyReplies[storyReplies.length-1]||"";
  const intent=classifyReply(previous);
  const response=beat==="warn"?{
   inquiry:"Because that letter was addressed to you. And I was afraid you would read it.",
   challenge:"I hid it because I was scared, not because I thought you were foolish.",
   support:"I know you want answers. I do too. I just need you to understand the risk.",
   fear:"You have every reason to be afraid. I won’t ask you to pretend otherwise.",
   affection:"If you matter to me, that makes the truth harder to say. Not easier.",
   neutral:"I should have told you about it sooner."
  }[intent]:{
   inquiry:"The handwriting on that envelope was copied from mine. Whoever sent it wants you to trust it.",
   challenge:"You’re right. I kept you outside the truth, and that was my mistake.",
   support:"Then I won’t face this alone. But you need to know what we’re walking into.",
   fear:"We can leave this room. I won’t make you decide anything tonight.",
   affection:"I wanted to keep you away from this. I realise that’s not the same as protecting you.",
   neutral:"I don’t have every answer. But I’ll stop hiding the ones I do have."
  }[intent];
  lead=`${response} `;
 }
 // Elias answers your reply and carries the scene in one message, never two in a row.
 storySay(lead+STORY[beat].say);
 await storySleep(440);if(token!==storyGen||currentStep!==1)return;
 storyOptions();$("#story-question").textContent="What would you say?";storyDock(true);storyScroll();
}
// Deterministic offline fallback: recognizes broad reader intentions, not arbitrary natural language.
function classifyReply(raw){
 // Small offline intention matcher, not an AI language model. Test negations
 // before positive signals so "I trust you" is not read as confrontation.
 const t=String(raw).toLowerCase().replace(/[’]/g,"'");
 const rejection=/\b(?:don't|dont|do not|can't|cannot|won't|will not|never|not)\s+(?:\w+\s+){0,2}(?:trust|believe|forgive|love|care)\b/;
 if(rejection.test(t)||/\b(?:liar|lie|lies|lied|lying|hiding|betray|betrayed|angry)\b|\bhow dare\b|\bshould have told\b/.test(t))return "challenge";
 if(/\b(?:love|care about|miss you|kiss|hold you|stay with you)\b/.test(t))return "affection";
 if(/\b(?:together|help|promise|with you|believe you|trust you|trust him|not alone|we'll|we will|protect you)\b|\bfind (?:your|his|the) brother\b/.test(t))return "support";
 const reassured=/\b(?:not|never|don't|dont)\s+(?:\w+\s+){0,2}(?:scared|afraid|worried)\b/;
 if(!reassured.test(t)&&/\b(?:scared|afraid|frightened|danger|worried|terrified|unsafe|run away)\b|\bleave me\b/.test(t))return "fear";
 if(/\b(?:why|what|who|when|where|how|tell|explain|letter|seal|brother|mean|know)\b/.test(t))return "inquiry";
 return "neutral";
}
function changeFor(intent,beat){
 if(intent==="challenge")return -1;
 if(intent==="support"||intent==="affection")return 1;
 if(intent==="inquiry"&&beat!=="start")return 1;
 return 0;
}
async function reply(t){
 t=String(t||"").trim();if(!t||storyEnding||!$("#story-dock")||$("#story-dock").hidden)return;
 const beat=storyBeat, intent=classifyReply(t);
 const nextMood=Math.max(0,Math.min(4,st.m+changeFor(intent,beat)));
 const d=nextMood-st.m; // Real change, including at trust limits.
 storyHistory.push(storySnapshot());storyRewindVisibility();storyReplies.push(t);
 st.reply=t;st.d=d;st.totalDelta+=d;st.m=nextMood;
 st.approach=({challenge:"Confrontational",support:"Supportive",affection:"Affectionate",fear:"Cautious",inquiry:"Curious",neutral:"Unpredictable"})[intent];
 storyDock(false);storyAdd(`<div class="bub me">${escapeHtml(t)}</div>`);
 const token=storyGen;
 await storySleep(350);if(token!==storyGen||currentStep!==1)return;
 storyAdd(`<div class="delta">${d<0?"Elias grows more guarded":d>0?"Elias opens up a little":"Elias considers your words"}</div>`);
 const next=STORY_ORDER[STORY_ORDER.indexOf(beat)+1];
 if(next){await playStory(next);return}
 storyEnding=true;await storySleep(580);if(token!==storyGen||currentStep!==1)return;
 const final=st.m>=3?"Then stay. We can look for him together—but I need your word that you’ll be careful.":st.m<=0?"I don’t expect you to forgive me. The letter is yours to keep. What happens next is your choice.":"I can’t ask you to trust me yet. I’ll show you what I know, and you can decide.";
 storySay(final);st.revelation="The seal is linked to Elias’s missing brother";
 await storySleep(480);if(token!==storyGen||currentStep!==1)return;
 storyAdd('<p class="nar">Beyond the door, the footsteps stop.</p><p class="story-chapter-note">End of preview · Your choices will carry forward</p><button class="go story-next" type="button" data-n="2">See what changed</button>');
 storyFinished=true;
}
function show(i){storyGen++;currentStep=i;phoneEl.dataset.tone="light";st.sheet=null;$$("#steps li").forEach((l,k)=>l.classList.toggle("on",k==i));screen.innerHTML=V[i]();if(i===1){st.reply=null;st.d=0;st.m=1;st.totalDelta=0;st.approach=null;st.revelation=null;storyEnding=false;storyFinished=false;storyReplies=[];storyHistory=[];storyRewindVisibility();playStory("start")}if(i==2)setTimeout(()=>{const m=$("#m");m&&(m.style.width=(25+st.m*18)+"%")},120)}
$("#steps").onclick=e=>{if(protoMode!=="play")return;const l=e.target.closest("li");if(!l)return;const i=+l.dataset.s;if(i>1&&!storyFinished)return;show(i)};
screen.onclick=e=>{if(protoMode!=="play")return;const b=e.target.closest("button,[data-x]");if(!b)return;if(b.dataset.x!==undefined){st.sheet=null;return show(0)}if(b.dataset.save!==undefined){st.saved=!st.saved;screen.innerHTML=V[0]();return}if(b.dataset.tab){st.tab=b.dataset.tab;return show(3)}if(b.dataset.c){st.sheet=b.dataset.c;screen.innerHTML=V[0]();return}if(b.dataset.rewind!==undefined)return rewindStory();if(b.dataset.n)return show(+b.dataset.n);if(b.dataset.r)reply(b.dataset.r)};
screen.onsubmit=e=>{if(protoMode!=="play")return;e.preventDefault();const t=e.target.querySelector("input").value.trim();t&&reply(t)};
