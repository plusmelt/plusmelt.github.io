// Theme
const body = document.body;
const toggle = document.getElementById("themeToggle");

const saved = localStorage.getItem("theme");
if (saved) body.setAttribute("data-theme", saved);

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// Highlight current page
const path = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(link => {
  if (link.getAttribute("href") === path) {
    link.classList.add("active");
  }
});

// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
