/* ═══════════════════════════════════════
   JJK CURSED ARCHIVE — main.js
═══════════════════════════════════════ */

/* ─── AUDIO SOURCE ───
   Paste your audio file name or URL here */
const AUDIO_SRC = "domain_expansion_full.mp3";

/* ─── STATE ─── */
let transitionStarted = false;
let currentChar = "gojo";
let streakInterval = null;

const AURA = {
  gojo:    { cols:["rgba(0,207,255,0.9)","rgba(0,150,255,0.7)","rgba(100,230,255,0.5)"],  streak:"rgba(0,207,255,0.5)",  swirl:"rgba(0,207,255,0.15)" },
  itadori: { cols:["rgba(255,100,0,0.9)","rgba(255,50,0,0.7)","rgba(255,180,50,0.6)"],    streak:"rgba(255,100,0,0.5)",  swirl:"rgba(255,100,0,0.15)" },
  megumi:  { cols:["rgba(130,60,255,0.9)","rgba(80,20,220,0.7)","rgba(180,100,255,0.5)"], streak:"rgba(120,60,255,0.5)", swirl:"rgba(100,40,255,0.15)" },
  sukuna:  { cols:["rgba(200,20,0,0.9)","rgba(180,0,0,0.8)","rgba(255,60,0,0.5)"],        streak:"rgba(200,0,0,0.6)",    swirl:"rgba(180,0,0,0.18)" },
  toji:    { cols:["rgba(0,200,180,0.8)","rgba(0,150,140,0.6)","rgba(0,255,220,0.4)"],    streak:"rgba(0,200,180,0.4)",  swirl:"rgba(0,180,150,0.12)" }
};
const CHAR_ORDER = ["gojo","itadori","megumi","sukuna","toji"];

/* ════════════════════════════════════
   LOADING PAGE
════════════════════════════════════ */
window.addEventListener("DOMContentLoaded", function() {
  initLoading();
});

function initLoading() {
  // Counter + bar
  let n = 0;
  const pctEl  = document.getElementById("ld-pct");
  const fillEl = document.getElementById("ld-fill");
  const tick = setInterval(function() {
    n += Math.floor(Math.random()*7) + 2;
    if (n >= 100) { n = 100; clearInterval(tick); onLoadComplete(); }
    if (pctEl)  pctEl.textContent  = String(n).padStart(3,"0");
    if (fillEl) fillEl.style.width = n + "%";
  }, 55);

  // Logo char drop
  const logoEl = document.getElementById("ld-logo-text");
  if (logoEl) {
    "JUJUTSU KAISEN".split("").forEach(function(ch, i) {
      const s = document.createElement("span");
      s.className = "lc";
      s.textContent = ch === " " ? "\u00a0" : ch;
      s.style.animationDelay = (1.8 + i * 0.075) + "s";
      logoEl.appendChild(s);
    });
  }

  // Particles
  const pCont = document.getElementById("ld-particles");
  if (pCont) {
    const cols = ["rgba(0,207,255,0.8)","rgba(204,0,0,0.7)","rgba(212,162,0,0.6)","rgba(255,255,255,0.4)"];
    for (let i = 0; i < 70; i++) {
      const p   = document.createElement("div");
      p.className = "ld-particle";
      const sz  = Math.random()*3.5 + 0.8;
      const col = cols[Math.floor(Math.random()*cols.length)];
      const dx  = (Math.random()-0.5)*180;
      const dur = Math.random()*7 + 5;
      const del = Math.random()*6 + 2;
      p.style.cssText = "width:"+sz+"px;height:"+sz+"px;left:"+Math.random()*100+"%;bottom:"+Math.random()*20+"%;background:"+col+";--dx:"+dx+"px;animation-duration:"+dur+"s;animation-delay:"+del+"s;box-shadow:0 0 "+(sz*4)+"px currentColor;";
      pCont.appendChild(p);
    }
  }

  // Slash spawner
  const slashCont = document.getElementById("ld-slash-container");
  function spawnLdSlash() {
    if (!slashCont) return;
    const s = document.createElement("div");
    s.className = "ld-slash";
    const blue = Math.random() > 0.4;
    const col  = blue ? "rgba(0,207,255,0.5)" : "rgba(204,0,0,0.4)";
    const dur  = Math.random()*1.2 + 1.2;
    s.style.cssText = "top:"+Math.random()*100+"%;left:"+Math.random()*30+"%;width:"+(Math.random()*35+15)+"%;transform:rotate("+(Math.random()-0.5)*8+"deg);background:linear-gradient(90deg,transparent,"+col+",transparent);animation-duration:"+dur+"s;";
    slashCont.appendChild(s);
    setTimeout(function(){ s.remove(); }, 2500);
  }
  setTimeout(function(){ spawnLdSlash(); setInterval(spawnLdSlash, 2000); }, 2000);

  // Auto-enter
  setTimeout(function(){ if (!transitionStarted) enterDomain(); }, 12000);
}

function onLoadComplete() {
  const loader  = document.getElementById("loader");
  const ldScene = document.getElementById("ld-scene");
  if (loader)  loader.classList.add("done");
  if (ldScene) ldScene.classList.add("visible");
}

/* ════════════════════════════════════
   ENTER DOMAIN
════════════════════════════════════ */
function enterDomain() {
  if (transitionStarted) return;
  transitionStarted = true;

  const btn = document.getElementById("ld-enter-btn");
  if (btn) btn.disabled = true;

  const audio = new Audio(AUDIO_SRC);
  audio.volume = 1;
  audio.play().catch(function(e){ console.warn("Audio blocked:", e); });

  // Store for later (audio keeps playing through chars page)
  window._jjkAudio = audio;

  setTimeout(function(){ domainExpansion(); }, 5000);
}

/* ════════════════════════════════════
   DOMAIN EXPANSION ANIMATION
════════════════════════════════════ */
function domainExpansion() {
  const overlay = document.getElementById("de-overlay");
  const deBg    = document.getElementById("de-bg");
  const deText  = document.getElementById("de-text");
  const deRings = document.getElementById("de-rings");
  const deSps   = document.getElementById("de-spirals");
  const deSlash = document.getElementById("de-slashes");
  const deFlash = document.getElementById("de-flash");
  const ldPage  = document.getElementById("loading-page");
  const chPage  = document.getElementById("chars-page");

  if (!overlay) { console.error("ERROR: #de-overlay not found"); return; }

  overlay.classList.add("active");
  overlay.style.transition = "opacity 0.5s ease";
  overlay.style.opacity    = "1";
  deBg.style.transition    = "opacity 0.5s ease";
  deBg.style.opacity       = "1";

  setTimeout(function(){ shake(); }, 400);

  setTimeout(function(){
    deText.style.transition = "opacity 0.5s ease";
    deText.style.opacity    = "1";
  }, 600);

  setTimeout(function(){
    var sizes  = [150,300,500,750,1100];
    sizes.forEach(function(sz, i) {
      const r   = document.createElement("div");
      r.className = "de-ring";
      const col = (i%2===0) ? "rgba(200,0,0,0.7)" : "rgba(0,207,255,0.4)";
      r.style.cssText = "width:"+sz+"px;height:"+sz+"px;border-color:"+col+";animation-delay:"+(i*0.2)+"s;";
      deRings.appendChild(r);
    });
  }, 900);

  setTimeout(function(){
    var spirals = [[350,9,1.4,false],[550,13,0.9,true],[750,18,1.8,false]];
    spirals.forEach(function(sp) {
      const s = document.createElement("div");
      s.className = "de-spiral";
      var style = "width:"+sp[0]+"px;height:"+sp[0]+"px;animation-duration:"+sp[1]+"s,"+sp[2]+"s;";
      if (sp[3]) style += "animation-name:deSpinReverse,deSpiralPulse;";
      s.style.cssText = style;
      deSps.appendChild(s);
    });
    deSps.style.transition = "opacity 0.8s ease";
    deSps.style.opacity    = "1";
  }, 1200);

  setTimeout(function(){ slashWave(deSlash, 8, false); }, 1500);
  setTimeout(function(){ shake(true); }, 2200);
  setTimeout(function(){ crackBurst(deSlash, 16); }, 2500);
  setTimeout(function(){ slashWave(deSlash, 10, true); }, 3000);
  setTimeout(function(){ vertSlash(deSlash, 5); }, 3500);
  setTimeout(function(){ shake(); }, 3800);
  setTimeout(function(){ crackBurst(deSlash, 22); }, 4000);
  setTimeout(function(){
    for (var i=0; i<4; i++) {
      (function(idx){ setTimeout(function(){ slashWave(deSlash, 7, idx%2===1); }, idx*180); })(i);
    }
  }, 4400);
  setTimeout(function(){ shake(true); }, 4800);

  // WHITE FLASH
  setTimeout(function(){
    deFlash.style.opacity = "1";
  }, 5100);

  // Reveal characters
  setTimeout(function(){
    deFlash.style.transition = "opacity 0.8s ease";
    deFlash.style.opacity    = "0";
    overlay.style.transition = "opacity 0.8s ease";
    overlay.style.opacity    = "0";
    ldPage.style.transition  = "opacity 0.4s ease";
    ldPage.style.opacity     = "0";
    chPage.classList.add("visible");
  }, 5400);

  // Clean up
  setTimeout(function(){
    ldPage.style.display  = "none";
    overlay.style.display = "none";
    initCharsPage();
  }, 6200);
}

/* ─── Helpers ─── */
function shake(hard) {
  document.body.classList.remove("shaking");
  void document.body.offsetWidth;
  document.body.classList.add("shaking");
  setTimeout(function(){ document.body.classList.remove("shaking"); }, hard ? 900 : 650);
}

function slashWave(container, count, diagonal) {
  for (var i=0; i<count; i++) {
    (function(idx){
      setTimeout(function(){
        var s = document.createElement("div");
        s.className = "de-slash-h";
        var dur = (Math.random()*0.35+0.45).toFixed(2);
        var rot = diagonal ? (Math.random()-0.5)*40 : (Math.random()-0.5)*8;
        s.style.cssText = "top:"+Math.random()*100+"%;left:-5%;width:"+(Math.random()*50+40)+"%;transform:rotate("+rot+"deg);animation-duration:"+dur+"s;";
        container.appendChild(s);
        setTimeout(function(){ s.remove(); }, 900);
      }, idx*95);
    })(i);
  }
}

function vertSlash(container, count) {
  for (var i=0; i<count; i++) {
    (function(idx){
      setTimeout(function(){
        var s = document.createElement("div");
        s.className = "de-slash-v";
        s.style.cssText = "top:-5%;left:"+Math.random()*85+"%;height:110%;animation-duration:"+(Math.random()*0.3+0.4).toFixed(2)+"s;";
        container.appendChild(s);
        setTimeout(function(){ s.remove(); }, 900);
      }, idx*120);
    })(i);
  }
}

function crackBurst(container, count) {
  for (var i=0; i<count; i++) {
    (function(idx){
      setTimeout(function(){
        var c = document.createElement("div");
        c.className = "de-crack";
        c.style.cssText = "top:"+Math.random()*100+"%;left:"+Math.random()*50+"%;width:"+(Math.random()*35+10)+"%;transform:rotate("+(Math.random()-0.5)*35+"deg);animation-duration:"+(Math.random()*0.25+0.2).toFixed(2)+"s;";
        container.appendChild(c);
        setTimeout(function(){ c.remove(); }, 1200);
      }, idx*80);
    })(i);
  }
}

/* ════════════════════════════════════
   CHARACTER PAGE
════════════════════════════════════ */
function initCharsPage() {
  // Marquee
  var mi = document.getElementById("mi");
  if (mi && mi.children.length === 0) {
    var texts = ["呪術廻戦","JUJUTSU KAISEN","呪霊祓除","CURSED SPIRIT EXORCISM","領域展開","DOMAIN EXPANSION","虚式","HOLLOW TECHNIQUE","悪鬼羅刹","KING OF CURSES","十種影法術","TEN SHADOWS"];
    for (var r=0; r<3; r++) {
      texts.forEach(function(t){
        var s = document.createElement("span");
        s.textContent = t;
        mi.appendChild(s);
      });
    }
  }

  CHAR_ORDER.forEach(function(id){ spawnAura(id); });

  document.querySelectorAll(".char-tab").forEach(function(tab){
    tab.addEventListener("click", function(){ switchChar(tab.dataset.target); });
  });

  document.addEventListener("keydown", function(e){
    var idx = CHAR_ORDER.indexOf(currentChar);
    if (e.key === "ArrowRight" && idx < CHAR_ORDER.length-1) switchChar(CHAR_ORDER[idx+1]);
    if (e.key === "ArrowLeft"  && idx > 0)                   switchChar(CHAR_ORDER[idx-1]);
  });

  var active = document.querySelector(".char-page.active");
  if (active) startStreaks(active);

  var mobBtn = document.getElementById("mob-toggle");
  if (mobBtn) {
    mobBtn.addEventListener("click", function(){
      mobBtn.classList.toggle("open");
      document.getElementById("mob-nav").classList.toggle("open");
    });
  }
}

function switchChar(target) {
  if (target === currentChar) return;
  var flash = document.getElementById("char-flash");
  flash.classList.add("on");
  setTimeout(function(){
    document.querySelectorAll(".char-page").forEach(function(p){ p.classList.remove("active"); });
    document.querySelectorAll(".char-tab").forEach(function(t){ t.classList.remove("active"); });
    document.querySelectorAll(".mob-link").forEach(function(l){ l.classList.toggle("mob-active", l.dataset.char === target); });
    var tp = document.querySelector("[data-char='"+target+"']");
    var tb = document.querySelector(".char-tab[data-target='"+target+"']");
    if (tp) tp.classList.add("active");
    if (tb) tb.classList.add("active");
    currentChar = target;
    startStreaks(tp);
    flash.classList.remove("on");
  }, 150);
}

function spawnAura(charId) {
  var container = document.getElementById("ac-"+charId);
  if (!container) return;
  var data = AURA[charId];
  if (!data) return;
  container.innerHTML = "";
  for (var i=0; i<55; i++) {
    var p  = document.createElement("div");
    p.className = "ap";
    var sz  = Math.random()*3 + 0.6;
    var col = data.cols[Math.floor(Math.random()*data.cols.length)];
    var dx  = (Math.random()-0.5)*220;
    p.style.cssText = "width:"+sz+"px;height:"+sz+"px;left:"+Math.random()*100+"%;bottom:"+Math.random()*12+"%;background:"+col+";--dx:"+dx+"px;animation-duration:"+(Math.random()*8+5)+"s;animation-delay:"+(Math.random()*7)+"s;box-shadow:0 0 "+(sz*5)+"px currentColor;";
    container.appendChild(p);
  }
  for (var j=0; j<3; j++) {
    var s  = document.createElement("div");
    s.className = "swirl";
    var sz2 = Math.random()*300+150;
    var d1  = Math.random()*25+18;
    var d2  = Math.random()*3+2;
    s.style.cssText = "width:"+sz2+"px;height:"+sz2+"px;left:"+(20+Math.random()*60)+"%;top:"+(10+Math.random()*60)+"%;transform:translate(-50%,-50%);border-color:"+data.swirl+";animation-duration:"+d1+"s,"+d2+"s;";
    container.appendChild(s);
  }
}

function spawnStreak(page) {
  if (!page || !page.classList.contains("active")) return;
  var id  = page.dataset.char;
  var col = (AURA[id] && AURA[id].streak) || "rgba(255,255,255,0.3)";
  var s   = document.createElement("div");
  s.className = "streak";
  s.style.cssText = "top:"+Math.random()*100+"%;left:"+Math.random()*25+"%;width:"+(Math.random()*30+12)+"%;transform:rotate("+(Math.random()-0.5)*12+"deg);background:linear-gradient(90deg,transparent,"+col+",transparent);animation-duration:"+(Math.random()*1.5+1)+"s;";
  page.appendChild(s);
  setTimeout(function(){ s.remove(); }, 2600);
}

function startStreaks(page) {
  if (streakInterval) clearInterval(streakInterval);
  streakInterval = setInterval(function(){ spawnStreak(page); }, 2000);
  spawnStreak(page);
}
