/* rx-chat v22 2026-11-07: removed lines take no new replies or reactions; delete shows busy at once; a failed send keeps your text; Esc closes menus; polling pauses while hidden. */
(function(){
var EMOJIS=["👍","❤️","😂","😮","😢","🙏","🔥","🎉"];
var ROOMS={
  roguex:{id:"roguex",title:"RogueXServices.com Room",blurb:"Say hi to the Rogue Valley."},
  neighborhood:{id:"neighborhood",title:"Neighborhood",blurb:"Local tips, lost pets, and a hello."},
  events:{id:"events",title:"Events This Week",blurb:"Shows, markets, and plans for the next few days."},
  pets:{id:"pets",title:"Pets",blurb:"Advice, photos, and park talk."},
  sports:{id:"sports",title:"Sports",blurb:"Scores, pickup games, and your team."},
  games:{id:"games",title:"Games",blurb:"Chess, checkers, trivia, and more."}
};
var ROOM_ORDER=["roguex","neighborhood","events","pets","sports","games"];
// Phone fit for the name-click menu. Scoped to this page by its own id so chat.html does not change.
(function(){
  if(document.getElementById("rx-chat-v22-css"))return;
  var st=document.createElement("style"); st.id="rx-chat-v22-css";
  st.textContent="@media (max-width:480px){"+
    "#ch-log .ch-msg.open .ch-menu{display:block;width:100%;max-width:100%}"+
    "#ch-log .ch-menu-bar{width:100%;max-width:100%}"+
    "#ch-log .ch-menu-bar .ch-emo-row{flex-wrap:wrap;overflow-x:visible;width:100%;max-width:100%;justify-content:flex-start;margin-left:0}"+
    "#ch-log .ch-menu-bar .ch-emo{width:36px;min-width:36px;height:36px}"+
    "#ch-log .ch-menu-bar .ch-acts,#ch-log .ch-menu-bar .ch-acts.is-confirm{display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;width:100%;max-width:100%}"+
    "#ch-log .ch-menu-bar .ch-reply-btn,#ch-log .ch-menu-bar .ch-dm-btn,#ch-log .ch-menu-bar .ch-del-btn,#ch-log .ch-menu-bar .ch-del-yes,#ch-log .ch-menu-bar .ch-del-no{min-height:36px;padding:6px 4px;margin:0}"+
    "#ch-box .ch-top{flex-wrap:wrap}#ch-box .ch-top b{flex:1 1 0;min-width:0}#ch-box .ch-top span{margin-left:0;flex-basis:100%}"+
  "}";
  (document.head||document.documentElement).appendChild(st);
})();
var log=document.getElementById("ch-log");
var form=document.getElementById("ch-form");
var textEl=document.getElementById("ch-text");
var topTitle=document.querySelector(".ch-top b");
var replyBar=document.getElementById("ch-reply");
var replyMeta=document.getElementById("ch-reply-meta");
var replyCancel=document.getElementById("ch-reply-x");
var room=localStorage.getItem("rxs_chat_room")||"roguex";
if(room==="main")room="roguex";
if(!ROOMS[room])room="roguex";
var seen={}, last=0, me="", replyTo=null, msgIndex={}, reactBusy={}, openMenuId=null, confirming={}, deleteBusy={}, deleteError={}, sending=false;
var PAL=["#B48CFF","#5BE49B","#FFB86B","#6BC8FF","#FF7AB8","#F5E663","#8AF0E0","#FF8F6B"];
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function color(n){var h=0;n=String(n||"");for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))|0;return PAL[Math.abs(h)%PAL.length]}
function empty(){return '<div class="mk-empty"><div class="mk-empty-ic" style="font-size:28px">💬</div><h3>It is quiet in here</h3><p>No messages yet. Start the conversation right here.</p></div>'}
function isMobileRooms(){return window.matchMedia("(max-width:959px)").matches}
function setRoomsOpen(open){
  var dir=document.getElementById("ch-dir");
  var panel=document.getElementById("ch-dir-panel");
  var tog=document.getElementById("ch-dir-tog");
  if(!dir||!panel||!tog)return;
  if(!isMobileRooms()){
    dir.classList.remove("is-collapsed");
    panel.hidden=false;
    tog.setAttribute("aria-expanded","true");
    return;
  }
  dir.classList.toggle("is-collapsed",!open);
  panel.hidden=!open;
  tog.setAttribute("aria-expanded",open?"true":"false");
}
function setRoom(id){
  room=id; localStorage.setItem("rxs_chat_room",id);
  seen={}; last=0; msgIndex={}; replyTo=null; openMenuId=null; hideReply();
  if(topTitle)topTitle.textContent=ROOMS[id].title;
  log.innerHTML='<p class="ch-sys">Loading room...</p>';
  document.querySelectorAll(".ch-room").forEach(function(a){
    var on=a.getAttribute("data-room")===id;
    a.classList.toggle("here",on);
    var pill=a.querySelector(".ch-pill");
    if(pill){pill.textContent=on?"You are here":"Live"; pill.classList.toggle("soon",false)}
  });
  if(isMobileRooms())setRoomsOpen(false);
  poll(true);
}
function hideReply(){replyTo=null; if(replyBar)replyBar.hidden=true; if(textEl)textEl.placeholder="Say hello"}

function viewerStamp(){var token="";try{token=String(RXT.token()||"")}catch(e){}if(!token)return"";var h=5381;for(var i=0;i<token.length;i++)h=((h<<5)+h)^token.charCodeAt(i);return (h>>>0).toString(16)}
function consentStore(){try{return JSON.parse(localStorage.getItem("rxs.sensitive")||"[]")}catch(e){return []}}
function consentId(convo){var who=viewerStamp();if(!who||!convo)return"";return who+"\u001f"+convo}
function hasConsent(convo){var id=consentId(convo);return !!id&&consentStore().indexOf(id)>=0}
function grantConsent(convo){var id=consentId(convo);if(!id)return;var list=consentStore();if(list.indexOf(id)>=0)return;list.push(id);if(list.length>500)list=list.slice(-500);try{localStorage.setItem("rxs.sensitive",JSON.stringify(list))}catch(e){}}
function classifySensitive(text){var swaps={"0":"o","1":"i","!":"i","3":"e","4":"a","@":"a","5":"s","$":"s","7":"t","*":"u"};var plain=String(text||"").toLowerCase().replace(/\s+/g," ").trim();if(!plain)return "ok";if(/\b(?:underage|jailbait|pre[-\s]?teen|csam|child\s*porn|kys|kill\s+you|i(?:'ll| will)\s+kill|rape\s+you|nigger|nigga|faggot|retard|tranny)\b/i.test(plain))return "prohibited";if(/\b(?:child|children|minor|minors)\b/i.test(plain)&&/\b(?:sex|nude|nudes|naked|porn)\b/i.test(plain))return "prohibited";var sensitive=/\b(?:sex|sexy|sexual|sexting|sexts?|nudes?|naked|horny|aroused|erotic|orgasms?|cum|cumming|climaxing|porn(?:ography)?|blow\s*jobs?|hand\s*jobs?|rim\s*jobs?|dicks?|cocks?|cunts?|penis(?:es)?|puss(?:y|ies)|vaginas?|clit(?:oris)?|tits?|titt(?:y|ies)|boob(?:s|ies)?|nipples?|threesomes?|bdsm|kink|kinky|fetish(?:es)?|dtf|masturbat\w*|deep\s*throat|doggy\s*style|f+u+c+k+(?:ing|ed|er|ers|s)?|sh[i]+t+(?:ty|ting|ted)?|bullshit|assholes?|jackass(?:es)?|bitch(?:es)?|bastards?|dickheads?|piss(?:ed|ing)?|netflix\s*(?:and|n)\s*chill|onlyfans)\b/i;if(/\b1[0-7]\s*(?:yo|y\/o|yrs?|years?\s*old)\b/i.test(plain)&&sensitive.test(plain))return "prohibited";var leet="";for(var i=0;i<plain.length;i++)leet+=swaps[plain[i]]||plain[i];var softened=leet.replace(/sexual(?:ly)?\s+(?:health|assault(?:ed)?|abuse|violence|education)|safe\s+sex|sex\s+education|reproductive\s+health|breast\s+(?:cancer|exam|feeding|feed)|(?:was|been|were|got)\s+raped|rape\s+crisis/gi," ");return sensitive.test(softened)?"sensitive":"ok"}
function coverHtml(flag){if(flag==="prohibited")return '<div class="rxs-cover"><strong>This message stays hidden</strong><p>This warning does not replace report or block. Accepting other messages does not show this one.</p></div>';return '<div class="rxs-cover"><strong>Sensitive message</strong><p>Strong language or sexual content stays covered until you choose to see it in this conversation. You will only be asked once here. Report and block still work.</p><button type="button" data-sens="yes">Show messages</button> <button type="button" data-sens="no">Not now</button></div>'}
function quoteBit(text, author){var flag=classifySensitive(text||"");var vis=author===me||flag==="ok"||(flag==="sensitive"&&hasConsent("room:"+room));return vis?esc((text||"").slice(0,80))+((text||"").length>80?"…":""):"Sensitive message"}
if(!document.getElementById("rxs-cover-css")){var st=document.createElement("style");st.id="rxs-cover-css";st.textContent=".rxs-cover{margin-top:4px;padding:8px 10px;border:1px solid rgba(255,196,120,.5);border-radius:14px}.rxs-cover p{margin:4px 0 8px;font-size:12px}.rxs-cover button{min-height:44px;margin:0 6px 0 0;padding:8px 12px;border-radius:999px;font:inherit;font-weight:800}";document.head.appendChild(st)}
function showReply(m){
  var flag=classifySensitive(m.text||"");
  var vis=m.author===me||flag==="ok"||(flag==="sensitive"&&hasConsent("room:"+room));
  replyTo={id:m.id,author:m.author,text:vis?m.text:""};
  if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.innerHTML="Replying to <b>"+esc(m.author)+"</b>: “"+quoteBit(m.text,m.author)+"”"}
  if(textEl){textEl.placeholder="Write a reply"; textEl.focus()}
  closeMenus();
}
function closeMenus(){
  openMenuId=null;
  log.querySelectorAll(".ch-msg.open").forEach(function(el){el.classList.remove("open"); var nb=el.querySelector(".ch-name"); if(nb)nb.setAttribute("aria-expanded","false")});
}
function openMenu(mid){
  var el=log.querySelector('.ch-msg[data-id="'+String(mid).replace(/"/g,"")+'"]');
  if(!el)return;
  var was=el.classList.contains("open");
  closeMenus();
  if(was)return;
  el.classList.add("open");
  openMenuId=mid;
  var nb=el.querySelector(".ch-name"); if(nb)nb.setAttribute("aria-expanded","true");
}
function chipsHtml(m){
  // Emoji options only appear in the name-click menu (not under messages).
  return "";
}
function menuHtml(m){
  var mine={};
  (m.reactions||[]).forEach(function(r){ if(r&&r.emoji&&r.mine)mine[r.emoji]=1; });
  var pick=EMOJIS.map(function(e){
    var on=!!mine[e];
    return '<button type="button" class="ch-emo'+(on?" on":"")+'" data-emoji="'+e+'" data-mid="'+esc(m.id)+'" aria-pressed="'+(on?"true":"false")+'" aria-label="React '+e+'">'+e+"</button>";
  }).join("");
  if(m.deleted){
    // A removed line takes no new replies or reactions. The server refuses them too.
    var gone=(m.author===me)?"":'<button type="button" class="ch-dm-btn" data-mid="'+esc(m.id)+'" data-author="'+esc(m.author)+'">Message</button>';
    return '<div class="ch-menu"><div class="ch-menu-bar"><div class="ch-acts"><span class="ch-del-ask">Message removed</span>'+gone+"</div></div></div>";
  }
  var self=m.author===me;
  var dm=self?"":'<button type="button" class="ch-dm-btn" data-mid="'+esc(m.id)+'" data-author="'+esc(m.author)+'">Message</button>';
  var acts;
  if(confirming[m.id]){
    acts='<span class="ch-del-ask">Delete this message?</span><button type="button" class="ch-del-no" data-mid="'+esc(m.id)+'"'+(deleteBusy[m.id]?" disabled":"")+'>Cancel</button><button type="button" class="ch-del-yes" data-mid="'+esc(m.id)+'"'+(deleteBusy[m.id]?" disabled":"")+'>'+(deleteBusy[m.id]?"Deleting…":"Delete")+"</button>";
  }else{
    var del=m.mine===true&&!m.deleted?'<button type="button" class="ch-del-btn" data-mid="'+esc(m.id)+'">Delete</button>':"";
    acts='<button type="button" class="ch-reply-btn" data-mid="'+esc(m.id)+'">↩ Reply</button>'+del+dm;
  }
  var err=deleteError[m.id]?'<p class="ch-del-err" role="alert">'+esc(deleteError[m.id])+"</p>":"";
  return '<div class="ch-menu"><div class="ch-menu-bar"><div class="ch-emo-row" role="group" aria-label="Reactions">'+pick+'</div><div class="ch-acts'+(confirming[m.id]?" is-confirm":"")+'">'+acts+"</div>"+err+"</div></div>";
}
function renderMsg(m){
  var el=document.createElement("div");
  el.className="ch-msg"+(m.author===me?" mine":"");
  el.setAttribute("data-id",m.id);
  var quote="";
  if(m.replyTo&&(m.replyTo.author||m.replyTo.text)){
    quote='<div class="ch-quote" data-reply="'+esc(m.replyTo.id||"")+'">↩ '+esc(m.replyTo.author||"")+": "+quoteBit(m.replyTo.text,m.replyTo.author)+"</div>";
  }
  var body;
  if(m.deleted)body='<div class="ch-body ch-gone">Message removed</div>';
  else {var flag=classifySensitive(m.text||"");var vis=m.author===me||flag==="ok"||(flag==="sensitive"&&hasConsent("room:"+room));body=vis?'<div class="ch-body">'+esc(m.text)+"</div>":coverHtml(flag)}
  el.innerHTML='<div class="ch-line"><button type="button" class="ch-name" aria-haspopup="true" aria-expanded="false" data-mid="'+esc(m.id)+'" style="color:'+color(m.author)+'">'+esc(m.author)+'</button><small>'+new Date(m.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})+"</small></div>"+quote+body+menuHtml(m);
  return el;
}
function refreshReacts(m){
  var el=log.querySelector('.ch-msg[data-id="'+String(m.id).replace(/"/g,'')+'"]');
  if(!el)return;
  var oldChips=el.querySelector(".ch-reacts");
  if(oldChips)oldChips.remove();
  var oldMenu=el.querySelector(".ch-menu");
  if(!oldMenu)return;
  var tmp=document.createElement("div"); tmp.innerHTML=menuHtml(m);
  var newMenu=tmp.querySelector(".ch-menu");
  if(oldMenu&&newMenu){
    var wasOpen=el.classList.contains("open");
    oldMenu.replaceWith(newMenu);
    if(wasOpen)el.classList.add("open");
  }
}
function applyRemoved(id){
  var m=msgIndex[id];
  if(!m)return;
  m.deleted=true; m.text=""; confirming[id]=0; deleteError[id]="";
  if(replyTo&&replyTo.id===id)hideReply();
  var el=log.querySelector('.ch-msg[data-id="'+String(id).replace(/"/g,"")+'"]');
  if(el){
    var body=el.querySelector(".ch-body");
    if(body){body.textContent="Message removed"; body.classList.add("ch-gone")}
    refreshReacts(m);
  }
  log.querySelectorAll(".ch-quote").forEach(function(q){
    if(q.getAttribute("data-reply")===id)q.textContent="↩ "+(m.author||"")+": Message removed";
  });
}
function deleteOwn(mid){
  var m=msgIndex[mid];
  if(!m||m.mine!==true||m.deleted||deleteBusy[mid])return;
  deleteBusy[mid]=1; deleteError[mid]="";
  refreshReacts(m); keepOpen(mid);
  RXT.verify(document.getElementById("ch-verify")).then(function(ok){
    if(!ok){deleteBusy[mid]=0; deleteError[mid]="Finish the quick check, then tap Delete again. Your message is still there."; refreshReacts(m); keepOpen(mid); return}
    return RXT.post({action:"chatdelete",guestToken:RXT.token(),room:room,messageId:mid}).then(function(d){
      deleteBusy[mid]=0;
      if(d&&d.ok){applyRemoved(mid); closeMenus(); return}
      deleteError[mid]=(d&&d.error)||"Could not delete that message. It is still there.";
      if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.textContent=deleteError[mid]}
      refreshReacts(m);
      var el=log.querySelector('.ch-msg[data-id="'+String(mid).replace(/"/g,"")+'"]');
      if(el){el.classList.add("open"); openMenuId=mid}
    }).catch(function(){
      deleteBusy[mid]=0;
      deleteError[mid]="Could not delete that message. It is still there.";
      if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.textContent=deleteError[mid]}
      refreshReacts(m);
      var el=log.querySelector('.ch-msg[data-id="'+String(mid).replace(/"/g,"")+'"]');
      if(el){el.classList.add("open"); openMenuId=mid}
    });
  });
}
function keepOpen(mid){
  var el=log.querySelector('.ch-msg[data-id="'+String(mid).replace(/"/g,"")+'"]');
  if(el){el.classList.add("open"); openMenuId=mid}
}
function toggleReact(mid,emoji){
  var key=mid+":"+emoji;
  if(reactBusy[key])return;
  reactBusy[key]=1;
  var m=msgIndex[mid];
  if(m&&m.deleted){reactBusy[key]=0; return}
  RXT.verify(document.getElementById("ch-verify")).then(function(ok){
    if(!ok){reactBusy[key]=0;return}
    return RXT.post({action:"chatreact",guestToken:RXT.token(),room:room,messageId:mid,emoji:emoji}).then(function(d){
      reactBusy[key]=0;
      if(d&&d.error){
        if(!m)return;
        if(d.needsVerify||d.error==="verify")return;
        m.reactions=m.reactions||[];
        var found=null;
        for(var i=0;i<m.reactions.length;i++){if(m.reactions[i].emoji===emoji){found=m.reactions[i];break}}
        if(found&&found.mine){found.count=Math.max(0,(found.count||1)-1); found.mine=false; if(!found.count)m.reactions=m.reactions.filter(function(r){return r!==found})}
        else if(found){found.count=(found.count||1)+1; found.mine=true}
        else m.reactions.push({emoji:emoji,count:1,mine:true});
        refreshReacts(m);
        return;
      }
      if(d&&d.reactions&&m){m.reactions=d.reactions; refreshReacts(m)}
      else poll(true);
    }).catch(function(){reactBusy[key]=0});
  });
}
var dmTo=null;
function hideDm(){
  dmTo=null;
  var panel=document.getElementById("ch-dm");
  if(panel)panel.hidden=true;
  var input=document.getElementById("ch-dm-text");
  if(input)input.value="";
}
function startDm(author){
  if(!author||author===me)return;
  closeMenus();
  hideReply();
  dmTo=author;
  var panel=document.getElementById("ch-dm");
  var meta=document.getElementById("ch-dm-meta");
  var input=document.getElementById("ch-dm-text");
  if(panel)panel.hidden=false;
  if(meta)meta.innerHTML="Direct message to <b>"+esc(author)+"</b>";
  if(input){input.focus()}
}
function sendDm(text){
  if(!dmTo)return Promise.resolve();
  var to=dmTo;
  return RXT.verify(document.getElementById("ch-verify")).then(function(ok){
    if(!ok)return;
    return RXT.post({action:"dm_start",guestToken:RXT.token(),toName:to,text:text}).then(function(d){
      if(d&&d.ok){
        hideDm();
        if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.innerHTML="Message sent to <b>"+esc(to)+"</b>"}
        setTimeout(hideReply,2500);
        return;
      }
      if(d&&(d.needsVerify||d.error==="verify"))return;
      var err=(d&&d.error)||"Could not send that message.";
      var note=document.getElementById("ch-dm-note")||document.getElementById("ch-dm-meta");
      if(note)note.textContent=err;
      else if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.textContent=err}
    });
  });
}
function poll(reset){
  if(!reset&&document.hidden)return;
  if(reset){seen={}; last=0}
  RXT.post({action:"chatlist",guestToken:RXT.token(),since:last,room:room}).then(function(d){
    if(d&&d.me)me=d.me;
    me=d.me||me;
    (d.removed||[]).forEach(function(id){ if(id)applyRemoved(id); });
    (d.reactionUpdates||[]).forEach(function(u){ if(!u||!u.id||!msgIndex[u.id])return; msgIndex[u.id].reactions=u.reactions||[]; refreshReacts(msgIndex[u.id]); });
    var msgs=d.messages||[];
    if(last===0){
      log.innerHTML=msgs.length?"":empty();
      msgs.forEach(function(m){
        seen[m.id]=1; last=Math.max(last,m.at||0); msgIndex[m.id]=m;
        log.appendChild(renderMsg(m));
      });
      log.scrollTop=log.scrollHeight;
      return;
    }
    msgs.forEach(function(m){
      if(seen[m.id]){
        if(typeof m.mine==="boolean")msgIndex[m.id].mine=m.mine;
        if(m.deleted)applyRemoved(m.id);
        if(m.reactions){msgIndex[m.id].reactions=m.reactions; refreshReacts(msgIndex[m.id])}
        return;
      }
      seen[m.id]=1; last=Math.max(last,m.at||0); msgIndex[m.id]=m;
      if(log.querySelector(".mk-empty"))log.innerHTML="";
      log.appendChild(renderMsg(m));
      log.scrollTop=log.scrollHeight;
    });
  }).catch(function(){});
}
log.addEventListener("click",function(e){
  var sens=e.target.closest("[data-sens]");
  if(sens){e.preventDefault();if(sens.getAttribute("data-sens")==="yes")grantConsent("room:"+room);var ids=Object.keys(msgIndex);log.innerHTML="";ids.forEach(function(id){if(msgIndex[id])log.appendChild(renderMsg(msgIndex[id]))});return}
  var nameBtn=e.target.closest(".ch-name");
  if(nameBtn){
    e.preventDefault();
    openMenu(nameBtn.getAttribute("data-mid"));
    return;
  }
  var t=e.target.closest("[data-mid]");
  if(!t){
    if(!e.target.closest(".ch-menu"))closeMenus();
    return;
  }
  var mid=t.getAttribute("data-mid");
  if(t.classList.contains("ch-reply-btn")){
    if(msgIndex[mid])showReply(msgIndex[mid]);
    return;
  }
  if(t.classList.contains("ch-dm-btn")){
    startDm(t.getAttribute("data-author")|| (msgIndex[mid]&&msgIndex[mid].author));
    return;
  }
  if(t.classList.contains("ch-del-btn")){
    confirming[mid]=1; deleteError[mid]="";
    if(msgIndex[mid])setTimeout(function(){ refreshReacts(msgIndex[mid]); }, 0);
    return;
  }
  if(t.classList.contains("ch-del-no")){
    confirming[mid]=0; deleteError[mid]="";
    if(msgIndex[mid])setTimeout(function(){ refreshReacts(msgIndex[mid]); }, 0);
    return;
  }
  if(t.classList.contains("ch-del-yes")){
    deleteOwn(mid);
    return;
  }
  if(t.classList.contains("ch-emo")){
    toggleReact(mid,t.getAttribute("data-emoji"));
  }
});
document.addEventListener("click",function(e){
  if(!e.target.closest("#ch-log"))closeMenus();
});
document.addEventListener("keydown",function(e){
  if(e.key!=="Escape"||!openMenuId)return;
  var mid=openMenuId;
  if(confirming[mid]&&!deleteBusy[mid]){confirming[mid]=0; if(msgIndex[mid])refreshReacts(msgIndex[mid]); return}
  closeMenus();
  var nb=log.querySelector('.ch-msg[data-id="'+String(mid).replace(/"/g,"")+'"] .ch-name'); if(nb)nb.focus();
});
document.addEventListener("visibilitychange",function(){ if(!document.hidden)poll(false) });
if(replyCancel)replyCancel.onclick=function(){hideReply()};
var dmCancel=document.getElementById("ch-dm-x");
if(dmCancel)dmCancel.onclick=function(){hideDm()};
var dmForm=document.getElementById("ch-dm-form");
if(dmForm)dmForm.onsubmit=function(e){
  e.preventDefault();
  var input=document.getElementById("ch-dm-text");
  var text=(input&&input.value||"").trim();
  if(!text)return;
  sendDm(text);
};
document.querySelectorAll(".ch-room[data-room]").forEach(function(a){
  a.addEventListener("click",function(e){e.preventDefault(); setRoom(a.getAttribute("data-room"))});
});
(function(){
  var tog=document.getElementById("ch-dir-tog");
  if(tog)tog.addEventListener("click",function(){
    if(!isMobileRooms())return;
    var open=tog.getAttribute("aria-expanded")!=="true";
    setRoomsOpen(open);
  });
  window.addEventListener("resize",function(){setRoomsOpen(!isMobileRooms())});
  setRoomsOpen(!isMobileRooms());
})();
document.querySelectorAll(".ch-room .ch-pill").forEach(function(p){
  if(/soon/i.test(p.textContent||"")){p.textContent="Live"; p.classList.remove("soon")}
});
var ct=document.getElementById("ch-tela"); if(ct){ct.href="#ch-box"; ct.removeAttribute("target")}
document.querySelectorAll("[data-tela]").forEach(function(a){a.href="#ch-box"; a.removeAttribute("target"); a.removeAttribute("rel")});
RXT.whoami().then(function(n){me=n||me; var el=document.getElementById("ch-name"); if(el)el.textContent=n||"..."});
fetch(RXT.API+"/public/market?scope=local").then(function(r){return r.json()}).then(function(d){
  if(!d.guestWrites||!RXT.SITEKEY){form.hidden=true; document.getElementById("ch-closed").hidden=false}
});
function sendError(msg){
  if(replyBar){replyBar.hidden=false; if(replyMeta)replyMeta.textContent=msg}
}
form.onsubmit=function(e){
  e.preventDefault();
  if(sending)return;
  var text=textEl.value;
  if(!text.trim())return;
  var payload={action:"chat",guestToken:RXT.token(),text:text,room:room};
  if(replyTo)payload.replyTo=replyTo.id;
  sending=true;
  RXT.verify(document.getElementById("ch-verify")).then(function(ok){
    if(!ok){sending=false; return}
    return RXT.post(payload).then(function(d){
      sending=false;
      if(d&&(d.needsVerify||d.error==="verify"))return;
      if(d&&d.error){sendError(d.error+" Your message was not sent."); return}
      if(textEl.value===text)textEl.value="";
      hideReply(); poll(true);
    });
  }).catch(function(){sending=false; sendError("Could not send. Check your connection and try again.")});
};
setRoom(room);
setInterval(function(){poll(false)},4000);
})();
