const html = String.raw;

const groups = [
  {
    label: "Overview",
    pages: [
      ["/", "Home"],
      ["/installation", "Installation"],
      ["/quick-start", "Quick start"],
      ["/datasets", "Dataset catalog"],
      ["/models", "Model integrations"],
      ["/stable-stack", "Built on StableWM"],
    ],
  },
  {
    label: "Guides",
    pages: [
      ["/guides/collection", "Collect data"],
      ["/guides/model-sources", "Install model sources"],
      ["/guides/training", "Train a model"],
      ["/guides/rollout", "Rollout evaluation"],
      ["/guides/planning", "Planning evaluation"],
      ["/guides/reproduction", "Reproduce a matrix"],
    ],
  },
  {
    label: "AnyGoal tasks",
    pages: [
      ["/tasks/avoidt", "AvoidT"],
      ["/tasks/stackt", "StackT"],
      ["/tasks/pusht-antigoal", "PushT Antigoal"],
      ["/tasks/cubehop", "CubeHop"],
      ["/tasks/cubediagonal", "CubeDiagonal"],
      ["/tasks/avoid-peg", "Avoid Peg"],
      ["/tasks/extractpeg", "ExtractPeg"],
      ["/tasks/tworoom-route", "TwoRoom Route"],
    ],
  },
  {
    label: "Reference",
    pages: [
      ["/reference/python", "Python API"],
      ["/reference/cli", "CLI"],
      ["/reference/configuration", "Configuration"],
      ["/reference/registry", "Registry & extensions"],
      ["/reference/contracts", "Data Contracts"],
    ],
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function code(value) {
  return `<code>${escapeHtml(value)}</code>`;
}

function languageForLabel(label) {
  const normalized = label.toLowerCase();
  if (normalized === "terminal") return "bash";
  if (normalized.endsWith(".py")) return "python";
  if (normalized.endsWith(".yaml") || normalized.endsWith(".yml")) return "yaml";
  return "none";
}

function codeBlock(label, value) {
  const compact = label.toLowerCase() === "terminal" || label.toLowerCase().endsWith(".py");
  return html`<div class="code-block${compact ? " compact-code" : ""}">
    ${compact
      ? `<button class="copy-button symbol-copy" type="button" aria-label="Copy code" title="Copy code"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="9" y="9" width="10" height="10" rx="1.5"></rect><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg></button>`
      : `<div class="code-top">
        <span class="code-dots"><i></i><i></i><i></i></span>
        <span>${escapeHtml(label)}</span>
        <button class="copy-button" type="button">Copy</button>
      </div>`}
    <pre><code class="language-${languageForLabel(label)}">${escapeHtml(value.trim())}</code></pre>
  </div>`;
}

function callout(title, body, tone = "note") {
  return html`<aside class="callout ${tone}"><strong>${title}</strong><div>${body}</div></aside>`;
}

function bullets(items) {
  return `<ul class="content-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function steps(items) {
  return `<ol class="steps">${items.map(([title, body]) => `<li><strong>${title}</strong><div>${body}</div></li>`).join("")}</ol>`;
}

function table(headers, rows) {
  return html`<div class="table-wrap"><table>
    <thead><tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((item) => `<td>${item}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function signature(name, value, description) {
  return html`<article class="api-item">
    <div class="api-name"><span>${name}</span><code>${escapeHtml(value)}</code></div>
    <p>${description}</p>
  </article>`;
}

const datasetRows = [
  [code("pusht"), "PushT", code("pusht_expert_train.h5"), "External base data"],
  [code("avoidt"), "PushT", code("avoidt_test.h5"), "Generated"],
  [code("stackt"), "PushT", code("stackt_test.h5"), "Generated"],
  [code("pusht-antigoal"), "PushT", code("pusht_antigoal_test.h5"), "Generated"],
  [code("cube"), "Cube", code("cube_single_expert.h5"), "External base data"],
  [code("cubehop"), "Cube", code("cube_hop_test.h5"), "Generated"],
  [code("cubediagonal"), "Cube", code("cube_diagonal_test.h5"), "Generated"],
  [code("insertpeg"), "Insert Peg", code("manipulator_insert_peg_weak_expert_train.h5"), "External base data"],
  [code("avoid_peg"), "Insert Peg", code("avoid_peg_test.h5"), "Generated"],
  [code("extractpeg"), "Insert Peg", code("extract_peg_test.h5"), "Generated"],
  [code("tworoom"), "TwoRoom", code("tworoom.h5"), "External base data"],
  [code("tworoom_route"), "TwoRoom", code("tworoom_route_test.h5"), "Generated"],
];

const modelRows = [
  [code("lewm"), "LeWM", "Original source checkout", "latent"],
  [code("sensorimotor"), "Sensorimotor WM", "Original source checkout", "latent"],
  [code("prejepa"), "PreJEPA / DINO-WM alias", "Packaged runner", "latent (non-action modalities)"],
  [code("driftworld"), "DriftWorld", "Original source checkout", "normalized pixels"],
  [code("irasim"), "IRASim", "Original source checkout", "normalized pixels"],
  [code("toy-adaln"), "AdaLN predictor", "AnyGoal native", "normalized state"],
  [code("toy-action-duplicate"), "Action-duplicate predictor", "AnyGoal native", "normalized state"],
  [code("toy-driftworld"), "Toy DriftWorld predictor", "AnyGoal native", "normalized state"],
];

const pages = {
  "/installation": {
    title: "Installation",
    subtitle: "Choose the smallest dependency set for data, evaluation, or training, then add original model sources explicitly when needed.",
    sections: [
      ["tiers", "Install tiers", html`
        <p>The default package is the data-and-environment install. The explicit ${code("data")} extra is an alias, ${code("eval")} adds rollout and planning dependencies, and ${code("all")} adds the training stack.</p>
        ${codeBlock("terminal", `pip install anygoal                  # same as anygoal[data]
pip install 'anygoal[data]'          # data I/O, collection, environments
pip install 'anygoal[eval]'          # data + rollout/planning dependencies
pip install 'anygoal[all]'           # data + evaluation + training`)}
        ${callout("Dependency rule", `${code("eval")} includes the default data functionality; ${code("all")} includes data, evaluation, and training. You do not need to combine extras manually.`)}
      `],
      ["requirements", "Runtime requirements", html`
        <p>The package metadata supports Python 3.10 and newer. The repository's exact reproducibility environment targets Python 3.10 and CUDA 12.8 and is pinned in ${code("requirements.txt")}.</p>
        ${table(["Use case", "Recommended setup"], [
        ["Library user", `${code("pip install anygoal")} or one of the extras above`],
        ["Exact repository reproduction", `${code("python3.10 -m venv .venv")} followed by ${code("pip install -r requirements.txt")}`],
        ["Contributor", "Editable source install plus the project's development tools"],
      ])}
      `],
      ["sources", "Third-party model sources", html`
        <p>AnyGoal does not redistribute the upstream LeWM, Sensorimotor, DriftWorld, or IRASim repositories in its wheel. Install only the source trees required for your experiment:</p>
        ${codeBlock("terminal", `anygoal models list
anygoal models install driftworld
anygoal models install irasim
anygoal models install lewm
anygoal models install sensorimotor
# or: anygoal models install --all`)}
        <p>The installer checks out the exact revisions in ${code("anygoal/resources/sources.yaml")} under ${code("$ANYGOAL_HOME/sources")} (default ${code("~/.anygoal/sources")}) and does not run a hidden package installation.</p>
      `],
      ["verify", "Verify the install", html`
        ${codeBlock("terminal", `anygoal --version
anygoal list datasets
anygoal list models
anygoal models list`)}
        <p>Importing ${code("anygoal")} registers the shipped Gymnasium environments. Heavy training and evaluator dependencies are imported lazily only when their APIs are called.</p>
      `],
    ],
  },
  "/quick-start": {
    title: "Quick start",
    subtitle: "Collect an AnyGoal task dataset, validate it, inspect a model command, and use the public Python API.",
    sections: [
      ["discover", "1. Discover registered components", html`
        ${codeBlock("terminal", `anygoal list datasets
anygoal list models
anygoal models list`)}
        <p>The catalog is the source of truth for canonical IDs, aliases, task families, filenames, model capabilities, and runner profiles.</p>
      `],
      ["artifacts", "2. Download artifacts and evaluate", html`
        <p>Download all published checkpoints and datasets.</p>
        ${codeBlock("terminal", `anygoal artifacts download --checkpoints --all
anygoal artifacts download --datasets --all`)}
        <p>Download the specific dataset and checkpoint.</p>
        ${codeBlock("terminal", `anygoal artifacts download \
  --model driftworld \
  --dataset cubehop`)}
        <p>Alternatively, download artifacts during evaluation.</p>
        ${codeBlock("terminal", `anygoal eval planning \
  --model driftworld \
  --dataset cubehop \
  --download`)}
        <p>AnyGoal resolves published model checkpoints and datasets from Hugging Face. Use the targeted download first for a single evaluation, or download the complete published artifact set for offline experiments.</p>
      `],
      ["evaluate", "3. Resolve an evaluation before running it", html`
        ${codeBlock("terminal", `anygoal models install driftworld
anygoal eval rollout --model driftworld --dataset avoidt --seed 0 --dry-run
anygoal eval planning --model driftworld --dataset avoidt --seed 0 --dry-run`)}
        ${callout("Dry runs are deliberate", "The CLI evaluation commands are reproduction entry points backed by packaged model/task configs. Use a dry run first to inspect the exact module, checkpoint override, and configuration that will execute.")}
      `],
      ["python", "4. Use explicit paths from Python", html`
        ${codeBlock("example.py", `import anygoal

dataset_path = anygoal.collect("avoidt", num_episodes=400, seed=0)

result = anygoal.evaluate_rollout(
    "driftworld",
    data=dataset_path,
    checkpoint="/path/to/checkpoint.pth",
    seed=[0, 1, 2],
)

print(result[0].five_step_mse)
print(result[0].horizons[25].terminal_mse)`)}
        <p>The Python API is the direct interface for custom dataset and checkpoint paths. A sequence of seeds returns a dictionary keyed by seed; a scalar seed returns one result.</p>
      `],
    ],
  },
  "/datasets": {
    title: "Dataset catalog",
    subtitle: "Twelve registered datasets: four upstream base tasks and eight state-action recombination tasks generated by AnyGoal.",
    sections: [
      ["catalog", "Registered IDs", html`
        ${table(["Dataset ID", "Family", "Canonical filename", "Source"], datasetRows)}
        <p>Aliases such as ${code("cube_diagonal")}, ${code("extract_peg")}, and ${code("tworoom-route")} resolve to the canonical IDs shown above.</p>
      `],
      ["base", "Base datasets", html`
        <p>${code("pusht")}, ${code("cube")}, ${code("insertpeg")}, and ${code("tworoom")} are external artifacts. AnyGoal does not reconstruct them through ${code("collect")}; obtain the published HDF5 files, keep their canonical names when practical, and validate them locally.</p>
        ${codeBlock("terminal", `anygoal data validate /path/to/pusht_expert_train.h5 --dataset pusht
anygoal data validate /path/to/cube_single_expert.h5 --dataset cube`)}
      `],
      ["generated", "Generated tasks", html`
        <p>The eight AnyGoal variants have in-package collectors and scripted policies. Several collectors deliberately depend on a base dataset to constrain actions, states, or episode support.</p>
        ${bullets([
        `${code("avoidt")} and ${code("tworoom_route")} can be generated without a base reference file.`,
        `${code("stackt")} and ${code("pusht-antigoal")} use PushT reference support.`,
        `${code("cubehop")} and ${code("cubediagonal")} use the Cube reference artifact.`,
        `${code("avoid_peg")} and ${code("extractpeg")} use the Insert Peg reference artifact.`,
      ])}
      `],
      ["identity", "Identity and validation", html`
        <p>Collection stamps ${code("anygoal_dataset_id")} in the HDF5 root. Training and public evaluation infer a task from the canonical filename or HDF5 attributes and reject a conflicting explicit ${code("task")}.</p>
        <p>The common validator is non-mutating. It checks the file extension, required ${code("action")} and ${code("pixels")} columns, leading dimensions, and episode bookkeeping through ${code("ep_len")} or ${code("episode")}.</p>
      `],
    ],
  },
  "/models": {
    title: "Model integrations",
    subtitle: "Eight registered model adapters share benchmark entry points while retaining model-native preprocessing, checkpoints, and error spaces.",
    sections: [
      ["matrix", "Integration matrix", html`
        ${table(["Model ID", "Integration", "Code origin", "Rollout error space"], modelRows)}
        <p>Every current catalog entry declares ${code("train")}, ${code("rollout")}, and ${code("plan")} capabilities for the PushT, Cube, TwoRoom, and Insert Peg families.</p>
      `],
      ["boundary", "What AnyGoal standardizes", html`
        ${bullets([
        "Dataset and model IDs, aliases, supported families, and profile lookup.",
        "Episode sampling, action-block alignment, evaluation seeds, and result records.",
        "The call into each model's original trainer, checkpoint loader, rollout adapter, and planner.",
      ])}
        <p>AnyGoal does not pretend that every model computes the same internal quantity. Rollout results always record their ${code("error_space")}, and preprocessing remains owned by the adapter.</p>
      `],
      ["sources", "Source ownership", html`
        <p>The managed source installer clones original upstream repositories at pinned commits. This keeps attribution and repository history intact and lets integrations import the authors' implementations without vendoring them into AnyGoal.</p>
        ${codeBlock("terminal", `anygoal models status lewm
anygoal models status sensorimotor
anygoal models status driftworld
anygoal models status irasim`)}
      `],
      ["checkpoints", "Checkpoints are separate", html`
        ${callout("No automatic checkpoint download", "A source checkout is not a trained checkpoint. Pass an explicit checkpoint or use a verified packaged profile whose path is configured in your environment. Public checkpoint URLs, licenses, and hashes must be supplied before a release can promise automatic retrieval.", "warning")}
      `],
    ],
  },
  "/stable-stack": {
    title: "Built on Stable World-Model",
    subtitle: "AnyGoal adds tasks and evaluation protocols while keeping the established Stable World-Model stack underneath.",
    sections: [
      ["boundary", "What comes from where", html`
        ${table(["Layer", "Owner"], [
        ["Worlds & environments", "Stable World-Model base environments; AnyGoal task variants and registration"],
        ["Dataset I/O", `Stable World-Model ${code("HDF5Dataset")}; AnyGoal collection, identity, and validation`],
        ["Planning", `Stable World-Model ${code("World")}, solver, cost, and policy; AnyGoal trial selection and task metrics`],
        ["Model training", "Original model code plus Stable Pretraining where required; AnyGoal runners and profiles"],
      ])}
      `],
      ["data", "Shared data contract", html`
        <p>AnyGoal reads and writes the same trajectory HDF5 layout used by Stable World-Model. Paths or existing ${code("HDF5Dataset")} objects work directly in training, rollout, and planning.</p>
      `],
      ["planning", "A thin planning layer", html`
        <p>${code("anygoal.plan")} keeps Stable World-Model's model, cost, solver, and policy behavior. It only selects deterministic dataset trials, restores task state, and records benchmark results.</p>
      `],
      ["training", "Training support", html`
        <p>Stable Pretraining supplies training components for LeWM, Sensorimotor, PreJEPA, and toy-predictor integrations. It is optional unless those workflows need it.</p>
      `],
    ],
  },
  "/guides/collection": {
    title: "Collect data",
    subtitle: "Use one registry ID from Python or the CLI; AnyGoal dispatches to the matching in-package collector.",
    sections: [
      ["api", "Python interface", html`
        ${codeBlock("example.py", `from anygoal import collect

path = collect(
    "cubediagonal",
    num_episodes=400,
    num_parallel=5,
    seed=10065,
    output="/data/cube_diagonal_test.h5",
)
print(path)`)}
        <p>Keyword arguments map directly to the selected collector. ${code("num_episodes")} is translated to the collector's native count option; TwoRoom Route is the exception because its full preset uses fixed balanced condition counts.</p>
      `],
      ["cli", "Command line", html`
        ${codeBlock("terminal", `anygoal collect cubediagonal \
  --num-episodes 400 \
  --num-parallel 5 \
  --seed 10065 \
  --output /data/cube_diagonal_test.h5`)}
        <p>Collector-specific options follow the dataset ID. Python underscores become CLI hyphens, and boolean parameters use flags such as ${code("--overwrite")} or ${code("--no-...")} when applicable.</p>
      `],
      ["safety", "Artifact safety", html`
        ${bullets([
        "Collectors validate counts, paths, and required reference artifacts before the main run.",
        "Outputs are commonly written to a temporary HDF5 file and atomically moved into place.",
        "Existing output paths are refused by default.",
        "The canonical dataset ID is stamped after collection for later task checks.",
      ])}
      `],
      ["defaults", "Publication defaults", html`
        <p>Most collectors default to 400 accepted episodes. Use the task pages for the exact balancing rule, publication seed, reference data, and task-specific filters. Do not assume one collector's options apply to another.</p>
      `],
    ],
  },
  "/guides/model-sources": {
    title: "Install model sources",
    subtitle: "Fetch pinned upstream code without bundling it into AnyGoal or silently installing it as another distribution.",
    sections: [
      ["managed", "Managed checkout", html`
        ${codeBlock("terminal", `anygoal models list
anygoal models install lewm
anygoal models install sensorimotor
anygoal models install driftworld
anygoal models install irasim`)}
        <p>Each status is ${code("missing")}, ${code("ready")}, or ${code("unverified")}. ${code("ready")} means the checkout's current commit exactly matches the source manifest revision.</p>
      `],
      ["resolution", "Resolution order", html`
        ${steps([
        ["Explicit override", `A model-specific environment variable such as ${code("DRIFTWORLD_SOURCE_ROOT")} wins.`],
        ["Managed checkout", `${code("ANYGOAL_SOURCE_ROOT")} defaults to ${code("$ANYGOAL_HOME/sources")} (${code("~/.anygoal/sources")}).`],
        ["Development submodule", `A source checkout's ${code("worldmodels/")} submodule is recognized for repository development.`],
      ])}
      `],
      ["variables", "Supported overrides", html`
        ${table(["Model", "Environment variable"], [
        ["LeWM", code("LEWM_SOURCE_ROOT")],
        ["Sensorimotor", code("SENSORIMOTOR_SOURCE_ROOT")],
        ["DriftWorld", code("DRIFTWORLD_SOURCE_ROOT")],
        ["IRASim", code("IRASIM_SOURCE_ROOT")],
      ])}
      `],
      ["behavior", "Installer behavior", html`
        <p>The installer clones with filtered blobs, checks out a detached pinned revision, and then moves the completed checkout into the cache. It refuses to replace an existing destination or an incompatible explicitly configured checkout.</p>
        ${callout("Source only", "The command downloads original source code. It does not download checkpoints and does not run pip inside the checkout.")}
      `],
    ],
  },
  "/guides/training": {
    title: "Train a model",
    subtitle: "Launch a verified model/base-task profile and receive the reloaded model together with reproducibility metadata.",
    sections: [
      ["scope", "Supported training scope", html`
        <p>Training profiles are registered for the four base tasks: ${code("pusht")}, ${code("cube")}, ${code("tworoom")}, and ${code("insertpeg")}. AnyGoal variants are evaluation targets, not separate verified training profiles.</p>
        ${callout("Official checkpoint warning", "For LeWM and PreJEPA on PushT, Cube, and TwoRoom, the AnyGoal experiments used official released checkpoints. Retraining can be useful, but a newly trained checkpoint is not guaranteed to reproduce reported numbers.", "warning")}
      `],
      ["cli", "Inspect, then launch", html`
        ${codeBlock("terminal", `anygoal train driftworld \
  --data /data/pusht_expert_train.h5 \
  --task pusht \
  --seed 0 \
  --dry-run

# Remove --dry-run after inspecting the resolved command.`)}
        <p>The CLI accepts common options such as learning rate, batch size, seed, workers, output directory, maximum steps, and maximum epochs only when that model supports them. Model-specific Hydra-style overrides follow as ${code("key=value")} arguments.</p>
      `],
      ["python", "Python interface", html`
        ${codeBlock("example.py", `import anygoal

model, run = anygoal.train(
    "toy-adaln",
    data="/data/pusht_expert_train.h5",
    task="pusht",
    seed=0,
    max_epochs=10,
)

print(run.checkpoint)
print(run.config)
print(run.elapsed_seconds)`)}
        <p>${code("train")} validates dataset identity, runs the native trainer as a subprocess, detects the newly written checkpoint, locates its saved config, reloads the model in evaluation mode, and returns ${code("(model, TrainingResult)")}.</p>
      `],
      ["result", "TrainingResult", html`
        ${table(["Field", "Meaning"], [
        [code("model_id / task_id"), "Canonical registry IDs"],
        [code("data"), "Resolved local HDF5 path"],
        [code("run_directory"), "Directory containing the selected checkpoint"],
        [code("checkpoint / config"), "Exact reload artifacts"],
        [code("command"), "Native command that ran"],
        [code("elapsed_seconds"), "Wall-clock training duration"],
      ])}
      `],
    ],
  },
  "/guides/rollout": {
    title: "Rollout evaluation",
    subtitle: "Measure open-loop short-horizon and autoregressive prediction error with one episode-sampling protocol.",
    sections: [
      ["protocol", "Default protocol", html`
        ${table(["Setting", "Default", "Meaning"], [
        [code("history_length"), "3", "Observed context frames"],
        [code("frame_skip"), "5", "Environment steps per model action block"],
        [code("horizons"), "15, 25", "Autoregressive environment-step horizons"],
        [code("num_episodes"), "100", "Sampled eligible episodes"],
        [code("batch_size"), "32", "Evaluation batch size"],
      ])}
        <p>The short-horizon result is one action block, so the default is a 5-step MSE. Longer horizons report cumulative, mean-step, terminal, and start-weighted cumulative MSE.</p>
      `],
      ["python", "Python interface", html`
        ${codeBlock("example.py", `result = anygoal.evaluate_rollout(
    "irasim",
    data="/data/cube_hop_test.h5",
    task="cubehop",
    checkpoint="/checkpoints/irasim.pt",
    seed=[0, 1, 2],
    output_dir="outputs/cubehop_rollout",
)

seed_zero = result[0]
print(seed_zero.error_space)
print(seed_zero.short_horizon_mse)
print(seed_zero.horizons[25].terminal_mse)`)}
        <p>You may also pass a custom adapter object implementing ${code("rollout_errors")}, ${code("model_name")}, ${code("error_space")}, and ${code("observation_keys")}.</p>
      `],
      ["weighting", "Sampling and aggregation", html`
        <p>Episodes are selected reproducibly from those long enough for the requested context and horizon. The primary aggregate gives every sampled episode equal weight. Raw JSON also contains start-weighted values, per-episode summaries, selected indices, and a sampling digest.</p>
        ${callout("Short-only fallback", "If too few episodes support all long horizons but enough support one action block, short-horizon evaluation still runs and the unavailable long-horizon metrics include a reason.")}
      `],
      ["space", "Compare like with like", html`
        <p>Latent autoregressive models, video models, and true-state toy predictors do not share a universal MSE scale. Always group or label results by ${code("error_space")}; do not rank models across latent, normalized-pixel, and normalized-state spaces as though the values were interchangeable.</p>
      `],
    ],
  },
  "/guides/planning": {
    title: "Planning evaluation",
    subtitle: "Evaluate a caller-built Stable Worldmodel policy on deterministic future-state goals sampled from an HDF5 trajectory dataset.",
    sections: [
      ["ownership", "Division of responsibility", html`
        <p>You construct the model, objective, solver, and ${code("WorldModelPolicy")}. AnyGoal selects trials, restores task states, installs dataset future states as goals, runs ${code("World.evaluate")}, and attaches task-specific metrics.</p>
      `],
      ["example", "Python interface", html`
        ${codeBlock("example.py", `import anygoal
from stable_worldmodel.planning import CEMSolver, GoalMSE, ShootingCostEvaluator
from stable_worldmodel.policy import PlanConfig, WorldModelPolicy

cost = ShootingCostEvaluator(model=model, objective=GoalMSE())
solver = CEMSolver(cost=cost, num_samples=300, n_steps=30, device="cuda")
policy = WorldModelPolicy(
    solver=solver,
    config=PlanConfig(horizon=5, receding_horizon=5, action_block=5),
)

result = anygoal.plan(
    policy,
    data="/data/avoidt_test.h5",
    seed=[0, 1, 2],
    output_dir="outputs/avoidt_planning",
    save_video=True,
)
print(result[0].metrics)`)}
      `],
      ["defaults", "Default evaluation protocol", html`
        ${table(["Argument", "Default"], [
        [code("num_evals"), "50 trials"],
        [code("goal_offset_steps"), "25 dataset steps"],
        [code("eval_budget"), "50 environment steps"],
        [code("start_selection"), code("random")],
        [code("seed"), "0 (controls start-point sampling)"],
      ])}
        <p>Solver randomness remains controlled by the supplied policy. The policy's ${code("horizon × action_block")} may not exceed the evaluation budget.</p>
      `],
      ["outputs", "Results and artifacts", html`
        <p>${code("PlanningResult")} stores canonical task ID, data path, metrics, exact episode indices and start steps, seed, elapsed time, and optional output paths. Video or artifact saving requires ${code("output_dir")}; existing ${code("metrics.json")} is protected unless ${code("overwrite=True")}.</p>
      `],
    ],
  },
  "/guides/reproduction": {
    title: "Reproduce a matrix",
    subtitle: "Expand a versioned manifest into explicit model × dataset × seed evaluation commands.",
    sections: [
      ["manifest", "Manifest format", html`
        ${codeBlock("manifest.yaml", `schema_version: 1
matrices:
  - evaluation: rollout
    models: [lewm, driftworld]
    datasets: [avoidt, stackt]
    seeds: [0, 1, 2]`)}
      `],
      ["expand", "Expand commands", html`
        ${codeBlock("terminal", `anygoal reproduce scripts/analysis/manifest.yaml`)}
        <p>The command prints every resolved ${code("anygoal eval ...")} command. It intentionally does not choose a local scheduler or execute a cluster job; pipe or translate the output into the workflow system you control.</p>
      `],
      ["analysis", "Research analysis boundary", html`
        <p>Counterfactual analyses, statistical aggregation, plotting, and publication visualizations live under ${code("scripts/analysis/")}. They are research workflows rather than stable library API and are not imported by ${code("anygoal")}.</p>
      `],
    ],
  },
  "/reference/python": {
    title: "Python API",
    subtitle: "The stable top-level surface is intentionally small; specialized contracts live in focused submodules.",
    sections: [
      ["top-level", "Top-level functions", html`
        ${signature("collect", "anygoal.collect(dataset, num_episodes=None, **options) -> Path", "Collect a generated registry dataset and stamp its canonical identity.")}
        ${signature("train", "anygoal.train(model, *, data, task, ...) -> (model, TrainingResult)", "Run a verified base-task training profile and reload the emitted checkpoint.")}
        ${signature("evaluate_rollout", "anygoal.evaluate_rollout(model_or_adapter, *, data, ...) -> RolloutResult | dict", "Run the shared open-loop rollout protocol with a registered model or custom adapter.")}
        ${signature("plan", "anygoal.plan(policy, *, data, ...) -> PlanningResult | dict", "Run dataset-driven future-state planning with a caller-built Stable Worldmodel policy.")}
        ${signature("get_registry", "anygoal.get_registry() -> Registry", "Access resolved dataset, model, and extension specifications.")}
        ${signature("register_envs", "anygoal.register_envs() -> None", "Idempotently register the bundled Gymnasium environments; import already calls it.")}
      `],
      ["results", "Result types", html`
        ${table(["Type", "Module", "Purpose"], [
        [code("TrainingPlan / TrainingResult"), code("anygoal.training"), "Resolved native command and completed training artifact"],
        [code("RolloutResult / HorizonMetrics"), code("anygoal.rollout"), "Typed rollout metrics plus raw protocol output"],
        [code("PlanningResult"), code("anygoal.planning"), "Planning metrics and exact sampled trials"],
        [code("ValidationReport"), code("anygoal.types"), "Non-mutating HDF5 validation result"],
      ])}
      `],
      ["datasets", "Dataset utilities", html`
        <p>${code("anygoal.datasets")} lazily exports ${code("validate_hdf5")}, state adapters for the four task families, and fixed z-score/min-max transforms used by the toy predictors.</p>
        ${codeBlock("example.py", `from anygoal.datasets import validate_hdf5

report = validate_hdf5("/data/avoidt_test.h5", dataset_id="avoidt")
if not report.valid:
    for issue in report.issues:
        print(issue.level, issue.message)`)}
      `],
      ["imports", "Lazy optional dependencies", html`
        <p>Top-level training, rollout, planning, environment, dataset, and world-model integrations delay heavy imports until used. A base data install can therefore import ${code("anygoal")} without eagerly loading every model stack.</p>
      `],
    ],
  },
  "/reference/cli": {
    title: "Command-line interface",
    subtitle: "A compact terminal surface for discovery, data collection and validation, source management, training, evaluation, and manifest expansion.",
    sections: [
      ["commands", "Command map", html`
        ${table(["Command", "Purpose"], [
        [code("anygoal list datasets|models|visualizers"), "Inspect registered integrations"],
        [code("anygoal models list|status|install"), "Inspect or fetch pinned upstream source"],
        [code("anygoal artifacts download"), "Download published datasets and checkpoints"],
        [code("anygoal config show"), "Print merged configuration"],
        [code("anygoal data validate"), "Check common HDF5 invariants"],
        [code("anygoal collect"), "Run a generated dataset collector"],
        [code("anygoal train"), "Run a verified training profile"],
        [code("anygoal eval rollout|planning"), "Run packaged reproduction entry points"],
        [code("anygoal reproduce"), "Expand a matrix manifest"],
      ])}
      `],
      ["examples", "Representative usage", html`
        ${codeBlock("terminal", `anygoal list datasets
anygoal models install --all
anygoal config show --site ~/.config/anygoal/site.yaml
anygoal data validate /data/avoidt_test.h5 --dataset avoidt --json
anygoal collect avoidt --num-episodes 400 --seed 0
anygoal train lewm --data /data/pusht_expert_train.h5 --task pusht --dry-run
anygoal eval rollout --model lewm --dataset avoidt --seed 0 --dry-run
anygoal eval planning --model lewm --dataset avoidt --seed 0 --dry-run`)}
      `],
      ["evaluation", "CLI evaluation boundary", html`
        <p>${code("anygoal eval")} resolves a registered model/task combination to its packaged runner and configuration. It is suited to exact project reproduction. It does not expose the full explicit-path surface of the Python APIs; use ${code("anygoal.evaluate_rollout")} or ${code("anygoal.plan")} for arbitrary HDF5 and policy objects.</p>
      `],
      ["visualizers", "Visualizer extensions", html`
        <p>The CLI retains a registry-based ${code("visualize")} extension point, but AnyGoal currently ships no built-in visualizers. Analysis plots live in ${code("scripts/analysis/")}. An external package may register a visualizer entry point, after which it appears in ${code("anygoal list visualizers")}.</p>
      `],
    ],
  },
  "/reference/configuration": {
    title: "Configuration",
    subtitle: "Merge package defaults, a machine-level site file, an experiment file, and explicit overrides without embedding personal paths in code.",
    sections: [
      ["precedence", "Precedence", html`
        ${codeBlock("text", `explicit overrides
        ↓
experiment config
        ↓
site config
        ↓
package defaults`)}
        <p>Mappings are merged recursively; scalar and list values replace the lower-priority value.</p>
      `],
      ["site", "Site configuration", html`
        ${codeBlock("terminal", `mkdir -p ~/.config/anygoal
anygoal config show > ~/.config/anygoal/site.yaml
anygoal config show --site ~/.config/anygoal/site.yaml`)}
        <p>The default site path is ${code("~/.config/anygoal/site.yaml")} and can be changed with ${code("ANYGOAL_SITE_CONFIG")}.</p>
      `],
      ["paths", "Filesystem roots", html`
        ${table(["Variable", "Default"], [
        [code("ANYGOAL_DATA_ROOT"), code("~/.stable_worldmodel/datasets")],
        [code("ANYGOAL_HOME"), code("~/.anygoal")],
        [code("ANYGOAL_CHECKPOINT_ROOT"), code("$ANYGOAL_HOME/checkpoints")],
        [code("ANYGOAL_OUTPUT_ROOT"), code("./outputs")],
        [code("ANYGOAL_SOURCE_ROOT"), code("$ANYGOAL_HOME/sources")],
        [code("ANYGOAL_CACHE_ROOT"), code("$ANYGOAL_HOME/cache")],
      ])}
      `],
      ["wandb", "Weights & Biases defaults", html`
        <p>The package default disables W&amp;B. The site file may set entity, project, mode, directory, tags, and resume behavior for runners that consume those settings. Configuration alone never uploads an artifact unless the selected runner enables logging.</p>
      `],
    ],
  },
  "/reference/registry": {
    title: "Registry & extensions",
    subtitle: "One packaged YAML catalog resolves stable IDs to datasets, model capabilities, runners, configs, and optional external integrations.",
    sections: [
      ["lookup", "Lookup", html`
        ${codeBlock("example.py", `from anygoal import get_registry

registry = get_registry()
dataset = registry.dataset("cube_diagonal")  # alias -> cubediagonal
model = registry.model("dino-wm")            # alias -> prejepa

print(dataset.environment)
print(model.capabilities)`)}
        <p>Unknown IDs fail with the available canonical choices. IDs and aliases are checked globally within each registry kind so ambiguous names cannot load silently.</p>
      `],
      ["specs", "Specification objects", html`
        ${table(["Type", "Carries"], [
        [code("DatasetSpec"), "ID, aliases, family, filename, environment, schema, source, collector, seed"],
        [code("ModelSpec"), "Capabilities, families, native runners, profile locations, config and seed styles"],
        [code("VisualizerSpec"), "Input/output contract and optional runner"],
      ])}
      `],
      ["plugins", "Entry-point groups", html`
        ${table(["Group", "Extension"], [
        [code("anygoal.datasets"), "DatasetSpec-compatible object"],
        [code("anygoal.models"), "ModelSpec-compatible object"],
        [code("anygoal.visualizers"), "VisualizerSpec-compatible object"],
      ])}
        <p>Entry points are loaded when the registry is constructed. Duplicate canonical IDs or aliases are rejected, as are unknown model capabilities and malformed source declarations.</p>
      `],
      ["principle", "Extension principle", html`
        <p>Add metadata and an adapter, not a model-name conditional in the CLI. Scientific integrations must document observation keys, action convention, history, frame skip, preprocessing, normalization ownership, and native output space.</p>
      `],
    ],
  },
  "/reference/contracts": {
    title: "Data contracts",
    subtitle: "AnyGoal keeps Stable World-Model's HDF5 trajectory contract so datasets remain interoperable.",
    sections: [
      ["hdf5", "Stable World-Model HDF5", html`
        <p>${code("action")} and ${code("pixels")} are required. Optional state, proprioception, goals, and task-specific fields keep one shared leading time dimension.</p>
        <p>Episode boundaries use ${code("ep_len")} or ${code("episode")}. AnyGoal adds only the ${code("anygoal_dataset_id")} root attribute for task identity.</p>
      `],
      ["interop", "Direct interoperability", html`
        <p>Training, rollout, and planning accept an HDF5 path or a Stable World-Model ${code("HDF5Dataset")}. AnyGoal does not introduce another dataset container.</p>
      `],
      ["validation", "Validation", html`
        ${codeBlock("terminal", `anygoal data validate /path/to/dataset.h5 --dataset avoidt`)}
        <p>Validation is non-mutating and checks required keys, row counts, episode bookkeeping, and optional task identity.</p>
      `],
    ],
  },
};

const taskPages = {
  "/tasks/avoidt": {
    title: "AvoidT",
    gifDirectory: "avoidt",
    subtitle: "Move the PushT agent to a sampled corner target while the physical T remains an obstacle.",
    id: "avoidt",
    family: "PushT",
    env: "anygoal/AvoidT-v1",
    file: "avoidt_test.h5",
    seed: "0",
    count: "400: 100 accepted episodes for each of four corner goals",
    command: "anygoal collect avoidt --num-episodes 400 --num-parallel 8 --seed 0",
    task: "Each reset samples the physical T pose, a ball start in a clearance annulus, and a ball goal inside the selected corner region. The dataset goal preserves the obstacle state while changing the agent position.",
    support: "No external reference dataset is required. Episodes shorter than the minimum or failing the scripted objective are rejected.",
  },
  "/tasks/stackt": {
    title: "StackT",
    gifDirectory: "stackt",
    subtitle: "Rotate and move a physical T so its head overlays a visible goal T, forming a plus-like stack.",
    id: "stackt",
    family: "PushT",
    env: "anygoal/StackT-v2",
    file: "stackt_test.h5",
    seed: "0",
    count: "400 accepted episodes",
    command: "anygoal collect stackt --num-episodes 400 --reference /data/pusht_expert_train.h5 --seed 0",
    task: "The physical T and pusher are randomized independently. Version 2 samples a supported initial angle band and uses a one-degree goal-angle tolerance.",
    support: "Requires the PushT base dataset. A KDE-based block-angle support filter rejects trajectories outside the declared reference support.",
  },
  "/tasks/pusht-antigoal": {
    title: "PushT Antigoal",
    gifDirectory: "pusht-antigoal",
    subtitle: "Move the physical T toward an invisible corner target while the canonical visible PushT goal remains a decoy.",
    id: "pusht-antigoal",
    family: "PushT",
    env: "anygoal/PushTAntigoal-v3",
    file: "pusht_antigoal_test.h5",
    seed: "0",
    count: "400: 100 accepted episodes for each target corner",
    command: "anygoal collect pusht-antigoal --num-episodes 400 --reference /data/pusht_expert_train.h5 --seed 0",
    task: "The initial T pose is sampled from discrete radii and angles around the center. The hidden task goal is one of four inward corners with a fixed opposite orientation.",
    support: "Requires the PushT base dataset. Angle and joint-support filters constrain accepted trajectories unless explicitly skipped.",
  },
  "/tasks/cubehop": {
    title: "CubeHop",
    gifDirectory: "cubehop",
    subtitle: "Move and rotate the end effector between floor targets and elevated waypoints around a cube.",
    id: "cubehop",
    family: "Cube",
    env: "anygoal/CubeHop-v0",
    file: "cube_hop_test.h5",
    seed: "0",
    count: "400, balanced equally between left and right layouts",
    command: "anygoal collect cubehop --num-episodes 400 --reference /data/cube_single_expert.h5 --seed 0",
    task: "The cube, end-effector start, floor targets, and elevated waypoints are sampled from side-specific bounds. Evaluation records end-effector position/yaw and cube-position criteria.",
    support: "Requires the Cube base dataset. Proposed 5-D actions are projected into calibrated reference action support; episode length follows the reference dataset.",
  },
  "/tasks/cubediagonal": {
    title: "CubeDiagonal",
    gifDirectory: "cubediagonal",
    subtitle: "Solve the original single-cube task using a diagonal grasp across opposite vertical cube edges.",
    id: "cubediagonal",
    family: "Cube",
    env: "anygoal/CubeDiagonal-v0",
    file: "cube_diagonal_test.h5",
    seed: "10065",
    count: "400 accepted episodes",
    command: "anygoal collect cubediagonal --num-episodes 400 --reference /data/cube_single_expert.h5 --seed 10065",
    task: "The cube yaw is sampled around 85 degrees by default. Contact auditing checks bilateral opposite-edge contact, stable grasp duration, lifted targets, and completed goals.",
    support: "Requires the Cube base dataset. Collection can require diagonal lifts, a minimum number of lifted/completed targets, and bounded cube quaternion tilt.",
  },
  "/tasks/avoid-peg": {
    title: "Avoid Peg",
    gifDirectory: "hug_box",
    subtitle: "Move the manipulator around the target box while avoiding contact with the peg.",
    id: "avoid_peg",
    family: "Insert Peg",
    env: "anygoal/InsertPeg-v0",
    file: "avoid_peg_test.h5",
    seed: "20260914",
    count: "400, alternating left and right target sides",
    command: "anygoal collect avoid_peg --num-episodes 400 --reference /data/insert_peg_weak_expert_train.h5 --seed 20260914",
    task: "The scripted HugBox policy aligns the arm on a sampled side and executes a wrap around the target geometry without touching the peg, while auditing collision and support features.",
    support: "Requires the Insert Peg base dataset and cached reference-support estimates. The collector may omit pixel writing only when explicitly requested for diagnostics.",
  },
  "/tasks/extractpeg": {
    title: "ExtractPeg",
    gifDirectory: "extractpeg",
    subtitle: "Reverse insertion: grasp the inserted peg, extract it, carry it through a waypoint, and release it at a sampled destination.",
    id: "extractpeg",
    family: "Insert Peg",
    env: "anygoal/InsertPeg-v0",
    file: "extract_peg_test.h5",
    seed: "20260915",
    count: "400, balanced left and right",
    command: "anygoal collect extractpeg --num-episodes 400 --reference /data/insert_peg_weak_expert_train.h5 --seed 20260915",
    task: "The collection-only ExtractPeg environment adds a releasable hand-to-peg weld. The policy reconstructs reverse-insertion anchors, extracts, rotates, transports, and releases the peg.",
    support: "Requires the Insert Peg base dataset for reverse anchors, action support, and state support auditing.",
  },
  "/tasks/tworoom-route": {
    title: "TwoRoom Route",
    gifDirectory: "tworoom_route",
    subtitle: "Follow one of eight start–waypoint–goal routes without rendering the target.",
    id: "tworoom_route",
    family: "TwoRoom",
    env: "anygoal/TwoRoom-Route-v1",
    file: "tworoom_route_test.h5",
    seed: "0",
    count: "400: eight routes × (20 clean constant + 20 noisy constant + 10 clean varying)",
    command: "anygoal collect tworoom_route --seed 0",
    task: "The target is invisible. A feedback controller traverses a fixed waypoint under clean constant-magnitude, noisy constant-magnitude, or clean varying-magnitude actions.",
    support: "No base reference file is required. The full count is fixed for balanced route/condition coverage; use --smoke for one episode per route and condition.",
  },
};

function taskGifGrid(task) {
  const label = `${task.title} example trajectories`;
  const gifs = Array.from({ length: 8 }, (_, episode) => {
    const fileName = `episode_${String(episode).padStart(3, "0")}.gif`;
    const source = `assets/dataset_first_10_episodes/${task.gifDirectory}/${fileName}`;
    const alt = `${task.title} environment, episode ${episode + 1}`;
    return `<img src="${source}" alt="${escapeHtml(alt)}" loading="lazy" />`;
  }).join("");

  return `<div class="task-gif-grid" aria-label="${escapeHtml(label)}">${gifs}</div>`;
}

function homeTaskGifGrid() {
  const label = "AnyGoal task examples";
  const gifs = Object.values(taskPages).map((task) => {
    const source = `assets/dataset_first_10_episodes/${task.gifDirectory}/episode_000.gif`;
    const alt = `${task.title} environment, first episode`;
    return `<img src="${source}" alt="${escapeHtml(alt)}" loading="lazy" />`;
  }).join("");

  return `<div class="task-gif-grid" aria-label="${label}">${gifs}</div>`;
}

for (const [path, task] of Object.entries(taskPages)) {
  pages[path] = {
    title: task.title,
    subtitle: task.subtitle,
    gifDirectory: task.gifDirectory,
    sections: [
      ["specification", "Task specification", html`
        <p>${task.task}</p>
        ${table(["Property", "Value"], [
        ["Dataset ID", code(task.id)],
        ["Family", task.family],
        ["Gymnasium environment", code(task.env)],
        ["Canonical file", code(task.file)],
        ["Publication seed", code(task.seed)],
        ["Default full collection", task.count],
      ])}
      `],
      ["collection", "Collect", html`
        ${codeBlock("terminal", task.command)}
        <p>${task.support}</p>
      `],
      ["environment", "Use the environment", html`
        ${codeBlock("example.py", `import gymnasium as gym
import anygoal  # registers AnyGoal environments

env = gym.make("${task.env}", render_mode="rgb_array")
observation, info = env.reset(seed=${task.seed})
observation, reward, terminated, truncated, info = env.step(env.action_space.sample())
env.close()`)}
        ${callout("Environment versus dataset", "The registered environment supplies dynamics and reset behavior. The benchmark dataset additionally fixes a collection policy, balancing rule, support constraint, episode acceptance rule, and canonical HDF5 schema.")}
      `],
      ["evaluation", "Evaluate", html`
        ${codeBlock("terminal", `anygoal eval rollout --model lewm --dataset ${task.id} --seed 0 --dry-run
anygoal eval planning --model lewm --dataset ${task.id} --seed 0 --dry-run`)}
        <p>For a custom dataset path or checkpoint, use the Python rollout or planning API and pass ${code(`task="${task.id}"`)} when identity cannot be inferred from the HDF5 filename or attributes.</p>
      `],
    ],
  };
}

const flatPages = groups.flatMap((group) =>
  group.pages.map(([path, title]) => ({ path, title, group: group.label })),
);

const navigation = document.querySelector("#navigation");
const main = document.querySelector("#main");
const toc = document.querySelector("#toc");

function currentPath() {
  const path = (location.hash.replace(/^#/, "").split("::")[0] || "/").replace(/\/$/, "") || "/";
  return path === "/" || pages[path] ? path : "/";
}

function renderNavigation(path) {
  navigation.innerHTML = groups
    .map(
      (group) => html`<section class="nav-group">
        <p>${group.label}</p>
        ${group.pages
          .map(
            ([href, title]) =>
              `<a class="nav-link${href === path ? " active" : ""}" href="#${href}">${title}</a>`,
          )
          .join("")}
      </section>`,
    )
    .join("");
}

function section(id, title, index, body) {
  return html`<section class="doc-section" id="${id}">
    <div class="section-heading"><h2>${title}</h2></div>
    <div class="section-body">${body}</div>
  </section>`;
}

function pager(path) {
  const index = flatPages.findIndex((page) => page.path === path);
  const previous = flatPages[index - 1];
  const next = flatPages[index + 1];
  return html`<nav class="pager" aria-label="Previous and next pages">
    ${previous ? `<a href="#${previous.path}"><span>← Previous</span><strong>${previous.title}</strong></a>` : "<span></span>"}
    ${next ? `<a href="#${next.path}"><span>Next →</span><strong>${next.title}</strong></a>` : ""}
  </nav>`;
}

function renderHome() {
  main.innerHTML = html`<div class="home-hero">
    <h1>AnyGoal</h1>
    <h2><br /><span>a compositional generalization suite for world model research.</span></h2>
    ${homeTaskGifGrid()}
    <div class="hero-actions">
      <a class="primary-action" href="#/quick-start">Get started</a>
      <a class="secondary-action" href="https://github.com/galilai-group/AnyGoal">View source</a>
    </div>
    <div class="install-strip"><code>pip install anygoal</code><button type="button" data-copy="pip install anygoal">Copy</button></div>
    ${table(["Command", "Includes"], [
    [code("pip install anygoal"), "Data I/O, collectors, validation, simulation environments"],
    [code("pip install 'anygoal[eval]'"), "Default data install plus rollout and planning dependencies"],
    [code("pip install 'anygoal[all]'"), "Data, evaluation, and training"],
  ])}
    ${callout("Upstream models stay upstream", `The wheel does not vendor third-party model repositories. Use ${code("anygoal models install <id>")} to fetch a pinned original checkout only when an integration needs it.`)}
  </div>
  ${section("foundation", "Built on a stable foundation", 1, html`
    <p>AnyGoal extends the Stable stack; it does not replace it.</p>
    <div class="foundation-grid">
      <article class="foundation-card">
        <div><span class="dependency-name">Stable World-Model</span><span class="dependency-version">v0.1.1</span></div>
        <p>Environments, HDF5 data I/O, world abstraction, solvers, costs, and policies.</p>
        <small>Supported range: &gt;=0.1.1,&lt;0.2.0</small>
        <a href="https://github.com/galilai-group/stable-worldmodel" target="_blank" rel="noreferrer">GitHub repository <span aria-hidden="true">↗</span></a>
      </article>
      <article class="foundation-card">
        <div><span class="dependency-name">Stable Pretraining</span><span class="dependency-version">v0.1.7</span></div>
        <p>Optional training components used by selected model integrations.</p>
        <small>Supported range: &gt;=0.1.7,&lt;0.2</small>
        <a href="https://github.com/galilai-group/stable-pretraining" target="_blank" rel="noreferrer">GitHub repository <span aria-hidden="true">↗</span></a>
      </article>
    </div>
    <a class="text-link" href="#/stable-stack">See how AnyGoal uses the Stable stack →</a>
  `)}
  ${section("start", "Start here", 2, html`<div class="card-grid">
    <a class="doc-card" href="#/quick-start"><small>Guide</small><h3>Quick start →</h3><p>Collect, validate, and resolve your first evaluation.</p></a>
    <a class="doc-card" href="#/datasets"><small>Catalog</small><h3>Datasets →</h3><p>Four base tasks and eight AnyGoal variants.</p></a>
    <a class="doc-card" href="#/models"><small>Integrations</small><h3>Models →</h3><p>Capabilities, source ownership, and error spaces.</p></a>
    <a class="doc-card" href="#/reference/python"><small>Reference</small><h3>Python API →</h3><p>The stable public surface and typed results.</p></a>
  </div>`)}
  ${pager("/")}`;
  document.title = "AnyGoal";
}

function renderDoc(path) {
  const page = pages[path];
  main.innerHTML = html`<header class="doc-header">
    <h1>${page.title}</h1>
    <p class="lead">${page.subtitle}</p>
    ${page.gifDirectory ? taskGifGrid(page) : ""}
  </header>
  ${page.sections.map(([id, title, body], index) => section(id, title, index + 1, body)).join("")}
  ${pager(path)}`;
  document.title = `${page.title} — AnyGoal`;
}

function bindCopyButtons() {
  document.querySelectorAll(".copy-button, [data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy || button.closest(".code-block").querySelector("code").innerText;
      await navigator.clipboard.writeText(value);
      const originalText = button.textContent;
      const originalLabel = button.getAttribute("aria-label");
      const originalTitle = button.getAttribute("title");
      if (button.classList.contains("symbol-copy")) {
        button.setAttribute("aria-label", "Copied");
        button.setAttribute("title", "Copied");
      } else {
        button.textContent = "Copied";
      }
      setTimeout(() => {
        button.textContent = originalText;
        if (originalLabel === null) button.removeAttribute("aria-label");
        else button.setAttribute("aria-label", originalLabel);
        if (originalTitle === null) button.removeAttribute("title");
        else button.setAttribute("title", originalTitle);
      }, 1200);
    });
  });
}

function render() {
  const path = currentPath();
  renderNavigation(path);
  if (path === "/") renderHome(); else renderDoc(path);
  toc.innerHTML = [...main.querySelectorAll(".doc-section")]
    .map((element) => `<a href="#${path}::${element.id}" data-anchor="${element.id}">${element.querySelector("h2").textContent}</a>`)
    .join("");
  toc.querySelectorAll("[data-anchor]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", `#${path}::${link.dataset.anchor}`);
      document.getElementById(link.dataset.anchor).scrollIntoView();
    }),
  );
  if (window.Prism) Prism.highlightAllUnder(main);
  bindCopyButtons();
  document.body.classList.remove("menu-open");
  document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
  const anchor = location.hash.split("::")[1];
  if (anchor && document.getElementById(anchor)) {
    document.getElementById(anchor).scrollIntoView();
  } else {
    scrollTo({ top: 0, behavior: "instant" });
  }
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

function searchableText(path) {
  if (path === "/") return "AnyGoal world models rollout planning benchmark installation";
  const page = pages[path];
  return `${page.title} ${page.subtitle} ${page.sections.map((item) => item.join(" ")).join(" ")}`
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/g, " ");
}

function renderSearch(query = "") {
  const normalized = query.trim().toLowerCase();
  const matches = flatPages.filter((page) => searchableText(page.path).toLowerCase().includes(normalized));
  searchResults.innerHTML = matches.length
    ? matches.map((page) => `<a class="search-result" href="#${page.path}"><span>${page.title}</span><small>${page.group}</small></a>`).join("")
    : `<div class="empty-search">No pages found.</div>`;
  searchResults.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => searchDialog.close()));
}

function openSearch() {
  searchInput.value = "";
  renderSearch();
  searchDialog.showModal();
  setTimeout(() => searchInput.focus(), 0);
}

document.querySelector("#search-trigger").addEventListener("click", openSearch);
searchInput.addEventListener("input", () => renderSearch(searchInput.value));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    openSearch();
  }
});

addEventListener("hashchange", render);
render();
