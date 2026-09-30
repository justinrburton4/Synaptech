import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const projects = await readFile(new URL("../projects.html", import.meta.url), "utf8").catch(() => "");
const categoryPages = {
  "ai-tools.html": await readFile(new URL("../ai-tools.html", import.meta.url), "utf8").catch(() => ""),
  "web-design.html": await readFile(new URL("../web-design.html", import.meta.url), "utf8").catch(() => ""),
  "graphic-design.html": await readFile(new URL("../graphic-design.html", import.meta.url), "utf8").catch(() => ""),
  "custom-software.html": await readFile(new URL("../custom-software.html", import.meta.url), "utf8").catch(() => ""),
};
const previewPages = {
  "project-tonaliq.html": await readFile(new URL("../project-tonaliq.html", import.meta.url), "utf8").catch(() => ""),
  "project-design-byu.html": await readFile(new URL("../project-design-byu.html", import.meta.url), "utf8").catch(() => ""),
  "project-red-rising.html": await readFile(new URL("../project-red-rising.html", import.meta.url), "utf8").catch(() => ""),
  "project-spicy-pineapple.html": await readFile(new URL("../project-spicy-pineapple.html", import.meta.url), "utf8").catch(() => ""),
  "project-decal-company.html": await readFile(new URL("../project-decal-company.html", import.meta.url), "utf8").catch(() => ""),
  "project-move-team.html": await readFile(new URL("../project-move-team.html", import.meta.url), "utf8").catch(() => ""),
};
const previewScript = await readFile(new URL("../project-preview.js", import.meta.url), "utf8").catch(() => "");
const homeConcepts = {
  "home-concept-1.html": await readFile(new URL("../home-concept-1.html", import.meta.url), "utf8").catch(() => ""),
};
const homeConceptCss = await readFile(new URL("../home-concepts.css", import.meta.url), "utf8").catch(() => "");
const homeConceptOneScript = await readFile(new URL("../home-concept-1.js", import.meta.url), "utf8").catch(() => "");
const allInteriorPages = { projects, ...categoryPages, ...previewPages };

test("landing page presents Synaptech without unverifiable proof claims", () => {
  assert.match(html, /<h1[^>]*>Design solutions for ideas worth building\.<\/h1>/i);
  assert.match(html, /designs and builds digital products, websites, storefronts, and interactive experiences/i);
  assert.match(html, /class="graph-hub"[^>]*data-graph-point="synaptech"/i);
  assert.doesNotMatch(html, /Strategy, design &amp; development/i);
  assert.doesNotMatch(html, /\b(?:award-winning|industry-leading|trusted by|guaranteed|#1)\b/i);
});

test("navigation and contact path are accessible without JavaScript", () => {
  assert.match(html, /<nav[^>]*aria-label="Primary"/i);
  assert.match(html, /href="mailto:solutionswithsynaptech@gmail\.com\?subject=Synaptech%20project%20inquiry"/i);
  assert.match(html, /data-project-graph[^>]*aria-label="Interactive map of projects organized by category"/i);
  assert.match(homeConceptCss, /\.concept-skip\s*{[^}]*clip-path:\s*inset\(50%\)/i);
  assert.match(homeConceptCss, /\.concept-skip:focus\s*{[^}]*clip-path:\s*none/i);
});

test("the supplied brand asset is used with meaningful alternative text", () => {
  assert.match(html, /src="assets\/synaptech-design-logo\.png"/i);
  assert.match(html, /alt="Synaptech Design Solutions"/i);
  assert.match(projects, /src="assets\/synaptech-design-logo\.png"/i);
});

test("project imagery reserves space and defers below-fold loading", () => {
  for (const [file, page] of Object.entries({ index: html, projects, ...categoryPages, ...previewPages })) {
    const images = page.match(/<img\b[^>]*>/gi) ?? [];
    assert.ok(images.length > 0, file);
    for (const image of images) {
      assert.match(image, /\bwidth="\d+"/i, `${file}: ${image}`);
      assert.match(image, /\bheight="\d+"/i, `${file}: ${image}`);
    }
  }
  assert.match(projects, /<img[^>]*loading="lazy"/i);
});

test("the page contains only the header and opening hero", () => {
  assert.doesNotMatch(html, /signal-card|featured-deck|id="services"|id="process"|<footer/i);
  assert.equal((html.match(/<section\b/gi) ?? []).length, 1);
});

test("the visual palette is monochrome with one intentional signal color", () => {
  const colors = [...css.matchAll(/#[0-9a-f]{6}\b/gi)].map(([hex]) => hex);

  for (const hex of colors) {
    if (hex.toLowerCase() === "#2d6f91") continue;
    const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((value) => parseInt(value, 16));
    assert.ok(Math.max(...channels) - Math.min(...channels) <= 8, `${hex} is not monochrome`);
  }
});

test("the home page prioritizes brand purpose over project navigation", () => {
  assert.match(html, /class="concept-nav"[\s\S]*?href="projects\.html"[\s\S]*?Start a project/i);
  assert.match(html, /class="field-message"[\s\S]*?Design solutions for ideas worth building/i);
  assert.match(html, /class="project-graph"/i);
  assert.match(homeConceptCss, /\.concept\s*{[^}]*height:\s*100svh[^}]*overflow:\s*hidden/i);
});

test("the full home project navigation persists unchanged across interior pages", () => {
  const destinations = ["ai-tools.html", "web-design.html", "graphic-design.html", "custom-software.html", "projects.html"];

  for (const [file, page] of Object.entries(allInteriorPages)) {
    assert.match(page, /<nav[^>]*class="project-nav"[^>]*aria-label="Primary"/i, file);
    for (const destination of destinations) {
      assert.match(page, new RegExp(`href="${destination}"`, "i"), `${file} -> ${destination}`);
    }
  }
});

test("each category page contains only its own project cards", () => {
  const expected = {
    "ai-tools.html": ["TonaliQ"],
    "web-design.html": ["design.byu.edu", "redrising.games", "BYU Move Team Management System"],
    "graphic-design.html": ["SpicyPineappleGroup", "The Decal Company"],
    "custom-software.html": ["BYU Move Team Management System"],
  };

  for (const [file, names] of Object.entries(expected)) {
    const page = categoryPages[file];
    assert.equal((page.match(/<article[^>]*class="project-card"/gi) ?? []).length, names.length, file);
    for (const name of names) assert.match(page, new RegExp(name.replaceAll(".", "\\."), "i"), file);
  }
});

test("every project card opens a dedicated factual preview page", () => {
  const expected = {
    "project-tonaliq.html": "TonaliQ",
    "project-design-byu.html": "design.byu.edu",
    "project-red-rising.html": "redrising.games",
    "project-spicy-pineapple.html": "SpicyPineappleGroup",
    "project-decal-company.html": "The Decal Company",
    "project-move-team.html": "BYU Move Team Management System",
  };

  assert.equal((projects.match(/class="project-card-preview"/gi) ?? []).length, 6);
  assert.equal(Object.values(categoryPages).reduce((count, page) => count + (page.match(/class="project-card-preview"/gi) ?? []).length, 0), 7);

  const categoryLinks = {
    "ai-tools.html": ["project-tonaliq.html"],
    "web-design.html": ["project-design-byu.html", "project-red-rising.html", "project-move-team.html"],
    "graphic-design.html": ["project-spicy-pineapple.html", "project-decal-company.html"],
    "custom-software.html": ["project-move-team.html"],
  };
  for (const [page, links] of Object.entries(categoryLinks)) {
    for (const link of links) assert.match(categoryPages[page], new RegExp(`href="${link}"`, "i"), `${page} -> ${link}`);
  }

  for (const [file, name] of Object.entries(expected)) {
    assert.match(projects, new RegExp(`href="${file}"`, "i"), file);
    assert.match(previewPages[file], new RegExp(`<h1[^>]*>${name.replaceAll(".", "\\.")}<\\/h1>`, "i"), file);
    assert.doesNotMatch(previewPages[file], /\b(?:award-winning|industry-leading|trusted by|guaranteed|#1)\b/i, file);
  }
});

test("the landing page compacts vertically on short desktop viewports", () => {
  assert.match(homeConceptCss, /\.concept\s*{[^}]*height:\s*100svh[^}]*overflow:\s*hidden/i);
  assert.match(homeConceptCss, /\.field-layout\s*{[^}]*padding:\s*clamp\(1rem,\s*2\.5vh,\s*2rem\)/i);
  assert.match(homeConceptCss, /\.project-graph\s*{[^}]*height:\s*min\(74vh,\s*650px\)/i);
});

test("the projects page presents one unified grid with categories on the cards", () => {
  assert.equal((projects.match(/<section\b/gi) ?? []).length, 1);
  assert.match(projects, /<section class="project-category" aria-label="All projects">/i);
  assert.doesNotMatch(projects, /class="category-heading"|data-category=/i);
  for (const category of ["Audio tools / product", "Research / education", "Interactive / fan community", "Web application / operations", "Commerce / storefront", "Graphic design"]) {
    assert.match(projects, new RegExp(category.replaceAll("/", "\\/"), "i"));
  }
});

test("the requested design and custom software projects appear in their categories", () => {
  assert.equal((projects.match(/<article[^>]*class="project-card"/gi) ?? []).length, 6);
  assert.match(projects, /<h3[^>]*>The Decal Company<\/h3>/i);
  assert.equal((projects.match(/<h3[^>]*>BYU Move Team Management System<\/h3>/gi) ?? []).length, 1);
});

test("project cards retain a clear hierarchy without section dividers", () => {
  assert.doesNotMatch(projects, /class="category-heading"/i);
  assert.match(css, /\.project-card h3\s*{[^}]*font-size:/i);
});

test("the projects page presents a factual TonaliQ project card", () => {
  assert.match(projects, /<h1[^>]*>Projects<\/h1>/i);
  assert.match(projects, /<article[^>]*class="project-card"/i);
  assert.match(projects, /<h3[^>]*>TonaliQ<\/h3>/i);
  assert.match(projects, /audio-grounded feedback/i);
  assert.doesNotMatch(projects, /\b(?:award-winning|industry-leading|trusted by|guaranteed|#1)\b/i);
});

test("the projects page includes linked cards for BYU Design Exploration and SpicyPineappleGroup", () => {
  assert.equal((projects.match(/<article[^>]*class="project-card"/gi) ?? []).length, 6);
  assert.match(projects, /<h3[^>]*>design\.byu\.edu<\/h3>/i);
  assert.match(projects, /href="https:\/\/www\.design\.byu\.edu\/"/i);
  assert.match(projects, /<h3[^>]*>SpicyPineappleGroup<\/h3>/i);
  assert.match(projects, /href="https:\/\/www\.etsy\.com\/shop\/SpicyPineappleGroup"/i);
});

test("the projects page includes a factual linked card for redrising.games", () => {
  assert.match(projects, /<h3[^>]*>redrising\.games<\/h3>/i);
  assert.match(projects, /href="https:\/\/redrising\.games\/"/i);
  assert.match(projects, /unofficial fan project/i);
});

test("project cards use a compact desktop footprint", () => {
  assert.match(css, /\.project-card\s*{[^}]*aspect-ratio:\s*5\s*\/\s*6/i);
  assert.match(css, /\.category-page \.project-card\s*{[^}]*aspect-ratio:\s*3\s*\/\s*2/i);
  assert.match(css, /\.project-visual\s*{[^}]*min-height:\s*0/i);
  assert.match(css, /\.project-card h3\s*{[^}]*font-size:\s*clamp\(/i);
  assert.match(css, /\.projects-page:not\(\.category-page\) \.project-card p\s*{[^}]*-webkit-line-clamp:\s*3/i);
});

test("category titles are compact and project cards use a responsive grid", () => {
  assert.match(css, /\.projects-heading h1\s*{[^}]*font-size:\s*clamp\(/i);
  assert.match(css, /\.project-category\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(css, /\.category-page \.projects-main\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(css, /@media\s*\(max-width:\s*1060px\)[\s\S]*?\.project-category,\s*\.category-page \.projects-main\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.project-category,\s*\.category-page \.projects-main\s*{[^}]*grid-template-columns:\s*1fr/i);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.project-card\s*{[^}]*aspect-ratio:\s*auto/i);
  for (const [file, page] of Object.entries(categoryPages)) {
    assert.match(page, /<body class="projects-page category-page">/i, file);
  }
});

test("every project card uses a sourced representative image instead of letter art", () => {
  const cardPages = { projects, ...categoryPages };
  for (const [file, page] of Object.entries(cardPages)) {
    const cards = page.match(/<article[^>]*class="project-card"[\s\S]*?<\/article>/gi) ?? [];
    assert.ok(cards.length > 0, file);
    for (const card of cards) {
      assert.match(card, /class="project-visual\b[^"]*"[\s\S]*?<img[^>]+src="assets\/(?:project-cards|project-logos|byu-move|decal-company)\//i, file);
      assert.doesNotMatch(card, /class="project-monogram"/i, file);
    }
  }
});

test("The Decal Company preview presents supplied design assets as an accessible gallery", () => {
  const page = previewPages["project-decal-company.html"];
  assert.match(page, /class="preview-gallery"/i);
  assert.ok((page.match(/<img\b/gi) ?? []).length >= 4);
  assert.match(page, /assets\/decal-company\/brand-guide\.png/i);
  assert.match(page, /assets\/decal-company\/color-application\.png/i);
  assert.match(page, /assets\/decal-company\/size-guide\.png/i);
  assert.doesNotMatch(page, /<img(?![^>]*\balt=)[^>]*>/i);
});

test("BYU Move preview is an interactive, self-contained walkthrough", () => {
  const page = previewPages["project-move-team.html"];
  assert.match(page, /class="move-demo"/i);
  for (const view of ["home", "movers", "admin"]) {
    assert.match(page, new RegExp(`data-move-view="${view}"`, "i"));
    assert.match(page, new RegExp(`data-move-panel="${view}"`, "i"));
  }
  assert.match(page, /assets\/byu-move\/background\.jpeg/i);
  assert.match(page, /<script[^>]*src="project-preview\.js"[^>]*defer/i);
  assert.match(previewScript, /aria-selected/i);
  assert.match(previewScript, /data-move-panel/i);
  assert.match(previewScript, /hashchange/i);
});

test("BYU Move preview mirrors the built admin portal and exposes its operational views", () => {
  const page = previewPages["project-move-team.html"];
  assert.match(page, /class="byu-admin-shell"/i);
  assert.match(page, /Department of Exercise Sciences/i);
  assert.match(page, /<h3[^>]*>Mentors Portal<\/h3>/i);
  assert.match(page, /Welcome, <strong>BYU Move Admin<\/strong>/i);
  for (const view of ["dashboard", "sessions", "participants", "calendar", "manage", "mentors", "tools"]) {
    assert.match(page, new RegExp(`data-admin-view="${view}"`, "i"));
    assert.match(page, new RegExp(`data-admin-panel="${view}"`, "i"));
  }
  assert.match(previewScript, /data-admin-panel/i);
  assert.match(css, /\.byu-tool-grid\s*\{/i);
  assert.match(css, /\.byu-admin-wide\s*\{/i);
});

test("each preview page includes project detail beyond its opening summary", () => {
  for (const [file, page] of Object.entries(previewPages)) {
    assert.match(page, /class="preview-details"/i, file);
    assert.match(page, /<h2/i, file);
  }
});

test("project cards and preview heroes use the same project artwork as the homepage graph", () => {
  const expectedArtwork = {
    "project-tonaliq.html": "assets/project-logos/tonaliq-app-icon.png",
    "project-design-byu.html": "assets/project-logos/desx.png",
    "project-red-rising.html": "assets/project-logos/red-rising-games.png",
    "project-spicy-pineapple.html": "assets/project-logos/spdg.png",
    "project-decal-company.html": "assets/decal-company/monogram.png",
    "project-move-team.html": "assets/byu-move/logo.png",
  };

  for (const [file, artwork] of Object.entries(expectedArtwork)) {
    assert.match(previewPages[file], new RegExp(artwork.replaceAll("/", "\\/").replaceAll(".", "\\."), "i"), file);
    assert.match(projects, new RegExp(artwork.replaceAll("/", "\\/").replaceAll(".", "\\."), "i"), file);
  }

  assert.match(css, /\.category-page\s*{[^}]*min-height:\s*100svh[^}]*grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\)/i);
  assert.match(css, /\.preview-hero\s*{[^}]*min-height:\s*calc\(100svh\s*-\s*94px\)/i);
});

test("the minimalist homepage concept remains factual and brand-led", () => {
  Object.entries(homeConcepts).forEach(([file, page]) => {
    assert.match(page, /class="concept concept-field"/i, file);
    assert.match(page, /Design solutions for ideas worth building\./i, file);
    assert.match(page, /Synaptech designs and builds digital products, websites, storefronts, and interactive experiences/i, file);
    assert.match(page, /assets\/synaptech-(?:design-)?logo\.png/i, file);
    assert.doesNotMatch(page, /home-concept-[23]\.html/i, file);
    assert.match(page, /href="projects\.html"/i, file);
    assert.match(page, /mailto:solutionswithsynaptech@gmail\.com/i, file);
    assert.doesNotMatch(page, /\b(?:award-winning|industry-leading|trusted by|guaranteed|#1)\b/i, file);
  });

  assert.match(homeConceptCss, /\.concept\s*{[^}]*height:\s*100svh[^}]*overflow:\s*hidden/i);
  assert.match(homeConceptCss, /\.concept-field\s*{/i);
  assert.doesNotMatch(homeConceptCss, /\.concept-(?:frame|path)\s*{/i);
  assert.match(homeConceptCss, /@media\s*\(max-width:\s*560px\)/i);
  assert.match(homeConceptCss, /prefers-reduced-motion:\s*reduce/i);
});

test("the approved interactive concept is the canonical homepage", () => {
  assert.match(html, /<body class="concept concept-field">/i);
  assert.match(html, /data-project-graph/i);
  assert.match(html, /src="home-concept-1\.js"\s+defer/i);
  assert.match(html, /href="home-concepts\.css\?v=/i);
});

test("Open Field includes an accessible interactive project graph", () => {
  const page = homeConcepts["home-concept-1.html"];
  const projectNodes = page.match(/class="graph-node\s/g) || [];

  assert.match(page, /data-project-graph/i);
  assert.match(page, /<nav class="concept-nav" aria-label="Primary">/i);
  assert.match(page, /Selected work/i);
  assert.equal(projectNodes.length, 6);
  assert.match(page, /class="graph-hub"[^>]*data-graph-point="synaptech"/i);
  for (const category of ["Product &amp; AI", "Web design", "Graphic design", "Custom software"]) {
    assert.match(page, new RegExp(category, "i"));
  }
  for (const logo of ["tonaliq-app-icon.png", "desx.png", "red-rising-games.png", "spdg.png"]) {
    assert.match(page, new RegExp(`assets/project-logos/${logo.replace(".", "\\.")}`, "i"));
  }
  assert.match(page, /<dialog[^>]*data-project-dialog/i);
  assert.match(page, /data-project-preview/i);
  assert.match(page, /src="home-concept-1\.js"\s+defer/i);
  assert.match(homeConceptCss, /\.project-graph\s*{/i);
  assert.match(homeConceptCss, /\.graph-hub\s*{/i);
  assert.match(homeConceptCss, /\.graph-node\s*{/i);
  assert.match(homeConceptOneScript, /addEventListener\("pointermove"/i);
  assert.match(homeConceptOneScript, /addEventListener\("pointerenter"/i);
  assert.match(homeConceptOneScript, /addEventListener\("focus"/i);
  assert.match(homeConceptOneScript, /prefers-reduced-motion:\s*reduce/i);
  assert.match(homeConceptOneScript, /targetScale[\s\S]*proximity/i);
  assert.match(homeConceptOneScript, /--node-scale/i);
  assert.match(homeConceptOneScript, /showModal\(\)/i);
  assert.match(homeConceptOneScript, /setAttribute\("x1"/i);
});
