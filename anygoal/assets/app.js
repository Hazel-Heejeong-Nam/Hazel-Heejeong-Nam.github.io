const groups = [
  {
    label: "Overview",
    pages: [
      ["/", "Home"],
      ["/quick-start", "Quick start"],
      ["/baseline-models", "Baseline models"],
      ["/baseline-envs", "Baseline envs"],
      ["/download", "Download"],
      ["/cli", "CLI"],
    ],
  },
  {
    label: "Environments",
    pages: [
      ["/environments/avoidt", "AvoidT"],
      ["/environments/stackt", "StackT"],
      ["/environments/pusht-antigoal", "PushT Antigoal"],
      ["/environments/cubehop", "CubeHop"],
      ["/environments/cubediagonal", "CubeDiagonal"],
      ["/environments/hug-box", "Hug Box"],
      ["/environments/extractpeg", "ExtractPeg"],
      ["/environments/tworoom-route", "TwoRoom Route"],
    ],
  },
  {
    label: "API",
    pages: [
      ["/api/registry", "Registry"],
      ["/api/datasets", "Datasets"],
      ["/api/environments", "Environments"],
      ["/api/evaluation", "Evaluation"],
      ["/api/world-models", "World models"],
      ["/api/visualization", "Visualization"],
    ],
  },
];

const pageDetails = {
  "/quick-start": ["Get running with AnyGoal", "Install the package, discover registered components, and run your first benchmark workflow."],
  "/baseline-models": ["Baseline models", "A shared interface for the model families currently integrated with the AnyGoal benchmark."],
  "/baseline-envs": ["Baseline environments", "The four upstream environments used as the starting point for AnyGoal evaluation."],
  "/download": ["Download datasets & artifacts", "Locate, import, and validate the data and checkpoints used by benchmark runs."],
  "/cli": ["Command-line interface", "Discover datasets and models, collect data, evaluate predictions, plan, and visualize results."],
  "/environments/avoidt": ["AvoidT", "An AnyGoal Push-T family environment for evaluating behavior away from the canonical goal."],
  "/environments/stackt": ["StackT", "An AnyGoal Push-T family environment centered on a compositional stacked-object objective."],
  "/environments/pusht-antigoal": ["PushT Antigoal", "An AnyGoal Push-T family environment with an alternative goal specification."],
  "/environments/cubehop": ["CubeHop", "An AnyGoal cube-family environment for evaluating a new object interaction objective."],
  "/environments/cubediagonal": ["CubeDiagonal", "An AnyGoal cube-family environment with a diagonal manipulation objective."],
  "/environments/hug-box": ["Hug Box", "An AnyGoal manipulator-family task built on the insert-peg environment."],
  "/environments/extractpeg": ["ExtractPeg", "An AnyGoal manipulator-family task that reverses the canonical insertion objective."],
  "/environments/tworoom-route": ["TwoRoom Route", "An AnyGoal TwoRoom-family environment with a new route and geometry."],
  "/api/registry": ["Registry API", "Resolve canonical dataset, model, and visualizer specifications from the packaged catalog."],
  "/api/datasets": ["Datasets API", "Collect, validate, and adapt benchmark datasets through AnyGoal's dataset utilities."],
  "/api/environments": ["Environments API", "Register and construct the environment variants shipped by AnyGoal."],
  "/api/evaluation": ["Evaluation API", "Run prediction, planning, and counterfactual evaluation workflows."],
  "/api/world-models": ["World models API", "Adapters and planning interfaces for the world-model implementations integrated by AnyGoal."],
  "/api/visualization": ["Visualization API", "Render dataset sequences and plot registered benchmark result artifacts."],
};

const implementationNotes = {
  "/baseline-models": "Registered models: lewm · sensorimotor · prejepa · driftworld · irasim · toy-adaln · toy-action-duplicate · toy-driftworld",
  "/baseline-envs": "Upstream bases: pusht · cube · tworoom · insertpeg",
  "/environments/avoidt": "Catalog ID: avoidt  ·  Environment: anygoal/AvoidT-v1",
  "/environments/stackt": "Catalog ID: stackt  ·  Environment: anygoal/StackT-v2",
  "/environments/pusht-antigoal": "Catalog ID: pusht-antigoal  ·  Environment: anygoal/PushTAntigoal-v3",
  "/environments/cubehop": "Catalog ID: cubehop  ·  Environment: anygoal/CubeHop-v0",
  "/environments/cubediagonal": "Catalog ID: cubediagonal  ·  Environment: anygoal/CubeDiagonal-v0",
  "/environments/hug-box": "Catalog ID: hug_box  ·  Family: manipulator",
  "/environments/extractpeg": "Catalog ID: extractpeg  ·  Family: manipulator",
  "/environments/tworoom-route": "Catalog ID: tworoom_route  ·  Environment: anygoal/TwoRoom-Tri-v1",
  "/api/registry": "Module: anygoal.registry",
  "/api/datasets": "Module: anygoal.datasets",
  "/api/environments": "Module: anygoal.envs",
  "/api/evaluation": "Module: anygoal.evaluation",
  "/api/world-models": "Modules: anygoal.wm · anygoal.models",
  "/api/visualization": "Module: anygoal.visualization",
};

const flatPages = groups.flatMap((group) => group.pages.map(([path, title]) => ({ path, title, group: group.label })));
const navigation = document.querySelector("#navigation");
const main = document.querySelector("#main");
const toc = document.querySelector("#toc");

function currentPath() {
  const path = location.hash.replace(/^#/, "") || "/";
  return pageDetails[path] || path === "/" ? path : "/";
}

function renderNavigation(path) {
  navigation.innerHTML = groups.map((group) => `
    <section class="nav-group">
      <p>${group.label}</p>
      ${group.pages.map(([href, title]) => `<a class="nav-link${href === path ? " active" : ""}" href="#${href}">${title}</a>`).join("")}
    </section>
  `).join("");
}

function skeletonCopy() {
  return `<div class="placeholder-copy" aria-label="Content placeholder"><span class="placeholder-label">Content placeholder</span><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>`;
}

function codeBlock(kind = "python") {
  const isShell = kind === "shell";
  return `<div class="code-block">
    <div class="code-top"><span class="code-dots"><i></i><i></i><i></i></span><span>${isShell ? "terminal" : "example.py"}</span><button class="copy-button" type="button">Copy</button></div>
    <pre><code${isShell ? ' class="terminal-line"' : ""}>${isShell ? "anygoal &lt;command&gt; &lt;options&gt;" : '<span class="token-comment"># Code example placeholder</span>\n<span class="token-accent">import</span> anygoal\n\n<span class="token-comment"># Example usage will be added here.</span>'}</code></pre>
  </div>`;
}

function figurePlaceholder() {
  return `<div class="figure-placeholder"><div class="figure-inner"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="3"></rect><circle cx="17" cy="18" r="4"></circle><path d="m8 36 10-10 7 6 6-8 9 12"></path></svg><span>Figure placeholder</span></div></div>`;
}

function section(id, title, index, body) {
  return `<section class="doc-section" id="${id}"><div class="section-heading"><h2>${title}</h2><span class="section-index">${String(index).padStart(2, "0")}</span></div>${body}</section>`;
}

function pager(path) {
  const index = flatPages.findIndex((page) => page.path === path);
  const previous = flatPages[index - 1];
  const next = flatPages[index + 1];
  return `<nav class="pager" aria-label="Previous and next pages">
    ${previous ? `<a href="#${previous.path}"><span>← Previous</span><strong>${previous.title}</strong></a>` : "<span></span>"}
    ${next ? `<a href="#${next.path}"><span>Next →</span><strong>${next.title}</strong></a>` : ""}
  </nav>`;
}

function renderHome() {
  main.innerHTML = `<div class="home-hero">
    <div class="eyebrow">Documentation scaffold</div>
    <h1>World models,<br><span>tested beyond the goal.</span></h1>
    <p class="lead">AnyGoal is a benchmark API for collecting out-of-distribution control datasets and evaluating world models through prediction, planning, and counterfactual analysis.</p>
    <div class="status-note">The library and its documentation are in active development.</div>
    <div class="install-strip"><code>pip install anygoal</code><button type="button" data-copy="pip install anygoal">Copy</button></div>
  </div>
  ${section("start", "Start here", 1, `<div class="card-grid">
    <a class="doc-card" href="#/quick-start"><small>Guide</small><h3>Quick start →</h3><p>Installation, discovery, and a first benchmark run.</p></a>
    <a class="doc-card" href="#/cli"><small>Reference</small><h3>Command line →</h3><p>Commands for data, training, evaluation, and plots.</p></a>
    <a class="doc-card" href="#/baseline-models"><small>Catalog</small><h3>Baseline models →</h3><p>The integrated model families and capabilities.</p></a>
    <a class="doc-card" href="#/environments/avoidt"><small>Benchmark</small><h3>Environments →</h3><p>Eight AnyGoal variants grounded in the current catalog.</p></a>
  </div>`)}
  ${section("workflow", "Benchmark workflow", 2, skeletonCopy() + figurePlaceholder())}
  ${pager("/")}`;
  document.title = "AnyGoal — World models, tested beyond the goal";
}

function renderDoc(path) {
  const [title, subtitle] = pageDetails[path];
  const isCli = path === "/cli" || path === "/download";
  const isEnvironment = path.startsWith("/environments/");
  const headings = isEnvironment
    ? [["overview", "Overview"], ["task", "Task specification"], ["usage", "Usage"], ["visual", "Environment preview"]]
    : [["overview", "Overview"], ["interface", path.startsWith("/api/") ? "Interface" : "Setup"], ["example", "Example"], ["reference", "Reference"]];
  const bodies = [
    skeletonCopy(),
    skeletonCopy(),
    codeBlock(isCli ? "shell" : "python"),
    isEnvironment ? figurePlaceholder() : skeletonCopy(),
  ];
  main.innerHTML = `<header>
    <div class="eyebrow">${flatPages.find((page) => page.path === path).group}</div>
    <h1>${title}</h1>
    <p class="lead">${subtitle}</p>
    ${implementationNotes[path] ? `<div class="status-note">${implementationNotes[path]}</div>` : ""}
  </header>
  ${headings.map(([id, heading], index) => section(id, heading, index + 1, bodies[index])).join("")}
  ${pager(path)}`;
  document.title = `${title} — AnyGoal`;
}

function bindCopyButtons() {
  document.querySelectorAll(".copy-button, [data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy || button.closest(".code-block").querySelector("code").innerText;
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = original; }, 1200);
    });
  });
}

function render() {
  const path = currentPath();
  renderNavigation(path);
  if (path === "/") renderHome(); else renderDoc(path);
  toc.innerHTML = [...main.querySelectorAll(".doc-section")].map((element) => `<a href="#${path}::${element.id}" data-anchor="${element.id}">${element.querySelector("h2").textContent}</a>`).join("");
  toc.querySelectorAll("[data-anchor]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById(link.dataset.anchor).scrollIntoView();
  }));
  bindCopyButtons();
  document.body.classList.remove("menu-open");
  document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
  scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}

const themeToggle = document.querySelector("#theme-toggle");
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("anygoal-theme", next);
  document.querySelector('meta[name="theme-color"]').content = next === "dark" ? "#0c0c0d" : "#fafafa";
});

const menuToggle = document.querySelector("#menu-toggle");
menuToggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelector("#sidebar-scrim").addEventListener("click", () => document.body.classList.remove("menu-open"));

const searchDialog = document.querySelector("#search-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
function renderSearch(query = "") {
  const matches = flatPages.filter((page) => page.title.toLowerCase().includes(query.toLowerCase()));
  searchResults.innerHTML = matches.length ? matches.map((page) => `<a class="search-result" href="#${page.path}"><span>${page.title}</span><small>${page.group}</small></a>`).join("") : `<div class="empty-search">No pages found.</div>`;
  searchResults.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => searchDialog.close()));
}
function openSearch() { renderSearch(); searchDialog.showModal(); setTimeout(() => searchInput.focus(), 0); }
document.querySelector("#search-trigger").addEventListener("click", openSearch);
searchInput.addEventListener("input", () => renderSearch(searchInput.value));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); }
});

addEventListener("hashchange", render);
render();
