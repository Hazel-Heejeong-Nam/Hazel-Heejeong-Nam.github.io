(function () {
  'use strict';

  var panel = document.getElementById('paper-constellation');
  if (!panel) return;
  var toggle = panel.querySelector('.constellation-toggle');
  var content = panel.querySelector('.constellation-content');

  var papers = [
    { id: 'scadi', label: 'SCADI', title: 'SCADI: Self-supervised Causal Disentanglement in Latent Variable Models', year: '2023', url: 'https://arxiv.org/abs/2311.06567', x: 18, y: 9, align: 'below' },
    { id: 'pathology', label: 'CDNE', title: 'Compact and De-biased Negative Instance Embedding for Multi-Instance Learning on Whole-Slide Pathological Images', year: '2024', url: 'https://arxiv.org/abs/2402.10595', x: 50, y: 9, align: 'below' },
    { id: 'forecasting', label: 'Adversarial Forecasting', title: 'An Adversarial Learning Approach to Irregular Time-Series Forecasting', year: '2024', url: 'https://arxiv.org/abs/2411.19341', x: 81, y: 19, align: 'below' },
    { id: 'crl', label: 'CRL', title: 'On Causal Representation Learning with Internal Auxiliaries', year: '2026', url: 'https://proceedings.mlr.press/v337/kim26e.html', x: 18, y: 38, align: 'above' },
    { id: 'causal-jepa', label: 'Causal-JEPA', title: 'Causal-JEPA: Learning World Models through Object-Level Latent Interventions', year: '2026', url: 'https://arxiv.org/abs/2602.11389', x: 50, y: 40, align: 'above' },
    { id: 'lala-world', label: 'LaLa-World', title: 'LaLa-World: Scaling Latent World Models with Natural Language Actions', year: '2026', url: 'https://arxiv.org/abs/2610.27851', x: 81, y: 52, align: 'above' },
    { id: 'vague', label: 'VAGUE', title: 'VAGUE: Visual Contexts Clarify Ambiguous Expressions', year: '2025', url: 'https://arxiv.org/abs/2411.14137', x: 81, y: 69, align: 'above' },
    { id: 'otf-lam', label: 'OTF-LAM', title: 'Latent Actions from Factorized Transition Effects under Agent Ambiguity', year: '2026', url: 'https://arxiv.org/abs/2606.30544', x: 18, y: 76, align: 'above' },
    { id: 'anygoal', label: 'AnyGoal', title: 'AnyGoal: On World Model Generalization Beyond Expert Rollouts', year: '2026', url: 'https://arxiv.org/abs/2610.26844', x: 50, y: 80, align: 'above' },
    { id: 'spot', label: 'SPOT', title: 'When AI Co-Scientists Fail: SPOT—a Benchmark for Automated Verification of Scientific Research', year: '2025', url: 'https://arxiv.org/abs/2505.11855', x: 81, y: 93, align: 'above' }
  ];

  var lenses = {
    structure: {
      nodes: ['scadi', 'crl', 'causal-jepa', 'otf-lam'],
      edges: [['scadi', 'crl'], ['scadi', 'causal-jepa'], ['scadi', 'otf-lam'], ['crl', 'causal-jepa'], ['crl', 'otf-lam'], ['causal-jepa', 'otf-lam']]
    },
    dynamics: {
      nodes: ['otf-lam', 'causal-jepa', 'forecasting', 'lala-world', 'anygoal'],
      edges: [['otf-lam', 'causal-jepa'], ['otf-lam', 'forecasting'], ['otf-lam', 'lala-world'], ['otf-lam', 'anygoal'], ['causal-jepa', 'forecasting'], ['causal-jepa', 'lala-world'], ['causal-jepa', 'anygoal'], ['forecasting', 'lala-world'], ['forecasting', 'anygoal'], ['lala-world', 'anygoal']]
    },
    reuse: {
      nodes: ['otf-lam', 'anygoal', 'lala-world'],
      edges: [['otf-lam', 'anygoal'], ['otf-lam', 'lala-world'], ['anygoal', 'lala-world']]
    },
    verify: {
      nodes: ['anygoal', 'spot', 'vague'],
      edges: [['anygoal', 'spot'], ['anygoal', 'vague'], ['spot', 'vague']]
    }
  };

  var paperById = {};
  papers.forEach(function (paper) { paperById[paper.id] = paper; });
  var stars = panel.querySelector('.constellation-stars');
  var lines = panel.querySelector('.constellation-lines');
  var detail = panel.querySelector('.constellation-paper-detail');
  var tabs = Array.prototype.slice.call(panel.querySelectorAll('[data-constellation-lens]'));
  var activeLens = 'structure';
  var selectedPaper = null;

  papers.forEach(function (paper) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'constellation-star constellation-star--' + paper.align;
    button.dataset.paperId = paper.id;
    button.style.left = paper.x + '%';
    button.style.top = paper.y + '%';
    button.style.setProperty('--float-delay', '-' + (papers.indexOf(paper) * 0.37) + 's');
    button.setAttribute('aria-label', paper.title.indexOf(paper.label + ':') === 0 ? paper.title : paper.label + ': ' + paper.title);
    button.innerHTML = '<span class="constellation-star-dot" aria-hidden="true"></span><span class="constellation-star-label"></span>';
    button.querySelector('.constellation-star-label').textContent = paper.label;
    button.addEventListener('click', function () { selectPaper(paper.id); });
    stars.appendChild(button);
  });

  function selectPaper(id) {
    selectedPaper = id;
    var paper = paperById[id];
    panel.querySelectorAll('.constellation-star').forEach(function (star) {
      star.classList.toggle('is-selected', star.dataset.paperId === id);
      star.setAttribute('aria-pressed', String(star.dataset.paperId === id));
    });
    detail.textContent = '';
    var meta = document.createElement('span');
    meta.className = 'constellation-detail-meta';
    meta.textContent = paper.label + ' · ' + paper.year;
    var title = document.createElement('strong');
    title.textContent = paper.title;
    var link = document.createElement('a');
    link.href = paper.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Read paper ↗';
    detail.append(meta, title, link);
  }

  function setLens(name) {
    activeLens = name;
    var lens = lenses[name];
    if (selectedPaper && lens.nodes.indexOf(selectedPaper) === -1) {
      selectedPaper = null;
      detail.textContent = 'Select a star to explore its paper.';
      panel.querySelectorAll('.constellation-star').forEach(function (star) {
        star.classList.remove('is-selected');
        star.setAttribute('aria-pressed', 'false');
      });
    }
    tabs.forEach(function (tab) {
      tab.setAttribute('aria-pressed', String(tab.dataset.constellationLens === name));
    });
    panel.querySelectorAll('.constellation-star').forEach(function (star) {
      star.classList.toggle('is-active', lens.nodes.indexOf(star.dataset.paperId) !== -1);
    });
    lines.textContent = '';
    lens.edges.forEach(function (edge) {
      var from = paperById[edge[0]];
      var to = paperById[edge[1]];
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x * 10);
      line.setAttribute('y1', from.y * 10);
      line.setAttribute('x2', to.x * 10);
      line.setAttribute('y2', to.y * 10);
      lines.appendChild(line);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { setLens(tab.dataset.constellationLens); });
  });
  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    content.hidden = expanded;
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Expand Explore' : 'Collapse Explore');
  });
  setLens(activeLens);
  detail.textContent = 'Select a star to explore its paper.';
}());
