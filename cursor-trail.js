/* Pixel-square cursor trail.
   - Drops a 14px square every ~22px of cursor travel, snapped to a 14px grid
     so the trail looks like ASCII/MS-Paint pixels rather than a smooth curve.
   - Each square auto-removes after the CSS fade-out completes (~700ms).
   - No-op on touch / reduced-motion (CSS already hides the layer; we still
     skip work to avoid wasted listeners). */
(function () {
  if (window.matchMedia) {
    var coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (coarse.matches || reduce.matches) return;
  }

  var GRID = 14;          // square size + grid step (matches CSS .cursor-trail-px size)
  var STEP = 22;          // min cursor travel between drops, before grid-snap
  var MAX_NODES = 60;     // hard cap; older squares get removed if exceeded
  var FADE_MS = 700;      // matches the CSS animation

  var layer = document.createElement("div");
  layer.className = "cursor-trail-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  var lastX = -9999, lastY = -9999;
  var lastDropX = -9999, lastDropY = -9999;
  var nodes = [];

  function drop(x, y) {
    var snapX = Math.round(x / GRID) * GRID;
    var snapY = Math.round(y / GRID) * GRID;
    if (snapX === lastDropX && snapY === lastDropY) return;
    lastDropX = snapX;
    lastDropY = snapY;

    var px = document.createElement("div");
    px.className = "cursor-trail-px";
    px.style.left = snapX + "px";
    px.style.top = snapY + "px";
    layer.appendChild(px);
    nodes.push(px);

    setTimeout(function () {
      if (px.parentNode) px.parentNode.removeChild(px);
      var i = nodes.indexOf(px);
      if (i !== -1) nodes.splice(i, 1);
    }, FADE_MS);

    if (nodes.length > MAX_NODES) {
      var old = nodes.shift();
      if (old && old.parentNode) old.parentNode.removeChild(old);
    }
  }

  window.addEventListener("mousemove", function (e) {
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    if (dx * dx + dy * dy < STEP * STEP) return;
    lastX = e.clientX;
    lastY = e.clientY;
    drop(e.clientX, e.clientY);
  }, { passive: true });
})();
