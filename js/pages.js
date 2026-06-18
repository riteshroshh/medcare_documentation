function renderMath(el) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
}

function processCitations(el) {
  el.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.hasAttribute('data-page')) return;
    const ref = link.getAttribute('href').substring(1);
    if (ref.startsWith('ref-')) {
      link.classList.add('citation');
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(ref);
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
          target.classList.add('highlight-flash');
          setTimeout(() => target.classList.remove('highlight-flash'), 2000);
        }
      });
    }
  });
}

function renderPage(pageId) {
  const el = document.getElementById('main-content');
  if (!el) return;

  el.classList.add('page-transitioning');

  setTimeout(() => {
    let fn = window.PAGES[pageId];
    if (!fn) {
      const isPlanned = document.querySelector('.nav-item[data-page="' + pageId + '"]');
      if (isPlanned) {
        const formattedTitle = isPlanned.textContent.trim();
        fn = () => `
          <div class="page-chip" style="color: #ec4899; border-color: rgba(236,72,153,0.3); background: rgba(236,72,153,0.05);">coming soon</div>
          <h1 style="margin-top: 1rem; font-size: 3rem; background: linear-gradient(135deg, #fff, #a0a0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${formattedTitle}</h1>
          <p class="lead" style="color: var(--muted);">This neural pathway is currently under construction. The weights are still converging.</p>
        `;
      } else {
        fn = () => `
          <div style="min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 8rem; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.1); margin-bottom: -1rem; letter-spacing: -0.05em;">404</div>
            <h1 style="font-size: 2.5rem; color: var(--heading);">Dead End</h1>
            <p style="color: var(--muted); max-width: 400px; margin: 1rem auto 2.5rem; line-height: 1.6;">
              This dimensional coordinate does not exist.
            </p>
          </div>
        `;
      }
    }
    let isRealPage = !!window.PAGES[pageId];
    let content = fn();
    if (window.marked && (isRealPage || !content.trim().startsWith('<'))) {
      content = marked.parse(content);
    }
    el.innerHTML = content;
    window.scrollTo(0, 0);
    renderMath(el);
    processCitations(el);
    
    el.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return;
      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98c379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          }, 2000);
        });
      });
      pre.appendChild(btn);
    });

    if (window.Prism) { Prism.highlightAllUnder(el); }

    // Add Next / Previous Navigation
    const allNavItems = Array.from(document.querySelectorAll('.nav-item[data-page]'));
    const currentIndex = allNavItems.findIndex(navEl => navEl.dataset.page === pageId);
    
    if (currentIndex !== -1) {
      
      const basePath = '';
      let navHtml = '<div class="page-navigation">';
      
      if (currentIndex > 0) {
        const prev = allNavItems[currentIndex - 1];
        let prevTitle = prev.textContent.trim();
        navHtml += `<a href="${window.location.pathname}?p=${prev.dataset.page}" data-page="${prev.dataset.page}" class="page-nav-btn prev">
                      <span class="nav-label">&larr; Previous</span>
                      <span class="nav-title">${prevTitle}</span>
                    </a>`;
      } else {
        navHtml += `<div></div>`;
      }
      
      if (currentIndex < allNavItems.length - 1) {
        const next = allNavItems[currentIndex + 1];
        let nextTitle = next.textContent.trim();
        navHtml += `<a href="${window.location.pathname}?p=${next.dataset.page}" data-page="${next.dataset.page}" class="page-nav-btn next">
                      <span class="nav-label">Next &rarr;</span>
                      <span class="nav-title">${nextTitle}</span>
                    </a>`;
      } else {
        navHtml += `<div></div>`;
      }
      
      navHtml += '</div>';
      el.insertAdjacentHTML('beforeend', navHtml);

      el.querySelectorAll('.page-nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPage = btn.dataset.page;
          history.pushState({ page: targetPage }, '', btn.getAttribute('href'));
          document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
          const link = document.querySelector('.nav-item[data-page="' + targetPage + '"]');
          if (link) link.classList.add('active');
          window.renderPage(targetPage);
        });
      });
    }

    // Dynamic TOC
    const tocNav = document.getElementById('toc-nav');
    if (tocNav) {
      tocNav.innerHTML = '';
      const headings = el.querySelectorAll('h2, h3');
      if (headings.length > 0) {
        headings.forEach((heading, idx) => {
          if (!heading.id) heading.id = 'heading-' + idx;
          const link = document.createElement('a');
          link.href = '#' + heading.id;
          link.className = 'toc-link ' + heading.tagName.toLowerCase();
          link.textContent = heading.textContent;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const y = heading.getBoundingClientRect().top + window.scrollY - 85;
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, null, '#' + pageId + '::' + heading.id);
          });
          tocNav.appendChild(link);
        });

        const handleScroll = () => {
          let current = '';
          headings.forEach(heading => {
            if (heading.getBoundingClientRect().top < 150) current = heading.id;
          });
          tocNav.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) link.classList.add('active');
          });
        };
        window.removeEventListener('scroll', window._tocScrollHandler);
        window._tocScrollHandler = handleScroll;
        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        document.getElementById('toc-sidebar').style.display = 'block';
      } else {
        document.getElementById('toc-sidebar').style.display = 'none';
      }
    }

    requestAnimationFrame(() => el.classList.remove('page-transitioning'));
  }, 150);
}

window.renderPage = renderPage;

document.addEventListener('DOMContentLoaded', function() {
  let pageId = 'overview';
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('p')) {
    pageId = urlParams.get('p');
  } else {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart !== 'medcare_documentation' && !lastPart.includes('.')) {
      pageId = lastPart;
    } else if (lastPart && lastPart.endsWith('.html') && lastPart !== 'index.html' && lastPart !== '404.html') {
      pageId = lastPart.replace('.html', '');
    }
  }
  
  pageId = pageId || window.location.hash.replace('#', '') || 'overview';
  pageId = pageId.split('::')[0];

  const isLocal = window.location.protocol === 'file:';
  const repoPath = '/medcare_documentation';
  if (isLocal) {
    history.replaceState({ page: pageId }, '', window.location.pathname + '?p=' + pageId + (window.location.hash ? window.location.hash : ''));
  } else {
    history.replaceState({ page: pageId }, '', repoPath + '/' + pageId + (window.location.hash ? window.location.hash : ''));
  }

  renderPage(pageId);
});
