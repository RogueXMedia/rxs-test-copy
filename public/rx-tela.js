window.RXT=(function(){var API="https://tela-api.roguecleaning.org",SITEKEY="0x4AAAAAAF1_iy4bTad9uUnB",TELA="https://tela-web.roguecleaning.org";
function token(){var t=localStorage.getItem("rxt_guest");if(!t){var a=new Uint8Array(32);crypto.getRandomValues(a);t=Array.from(a,function(b){return b.toString(16).padStart(2,"0")}).join("");localStorage.setItem("rxt_guest",t)}return t}
function post(b){b.guestToken=b.guestToken||token();return fetch(API+"/public/market",{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(b)}).then(function(r){return r.json()})}
var me=null;function whoami(){return post({action:"whoami"}).then(function(d){me=d;return d.name||""})}
function loadTS(){return new Promise(function(ok){if(window.turnstile)return ok();var s=document.createElement("script");s.src="https://challenges.cloudflare.com/turnstile/v0/api.js";s.onload=function(){ok()};document.head.appendChild(s)})}
/* One quick human check per device unlocks chat and messages. */
function verify(holder){return (me?Promise.resolve(me):whoami().then(function(){return me})).then(function(d){if(d&&d.verified)return true;if(!SITEKEY)return false;return loadTS().then(function(){return new Promise(function(ok){holder.hidden=false;holder.innerHTML="";turnstile.render(holder,{sitekey:SITEKEY,callback:function(t){post({action:"verify",turnstile:t}).then(function(r){holder.hidden=true;if(r.verified){me.verified=true;ok(true)}else ok(false)})}})})})})}
function widget(holder){return loadTS().then(function(){holder.innerHTML="";return turnstile.render(holder,{sitekey:SITEKEY})})}
return{API:API,SITEKEY:SITEKEY,TELA:TELA,token:token,post:post,whoami:whoami,verify:verify,widget:widget}})();
