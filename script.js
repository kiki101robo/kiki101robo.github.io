// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Render project videos only when a real source exists. Firmware projects use
// evidence summaries until real hardware demos are available.
(function initProjectVideos() {
  document.querySelectorAll(".project-video").forEach((slot) => {
    const src = (slot.dataset.video || "").trim();
    if (!src) return;
    slot.classList.add("has-video");
    const match = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    const ytId = match ? match[1] : (/^[A-Za-z0-9_-]{11}$/.test(src) ? src : null);
    if (ytId) {
      slot.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}" title="Project demo video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  });
})();

// Copy the email as a fallback when no mail app is configured.
(function initMailtoCopy() {
  const links = document.querySelectorAll('a[href^="mailto:"]');
  if (!links.length) return;
  const toast = document.createElement("div");
  toast.className = "email-toast";
  document.body.appendChild(toast);
  let timer;
  links.forEach((link) => link.addEventListener("click", () => {
    const email = link.getAttribute("href").replace("mailto:", "").split("?")[0];
    navigator.clipboard?.writeText(email).catch(() => {});
    toast.textContent = `Email copied — ${email}`;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }));
})();
