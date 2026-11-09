/* RogueXServices.com community: nav pills, homepage cards, always-Local region. rxt-v23 2026-11-06 chrome-relock-on-mutation no rooms nav; v24 2026-11-08 no layout shift on compact, hysteresis, phone frame fits under header */
(function(){var TELA="https://tela-web.roguecleaning.org",GAMES="/games",DATING="/dating",ROOMS="/rooms";
var LOCAL="Southern Oregon & Northern California";
var CARDS='<a class="local-partner-card" href="/marketplace"><span class="eyebrow">Powered by Tel-a</span><strong>Marketplace</strong><span class="lp-desc">Buy, sell and trade locally across Southern Oregon and Northern California. No account needed.</span><span class="lp-more">Open Marketplace</span></a>'+
'<a class="local-partner-card" href="/chat"><span class="eyebrow">Powered by Tel-a</span><strong>Chat</strong><span class="lp-desc">Join the RogueXServices.com room. No sign-up, just a friendly random name.</span><span class="lp-more">Open Chat</span></a>'+
'<a class="local-partner-card" href="'+DATING+'"><span class="eyebrow">Powered by Tel-a</span><strong>Dating</strong><span class="lp-desc">18+ local dating for Southern Oregon and Northern California. A private dating name, a pick-up line, no photos.</span><span class="lp-more">Open Dating</span></a>'+
'<a class="local-partner-card" href="'+GAMES+'"><span class="eyebrow">Powered by Tel-a</span><strong>Games</strong><span class="lp-desc">Play chess, checkers and more in your browser with neighbors. No account, no download.</span><span class="lp-more">Play now</span></a>';
var PILLS='<span class="rxt-pow">Powered by Tel-a</span><span class="rxt-pills"><a href="/marketplace" data-rxt="marketplace">Marketplace<span class="rxt-badge" data-rxt-badge="marketplace" hidden></span></a><a href="/chat" data-rxt="chat">Chat<span class="rxt-badge" data-rxt-badge="chat" hidden></span></a><a href="'+DATING+'" data-rxt="dating">Dating<span class="rxt-badge" data-rxt-badge="dating" hidden></span></a><a href="'+GAMES+'" data-rxt="games">Games<span class="rxt-badge" data-rxt-badge="games" hidden></span></a></span>';
var CSS=".rxs-chrome{position:fixed;top:0;left:0;right:0;z-index:2000;background:#06182b;box-shadow:0 10px 28px rgba(0,0,0,.35)}.rxs-chrome .announcement{position:relative;z-index:1;background:var(--navy-deep,#04101c)}.rxs-chrome .site-header{position:relative;z-index:1;background:var(--navy,#06182b)}.rxs-chrome-spacer{display:block;width:100%;pointer-events:none}.rxt-sub{margin:4px 0 0;opacity:.8}.rxt-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:12px}"+
".rxt-nav{display:inline-flex;flex-direction:column;align-items:center;gap:14px;margin-left:8px}"+
".rxt-pow{display:inline-flex;align-items:center;justify-content:center;gap:0;text-align:center;line-height:1;font-size:12px;letter-spacing:.04em;font-weight:700;text-transform:none}.rxt-pow .rxt-pow-by{color:#9fe870;letter-spacing:.06em;padding-right:.4em;font-size:12px}.rxt-pow .rxt-pow-word{display:inline-flex;align-items:center;gap:6px;font-size:17px;letter-spacing:0;line-height:1}.rxt-pow .rxt-pow-pin{display:block;width:26px;height:26px;object-fit:contain;flex:none;filter:drop-shadow(0 0 8px rgba(120,80,220,.55))}.rxt-pow .rxt-pow-mark{display:inline;letter-spacing:0;white-space:nowrap}.rxt-pow .rxt-pow-tel{color:#fff!important;letter-spacing:0}.rxt-pow .rxt-pow-a{color:#9b6cff!important;letter-spacing:0}"+
".rxt-pow a{color:inherit!important;font-weight:700;text-decoration:none;padding:0!important;background:none!important;box-shadow:none!important}.rxt-pow a:hover .rxt-pow-mark,.rxt-pow a:focus-visible .rxt-pow-mark{text-decoration:underline;text-underline-offset:3px}"+
".rxt-pills{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}"+
".rxt-pills a{display:inline-block;padding:6px 13px!important;border-radius:999px;background:linear-gradient(180deg,rgba(159,232,112,.22),rgba(159,232,112,.08));border:1px solid rgba(159,232,112,.65);color:#eaffd9!important;font-weight:700;font-size:13px;line-height:1.2;box-shadow:0 0 12px rgba(159,232,112,.28);transition:transform .15s,box-shadow .15s,background .15s;text-decoration:none}"+
".rxt-pills a:hover,.rxt-pills a:focus-visible{background:#9fe870;color:#0b1a12!important;box-shadow:0 0 20px rgba(159,232,112,.65);transform:translateY(-1px)}"+
".rxt-pills a[aria-current=page]{background:#9fe870;color:#0b1a12!important}"+
".rxt-mnav{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0 4px;border-top:1px solid rgba(255,255,255,.1);margin-top:8px}"+
".rxt-mnav .rxt-pills a{font-size:14px;padding:8px 14px!important}"+
".rxt-mbar{display:none}@media (max-width:600px){.rxt-mbar{display:flex;flex-direction:column;align-items:center;gap:16px;padding:14px 12px 16px;border-top:1px solid rgba(255,255,255,.1)}.rxt-mbar .rxt-pills{gap:8px}.rxt-mbar .rxt-pills{flex-wrap:nowrap}.rxt-mbar .rxt-pills a{font-size:14px;padding:8px 13px!important;white-space:nowrap}.rxt-mnav{display:none!important}}@media (max-width:380px){.rxt-mbar .rxt-pills{gap:5px}.rxt-mbar .rxt-pills a{font-size:13px;padding:7px 10px!important}}@media (max-width:330px){.rxt-mbar .rxt-pills{flex-wrap:wrap}}"+
".mk-toggle{display:none!important}.rxs-chrome{transition:box-shadow .2s ease}.rxs-chrome .announcement{overflow:hidden;max-height:80px;transition:max-height .22s ease,padding .22s ease,opacity .18s ease,border .18s ease}.rxs-chrome .site-header{transition:padding .2s ease,min-height .2s ease}.rxs-chrome .brand strong{transition:font-size .2s ease}.rxs-chrome .brand small{transition:opacity .18s ease,max-height .18s ease,margin .18s ease}.rxs-chrome .logo-frame,.rxs-chrome .brand img{transition:width .2s ease,height .2s ease,max-height .2s ease}.rxs-chrome .rxt-mbar{transition:padding .2s ease,gap .2s ease}.rxs-chrome .rxt-pills a{transition:padding .15s ease,font-size .15s ease,transform .15s}.rxs-chrome.rxs-chrome-compact{box-shadow:0 4px 14px rgba(0,0,0,.3)}.rxs-chrome.rxs-chrome-compact .announcement{max-height:0!important;padding-top:0!important;padding-bottom:0!important;opacity:0;border:0;min-height:0!important;pointer-events:none}.rxs-chrome.rxs-chrome-compact .site-header{min-height:0!important;padding-top:2px!important;padding-bottom:2px!important}.rxs-chrome.rxs-chrome-compact .site-header .wrap,.rxs-chrome.rxs-chrome-compact .site-header .inner,.rxs-chrome.rxs-chrome-compact .site-header>div{padding-top:0!important;padding-bottom:0!important;gap:6px!important}.rxs-chrome.rxs-chrome-compact .brand{gap:6px!important}.rxs-chrome.rxs-chrome-compact .brand small{opacity:0;max-height:0;overflow:hidden;margin:0;display:none}.rxs-chrome.rxs-chrome-compact .brand strong{font-size:13px;line-height:1.1}.rxs-chrome.rxs-chrome-compact .brand .brand-services{font-size:11px}.rxs-chrome.rxs-chrome-compact .logo-frame{width:28px!important;height:28px!important;max-width:28px}.rxs-chrome.rxs-chrome-compact .logo-frame img,.rxs-chrome.rxs-chrome-compact .brand img{width:28px!important;height:28px!important;max-height:28px!important}.rxs-chrome.rxs-chrome-compact .rxt-mbar{padding:2px 10px 4px!important;gap:4px!important;border-top-width:0!important}.rxs-chrome.rxs-chrome-compact .rxt-mbar .rxt-pills{gap:4px}.rxs-chrome.rxs-chrome-compact .rxt-mbar .rxt-pills a{padding:3px 8px!important;font-size:11px!important}.rxs-chrome.rxs-chrome-compact .rxt-nav{gap:2px;margin-left:4px}.rxs-chrome.rxs-chrome-compact .rxt-pow{transform:scale(.88);transform-origin:center}.rxs-chrome.rxs-chrome-compact .rxt-pow .rxt-pow-by{font-size:9px;padding-right:.3em}.rxs-chrome.rxs-chrome-compact .rxt-pow .rxt-pow-word{font-size:12px;gap:4px}.rxs-chrome.rxs-chrome-compact .rxt-pow .rxt-pow-pin{width:16px;height:16px}.rxs-chrome.rxs-chrome-compact .rxt-pills a{padding:3px 8px!important;font-size:11px!important}.rxs-chrome.rxs-chrome-compact .desktop-nav{gap:8px;font-size:12px}.rxs-chrome.rxs-chrome-compact .desktop-nav a{padding:2px 0!important}.rxs-chrome.rxs-chrome-compact .header-cta,.rxs-chrome.rxs-chrome-compact .cta-row,.rxs-chrome.rxs-chrome-compact .header-actions{transform:scale(.85);transform-origin:right center}.rxs-chrome.rxs-chrome-compact .header-cta a,.rxs-chrome.rxs-chrome-compact .cta-row a{padding:6px 10px!important;font-size:11px!important}";
// v24: on phones the Dating/Games frame is exactly the screen under the compact
// header and stays there while the page scrolls past its short footer, so the
// frame's own top (Back to Games, the Dating title) is never under the header.
CSS+="@media (max-width:640px){.rxe,.rxe-wrap{padding-bottom:0!important}.rxe-frame{position:sticky;top:var(--rxs-chrome-compact-h,92px);z-index:1}.rxe-frame iframe{height:calc(100vh - var(--rxs-chrome-compact-h,92px));height:calc(100dvh - var(--rxs-chrome-compact-h,92px));min-height:0}}";
CSS+=".rxt-badge[hidden]{display:none!important}.rxt-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;min-width:1.15em;height:1.15em;padding:0 4px;border-radius:999px;background:#ff4d6d;color:#fff;font-size:11px;line-height:1;font-weight:800;vertical-align:middle}.rxt-pills a[aria-current=page] .rxt-badge{background:#10210a;color:#c6f54a}";
var TELA_LINK=function(a){var h=a.getAttribute("href")||"";return h==="/marketplace"||h==="/chat"||h==="/dating"||h==="/games"||h==="/rooms"||h.indexOf("play#games")>-1};
var POW="Powered by Tel-a";
var busy=false;

function setText(el,t){if(el&&el.textContent!==t)el.textContent=t}

function ensureBrand(el){if(!el)return;if(el.getAttribute("data-brand")==="c17"&&el.querySelector(".rxt-pow-pin"))return;el.setAttribute("data-brand","c17");el.setAttribute("aria-label","Powered by Tel-a");while(el.firstChild)el.removeChild(el.firstChild);var by=document.createElement("span");by.className="rxt-pow-by";by.textContent="Powered by";var link=document.createElement("a");link.className="rxt-pow-word";link.href="https://tel-a.com/";link.target="_blank";link.rel="noopener noreferrer";link.setAttribute("aria-label","Tel-a");var pin=document.createElement("img");pin.className="rxt-pow-pin";pin.src="/assets/tela-pin-nav.png";pin.width=26;pin.height=26;pin.alt="";pin.decoding="async";var mark=document.createElement("span");mark.className="rxt-pow-mark";var tel=document.createElement("span");tel.className="rxt-pow-tel";tel.textContent="Tel-";var a=document.createElement("span");a.className="rxt-pow-a";a.textContent="a";mark.appendChild(tel);mark.appendChild(a);link.appendChild(pin);link.appendChild(mark);el.appendChild(by);el.appendChild(link)}
function refreshPow(){document.querySelectorAll(".rxt-pow").forEach(function(el){ensureBrand(el)});document.querySelectorAll("#rxt-cards .eyebrow, #rxt-cards .local-partner-card > .eyebrow").forEach(function(el){var t=el.textContent||"";if(/On RogueXServices\.com|ROGUEXSERVICES\.COM/i.test(t))setText(el,t.replace(/COMMUNITY\. ON ROGUEXSERVICES\.COM\./i,"COMMUNITY. POWERED BY TEL-A.").replace(/On RogueXServices\.com/i,"Powered by Tel-a"))});var sub=document.querySelector("#rxt-cards .rxt-sub");if(sub&&/RogueXServices\.com/.test(sub.textContent||""))setText(sub,(sub.textContent||"").replace(/Everything here stays on RogueXServices\.com\. Local to /,"Start using Tel-a right here. Everything here is local to "))}

var FRAME_ORIGIN="https://tela-web.roguecleaning.org";
var datingCount=0;
function badgeCount(n){n=Number(n);if(!isFinite(n)||n<=0)return 0;return Math.min(99,Math.floor(n))}
function paintBadge(key,count){if(key==="dating")datingCount=count;document.querySelectorAll('[data-rxt-badge="'+key+'"]').forEach(function(el){if(!count){if(el.hidden&&el.textContent==="")return;el.hidden=true;el.textContent="";return}var text=String(count);if(!el.hidden&&el.textContent===text)return;el.hidden=false;el.textContent=text})}
function acceptNotice(origin,data){if(origin!==FRAME_ORIGIN)return null;if(!data||data.source!=="tela-rxs-notices"||!data.dating||typeof data.dating!=="object")return null;return badgeCount(data.dating.unseenMatches)+badgeCount(data.dating.unreadMessages)}
function mark(root){var here=location.pathname.replace(/\/+$/,"")||"/";root.querySelectorAll(".rxt-pills a").forEach(function(a){if(a.getAttribute("href")===here)a.setAttribute("aria-current","page")})}
function nav(){document.querySelectorAll("nav.desktop-nav").forEach(function(n){if(n.querySelector(".rxt-nav"))return;Array.prototype.slice.call(n.querySelectorAll("a")).forEach(function(a){if(TELA_LINK(a))a.remove()});var d=document.createElement("div");d.className="rxt-nav";d.innerHTML=PILLS;n.appendChild(d);mark(d)});
document.querySelectorAll(".mobile-nav").forEach(function(n){if(n.querySelector(".rxt-mnav"))return;Array.prototype.slice.call(n.querySelectorAll("a")).forEach(function(a){if(TELA_LINK(a))a.remove()});var d=document.createElement("div");d.className="rxt-mnav";d.innerHTML=PILLS;n.appendChild(d);mark(d)});
document.querySelectorAll("header.site-header").forEach(function(h){if(h.querySelector(".rxt-mbar"))return;var d=document.createElement("div");d.className="rxt-mbar";d.innerHTML=PILLS;h.appendChild(d);mark(d)});paintBadge("dating",datingCount)}
window.addEventListener("message",function(e){var n=acceptNotice(e.origin,e.data);if(n===null)return;var ok=false;var frames=document.querySelectorAll("iframe");for(var i=0;i<frames.length;i++){if(frames[i].contentWindow===e.source)ok=true}if(!ok)return;paintBadge("dating",n)});
window.RXSNavBadge={acceptNotice:acceptNotice,paintBadge:paintBadge};
function cards(){var s=document.getElementById("rxt-cards");if(!s){var anchor=document.querySelector(".local-partners, section[class*=partner]")||document.querySelector("main section:nth-of-type(3)");if(!anchor)return;
s=document.createElement("section");s.id="rxt-cards";s.className="wrap";s.innerHTML='<p class="eyebrow">COMMUNITY. ON ROGUEXSERVICES.COM.</p><h2>Buy, sell, talk, meet, date and play</h2><p class="rxt-sub">Everything here stays on RogueXServices.com. Local to '+LOCAL+'.</p><div class="rxt-grid"></div>';anchor.parentNode.insertBefore(s,anchor)}
s.style.padding="32px 16px";var g=s.querySelector(".rxt-grid");if(g&&g.getAttribute("data-v7")!=="1"){g.innerHTML=CARDS;g.setAttribute("data-v7","1");g.removeAttribute("data-v4");var h=s.querySelector("h2");if(h)setText(h,"Buy, sell, talk, meet, date and play");var p=s.querySelector(".rxt-sub");if(p)setText(p,"Everything here stays on RogueXServices.com. Local to "+LOCAL+".")}}
function market(){var r=document.getElementById("mk-region");if(r)setText(r,LOCAL)}
function add(){if(busy)return;busy=true;try{if(!document.getElementById("rxt-css")&&document.head){var st=document.createElement("style");st.id="rxt-css";st.textContent=CSS;document.head.appendChild(st)}nav();cards();market();refreshPow()}finally{busy=false}lockChrome()}
new MutationObserver(function(){if(!busy)add()}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();

function lockChrome(){
  if(document.querySelector(".rxs-chrome")){bindChromeScroll();sizeChrome();return}
  var ann=document.querySelector(".announcement");
  var hdr=document.querySelector("header.site-header");
  if(!hdr)return;
  var wrap=document.createElement("div");
  wrap.className="rxs-chrome";
  wrap.setAttribute("data-rxs-lock","1");
  var spacer=document.createElement("div");
  spacer.className="rxs-chrome-spacer";
  spacer.setAttribute("aria-hidden","true");
  if(ann&&ann.parentNode===hdr.parentNode){
    hdr.parentNode.insertBefore(wrap, ann);
    wrap.appendChild(ann);
    wrap.appendChild(hdr);
  }else{
    hdr.parentNode.insertBefore(wrap, hdr);
    wrap.appendChild(hdr);
  }
  wrap.parentNode.insertBefore(spacer, wrap.nextSibling);
  bindChromeScroll();
  sizeChrome();
  window.addEventListener("resize", sizeChrome, {passive:true});
  if(window.ResizeObserver){
    try{new ResizeObserver(sizeChrome).observe(wrap)}catch(e){}
  }
}
function bindChromeScroll(){
  if(window.__rxsChromeScrollBound)return;
  window.__rxsChromeScrollBound=1;
  var ticking=false;
  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      var wrap=document.querySelector(".rxs-chrome");
      if(!wrap)return;
      // Two thresholds so the header cannot flip back and forth near one line.
      var y=window.scrollY||window.pageYOffset||0;
      var was=wrap.classList.contains("rxs-chrome-compact");
      var compact=was?y>8:y>40;
      if(compact===wrap.classList.contains("rxs-chrome-compact"))return;
      if(compact)wrap.classList.add("rxs-chrome-compact");
      else wrap.classList.remove("rxs-chrome-compact");
      sizeChrome();
    });
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
}
/* v24: the spacer keeps the full header height and never shrinks while
   scrolling. v23 resized it by about 120px each time the header compacted, so
   the page jumped under the finger (iOS has no scroll anchoring) and could
   stall near the top. The compact height is kept in --rxs-chrome-compact-h
   so the Dating and Games frame can fit exactly under it on phones. */
function sizeChrome(){
  var wrap=document.querySelector(".rxs-chrome");
  var spacer=document.querySelector(".rxs-chrome-spacer");
  if(!wrap||!spacer)return;
  clearTimeout(wrap.__rxsSettle);
  var measure=function(){
    var h=Math.ceil(wrap.getBoundingClientRect().height);
    if(wrap.classList.contains("rxs-chrome-compact")){
      document.documentElement.style.setProperty("--rxs-chrome-compact-h",h+"px");
      // Opened already scrolled down: give the spacer a height once; it grows to full when the header expands.
      if(!spacer.style.height)spacer.style.height=h+"px";
    }else if(spacer.style.height!==h+"px"){
      spacer.style.height=h+"px";
    }
  };
  if(!spacer.style.height)measure();
  // The header animates for 0.2s. Measure once it has settled, never mid-way.
  wrap.__rxsSettle=setTimeout(measure,260);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",lockChrome); else lockChrome();

})();