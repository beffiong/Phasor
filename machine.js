/* HUMAN / MACHINE toggle.
   - Pill stays fixed at viewport bottom on every page (markup is in the HTML).
   - MACHINE shows .machine-overlay (a hand-written, AI-readable summary of
     the whole site). Stored in localStorage.phasor_mode so the choice
     persists across navigation.
   - Keyboard shortcut: "/" toggles modes; Esc returns to HUMAN.
*/
(function () {
  var STORAGE_KEY = "phasor_mode";
  var body = document.body;
  var toggle = document.querySelector(".mode-toggle");
  var overlay = document.querySelector(".machine-overlay");
  if (!toggle || !overlay) return;

  var btnHuman = toggle.querySelector('[data-mode="human"]');
  var btnMachine = toggle.querySelector('[data-mode="machine"]');

  function setMode(mode, persist) {
    if (mode !== "machine") mode = "human";
    body.setAttribute("data-mode", mode);
    btnHuman.setAttribute("aria-pressed", mode === "human" ? "true" : "false");
    btnMachine.setAttribute("aria-pressed", mode === "machine" ? "true" : "false");
    if (mode === "machine") {
      overlay.scrollTop = 0;
      overlay.setAttribute("tabindex", "-1");
      overlay.focus({ preventScroll: true });
    }
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* ignore */ }
    }
  }

  btnHuman.addEventListener("click", function () { setMode("human", true); });
  btnMachine.addEventListener("click", function () { setMode("machine", true); });

  document.addEventListener("keydown", function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "/") {
      e.preventDefault();
      var current = body.getAttribute("data-mode") || "human";
      setMode(current === "human" ? "machine" : "human", true);
    } else if (e.key === "Escape" && body.getAttribute("data-mode") === "machine") {
      setMode("human", true);
    }
  });

  /* Copy-to-clipboard. Builds a Markdown-ish plain-text version of the machine
     document by walking the rendered nodes — preserves headings, links (as
     `[text](href)`), and list bullets so what gets pasted reads like the
     original AI-readable doc, not flattened innerText. */
  var copyBtn = document.querySelector(".machine-copy");
  var doc = overlay.querySelector(".machine-doc");
  if (copyBtn && doc) {
    copyBtn.addEventListener("click", function () {
      var text = serializeDoc(doc);
      var done = function () {
        copyBtn.setAttribute("data-state", "copied");
        copyBtn.querySelector(".label").textContent = "Copied";
        setTimeout(function () {
          copyBtn.removeAttribute("data-state");
          copyBtn.querySelector(".label").textContent = "Copy";
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  }

  function serializeDoc(root) {
    var out = [];
    Array.prototype.forEach.call(root.children, function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === "h1") out.push("# " + el.textContent.trim() + "\n");
      else if (tag === "h2") out.push("\n## " + el.textContent.trim() + "\n");
      else if (tag === "h3") out.push("\n### " + el.textContent.trim() + "\n");
      else if (tag === "p") out.push(inlineText(el) + "\n");
      else if (tag === "ul") {
        Array.prototype.forEach.call(el.querySelectorAll(":scope > li"), function (li) {
          out.push("- " + inlineText(li));
        });
        out.push("");
      } else if (tag === "hr") out.push("\n---\n");
      else out.push(el.textContent.trim());
    });
    return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function inlineText(el) {
    var parts = [];
    el.childNodes.forEach(function (n) {
      if (n.nodeType === 3) parts.push(n.nodeValue);
      else if (n.nodeType === 1) {
        if (n.tagName === "A" && n.getAttribute("href")) {
          parts.push("[" + n.textContent.trim() + "](" + n.getAttribute("href") + ")");
        } else if (n.tagName === "CODE") {
          parts.push("`" + n.textContent.trim() + "`");
        } else {
          parts.push(n.textContent);
        }
      }
    });
    return parts.join("").replace(/\s+/g, " ").trim();
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  // Restore prior choice on load.
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  setMode(saved === "machine" ? "machine" : "human", false);
})();
