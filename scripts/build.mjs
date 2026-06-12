import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const rootPath = fileURLToPath(root);
const srcDir = path.join(rootPath, "src");
const tabsDir = path.join(rootPath, "tabs");
const distDir = path.join(rootPath, "dist");

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function titleFromFile(fileName) {
  return fileName.replace(/\.txt$/i, "");
}

function slugFor(fileName) {
  return titleFromFile(fileName)
    .toLowerCase()
    .replace(/#/g, "number-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTabPage(tab, content) {
  const rawUrl = encodeURIComponent(tab.fileName);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.2, maximum-scale=5.0">
    <meta name="description" content="Umphrey's McGee guitar tablature for ${escapeHtml(tab.title)}.">
    <meta name="theme-color" content="#121212">
    <title>${escapeHtml(tab.title)} - Umphrey's McGee Guitar Tabs</title>
    <link rel="icon" href="../favicon.ico">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body class="tab-page">
    <div class="tab-page-container">
      <header class="tab-header">
        <div class="tab-header-left">
          <a href="../index.html" class="back-link" id="backLink">&larr; Song List</a>
          <h1 class="tab-title">${escapeHtml(tab.title)}</h1>
        </div>

        <div class="tab-header-actions">
          <div class="zoom-controls" role="group" aria-label="Zoom controls">
            <button type="button" class="zoom-btn" id="zoomOut" title="Zoom out (− or [)">−</button>
            <button type="button" class="zoom-btn" id="zoomFit" title="Fit width to screen (F)">Fit</button>
            <button type="button" class="zoom-btn" id="zoomIn" title="Zoom in (+ or ])">+</button>
            <button type="button" class="zoom-btn" id="zoomReset" title="Reset zoom (0)">100%</button>
          </div>
          <a href="${rawUrl}" class="raw-link" title="View plain text file">View TXT</a>
          <a href="${rawUrl}" class="raw-link" download="${escapeHtml(tab.fileName)}" title="Download plain text file">Download TXT</a>
        </div>
      </header>

      <main class="tab-view">
        <pre id="tabContent" class="tab-content">${escapeHtml(content)}</pre>
      </main>
    </div>
    <script>
      (function() {
        const backLink = document.getElementById("backLink");
        if (backLink) {
          backLink.addEventListener("click", (e) => {
            if (window.history.length > 1) {
              e.preventDefault();
              window.history.back();
            }
          });
        }

        const tabContent = document.getElementById("tabContent");
        const zoomReset = document.getElementById("zoomReset");
        const baseFontSize = 15;
        let currentScale = 1.0;

        function applyZoom(scale) {
          currentScale = Math.max(0.35, Math.min(2.5, scale));
          if (tabContent) {
            tabContent.style.fontSize = (baseFontSize * currentScale).toFixed(1) + "px";
          }
          if (zoomReset) {
            zoomReset.textContent = Math.round(currentScale * 100) + "%";
          }
          try {
            localStorage.setItem("tab_zoom", currentScale.toFixed(2));
          } catch (_) {}
        }

        function zoomIn() { applyZoom(currentScale + 0.1); }
        function zoomOut() { applyZoom(currentScale - 0.1); }
        function resetZoom() { applyZoom(1.0); }

        function fitZoom() {
          if (!tabContent) return;
          tabContent.style.fontSize = baseFontSize + "px";
          const contentWidth = tabContent.scrollWidth;
          const availableWidth = window.innerWidth - 36;
          if (contentWidth > availableWidth && contentWidth > 0) {
            applyZoom((availableWidth / contentWidth) * 0.96);
          } else {
            applyZoom(1.0);
          }
        }

        document.getElementById("zoomIn")?.addEventListener("click", zoomIn);
        document.getElementById("zoomOut")?.addEventListener("click", zoomOut);
        document.getElementById("zoomFit")?.addEventListener("click", fitZoom);
        document.getElementById("zoomReset")?.addEventListener("click", resetZoom);

        // macOS Trackpad Pinch-to-zoom (wheel with ctrlKey in Chrome/Safari/Firefox)
        window.addEventListener("wheel", (e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 0.96 : 1.04;
            applyZoom(currentScale * factor);
          }
        }, { passive: false });

        // Safari GestureEvent support
        window.addEventListener("gesturestart", (e) => { e.preventDefault(); });
        window.addEventListener("gesturechange", (e) => {
          e.preventDefault();
          if (e.scale) {
            applyZoom(currentScale * (e.scale > 1 ? 1.03 : 0.97));
          }
        });

        // Desktop keyboard shortcuts
        window.addEventListener("keydown", (e) => {
          if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
          if (e.key === "-" || e.key === "_" || e.key === "[") {
            e.preventDefault();
            zoomOut();
          } else if (e.key === "+" || e.key === "=" || e.key === "]") {
            e.preventDefault();
            zoomIn();
          } else if (e.key === "0") {
            e.preventDefault();
            resetZoom();
          } else if (e.key === "f" || e.key === "F") {
            e.preventDefault();
            fitZoom();
          }
        });

        try {
          const saved = parseFloat(localStorage.getItem("tab_zoom"));
          if (!isNaN(saved) && saved >= 0.35 && saved <= 2.5 && saved !== 1.0) {
            applyZoom(saved);
          }
        } catch (_) {}
      })();
    </script>
  </body>
</html>
`;
}

function renderTabHtmlRedirect() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Umphrey's McGee Guitar Tabs</title>
    <link rel="icon" href="favicon.ico">
    <link rel="stylesheet" href="styles.css">
    <script>
      function slugFor(name) {
        return name
          .replace(/\\.txt$/i, "")
          .toLowerCase()
          .replace(/#/g, "number-")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        window.location.replace("tabs/" + slugFor(tab) + ".html");
      } else {
        window.location.replace("index.html");
      }
    </script>
  </head>
  <body>
    <p style="padding: 2rem; color: #a39c90; font-family: sans-serif;">Redirecting...</p>
  </body>
</html>
`;
}

function render404Page() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found - Umphrey's McGee Guitar Tabs</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/styles.css">
    <script>
      function slugFor(name) {
        return name
          .replace(/\\.txt$/i, "")
          .toLowerCase()
          .replace(/#/g, "number-")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      const path = window.location.pathname;
      const search = window.location.search;
      if (path.includes("tab.php") || path.includes("tab.html")) {
        const params = new URLSearchParams(search);
        const tab = params.get("tab");
        if (tab) {
          window.location.replace("/tabs/" + slugFor(tab) + ".html");
        } else {
          window.location.replace("/index.html");
        }
      }
    </script>
  </head>
  <body>
    <div class="container" style="text-align: center; padding-top: 4rem;">
      <header class="site-header">
        <h1>Page Not Found</h1>
      </header>
      <p style="color: #a39c90; margin: 1.5rem 0;">The requested page could not be found.</p>
      <a href="/index.html" class="tab-link" style="display: inline-block;">&larr; Back to Song List</a>
    </div>
  </body>
</html>
`;
}

async function build() {
  const files = (await readdir(tabsDir))
    .filter((fileName) => fileName.toLowerCase().endsWith(".txt"))
    .sort((a, b) => collator.compare(titleFromFile(a), titleFromFile(b)));

  const tabsWithContent = await Promise.all(
    files.map(async (fileName) => {
      const rawContent = await readFile(path.join(tabsDir, fileName), "utf8");
      const title = titleFromFile(fileName);
      const slug = slugFor(fileName);
      return {
        fileName,
        title,
        slug,
        rawContent
      };
    })
  );

  await rm(distDir, { recursive: true, force: true });
  await mkdir(path.join(distDir, "tabs"), { recursive: true });

  // 1. Write individual HTML pages and copy raw txt files for each tab
  await Promise.all(
    tabsWithContent.map(async (tab) => {
      const html = renderTabPage(tab, tab.rawContent);
      await writeFile(path.join(distDir, "tabs", `${tab.slug}.html`), html);
      await copyFile(path.join(tabsDir, tab.fileName), path.join(distDir, "tabs", tab.fileName));
    })
  );

  // 2. Build index.html with pre-rendered list of tabs
  const indexTemplate = await readFile(path.join(srcDir, "index.html"), "utf8");
  const tabListHtml = tabsWithContent
    .map(
      (t) =>
        `        <a href="tabs/${t.slug}.html" class="tab-link" data-slug="${t.slug}" data-title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</a>`
    )
    .join("\n");
  const indexHtml = indexTemplate.replace("<!-- TAB_LIST_ITEMS -->", tabListHtml);
  await writeFile(path.join(distDir, "index.html"), indexHtml);

  // 3. Write tab.html redirect and 404.html
  await writeFile(path.join(distDir, "tab.html"), renderTabHtmlRedirect());
  await writeFile(path.join(distDir, "404.html"), render404Page());
  await writeFile(path.join(distDir, ".nojekyll"), "");

  // 4. Copy static assets
  await Promise.all([
    copyFile(path.join(srcDir, "styles.css"), path.join(distDir, "styles.css")),
    copyFile(path.join(srcDir, "app.js"), path.join(distDir, "app.js")),
    copyFile(path.join(rootPath, "robots.txt"), path.join(distDir, "robots.txt")),
    copyFile(path.join(rootPath, "favicon.ico"), path.join(distDir, "favicon.ico"))
  ]);

  // 5. Generate tabs.json for metadata/API consumers
  const tabsJsonData = tabsWithContent.map(({ fileName, title, slug }) => ({
    fileName,
    title,
    slug,
    url: `tabs/${slug}.html`,
    rawUrl: `tabs/${encodeURIComponent(fileName)}`
  }));
  await writeFile(
    path.join(distDir, "tabs.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), tabs: tabsJsonData }, null, 2)}\n`
  );

  console.log(`Built ${tabsWithContent.length} tabs and static site in dist/`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
