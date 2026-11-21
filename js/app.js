/* Shared code: header, footer, cart, wishlist, accounts, product cards */
const S = window.STORE, PRODUCTS = window.PRODUCTS;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => S.currency + Number(n).toLocaleString("en-NG");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const byId = id => PRODUCTS.find(p => p.id === id);
const CAT_LABEL = { clothing: "Clothing", shoes: "Shoes", bags: "Bags", belts: "Belts", ties: "Ties", hats: "Hats" };

/* ---------- icons ---------- */
const ICON = {
  clothing: '<path d="M20 10 8 18l6 10 6-4v30h28V24l6 4 6-10-12-8c-2 5-6 7-12 7s-10-2-12-7z"/>',
  shoes: '<path d="M6 42c8 0 12-4 14-13l6 4c4 3 10 4 16 6 6 2 12 2 14 6v5H6z"/><path d="M6 50h52"/>',
  bags: '<path d="M12 26h40l4 30H8z"/><path d="M22 26v-6a10 10 0 0 1 20 0v6"/>',
  belts: '<path d="M4 26h56v12H4z"/><rect x="25" y="21" width="14" height="22" rx="2"/><circle cx="12" cy="32" r="1.5"/><circle cx="18" cy="32" r="1.5"/>',
  ties: '<path d="M26 6h12l-3 9h-6z"/><path d="m29 15-8 38 11 6 11-6-8-38"/>',
  hats: '<path d="M12 40c0-14 8-24 20-24s20 10 20 24z"/><path d="M4 42h56c0 5-12 8-28 8S4 47 4 42z"/>'
};
const icon = (cat, stroke = "#0B0B0B") =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${ICON[cat]}</svg>`;

/* Product photos. Put photos in the images folder:
   images/c1.jpg is the main photo for product c1, c1-2.jpg, c1-3.jpg, c1-4.jpg are the extra views.
   Or set image:"images/anything.jpg" (and optionally images:[...]) on the product in products.js.
   Until a photo exists, an empty photo slot shows with the file name to use. */
const photoOf = (p, i = 0) => (p.images && p.images[i]) || (i === 0 ? (p.image || `images/${p.id}.jpg`) : `images/${p.id}-${i + 1}.jpg`);
const art = (p, variant = 0) => {
  const src = photoOf(p, variant);
  return `<div class="art"><span class="slot">Photo slot<br>${esc(src)}</span><img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()"></div>`;
};

/* ---------- wishlist ---------- */
const wishes = () => LS.get("wish", []);
const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';
const heart = id => `<button class="heart ${wishes().includes(id) ? "on" : ""}" data-wish="${id}" aria-label="Save to wishlist">${heartSvg}</button>`;

/* ---------- product card ---------- */
const needsChoice = p => p.sizes.length > 1 || p.colors.length > 1;
const tile = p => `<div class="card">
  <a href="product.html?id=${p.id}">${art(p)}</a>${heart(p.id)}
  <div class="meta"><a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a>
  <span class="price">${money(p.price)}</span>
  <button class="btn" data-quick="${p.id}">${needsChoice(p) ? "Choose options" : "Add to Cart"}</button></div></div>`;

/* ---------- toast ---------- */
function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- cart ---------- */
const getCart = () => LS.get("cart", []);
const saveCart = c => { LS.set("cart", c); updateCount(); };
const cartCount = () => getCart().reduce((n, i) => n + i.qty, 0);
/* off = a deal discount, for example 0.15 for 15% off (combo and flash deals). Normal items use 0. */
const dealPrice = (p, off) => Math.round(p.price * (1 - off) / 100) * 100;
function addToCart(id, size, color, qty = 1, off = 0) {
  const c = getCart();
  const hit = c.find(i => i.id === id && i.size === size && i.color === color && (i.off || 0) === off);
  hit ? hit.qty += qty : c.push({ id, size, color, qty, ...(off ? { off } : {}) });
  saveCart(c);
}
function cartLines() {
  const lines = getCart().map(i => { const p = byId(i.id); return p && { ...i, p, unit: i.off ? dealPrice(p, i.off) : p.price }; }).filter(Boolean);
  const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0);
  const free = S.freeDeliveryOver > 0 && subtotal >= S.freeDeliveryOver;
  const delivery = lines.length === 0 || free ? 0 : S.deliveryFee;
  return { lines, subtotal, delivery, total: subtotal + delivery };
}
function bump(e) { const a = e.closest("a") || e; a.classList.remove("bump"); void a.offsetWidth; a.classList.add("bump"); }
function updateCount() {
  const ready = updateCount.ready; updateCount.ready = true;
  $$("[data-cart-count]").forEach(e => { const n = cartCount(), was = +e.textContent || 0; e.textContent = n; e.style.display = n ? "grid" : "none"; if (ready && n > was) bump(e); });
  $$("[data-wish-count]").forEach(e => { const n = wishes().length; e.textContent = n; e.style.display = n ? "grid" : "none"; });
}

/* global clicks: hearts and quick add */
document.addEventListener("click", e => {
  const h = e.target.closest("[data-wish]");
  if (h) {
    e.preventDefault();
    const id = h.dataset.wish; let w = wishes();
    w = w.includes(id) ? w.filter(x => x !== id) : [...w, id];
    LS.set("wish", w); $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle("on", w.includes(id)));
    if (w.includes(id)) { h.classList.remove("pop"); void h.offsetWidth; h.classList.add("pop"); }
    updateCount(); toast(w.includes(id) ? "Saved to your wishlist" : "Removed from wishlist");
    return;
  }
  const q = e.target.closest("[data-quick]");
  if (q) {
    const p = byId(q.dataset.quick);
    if (needsChoice(p)) location.href = "product.html?id=" + p.id;
    else { addToCart(p.id, p.sizes[0], p.colors[0], 1); toast("Added to cart"); }
  }
});

/* ---------- accounts (stored in this browser) ---------- */
async function sha(text) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}
const users = () => LS.get("users", {});
const currentUser = () => { const e = LS.get("session", null); return e ? users()[e] || null : null; };
function saveUser(u) { const all = users(); all[u.email] = u; LS.set("users", all); }

/* ---------- logo ----------
   Save your logo as images/logo.png (a transparent PNG about 400 x 120 pixels works best).
   If you use a different file name or type, change LOGO_FILE below.
   Until the file is there, a dashed "Your logo here" box shows in its place. */
const LOGO_FILE = "images/logo2.png";
const logoHtml = cls => `<a class="logo ${cls}" href="index.html" aria-label="${esc(S.name)} home"><img src="${LOGO_FILE}" alt="${esc(S.name)}" onerror="this.parentNode.classList.add('nologo');this.remove()"></a>`;

/* ---------- layout ---------- */
const svg = (d, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
function layout(active) {
  const u = currentUser();
  const acct = u ? "account.html" : "sign-in.html";
  const I = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'), person: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
    heart: svg('<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>'), bag: svg('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>')
  };
  $("#hdr").innerHTML = `
   <header class="site"><div class="wrap bar">
    ${logoHtml("")}
    <nav class="nav" id="nav" aria-label="Main">
      <a href="index.html" class="${active === "home" ? "on" : ""}">Home</a>
      <a href="shop.html" class="${active === "shop" ? "on" : ""}">Shop</a>
      <a href="find-outfit.html" class="find ${active === "find" ? "on" : ""}">Snap & Find</a>
      <a href="Community.html" class=" ${active === "" ? "on" : ""}">Community</a>
      <a href="contact.html" class="${active === "contact" ? "on" : ""}">Contact</a>
      <!-- on phones the icons live inside the menu -->
      <div class="nav-tools">
        <a href="shop.html#search">${I.search}<span>Search</span></a>
        <a href="${acct}">${I.person}<span>${u ? "My account" : "Sign in or create account"}</span></a>
        <a href="account.html?tab=saved">${I.heart}<span>Wishlist</span><span class="count" data-wish-count>0</span></a>
        <a href="cart.html">${I.bag}<span>Shopping bag</span><span class="count" data-cart-count>0</span></a>
      </div>
    </nav>
    <div class="tools">
      <a href="shop.html#search" aria-label="Search">${I.search}</a>
      <a href="${acct}" class="acct" aria-label="${u ? "My account" : "Sign in"}" title="${u ? "Hi, " + esc(u.name.split(" ")[0]) : "Sign in"}">${I.person}</a>
      <a href="account.html?tab=saved" aria-label="Wishlist">${I.heart}<span class="count" data-wish-count>0</span></a>
      <a href="cart.html" aria-label="Shopping bag">${I.bag}<span class="count" data-cart-count>0</span></a>
    </div>
    <button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span class="bars"><i></i><i></i><i></i></span></button>
  </div></header>`;
  $("#ftr").innerHTML = `
  <footer class="site"><div class="wrap">
    <div class="foot">
      <div>${logoHtml("")}<p>${esc(S.tagline)}. Pay online, we deliver to your door.</p></div>
      <div><h3>Shop</h3><a href="shop.html?g=men">Men</a><a href="shop.html?g=women">Women</a><a href="shop.html?c=shoes">Shoes</a><a href="shop.html?c=bags">Bags</a></div>
      <div><h3>Help</h3><a href="find-outfit.html">Find an outfit</a><a href="account.html">My account</a><a href="cart.html">Shopping bag</a><a href="contact.html">Contact us</a><a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} ${esc(S.name)}. All rights reserved.</div>
  </div></footer>`;
  const nav = $("#nav"), mb = $("#menuBtn");
  const setMenu = o => { nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", o); if (o) $("header.site").classList.remove("away"); };
  mb.onclick = () => setMenu(!nav.classList.contains("open"));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  if (!layout.bound) {
    layout.bound = true;
    document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", e => { if (!e.target.closest("header.site")) setMenu(false); });
  }
  updateCount();
  initMotion();
}

/* ---------- motion: progress bar, header hide, scroll reveal, tilt cards ---------- */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
function initMotion() {
  if (initMotion.done) return; initMotion.done = true;

  // thin gold progress line at the top of the page + header slides away when scrolling down
  const bar = document.createElement("div"); bar.id = "prog"; document.body.appendChild(bar);
  let lastY = scrollY, tick = false;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight, hd = $("header.site");
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    if (hd) {
      if (y > lastY + 6 && y > 260 && !$("#nav").classList.contains("open")) hd.classList.add("away");
      else if (y < lastY - 6 || y <= 260) hd.classList.remove("away");
    }
    lastY = y; tick = false;
  };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (REDUCED) return;

  // cards that tilt towards the pointer (add data-tilt to any element)
  document.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const t = e.target.closest && e.target.closest("[data-tilt]"); if (!t) return;
    const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty("--ry", ((x - .5) * 12).toFixed(2) + "deg"); t.style.setProperty("--rx", ((.5 - y) * 12).toFixed(2) + "deg");
    t.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); t.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  });
  document.addEventListener("pointerout", e => {
    const t = e.target.closest && e.target.closest("[data-tilt]");
    if (t && !t.contains(e.relatedTarget)) { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); }
  });

  // things fade and rise into place as they scroll into view (also works for items added later by the page)
  if (!("IntersectionObserver" in window)) return;
  const SEL = ".card,.cat,.sec-head,.strip>.wrap>div,.order,.stat,details,.combo,.fcard,.trend-head,.flash-head,.foot>div";
  const io = new IntersectionObserver(es => {
    es.filter(e => e.isIntersecting).forEach((e, i) => {
      io.unobserve(e.target); e.target.style.opacity = "";
      e.target.animate([{ opacity: 0, transform: "translateY(30px) scale(.97)" }, { opacity: 1, transform: "none" }],
        { duration: 750, delay: i * 80, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
    });
  }, { threshold: .1, rootMargin: "0px 0px -5% 0px" });
  const watch = root => {
    const list = root.matches && root.matches(SEL) ? [root] : [];
    if (root.querySelectorAll) list.push(...root.querySelectorAll(SEL));
    list.forEach(el => { if (el.dataset.rv) return; el.dataset.rv = 1; el.style.opacity = "0"; io.observe(el); });
  };
  watch(document.body);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && watch(n)))).observe(document.body, { childList: true, subtree: true });
}


/* ---------- outfit requests (photos shoppers send us to find) ---------- */
/* shrink a photo in the browser so it uploads fast: returns { blob, url } */
function shrinkImage(file, max = 1000, q = .82) {
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(b => b ? res({ blob: b, url: c.toDataURL("image/jpeg", q) }) : rej(new Error("blob")), "image/jpeg", q);
    };
    img.onerror = () => { URL.revokeObjectURL(u); rej(new Error("image")); };
    img.src = u;
  });
}
/* 0803 000 0000 -> 2348030000000, for WhatsApp links */
const waNumber = t => { const d = String(t || "").replace(/\D/g, ""); return d.startsWith("234") ? d : d.startsWith("0") ? "234" + d.slice(1) : d; };
const reqRow = r => `<div class="order req"><img class="req-th" src="${esc(r.thumb || "")}" alt="" onerror="this.style.visibility='hidden'">
  <div style="flex:1;min-width:0"><b>${esc(r.cat || "Outfit")} request #${esc(r.ref)}</b> <span class="pill">${esc(r.status || "Searching")}</span>
  <div class="muted" style="font-size:.88rem">${new Date(r.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}${r.note ? ", " + esc(r.note.slice(0, 90)) : ""}</div>
  <div class="muted" style="font-size:.82rem">We will message you on ${esc(r.notify || "WhatsApp")} when we find it.</div></div></div>`;