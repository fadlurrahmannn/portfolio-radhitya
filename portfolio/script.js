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

  // Projects: gambar taruh di img/projects/ lalu tulis path-nya di "image".
  // "links" = daftar tombol (GitHub, Figma, dll). Link pertama = tujuan kalau kartunya diklik.
  // Kalau "links" kosong, kartu tampil sebagai "Coming soon".
  // Contoh isi:
  // { title: "Nama Project", desc: "Deskripsi singkat", image: "img/projects/p1.jpg",
  //   links: [ { label: "GitHub", url: "https://github.com/..." }, { label: "Figma", url: "https://figma.com/..." } ] }
  projects: [
    { title: "KantinGO", desc: "Project details will land here.", image: "img/kantingo.png", links: [ { label: "GitHub", url: "https://github.com/fadlurrahmannn/kantingo-penjual" } ] },
    { title: "SIAKAM", desc: "Project details will land here.", image: "img/siakam.png", links: [ { label: "GitHub", url: "https://github.com/h44dziq/siakam/fork" } ] },
    { title: "Job Queue", desc: "Project details will land here.", image: "", links: [ { label: "GitHub", url: "https://github.com/fadlurrahmannn/job-queue-kelompok-4" } ] },
    { title: "Bikey", desc: "Project details will land here.", image: "img/bikey.png", links: [ { label: "Figma", url: "https://www.figma.com/design/dAxfHQU2cHZE8l11Z8rxKY/ngeprojek-yuk?node-id=261-2768&t=OoFXOnTBtKfTA0VX-0" } ] }
  ],

  // Sertifikat: cukup isi "url" (link Google Drive, share = Anyone with the link).
  // Gambar sertifikat otomatis diambil dari Drive. title & issuer boleh dikosongin.
  certificates: [
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "https://drive.google.com/file/d/1CsvWh1-KlWpSvg6_lbFlZv2CO4xdpfPE/view?usp=sharing" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "https://drive.google.com/file/d/1ixyS1iYhbICedFSqX0U0vkTgYLFCM9Ct/view?usp=sharing" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "https://drive.google.com/file/d/1sT02ERXbJugNR9KFElZ0FWW0PSlpL9FL/view?usp=sharing" },
    { title: "Nama Sertifikat", issuer: "Penerbit", date: "Bulan Tahun", url: "https://drive.google.com/file/d/1t1cCmodL3vT2vP7qJM2eB6uqPZF-aymx/view?usp=sharing" }
  ]
};
/* ============================= */

// Johari Finds links
document.getElementById("jf-ig").href = CONFIG.johariInstagram;
document.getElementById("jf-shopee").href = CONFIG.johariShopee;

// Foto kolase: img/photo-1 ... photo-4 (.jpg/.jpeg/.png/.webp semua kebaca).
// Bentuk kotak otomatis ngikutin rasio foto biar nggak kepotong aneh.
const collageEl = document.getElementById("collage");
function fitCollage() {
  let max = 0;
  collageEl.querySelectorAll(".tile").forEach(t => { max = Math.max(max, t.offsetTop + t.offsetHeight); });
  const extra = max - collageEl.clientHeight;
  collageEl.style.marginBottom = extra > 0 ? (extra + 16) + "px" : "";
}
window.addEventListener("resize", fitCollage);
document.querySelectorAll(".tile[data-photo]").forEach(t => {
  const base = t.dataset.photo.replace(/\.(jpe?g|png|webp)$/i, "");
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  let i = 0;
  const img = new Image();
  img.onload = () => {
    t.style.backgroundImage = `url("${img.src}")`;
    t.style.aspectRatio = Math.min(1.7, Math.max(.62, img.naturalWidth / img.naturalHeight));
    fitCollage();
  };
  img.onerror = () => { if (++i < exts.length) img.src = base + exts[i]; };
  img.src = base + exts[0];
});

// Certifications: seluruh kartu = link ke sertifikat
const certBox = document.getElementById("certs");
CONFIG.certificates.forEach(c => {
  const a = document.createElement("a");
  a.className = "cert";
  a.href = c.url || "#certifications";
  if (c.url) { a.target = "_blank"; a.rel = "noopener"; }
  a.innerHTML = `<div class="cthumb"><span>certificate</span></div><h3></h3><p></p>`;
  const h3 = a.querySelector("h3"), p = a.querySelector("p");
  h3.textContent = c.title || "";
  p.textContent = [c.issuer, c.date].filter(Boolean).join(", ");
  h3.hidden = !h3.textContent;
  p.hidden = !p.textContent;
  const m = (c.url || "").match(/\/d\/([\w-]+)/) || (c.url || "").match(/[?&]id=([\w-]+)/);
  const src = c.image || (m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000` : "");
  if (src) {
    const im = new Image();
    im.alt = "";
    im.referrerPolicy = "no-referrer";
    im.onload = () => a.querySelector(".cthumb").appendChild(im);
    im.src = src;
  }
  certBox.appendChild(a);
});

// Underline scribble draws when heading scrolls in
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .6 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Projects: kartu dibuat dari CONFIG.projects
const stage = document.getElementById("stage");
stage.innerHTML = "";
CONFIG.projects.forEach(p => {
  const card = document.createElement("div");
  card.className = "pcard";
  const links = (p.links || []).filter(l => l.url);
  const main = document.createElement(links.length ? "a" : "div");
  main.className = "pmain" + (links.length ? "" : " soon");
  if (links.length) { main.href = links[0].url; main.target = "_blank"; main.rel = "noopener"; }
  const box = document.createElement("div");
  box.className = "pimg";
  if (p.image) {
    const im = new Image();
    im.alt = p.title || "";
    im.onload = () => box.appendChild(im);
    im.src = p.image;
  }
  const h = document.createElement("h3");
  h.textContent = p.title || "Coming soon";
  const d = document.createElement("p");
  d.textContent = p.desc || "";
  main.append(box, h, d);
  card.appendChild(main);
  if (links.length) {
    const row = document.createElement("div");
    row.className = "plinks";
    links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = (l.label || "Open") + " ↗";
      row.appendChild(a);
    });
    card.appendChild(row);
  }
  stage.appendChild(card);
});

// Projects carousel
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
    c.style.pointerEvents = abs > 1 ? "none" : "auto";
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
let swiped = false;
window.addEventListener("pointerup", e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 40) {
    go(dx < 0 ? 1 : -1);
    swiped = true;
    setTimeout(() => { swiped = false; }, 80);
  }
  startX = null;
});
// habis geser, jangan ikut kebuka link; klik kartu samping = geser ke kartu itu
stage.addEventListener("click", e => {
  if (swiped) { e.preventDefault(); e.stopPropagation(); }
}, true);
stage.addEventListener("dragstart", e => e.preventDefault());
cards.forEach((card, i) => card.addEventListener("click", e => {
  if (i !== cur) { e.preventDefault(); cur = i; render(); }
}));
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