/* ====== EDIT BAGIAN INI ====== */
const CONFIG = {
  // Link Johari Finds (isi sama URL asli, contoh: https://instagram.com/akunmu)
  johariInstagram: "https://instagram.com/",
  johariShopee: "https://shopee.co.id/",

  // Sertifikat: ganti title, issuer, date, dan url (link Google Drive).
  // Tambah/hapus objek sesuka lo.
  // Logo skill: file di img/skills/<file>.svg (atau .png). Ganti file-nya buat pakai logo resmi.
  skills: [
    { name: "HTML", file: "html5" },
    { name: "CSS", file: "css3" },
    { name: "PHP", file: "php" },
    { name: "SQL", file: "sql" },
    { name: "PostgreSQL", file: "postgresql" },
    { name: "Figma", file: "figma" },
    { name: "Cisco Packet Tracer", file: "packettracer" },
    { name: "GNS3", file: "gns3" },
    { name: "SmartPLS", file: "smartpls" }
  ],

  certificates: [
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "" }
  ]
};
/* ============================= */

// Johari Finds links
document.getElementById("jf-ig").href = CONFIG.johariInstagram;
document.getElementById("jf-shopee").href = CONFIG.johariShopee;

// Foto kolase: taruh file di folder img/ dengan nama photo-1.jpg ... photo-4.jpg
document.querySelectorAll(".tile[data-photo]").forEach(t => {
  const img = new Image();
  img.onload = () => { t.style.backgroundImage = `url("${img.src}")`; };
  img.src = t.dataset.photo;
});

// Certifications: seluruh kartu = link ke sertifikat
const certBox = document.getElementById("certs");
CONFIG.certificates.forEach(c => {
  const a = document.createElement("a");
  a.className = "cert";
  a.href = c.url || "#certifications";
  if (c.url) { a.target = "_blank"; a.rel = "noopener"; }
  a.innerHTML = `<div class="cthumb">certificate</div><h3></h3><p></p>`;
  a.querySelector("h3").textContent = c.title;
  a.querySelector("p").textContent = [c.issuer, c.date].filter(Boolean).join(", ");
  certBox.appendChild(a);
});

// Underline scribble draws when heading scrolls in
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .6 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Projects carousel
const stage = document.getElementById("stage");
const cards = [...stage.children];
const count = document.getElementById("count");
let cur = 0;
function render() {
  const n = cards.length;
  cards.forEach((c, i) => {
    let d = i - cur;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    const abs = Math.abs(d);
    c.style.transform = `translateX(${d * 62}%) translateZ(${-abs * 120}px) rotateY(${-d * 32}deg)`;
    c.style.opacity = abs > 1 ? 0 : 1;
    c.style.filter = abs ? "grayscale(.6) brightness(.96)" : "none";
    c.style.zIndex = 10 - abs;
    c.style.pointerEvents = abs ? "none" : "auto";
    c.setAttribute("aria-hidden", abs ? "true" : "false");
  });
  count.textContent = `${cur + 1} / ${n}`;
}
const go = d => { cur = (cur + d + cards.length) % cards.length; render(); };
document.getElementById("prev").onclick = () => go(-1);
document.getElementById("next").onclick = () => go(1);
stage.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});
let startX = null;
stage.addEventListener("pointerdown", e => { startX = e.clientX; });
window.addEventListener("pointerup", e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  startX = null;
});
render();


/* ===== revisi 2 ===== */

// Skills: logo tiles with tilt + tap to show name
const skillGrid = document.getElementById("skillGrid");
CONFIG.skills.forEach(s => {
  const b = document.createElement("button");
  b.className = "skill";
  b.type = "button";
  b.setAttribute("aria-label", s.name);
  const img = new Image();
  img.alt = "";
  img.src = `img/skills/${s.file}.svg`;
  img.onerror = () => { img.onerror = null; img.src = `img/skills/${s.file}.png`; };
  const nm = document.createElement("span");
  nm.className = "nm";
  nm.textContent = s.name;
  b.append(img, nm);
  b.addEventListener("click", () => {
    const was = b.classList.contains("on");
    skillGrid.querySelectorAll(".on").forEach(x => x.classList.remove("on"));
    if (!was) b.classList.add("on");
  });
  b.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = b.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    b.style.transform = `perspective(500px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateY(-4px)`;
  });
  b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  skillGrid.appendChild(b);
});

// Experience: filter tabs
const tabs = [...document.querySelectorAll(".tabs button")];
const expCards = [...document.querySelectorAll(".exp-card")];
tabs.forEach(t => t.addEventListener("click", () => {
  tabs.forEach(x => x.setAttribute("aria-selected", x === t));
  const f = t.dataset.f;
  let i = 0;
  expCards.forEach(c => {
    const show = f === "all" || c.dataset.cat === f;
    c.hidden = !show;
    c.classList.remove("show");
    if (show) {
      c.style.animationDelay = `${i++ * 60}ms`;
      void c.offsetWidth;
      c.classList.add("show");
    }
  });
}));

// Home: draggable collage tiles
const collage = document.getElementById("collage");
let zTop = 5;
collage.querySelectorAll(".tile").forEach(t => {
  let sx, sy, ox, oy, moving = false;
  t.addEventListener("pointerdown", e => {
    moving = true;
    t.setPointerCapture(e.pointerId);
    t.classList.add("drag");
    t.style.zIndex = ++zTop;
    sx = e.clientX; sy = e.clientY;
    ox = parseFloat(t.dataset.x || 0); oy = parseFloat(t.dataset.y || 0);
  });
  t.addEventListener("pointermove", e => {
    if (!moving) return;
    ox = (parseFloat(t.dataset.x || 0)) + (e.clientX - sx);
    oy = (parseFloat(t.dataset.y || 0)) + (e.clientY - sy);
    t.style.translate = `${ox}px ${oy}px`;
    t.style.rotate = `${Math.max(-6, Math.min(6, (e.clientX - sx) / 20))}deg`;
  });
  const end = () => {
    if (!moving) return;
    moving = false;
    t.dataset.x = ox; t.dataset.y = oy;
    t.classList.remove("drag");
  };
  t.addEventListener("pointerup", end);
  t.addEventListener("pointercancel", end);
});

// Nav: highlight current section
const navLinks = [...document.querySelectorAll(".nav a")];
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => secObs.observe(s));
