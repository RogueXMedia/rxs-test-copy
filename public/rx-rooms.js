/* RogueXServices.com Rooms: real Tel-a rooms over the signed Tel-a API. Polling only (CSP connect-src https). */
(function(){
var API="https://tela-api.roguecleaning.org",TELA="https://tela-web.roguecleaning.org";
var $=function(i){return document.getElementById(i)};
var enc=new TextEncoder();
function hex(b){return Array.from(new Uint8Array(b),function(x){return x.toString(16).padStart(2,"0")}).join("")}
function b64(b){var s="",a=new Uint8Array(b);for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function rnd(n){var a=new Uint8Array(n);crypto.getRandomValues(a);return hex(a)}
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var PAL=["#B48CFF","#5BE49B","#FFB86B","#6BC8FF","#FF7AB8","#F5E663","#8AF0E0","#FF8F6B"];
function color(n){var h=0;n=String(n||"");for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))|0;return PAL[Math.abs(h)%PAL.length]}
var me=null,skew=0;
function identity(){
  var saved=null;try{saved=JSON.parse(localStorage.getItem("rxrooms_id")||"null")}catch(e){}
  if(saved&&saved.jwk)return crypto.subtle.importKey("jwk",saved.jwk,{name:"ECDSA",namedCurve:"P-256"},false,["sign"]).then(function(k){me={id:saved.id,key:k,pub:saved.pub,name:saved.name||""};return me});
  return crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]).then(function(kp){
    return Promise.all([crypto.subtle.exportKey("spki",kp.publicKey),crypto.subtle.exportKey("jwk",kp.privateKey)]).then(function(r){
      me={id:"u"+rnd(10),key:kp.privateKey,pub:b64(r[0]),name:"",fresh:true};
      localStorage.setItem("rxrooms_id",JSON.stringify({id:me.id,pub:me.pub,jwk:r[1]}));return me})})}
function req(path,method,json){
  method=method||"GET";var body=json===undefined?"":JSON.stringify(json);
  return crypto.subtle.digest("SHA-256",enc.encode(body)).then(function(h){
    var ts=Date.now()+skew,nonce=rnd(16),u=new URL(path,API);
    var payload="tela-req2:"+me.id+":"+ts+":"+nonce+":"+method+":"+u.pathname+u.search+":"+hex(h);
    return crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},me.key,enc.encode(payload)).then(function(sig){
      var hd={"X-Tela-Sig-V":"2","X-Tela-User":me.id,"X-Tela-Ts":String(ts),"X-Tela-Nonce":nonce,"X-Tela-Sig":b64(sig)};
      if(json!==undefined)hd["Content-Type"]="application/json";
      return fetch(u,{method:method,headers:hd,body:method==="GET"?undefined:body}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok)throw new Error(j.error||("HTTP "+r.status));return j})})})})}
function clock(){return fetch(API+"/ping",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){if(j.now)skew=Date.parse(j.now)-Date.now()}).catch(function(){})}
function register(){return req("/profile/register","POST",{id:me.id,nickname:"",age:18,avatarStyle:"adventurer",avatarSeed:me.id,lat:0,lng:0,hasLocation:false,publicKey:me.pub,platform:"web",appVersion:"rxs-rooms-1",deviceId:"rx"+me.id,capabilities:[]}).then(function(j){me.name=j.nickname||me.name;var s=JSON.parse(localStorage.getItem("rxrooms_id"));s.name=me.name;localStorage.setItem("rxrooms_id",JSON.stringify(s));$("ch-name").textContent=me.name})}
var rooms=[],cur=null,seen={},names={},timer=null;
function listRooms(){return req("/rooms?userId="+me.id+"&scope=worldwide").then(function(j){rooms=(j.rooms||[]).filter(function(r){return /^room_/.test(r.id)&&r.discoverMiles===0});drawList()})}
function drawList(){
  var el=$("rm-list");$("rm-total").textContent=rooms.length+" open";
  if(!rooms.length){el.innerHTML='<p class="ch-sys">No rooms open right now. Name one above to start.</p>';return}
  el.innerHTML="";rooms.slice(0,40).forEach(function(r){var a=document.createElement("a");a.href="#"+r.id;a.className="ch-room"+(cur&&cur.id===r.id?" here rm-on":"");
    a.innerHTML='<span class="ch-ic" aria-hidden="true">💬</span><span class="ch-rt"><b>'+esc(r.name)+'</b><small>'+esc(r.topic||r.category||"")+'</small></span><span class="ch-pill">'+(r.activeNow?"Live":"Open")+'</span>';
    a.onclick=function(e){e.preventDefault();enter(r)};el.appendChild(a)})}
function line(m){var n=m.senderNickname||names[m.sender]||(m.sender===me.id?me.name:"Guest");var el=document.createElement("div");el.className="ch-msg";
  el.innerHTML='<b style="color:'+color(n)+'">'+esc(n)+':</b>'+esc(m.text)+"<small>"+new Date(m.createdAt).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})+"</small>";return el}
function nameOf(id){if(names[id]||id===me.id)return Promise.resolve();return req("/user?id="+encodeURIComponent(id)).then(function(j){if(j.user)names[id]=j.user.nickname}).catch(function(){names[id]="Guest"})}
function poll(){if(!cur)return;var id=cur.id;
  req("/room/history?room="+id+"&userId="+me.id).then(function(j){if(!cur||cur.id!==id)return;var msgs=(j.messages||[]).filter(function(m){return m.type==="text"&&!seen[m.id]});
    return Promise.all(msgs.map(function(m){return nameOf(m.sender)})).then(function(){var log=$("ch-log");if(msgs.length&&log.querySelector(".ch-sys"))log.innerHTML="";
      msgs.sort(function(a,b){return a.createdAt-b.createdAt}).forEach(function(m){seen[m.id]=1;log.appendChild(line(m))});if(msgs.length)log.scrollTop=log.scrollHeight})}).catch(function(){});
  var r=rooms.filter(function(x){return x.id===id})[0]||cur;var n=Math.max(r.members||0,1);
  $("rm-people").textContent="Live room. Messages show up here in a few seconds. Share this page to invite people.";}
function enter(r){cur=r;seen={};$("rm-title").textContent=r.name;$("rm-sub").textContent="Worldwide room";$("ch-log").innerHTML='<p class="ch-sys">Joining...</p>';
  $("rm-tela").href=TELA+"/play#rooms";drawList();
  req("/rooms/join","POST",{roomId:r.id,userId:me.id}).catch(function(e){if(e.message!=="already a member")$("ch-log").innerHTML='<p class="ch-sys">Could not join: '+esc(e.message)+'</p>'}).then(function(){
    $("ch-text").disabled=false;$("ch-send").disabled=false;$("ch-log").innerHTML='<p class="ch-sys">You are in. Say hi.</p>';poll();clearInterval(timer);timer=setInterval(poll,3000);history.replaceState(null,"","#"+r.id)})}
$("ch-form").onsubmit=function(e){e.preventDefault();var t=$("ch-text").value.trim();if(!t||!cur)return;$("ch-text").value="";
  req("/room/send?room="+cur.id+"&userId="+me.id,"POST",{action:"send",type:"text",text:t,clientRef:rnd(8)}).then(poll).catch(function(err){$("ch-text").value=t;alert("Message not sent: "+err.message)})};
$("rm-new").onsubmit=function(e){e.preventDefault();var n=$("rm-name").value.trim();if(!n)return;
  req("/rooms/create","POST",{userId:me.id,name:n,topic:"Opened on RogueXServices.com",isPrivate:false,expiresInHours:0,starter:"",discoverMiles:0,requestId:rnd(8)}).then(function(j){$("rm-name").value="";var r=j.room;rooms.unshift(r);enter(r)}).catch(function(err){alert("Could not open the room: "+err.message)})};
clock().then(identity).then(register).then(listRooms).then(function(){var h=location.hash.slice(1);var r=rooms.filter(function(x){return x.id===h})[0];if(r)enter(r);setInterval(listRooms,20000)}).catch(function(e){$("rm-list").innerHTML='<p class="ch-sys">Rooms are not reachable right now. Try again soon.</p>';console.error(e)});
})();
