// ============================================
// FC26 Cheatsheet — App Logic
// ============================================

(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---- Controls grid ----
  let currentPlatform = 'ps';

  function renderControls(platform) {
    const grid = $('#controlsGrid');
    const items = CONTROLS_MAP[platform];
    grid.innerHTML = items
      .map(
        (c) => `
      <div class="control-item">
        <span class="control-label">${c.label}</span>
        <span class="control-key">${c.key}</span>
      </div>`
      )
      .join('');
  }

  $$('.platform-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.platform-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentPlatform = tab.dataset.platform;
      renderControls(currentPlatform);
    });
  });

  renderControls(currentPlatform);

  // ---- Card renderer ----
  function makeCard(item, showStars) {
    const starsHtml = showStars
      ? `<div class="card-stars">${'&#9733;'.repeat(item.stars)}${'&#9734;'.repeat(5 - item.stars)}</div>`
      : '';
    const badgeText = item.badgeText || item.difficulty || '';

    return `
    <div class="card" data-stars="${item.stars || 0}">
      <div class="card-top">
        <h3 class="card-title">${item.name}</h3>
        <span class="card-badge ${item.badge}">${badgeText}</span>
      </div>
      ${starsHtml}
      <p class="card-desc">${item.desc}</p>
      <div class="card-controls">
        <div class="control-row">
          <span class="control-platform">PS</span>
          <span class="control-input">${item.ps}</span>
        </div>
        <div class="control-row">
          <span class="control-platform">Xbox</span>
          <span class="control-input">${item.xbox}</span>
        </div>
        <div class="control-row">
          <span class="control-platform">PC</span>
          <span class="control-input">${item.pc}</span>
        </div>
      </div>
      ${item.tip ? `<div class="card-tip">${item.tip}</div>` : ''}
    </div>`;
  }

  function renderCards(gridId, data, showStars) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = data.map((item) => makeCard(item, showStars)).join('');
  }

  renderCards('skillMovesGrid', SKILL_MOVES, true);
  renderCards('passingGrid', PASSING, false);
  renderCards('shootingGrid', SHOOTING, false);
  renderCards('defendingGrid', DEFENDING, false);
  renderCards('setPiecesGrid', SET_PIECES, false);
  renderCards('goalkeepingGrid', GOALKEEPING, false);

  // ---- Search ----
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');
  const skillMovesSection = $('#skillMovesSection');

  const allMoves = [
    ...SKILL_MOVES.map((m) => ({ ...m, _cat: 'Skill Move' })),
    ...PASSING.map((m) => ({ ...m, _cat: 'Passing' })),
    ...SHOOTING.map((m) => ({ ...m, _cat: 'Shooting' })),
    ...DEFENDING.map((m) => ({ ...m, _cat: 'Defending' })),
    ...SET_PIECES.map((m) => ({ ...m, _cat: 'Set Piece' })),
    ...GOALKEEPING.map((m) => ({ ...m, _cat: 'Goalkeeping' })),
  ];

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      searchResults.style.display = 'none';
      skillMovesSection.style.display = '';
      return;
    }
    const hits = allMoves.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m._cat.toLowerCase().includes(q) ||
        (m.tip && m.tip.toLowerCase().includes(q)) ||
        m.ps.toLowerCase().includes(q)
    );
    skillMovesSection.style.display = 'none';
    searchResults.style.display = '';
    if (hits.length === 0) {
      searchResults.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">No moves found. Try a different search.</p>';
    } else {
      searchResults.innerHTML = hits
        .map((item) => {
          const hasStars = item.stars !== undefined;
          return makeCard(item, hasStars);
        })
        .join('');
    }
  });

  // ---- Skill moves filter ----
  $$('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const star = btn.dataset.star;
      const filtered =
        star === 'all'
          ? SKILL_MOVES
          : SKILL_MOVES.filter((m) => m.stars === parseInt(star));
      renderCards('skillMovesGrid', filtered, true);
    });
  });

  // ---- Tips ----
  function renderTips() {
    const grid = $('#tipsGrid');
    if (!grid) return;
    grid.innerHTML = PRO_TIPS.map(
      (tip) => `
      <div class="tip-card">
        <div class="tip-icon ${tip.iconClass}">${tip.icon}</div>
        <h3>${tip.title}</h3>
        <p>${tip.text}</p>
      </div>`
    ).join('');
  }
  renderTips();

  // ---- Mobile nav ----
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ---- Back to top ----
  const backToTop = $('#backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth scroll for nav ----
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
