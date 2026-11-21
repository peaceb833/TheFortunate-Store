/* Combo deals and flash deals, plus the size and colour picker used to add them to the cart.
   Load this AFTER products.js and app.js.
   ids are product ids from products.js. off is the discount: 0.15 means 15% off each item. */
window.COMBOS = [
  { id: "exec",    name: "The Executive",  tag: "For the office",   ids: ["c3", "s1", "w1", "t1"], off: 0.15 },
  { id: "weekend", name: "Weekend Smart",  tag: "Easy and sharp",   ids: ["c1", "c2", "s2", "h1"], off: 0.12 },
  { id: "date",    name: "Date Night",     tag: "For her",          ids: ["c5", "s4", "b2"],       off: 0.15 },
  { id: "boss",    name: "The Boss Lady",  tag: "Power dressing",   ids: ["c7", "s5", "b1", "t3"], off: 0.18 }
];

window.FLASH = [
  { id: "s3", off: 0.30 }, { id: "c8", off: 0.25 }, { id: "b3", off: 0.20 },
  { id: "c4", off: 0.25 }, { id: "b4", off: 0.25 }, { id: "c6", off: 0.20 }
];

/* add one deal item straight to the cart, or open the picker if it needs a size or colour */
function claimDeal(id, off) {
  const p = byId(id); if (!p) return;
  if (!needsChoice(p)) { addToCart(p.id, p.sizes[0], p.colors[0], 1, off); toast("Added at the deal price"); return; }
  dealPicker({ title: p.name, ids: [id], off });
}

/* pop-up where the customer picks a colour and size for every piece, then adds them with the deal price */
function dealPicker({ title, ids, off }) {
  const items = ids.map(byId).filter(Boolean).map(p => ({
    p, size: p.sizes.length === 1 ? p.sizes[0] : "", color: p.colors.length === 1 ? p.colors[0] : ""
  }));
  if (!items.length) return;
  const full = items.reduce((n, it) => n + it.p.price, 0), tot = items.reduce((n, it) => n + dealPrice(it.p, off), 0);
  const opener = document.activeElement;

  const group = (i, k, list) => list.length === 1
    ? `<div class="dp-fixed"><span class="muted">${k === "color" ? "Colour" : "Size"}:</span> ${esc(list[0])}</div>`
    : `<div class="dp-lbl">${k === "color" ? "Colour" : "Size"}</div><div class="opts dp-opts" data-i="${i}" data-k="${k}">${list.map(v => `<button type="button" class="opt" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div>`;

  const ov = document.createElement("div");
  ov.className = "dp-ov";
  ov.innerHTML = `<div class="dp" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <button class="dp-x" aria-label="Close" type="button">&times;</button>
    <h2>${esc(title)}</h2>
    <p class="muted dp-sub">Pick a colour and size for each piece. Your ${Math.round(off * 100)}% saving shows in your bag.</p>
    <div class="dp-list">${items.map((it, i) => `
      <div class="dp-row">
        <div class="cth">${icon(it.p.cat, "#A47A3F")}<img src="${esc(photoOf(it.p))}" alt="" onerror="this.remove()"></div>
        <div class="dp-b"><b>${esc(it.p.name)}</b>
          <div class="dp-pr"><b>${money(dealPrice(it.p, off))}</b> <s>${money(it.p.price)}</s></div>
          ${group(i, "color", it.p.colors)}${group(i, "size", it.p.sizes)}
        </div>
      </div>`).join("")}</div>
    <div class="msg err" id="dpErr" style="display:none"></div>
    <div class="dp-foot">
      <div><span class="muted">Total</span><div class="dp-total"><b>${money(tot)}</b> <s>${money(full)}</s></div></div>
      <button class="btn" id="dpAdd" type="button">Add to cart</button>
    </div></div>`;
  document.body.appendChild(ov);
  document.documentElement.style.overflow = "hidden";

  const close = () => {
    document.removeEventListener("keydown", onKey);
    document.documentElement.style.overflow = "";
    ov.classList.add("out"); setTimeout(() => ov.remove(), 220);
    if (opener && opener.focus) opener.focus();
  };
  const onKey = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);

  ov.addEventListener("click", e => {
    if (e.target === ov || e.target.closest(".dp-x")) return close();
    const o = e.target.closest(".dp-opts .opt");
    if (o) {
      const g = o.parentNode;
      $$(".opt", g).forEach(x => x.classList.toggle("on", x === o));
      items[+g.dataset.i][g.dataset.k] = o.dataset.v;
      $("#dpErr", ov).style.display = "none";
    }
  });
  $("#dpAdd", ov).onclick = () => {
    const miss = items.find(it => !it.color || !it.size);
    if (miss) {
      const e = $("#dpErr", ov);
      e.textContent = "Choose a colour and a size for the " + miss.p.name + ".";
      e.style.display = "block"; return;
    }
    items.forEach(it => addToCart(it.p.id, it.size, it.color, 1, off));
    close(); toast(items.length > 1 ? "Combo added to your bag" : "Added at the deal price");
  };
  const first = $(".opt", ov) || $("#dpAdd", ov); first.focus({ preventScroll: true });
}