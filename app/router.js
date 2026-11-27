// Hash router for NusaStat. Routes are plain hash paths (#/penduduk and
// friends) so the site works from any static file server with no rewrite
// rules, and every page is reachable by a link.

import {
  renderHome,
  renderPopulation,
  renderEconomy,
  renderProvinces,
  wireProvinces,
  renderCompare,
  wireCompare,
  renderSources,
} from "./views.js";

const ROUTES = {
  "/": { title: "NusaStat — Statistik Indonesia", render: renderHome },
  "/penduduk": { title: "Penduduk — NusaStat", render: renderPopulation },
  "/ekonomi": { title: "Ekonomi — NusaStat", render: renderEconomy },
  "/provinsi": {
    title: "Provinsi — NusaStat",
    render: renderProvinces,
    wire: wireProvinces,
  },
  "/bandingkan": {
    title: "Bandingkan Provinsi — NusaStat",
    render: renderCompare,
    wire: wireCompare,
  },
  "/sumber": { title: "Sumber & Metodologi — NusaStat", render: renderSources },
};

// The hash after "#", without a leading slash, or "/" for the home page.
export function currentPath() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function navigate() {
  const path = currentPath();
  const route = ROUTES[path] || ROUTES["/"];
  const view = document.getElementById("view");
  view.innerHTML = route.render();
  document.title = route.title;
  if (route.wire) route.wire();
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    const target = href.replace(/^#/, "") || "/";
    a.classList.toggle("nav-active", target === path);
    if (target === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener("hashchange", navigate);
  navigate();
}
