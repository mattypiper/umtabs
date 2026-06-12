const searchInput = document.querySelector("#search");
const tabList = document.querySelector("#tabList");
const tabLinks = tabList ? Array.from(tabList.querySelectorAll(".tab-link")) : [];

function filterSongs(query) {
  const normalized = (query || "").trim().toLowerCase();
  let matches = 0;

  for (const link of tabLinks) {
    const title = link.dataset.title || link.textContent;
    const visible = !normalized || title.toLowerCase().includes(normalized);
    link.style.display = visible ? "" : "none";
    if (visible) matches++;
  }

  let emptyMsg = tabList.querySelector(".empty-message");
  if (matches === 0) {
    if (!emptyMsg) {
      emptyMsg = document.createElement("p");
      emptyMsg.className = "empty-message";
      emptyMsg.textContent = "No matching songs.";
      tabList.appendChild(emptyMsg);
    }
    emptyMsg.style.display = "";
  } else if (emptyMsg) {
    emptyMsg.style.display = "none";
  }
}

if (searchInput) {
  // Check URL query param first, then sessionStorage
  const urlQuery = new URLSearchParams(window.location.search).get("q");
  const savedQuery = urlQuery || sessionStorage.getItem("tab_search") || "";

  if (savedQuery) {
    searchInput.value = savedQuery;
    filterSongs(savedQuery);
  }

  searchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    if (val.trim()) {
      sessionStorage.setItem("tab_search", val);
    } else {
      sessionStorage.removeItem("tab_search");
    }
    filterSongs(val);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      sessionStorage.removeItem("tab_search");
      filterSongs("");
    }
  });
}

// Support legacy hash links like index.html#2x2 or index.html#Anchor%20Drops
if (window.location.hash) {
  const hash = decodeURIComponent(window.location.hash.slice(1)).trim().toLowerCase();
  if (hash) {
    const match = tabLinks.find((link) => {
      const slug = link.dataset.slug?.toLowerCase();
      const title = (link.dataset.title || link.textContent).trim().toLowerCase();
      return slug === hash || title === hash;
    });
    if (match) {
      window.location.replace(match.href);
    }
  }
}
