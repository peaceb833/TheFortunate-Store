/* Support chat box for every page. Add ONE line at the bottom of a page, after js/app.js:
   <script src="js/support-chat.js"></script>
   Messages reach you by email (Formspree link in js/config.js) and the shopper gets a WhatsApp button. */
(function () {
  if (window.__scLoaded) return; window.__scLoaded = true;
  const S = window.STORE || {};
  const live = !/X{4,}/.test(S.formEndpoint || "XXXX");
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TOPICS = ["Track my order", "Delivery", "Payment", "Complaint", "Something else"];

  const css = document.createElement("style");
  css.textContent = `
  .sc-btn{position:fixed;right:18px;bottom:18px;z-index:90;width:58px;height:58px;border-radius:50%;border:0;background:#C79A5B;color:#0B0B0B;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.35)}
  .sc-btn:focus-visible,.sc-box button:focus-visible{outline:3px solid #0B0B0B;outline-offset:2px}
  .sc-box{overflow-y:auto;position:fixed;right:18px;bottom:88px;z-index:91;width:340px;max-width:calc(100vw - 24px);height:auto;max-height:min(640px,calc(100vh - 110px));background:#fff;color:#0B0B0B;border-radius:18px;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.4);font-family:Figtree,system-ui,sans-serif;font-size:.95rem}
  .sc-box[hidden]{display:none}
  .sc-h{background:#0B0B0B;color:#fff;padding:13px 16px;display:flex;justify-content:space-between;align-items:center}
  .sc-h b{font-family:"Playfair Display",serif;font-weight:500;font-size:1.05rem}
  .sc-h small{display:block;color:#E4DACA;font-size:.78rem}
  .sc-x{background:none;border:0;color:#fff;font-size:1.5rem;line-height:1;cursor:pointer}
  .sc-log{flex:1 1 auto;min-height:70px;overflow-y:auto;padding:14px;background:#F4EFE3;display:flex;flex-direction:column;gap:9px}
  .sc-h,.sc-q,.sc-f,.sc-note{flex:none}
  .sc-b{max-width:84%;padding:8px 12px;border-radius:14px;white-space:pre-wrap;word-break:break-word}
  .sc-b.me{align-self:flex-end;background:#0B0B0B;color:#fff;border-bottom-right-radius:4px}
  .sc-b.sys{align-self:flex-start;background:#fff;border:1px solid #E1D6C0;border-bottom-left-radius:4px}
  .sc-b a{color:#8A6430;font-weight:700}
  .sc-q{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px 0}
  .sc-q button{border:1px solid #C79A5B;background:#fff;border-radius:999px;padding:5px 11px;font:inherit;font-size:.82rem;cursor:pointer}
  .sc-q button.on{background:#C79A5B;font-weight:700}
  .sc-f{padding:10px 12px 12px;display:grid;gap:8px}
  .sc-f input,.sc-f textarea{width:100%;box-sizing:border-box;font:inherit;padding:9px 11px;border:1px solid #CFC3AB;border-radius:10px;background:#fff;color:#0B0B0B}
  .sc-f textarea{resize:none;height:64px}
  .sc-f .sc-s{border:0;background:#C79A5B;color:#0B0B0B;font:inherit;font-weight:700;border-radius:10px;padding:10px;cursor:pointer}
  .sc-f .sc-s:disabled{opacity:.6}
  .sc-err{color:#B3261E;font-size:.84rem}
  .sc-note{font-size:.76rem;background:#FFF4D6;border-radius:8px;padding:6px 10px;margin:8px 12px 0}
  @media (max-width:480px){.sc-box{right:8px;left:8px;width:auto;max-width:none;bottom:84px}}`;
  document.head.appendChild(css);

  const root = document.createElement("div");
  root.innerHTML = `
  <button class="sc-btn" id="scBtn" aria-label="Chat with support" aria-expanded="false"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg></button>
  <section class="sc-box" id="scBox" hidden aria-label="Support chat">
    <div class="sc-h"><div><b>Chat with us</b><small>We reply by phone, WhatsApp or email</small></div><button class="sc-x" id="scX" aria-label="Close chat">&times;</button></div>
    <div class="sc-log" id="scLog" aria-live="polite"></div>
    ${live ? "" : '<div class="sc-note">Test mode: add your Formspree link in js/config.js to receive messages.</div>'}
    <div class="sc-q" id="scQ">${TOPICS.map(t => `<button type="button">${t}</button>`).join("")}</div>
    <form class="sc-f" id="scF" novalidate>
      <div id="scWho"><input id="scN" placeholder="Your name" autocomplete="name" aria-label="Your name" style="margin-bottom:8px"><input id="scC" placeholder="Phone or email" autocomplete="tel" aria-label="Phone or email"></div>
      <textarea id="scM" placeholder="Type your message" aria-label="Message"></textarea>
      <div class="sc-err" id="scE" hidden role="alert"></div>
      <button class="sc-s" id="scS" type="submit">Send</button>
    </form>
  </section>`;
  document.body.appendChild(root);
  const $ = id => document.getElementById(id);
  let topic = "";

  const u = (() => { try { const e = get("session", null); return e ? (get("users", {})[e] || null) : null; } catch { return null; } })();
  const me = Object.assign({ name: u && u.name || "", contact: u && (u.phone || u.email) || "" }, get("scMe", {}));
  $("scN").value = me.name; $("scC").value = me.contact; $("scWho").hidden = !!(me.name && me.contact);

  const paint = () => {
    const hello = { f: "sys", t: "Hello. Ask a question or tell us about a problem with an order, delivery or payment." };
    $("scLog").innerHTML = [hello, ...get("scLog", [])].map(m => `<div class="sc-b ${m.f}">${m.h || esc(m.t)}</div>`).join("");
    $("scLog").scrollTop = $("scLog").scrollHeight;
  };
  const toggle = o => { $("scBox").hidden = !o; $("scBtn").setAttribute("aria-expanded", o); if (o) { paint(); $("scM").focus(); } };
  $("scBtn").onclick = () => toggle($("scBox").hidden);
  $("scX").onclick = () => toggle(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("scBox").hidden) toggle(false); });
  $("scQ").onclick = e => { const b = e.target.closest("button"); if (!b) return; topic = topic === b.textContent ? "" : b.textContent; [...$("scQ").children].forEach(x => x.classList.toggle("on", x.textContent === topic)); $("scM").focus(); };

  $("scF").onsubmit = async e => {
    e.preventDefault();
    const name = $("scN").value.trim(), contact = $("scC").value.trim(), text = $("scM").value.trim(), er = $("scE");
    const fail = t => { er.textContent = t; er.hidden = false; };
    if (!name || !contact) { $("scWho").hidden = false; return fail("Add your name and a phone number or email so we can reply."); }
    if (!text) return fail("Type a message first.");
    er.hidden = true; set("scMe", { name, contact });
    const body = `Support chat${topic ? " (" + topic + ")" : ""}\n\nFrom: ${name}\nContact: ${contact}\nPage: ${location.pathname.split("/").pop() || "index.html"}\n\n${text}`;
    $("scS").disabled = true; $("scS").textContent = "Sending";
    let ok = !live;
    if (live) { try { const r = await fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: "Support chat" + (topic ? ": " + topic : ""), name, email: contact.includes("@") ? contact : undefined, message: body }) }); ok = r.ok; } catch { ok = false; } }
    $("scS").disabled = false; $("scS").textContent = "Send";
    const wa = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(body)}`;
    const L = get("scLog", []); L.push({ f: "me", t: text });
    L.push(ok ? { f: "sys", h: `Thank you. We got your message and will reply to <b>${esc(contact)}</b>. For a faster answer, <a href="${wa}" target="_blank" rel="noopener">chat with us on WhatsApp</a>.` }
              : { f: "sys", h: `That did not send. Please <a href="${wa}" target="_blank" rel="noopener">message us on WhatsApp</a> instead.` });
    set("scLog", L.slice(-30)); $("scM").value = ""; $("scWho").hidden = true; paint();
  };
})();