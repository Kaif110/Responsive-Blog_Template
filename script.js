// Edit this list to add your own articles. Image paths are slots inside assets/images/.
const articles = [
  {
    id: 1,
    title: "Small moments that make life meaningful",
    author: "Author Name",
    date: "07 January",
    year: "2021",
    readTime: "6 min read",
    category: "Lifestyle",
    image: "assets/images/images (1).jpg",
    excerpt: "A thoughtful look at the everyday moments we often overlook, and how they can become our favourite memories."
  },
  {
    id: 2,
    title: "Finding your voice in a noisy world",
    author: "Author Name",
    date: "14 February",
    year: "2021",
    readTime: "5 min read",
    category: "People",
    image: "assets/images/images (2).jpg",
    excerpt: "Every person has a perspective worth sharing. Learn why honest stories can create meaningful connections."
  },
  {
    id: 3,
    title: "Build a workspace that inspires you",
    author: "Author Name",
    date: "22 March",
    year: "2020",
    readTime: "4 min read",
    category: "Productivity",
    image: "assets/images/images (3).jpg",
    excerpt: "A few practical ideas for making your desk feel calmer, more organised, and ready for creative work."
  },
  {
    id: 4,
    title: "The simple joy of putting words on paper",
    author: "Author Name",
    date: "09 April",
    year: "2020",
    readTime: "7 min read",
    category: "Writing",
    image: "assets/images/images (4).jpg",
    excerpt: "Slow down, start with one sentence, and discover how a regular writing habit can help you think clearly."
  },
  {
    id: 5,
    title: "People, places, and the stories between them",
    author: "Author Name",
    date: "18 June",
    year: "2021",
    readTime: "6 min read",
    category: "Culture",
    image: "assets/images/images (5).jpg",
    excerpt: "The best stories often begin with curiosity about the people and places around us."
  }
];

const articleList = document.querySelector("#articleList");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const resultsMessage = document.querySelector("#resultsMessage");
const resetFilters = document.querySelector("#resetFilters");
const yearInputs = [...document.querySelectorAll('input[name="year"]')];
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

function renderArticles() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedYear = document.querySelector('input[name="year"]:checked')?.value || "all";

  const filtered = articles.filter(article => {
    const matchesSearch = !query || [
      article.title, article.author, article.category, article.excerpt, article.year
    ].join(" ").toLowerCase().includes(query);
    const matchesYear = selectedYear === "all" || article.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  articleList.innerHTML = "";

  if (filtered.length === 0) {
    articleList.innerHTML = `
      <div class="empty-state">
        <h3>No articles found</h3>
        <p>Try another keyword or reset the year filter.</p>
      </div>`;
  } else {
    filtered.forEach(article => {
      const card = document.createElement("article");
      card.className = "article-card";
      card.innerHTML = `
        <div class="article-image-wrap">
          <img src="${escapeAttribute(article.image)}" alt="${escapeAttribute(article.title)}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
          <div class="article-placeholder" style="display:none">
            <span>ARTICLE IMAGE ${article.id}</span>
            <small>${escapeHtml(article.image)}</small>
          </div>
        </div>
        <div class="article-copy">
          <p class="eyebrow">${escapeHtml(article.category)}</p>
          <h3><a href="#contact" aria-label="Ask about ${escapeAttribute(article.title)}">${escapeHtml(article.title)}</a></h3>
          <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>
          <div class="article-meta">
            <span>${escapeHtml(article.author)}</span><span class="meta-dot"></span>
            <span>${escapeHtml(article.date)} ${escapeHtml(article.year)}</span><span class="meta-dot"></span>
            <span>${escapeHtml(article.readTime)}</span>
          </div>
          <a class="read-link" href="#contact" data-article="${escapeAttribute(article.title)}">Read article <span aria-hidden="true">→</span></a>
        </div>`;
      articleList.appendChild(card);
    });
  }

  const activeFilters = [];
  if (query) activeFilters.push(`search: “${searchInput.value.trim()}”`);
  if (selectedYear !== "all") activeFilters.push(`year: ${selectedYear}`);
  resultsMessage.hidden = activeFilters.length === 0;
  resultsMessage.textContent = activeFilters.length
    ? `${filtered.length} article${filtered.length === 1 ? "" : "s"} found (${activeFilters.join(", ")}).`
    : "";
  clearSearch.hidden = !query;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function escapeAttribute(value) { return escapeHtml(value); }

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  renderArticles();
  document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
});
searchInput.addEventListener("input", renderArticles);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderArticles();
  searchInput.focus();
});
yearInputs.forEach(input => input.addEventListener("change", renderArticles));
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  document.querySelector('input[name="year"][value="all"]').checked = true;
  renderArticles();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

articleList.addEventListener("click", event => {
  const link = event.target.closest("[data-article]");
  if (!link) return;
  const message = document.querySelector("#contactMessage");
  message.value = `Hi, I would like to know more about: ${link.dataset.article}`;
});

document.querySelector("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.querySelector("#contactName").value.trim();
  const feedback = document.querySelector("#contactFeedback");
  if (!name) {
    feedback.textContent = "Please enter your name.";
    feedback.style.color = "#b42318";
    return;
  }
  feedback.textContent = `Thanks, ${name}! The form is valid. Connect a backend to receive messages.`;
  feedback.style.color = "#28734c";
  event.currentTarget.reset();
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();
renderArticles();
