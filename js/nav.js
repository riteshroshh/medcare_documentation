// ─── Navigation Engine ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // ── Logo navigates to overview ────────────────────────────────────────────
  const logo = document.querySelector('.product-name[data-page]');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      const home = document.querySelector('.nav-item[data-page="overview"]');
      if (home) home.classList.add('active');
      const isGithubPages = window.location.pathname.startsWith('/medcare_documentation');
      const basePath = isGithubPages ? '/medcare_documentation/' : '/';
      history.pushState({ page: 'overview' }, '', basePath + 'overview');
      window.renderPage('overview');
    });
  }


  document.querySelectorAll('.nav-group-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const target = document.getElementById(this.dataset.target);
      const isOpen = target.classList.contains('open');
      target.classList.toggle('open', !isOpen);
      this.classList.toggle('open', !isOpen);
    });
  });

  // ── Page link routing ────────────────────────────────────────────────────
  document.querySelectorAll('.nav-item[data-page], .footer-link[data-page]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;

      // Active state
      document.querySelectorAll('.nav-item').forEach(function (l) {
        l.classList.remove('active');
      });
      this.classList.add('active');

      // Ensure parent group is open
      const parent = this.closest('.nav-sub');
      if (parent) {
        parent.classList.add('open');
        const toggle = document.querySelector('[data-target="' + parent.id + '"]');
        if (toggle) toggle.classList.add('open');
      }

      const isGithubPages = window.location.pathname.startsWith('/medcare_documentation');
      const basePath = isGithubPages ? '/medcare_documentation/' : '/';
      history.pushState({ page: pageId }, '', basePath + pageId);
      window.renderPage(pageId);
    });
  });

  // ── Handle direct history navigation ───────────────────────────────────────
  window.addEventListener('popstate', function (e) {
    let pageId = 'overview';
    if (e.state && e.state.page) {
      pageId = e.state.page;
    } else {
      const isGithubPages = window.location.pathname.startsWith('/medcare_documentation');
      const basePath = isGithubPages ? '/medcare_documentation/' : '/';
      const path = window.location.pathname.replace(basePath, '').replace(/^\//, '').replace(/\/$/, '');
      pageId = path || window.location.hash.replace('#', '') || 'overview';
    }
    const parts = pageId.split('::');
    pageId = parts[0];
    window.renderPage(pageId);
    
    if (parts.length > 1) {
      setTimeout(() => {
        const el = document.getElementById(parts[1]);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 85;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }

    const link = document.querySelector('.nav-item[data-page="' + pageId + '"]');
    if (link) {
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      // open parent
      const parent = link.closest('.nav-sub');
      if (parent) {
        parent.classList.add('open');
        const toggle = document.querySelector('[data-target="' + parent.id + '"]');
        if (toggle) toggle.classList.add('open');
      }
    }
  });

  // ── Search ───────────────────────────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  document.querySelector('.topbar').appendChild(searchResults);

  const allPages = Array.from(document.querySelectorAll('.nav-item[data-page]')).map(function (el) {
    return { id: el.dataset.page, title: el.textContent.trim() };
  });

  function stripHtml(html) {
    let tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!q) { searchResults.style.display = 'none'; return; }

    const terms = q.split(/\s+/);
    let matches = [];

    allPages.forEach(p => {
      // Basic match on title or id
      let score = 0;
      let snippet = '';
      if (p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        score += 100;
      }
      
      // Full text search if content available
      if (window.PAGES && window.PAGES[p.id]) {
        const rawContent = window.PAGES[p.id]();
        const textContent = stripHtml(rawContent).toLowerCase();
        
        let allTermsFound = true;
        for (let term of terms) {
          if (!textContent.includes(term)) {
            allTermsFound = false;
            break;
          }
        }
        
        if (allTermsFound) {
          score += 10;
          const idx = textContent.indexOf(terms[0]);
          if (idx !== -1) {
             const start = Math.max(0, idx - 40);
             const end = Math.min(textContent.length, idx + 80);
             snippet = stripHtml(rawContent).substring(start, end).replace(/\n/g, ' ') + '...';
             if (start > 0) snippet = '...' + snippet;
          }
        }
      }

      if (score > 0) {
        matches.push({ ...p, score, snippet });
      }
    });

    matches.sort((a, b) => b.score - a.score);

    if (!matches.length) { searchResults.style.display = 'none'; return; }

    matches.slice(0, 8).forEach(function (p) {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      let html = '<div class="search-result-title">' + p.title + '</div>';
      if (p.snippet) {
         html += '<div class="search-result-sub" style="color: var(--body); font-size: 0.7rem; margin-top: 0.3rem;">' + p.snippet + '</div>';
      } else {
         html += '<div class="search-result-sub">' + p.id + '.py</div>';
      }
      item.innerHTML = html;
      
      item.addEventListener('click', function () {
        searchResults.style.display = 'none';
        searchInput.value = '';
        const isGithubPages = window.location.pathname.startsWith('/medcare_documentation');
        const basePath = isGithubPages ? '/medcare_documentation/' : '/';
        history.pushState({ page: p.id }, '', basePath + p.id);
        window.renderPage(p.id);
        const link = document.querySelector('.nav-item[data-page="' + p.id + '"]');
        if (link) {
          document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          const parent = link.closest('.nav-sub');
          if (parent) {
            parent.classList.add('open');
            const toggle = document.querySelector('[data-target="' + parent.id + '"]');
            if (toggle) toggle.classList.add('open');
          }
        }
      });
      searchResults.appendChild(item);
    });
    searchResults.style.display = 'block';
  });

  document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });

  // --- 4. Cmd+K Modal Logic ---
  const cmdKOverlay = document.getElementById('cmd-k-overlay');
  const cmdKInput = document.getElementById('cmd-k-input');
  const cmdKResults = document.getElementById('cmd-k-results');

  const openCmdK = () => {
    cmdKOverlay.classList.add('visible');
    setTimeout(() => cmdKInput.focus(), 50);
  };

  const closeCmdK = () => {
    cmdKOverlay.classList.remove('visible');
    cmdKInput.value = '';
    cmdKResults.innerHTML = '';
  };

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCmdK();
    }
    if (e.key === 'Escape' && cmdKOverlay.classList.contains('visible')) {
      closeCmdK();
    }
  });

  cmdKOverlay.addEventListener('click', (e) => {
    if (e.target === cmdKOverlay) closeCmdK();
  });

  cmdKInput.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    cmdKResults.innerHTML = '';
    if (!q) return;

    let matches = [];
    Object.keys(window.PAGES).forEach(key => {
      const pageStr = window.PAGES[key]();
      const temp = document.createElement('div');
      temp.innerHTML = pageStr;
      const h1 = temp.querySelector('h1');
      const title = h1 ? h1.textContent : key;
      const text = temp.textContent.toLowerCase();
      
      if (title.toLowerCase().includes(q) || text.includes(q)) {
        matches.push({ id: key, title: title });
      }
    });

    matches.slice(0, 8).forEach((p, idx) => {
      const item = document.createElement('a');
      item.className = 'search-result-item';
      item.href = '#' + p.id;
      item.textContent = p.title;
      // if first item, select it
      if (idx === 0) item.classList.add('selected');
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        closeCmdK();
        const isGithubPages = window.location.pathname.startsWith('/medcare_documentation');
        const basePath = isGithubPages ? '/medcare_documentation/' : '/';
        history.pushState({ page: p.id }, '', basePath + p.id);
        window.renderPage(p.id);
      });
      cmdKResults.appendChild(item);
    });
  });

  // Handle enter key to navigate to first result
  cmdKInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const selected = cmdKResults.querySelector('.search-result-item.selected');
      if (selected) selected.click();
    }
  });

  // --- 5. Reading Progress Bar ---
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }

});
