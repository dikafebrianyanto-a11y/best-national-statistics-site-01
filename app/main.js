// Entry point for NusaStat. Boots the hash router once the document is
// ready and updates the footer year.

import { startRouter } from "./router.js";

function boot() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  startRouter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
