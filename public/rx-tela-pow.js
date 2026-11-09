/* RogueXServices.com community: nav pills, homepage cards, always-Local region. rxt-v8 2026-11-06 freeze fix */
(function(){var TELA="https://tela-web.roguecleaning.org",GAMES="/games",DATING="/dating",ROOMS="/rooms";
var LOCAL="Southern Oregon & Northern California";
var CARDS='<a class="local-partner-card" href="/marketplace"><span class="eyebrow">Powered by Tel-a</span><strong>Marketplace</strong><span class="lp-desc">Buy, sell and trade locally across Southern Oregon and Northern California. No account needed.</span><span class="lp-more">Open Marketplace</span></a>'+
'<a class="local-partner-card" href="/chat"><span class="eyebrow">Powered by Tel-a</span><strong>Chat</strong><span class="lp-desc">Join the RogueXServices.com room. No sign-up, just a friendly random name.</span><span class="lp-more">Open Chat</span></a>'+
'<a class="local-partner-card" href="'+ROOMS+'"><span class="eyebrow">Powered by Tel-a</span><strong>Rooms</strong><span class="lp-desc">Open a live room, invite people, and chat. Text chat works here. No account needed.</span><span class="lp-more">Open Rooms</span></a>'+
'<a class="local-partner-card" href="'+DATING+'"><span class="eyebrow">Powered by Tel-a</span><strong>Dating</strong><span class="lp-desc">18+ local dating for Southern Oregon and Northern California. A private dating name, a pick-up line, no photos.</span><span class="lp-more">Open Dating</span></a>'+
'<a class="local-partner-card" href="'+GAMES+'"><span class="eyebrow">Powered by Tel-a</span><strong>Games</strong><span class="lp-desc">Play chess, checkers and more in your browser with neighbors. No account, no download.</span><span class="lp-more">Play now</span></a>';
var PILLS='<span class="rxt-pow">Powered by Tel-a</span><span class="rxt-pills"><a href="/marketplace">Marketplace</a><a href="/chat">Chat</a><a href="'+ROOMS+'">Rooms</a><a href="'+DATING+'">Dating</a><a href="'+GAMES+'">Games</a></span>';
var CSS=".rxt-sub{margin:4px 0 0;opacity:.8}.rxt-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:12px}"+
".rxt-nav{display:inline-flex;flex-direction:column;align-items:center;gap:14px;margin-left:8px}"+
".rxt-pow{display:inline-flex;align-items:baseline;justify-content:center;gap:0;text-align:center;line-height:1.1;font-size:12px;letter-spacing:.04em;font-weight:700;text-transform:none}.rxt-pow .rxt-pow-by{color:#9fe870;letter-spacing:.06em}.rxt-pow .rxt-pow-tel{color:#fff;letter-spacing:0}.rxt-pow .rxt-pow-a{color:#9b6cff;letter-spacing:0}"+
".rxt-pow a{color:#c6ff9a!important;font-weight:700;text-decoration:underline;text-underline-offset:2px;padding:0!important;background:none!important;box-shadow:none!important}"+
".rxt-pills{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}"+
".rxt-pills a{display:inline-block;padding:6px 13px!important;border-radius:999px;background:linear-gradient(180deg,rgba(159,232,112,.22),rgba(159,232,112,.08));border:1px solid rgba(159,232,112,.65);color:#eaffd9!important;font-weight:700;font-size:13px;line-height:1.2;box-shadow:0 0 12px rgba(159,232,112,.28);transition:transform .15s,box-shadow .15s,background .15s;text-decoration:none}"+
".rxt-pills a:hover,.rxt-pills a:focus-visible{background:#9fe870;color:#0b1a12!important;box-shadow:0 0 20px rgba(159,232,112,.65);transform:translateY(-1px)}"+
".rxt-pills a[aria-current=page]{background:#9fe870;color:#0b1a12!important}"+
".rxt-mnav{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0 4px;border-top:1px solid rgba(255,255,255,.1);margin-top:8px}"+
".rxt-mnav .rxt-pills a{font-size:14px;padding:8px 14px!important}"+
".rxt-mbar{display:none}@media (max-width:600px){.rxt-mbar{display:flex;flex-direction:column;align-items:center;gap:16px;padding:14px 12px 16px;border-top:1px solid rgba(255,255,255,.1)}.rxt-mbar .rxt-pills{gap:8px}.rxt-mbar .rxt-pills{flex-wrap:nowrap}.rxt-mbar .rxt-pills a{font-size:14px;padding:8px 13px!important;white-space:nowrap}.rxt-mnav{display:none!important}}@media (max-width:380px){.rxt-mbar .rxt-pills{gap:5px}.rxt-mbar .rxt-pills a{font-size:13px;padding:7px 10px!important}}@media (max-width:330px){.rxt-mbar .rxt-pills{flex-wrap:wrap}}"+
".mk-toggle{display:none!important}";
var TELA_LINK=function(a){var h=a.getAttribute("href")||"";return h==="/marketplace"||h==="/chat"||h==="/dating"||h==="/games"||h==="/rooms"||h.indexOf("play#games")>-1};
var POW="Powered by Tel-a";
var busy=false;

function setText(el,t){if(el&&el.textContent!==t)el.textContent=t}

function ensureBrand(el){if(!el||el.getAttribute("data-brand")==="1")return;el.setAttribute("data-brand","1");el.setAttribute("aria-label","Powered by Tel-a");while(el.firstChild)el.removeChild(el.firstChild);var by=document.createElement("span");by.className="rxt-pow-by";by.textContent="Powered by ";var tel=document.createElement("span");tel.className="rxt-pow-tel";tel.textContent="Tel-";var a=document.createElement("span");a.className="rxt-pow-a";a.textContent="a";el.appendChild(by);el.appendChild(tel);el.appendChild(a)}
function refreshPow(){document.querySelectorAll(".rxt-pow").forEach(function(el){ensureBrand(el)});document.querySelectorAll("#rxt-cards .eyebrow, #rxt-cards .local-partner-card > .eyebrow").forEach(function(el){var t=el.textContent||"";if(/On RogueXServices\.com|ROGUEXSERVICES\.COM/i.test(t))setText(el,t.replace(/COMMUNITY\. ON ROGUEXSERVICES\.COM\./i,"COMMUNITY. POWERED BY TEL-A.").replace(/On RogueXServices\.com/i,"Powered by Tel-a"))});var sub=document.querySelector("#rxt-cards .rxt-sub");if(sub&&/RogueXServices\.com/.test(sub.textContent||""))setText(sub,(sub.textContent||"").replace(/Everything here stays on RogueXServices\.com\. Local to /,"Start using Tel-a right here. Everything here is local to "))}

function mark(root){var here=location.pathname.replace(/\/+$/,"")||"/";root.querySelectorAll(".rxt-pills a").forEach(function(a){if(a.getAttribute("href")===here)a.setAttribute("aria-current","page")})}
function nav(){document.querySelectorAll("nav.desktop-nav").forEach(function(n){if(n.querySelector(".rxt-nav"))return;Array.prototype.slice.call(n.querySelectorAll("a")).forEach(function(a){if(TELA_LINK(a))a.remove()});var d=document.createElement("div");d.className="rxt-nav";d.innerHTML=PILLS;n.appendChild(d);mark(d)});
document.querySelectorAll(".mobile-nav").forEach(function(n){if(n.querySelector(".rxt-mnav"))return;Array.prototype.slice.call(n.querySelectorAll("a")).forEach(function(a){if(TELA_LINK(a))a.remove()});var d=document.createElement("div");d.className="rxt-mnav";d.innerHTML=PILLS;n.appendChild(d);mark(d)});
document.querySelectorAll("header.site-header").forEach(function(h){if(h.querySelector(".rxt-mbar"))return;var d=document.createElement("div");d.className="rxt-mbar";d.innerHTML=PILLS;h.appendChild(d);mark(d)})}
function cards(){var s=document.getElementById("rxt-cards");if(!s){var anchor=document.querySelector(".local-partners, section[class*=partner]")||document.querySelector("main section:nth-of-type(3)");if(!anchor)return;
s=document.createElement("section");s.id="rxt-cards";s.className="wrap";s.innerHTML='<p class="eyebrow">COMMUNITY. ON ROGUEXSERVICES.COM.</p><h2>Buy, sell, talk, meet, date and play.</h2><p class="rxt-sub">Everything here stays on RogueXServices.com. Local to '+LOCAL+'.</p><div class="rxt-grid"></div>';anchor.parentNode.insertBefore(s,anchor)}
s.style.padding="32px 16px";var g=s.querySelector(".rxt-grid");if(g&&g.getAttribute("data-v7")!=="1"){g.innerHTML=CARDS;g.setAttribute("data-v7","1");g.removeAttribute("data-v4");var h=s.querySelector("h2");if(h)setText(h,"Buy, sell, talk, meet, date and play.");var p=s.querySelector(".rxt-sub");if(p)setText(p,"Everything here stays on RogueXServices.com. Local to "+LOCAL+".")}}
function market(){var r=document.getElementById("mk-region");if(r)setText(r,LOCAL)}
function add(){if(busy)return;busy=true;try{if(!document.getElementById("rxt-css")&&document.head){var st=document.createElement("style");st.id="rxt-css";st.textContent=CSS;document.head.appendChild(st)}nav();cards();market();refreshPow()}finally{busy=false}}
new MutationObserver(function(){if(!busy)add()}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();
})();
