// ---------- Config ----------
const GITHUB_USERNAME = "kiki101robo";

// Repos already shown in the "Featured Projects" section — skip these in the auto-pulled list
const FEATURED_REPOS = new Set([
  "STM32-Baremetal-Drivers",
  "Alexa_Robotic_Manipulator_Arm",
  "Structure_From_Motion",
  "ProtoCALL_Neck_Band-for-Head-Gear-CAD-Files-and-Video",
  "ProtoCALL_Elbow-Actuator-CAD-Files-and-Video",
  "stm32-baremetal-bootloader",
]);

const LANG_COLORS = {
  "C": "#555555",
  "C++": "#f34b7d",
  "Python": "#3572A5",
  "JavaScript": "#f1e05a",
  "TypeScript": "#3178c6",
  "Jupyter Notebook": "#DA5B0B",
  "HTML": "#e34c26",
  "CSS": "#563d7c",
  "Rust": "#dea584",
  "Shell": "#89e051",
  "MATLAB": "#e16737",
  "CMake": "#DA3434",
};

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Project video slots ----------
// Fill in a video later by adding data-video="..." (and optionally data-poster="...")
// to the <div class="project-video"> for that project in index.html. Accepts:
//   - a YouTube URL (any format) or bare 11-char video ID
//   - a path/URL to a local .mp4 / .webm / .mov file (use data-poster for a thumbnail)
//   - any other embeddable URL (e.g. Vimeo), used as a generic iframe
(function initProjectVideos() {
  document.querySelectorAll(".project-video").forEach((slot) => {
    const src = (slot.dataset.video || "").trim();

    if (!src) {
      slot.innerHTML =
        '<div class="project-video-placeholder"><span class="icon">🎬</span><span>Video coming soon</span></div>';
      return;
    }

    slot.classList.add("has-video");
    const ytId = extractYouTubeId(src);

    if (ytId) {
      slot.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}" title="Project demo video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (/\.(mp4|webm|mov)(\?.*)?$/i.test(src)) {
      const poster = slot.dataset.poster ? ` poster="${slot.dataset.poster}"` : "";
      slot.innerHTML = `<video controls preload="metadata"${poster}><source src="${src}"></video>`;
    } else {
      slot.innerHTML = `<iframe src="${src}" title="Project demo video" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  });

  function extractYouTubeId(url) {
    const m = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
    );
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(url) ? url : null;
  }
})();

// ---------- Theme toggle ----------
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const iconSun = document.getElementById("iconSun");
  const iconMoon = document.getElementById("iconMoon");

  let stored = null;
  try { stored = localStorage.getItem("kk-theme"); } catch (e) { /* storage unavailable */ }

  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (prefersLight ? "light" : "dark");
  applyTheme(initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("kk-theme", next); } catch (e) { /* ignore */ }
  });

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      iconSun.hidden = true;
      iconMoon.hidden = false;
    } else {
      root.removeAttribute("data-theme");
      iconSun.hidden = false;
      iconMoon.hidden = true;
    }
  }
})();

// ---------- Auto-pull GitHub repos ----------
(async function loadRepos() {
  const statusEl = document.getElementById("repoStatus");
  const gridEl = document.getElementById("repoGrid");

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

    const repos = await res.json();

    const filtered = repos
      .filter((r) => !r.fork)
      .filter((r) => !FEATURED_REPOS.has(r.name))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (filtered.length === 0) {
      statusEl.textContent = "No additional public repositories found.";
      return;
    }

    statusEl.textContent = `${filtered.length} additional repositor${filtered.length === 1 ? "y" : "ies"}`;

    gridEl.innerHTML = filtered
      .map((repo) => {
        const lang = repo.language || "";
        const color = LANG_COLORS[lang] || "#8a91a3";
        const desc = repo.description || "No description provided.";
        const updated = new Date(repo.pushed_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        });
        return `
          <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
            <h4>${escapeHtml(repo.name)}</h4>
            <p>${escapeHtml(desc)}</p>
            <div class="repo-meta">
              ${lang ? `<span><span class="lang-dot" style="background:${color}"></span>${escapeHtml(lang)}</span>` : ""}
              <span>★ ${repo.stargazers_count}</span>
              <span>Updated ${updated}</span>
            </div>
          </a>`;
      })
      .join("");
  } catch (err) {
    statusEl.classList.add("error");
    statusEl.innerHTML = `Couldn't load repositories automatically (GitHub API rate limit or network issue). See the full list at <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" rel="noopener">github.com/${GITHUB_USERNAME}</a>.`;
  }
})();

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Mailto fallback: copy email on click ----------
// mailto: links only open something if the visitor's OS has a default mail app configured.
// If it doesn't, clicking silently does nothing — so also copy the address as a reliable fallback.
(function initMailtoCopy() {
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (!mailLinks.length) return;

  const toast = document.createElement("div");
  toast.className = "email-toast";
  document.body.appendChild(toast);
  let toastTimer = null;

  mailLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const email = link.getAttribute("href").replace("mailto:", "").split("?")[0];
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      toast.textContent = `Email copied — ${email}`;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    });
  });
})();
