/**
 * Krishna Kant Pandey — Portfolio Core Engine
 * Handles Theme Toggling, Mobile Drawer, Live Filtering, Copy Toast, and Form Handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initMobileMenu();
  initRoleTyper();
  initProjectFiltering();
  initCopyActions();
  initContactForm();
});

/* ==========================================================================
   1. THEME ENGINE (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      updateThemeUI(nextTheme);
    });
  });
}

function updateThemeUI(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    const textEl = btn.querySelector('.theme-text');
    const iconEl = btn.querySelector('.theme-icon');
    if (textEl) {
      textEl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
    if (iconEl) {
      iconEl.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  });
}

/* ==========================================================================
   2. NAVIGATION & ACTIVE STATE
   ========================================================================== */
function initNavigation() {
  let path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';

  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === path || (path === 'index.html' && href.endsWith('index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!sidebar || !toggleBtn) return;

  function openMenu() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on nav link click in mobile
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. DYNAMIC ROLE TYPER
   ========================================================================== */
function initRoleTyper() {
  const target = document.getElementById('role-typewriter');
  if (!target) return;

  const roles = [
    'B.Tech CSE Undergraduate (2023–2027)',
    'Spring Boot & Java Developer',
    'DSA & OOP Problem Solver',
    'AI Workflows & REST APIs Builder'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeStep() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* ==========================================================================
   5. PROJECT FILTERING & LIVE BACKEND SYNC
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const container = document.getElementById('projects-container');

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTags = card.getAttribute('data-tags') || '';
      const textContent = card.innerText.toLowerCase();

      const matchesCat =
        currentCategory === 'all' ||
        cardCategory.toLowerCase().includes(currentCategory.toLowerCase()) ||
        cardTags.toLowerCase().includes(currentCategory.toLowerCase());

      const matchesSearch = !currentSearch || textContent.includes(currentSearch);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilter();
    });
  }

  // Connect live to Backend API if available
  const API_BASE = (window.API_BASE_URL || '').trim();
  const api = (path) => (API_BASE ? `${API_BASE.replace(/\/+$/, '')}${path}` : path);

  if (container && window.location.pathname.includes('projects.html')) {
    fetch(api('/api/projects'))
      .then((res) => {
        if (!res.ok) throw new Error('Backend offline');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        // Dynamically populate projects from SQLite / MySQL database
        container.innerHTML = '';
        data.forEach((p) => {
          const card = document.createElement('article');
          card.className = 'project-card';
          const tagsArr = Array.isArray(p.tags) ? p.tags : [];
          card.setAttribute('data-category', tagsArr.join(' '));
          card.setAttribute('data-tags', tagsArr.join(' '));

          const bulletList = p.description
            ? p.description.split('. ').map((b) => b.trim()).filter(Boolean)
            : [];

          card.innerHTML = `
            <span class="project-badge-type">${escapeHtml(tagsArr[0] || 'Software Engineering')}</span>
            <h2 class="project-title">${escapeHtml(p.title)}</h2>
            <ul class="project-bullets">
              ${bulletList.map((b) => `<li>${escapeHtml(b.endsWith('.') ? b : b + '.')}</li>`).join('')}
            </ul>
            <div class="project-tech-stack">
              ${tagsArr.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="project-actions">
              ${
                p.url
                  ? `
                <a href="${escapeHtml(p.url)}" target="_blank" rel="noreferrer" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                  <span>View Source</span>
                </a>
              `
                  : ''
              }
              <a href="contact.html" class="btn btn-secondary" style="padding: 10px 18px; font-size: 0.9rem;">
                <span>Discuss Project</span>
              </a>
            </div>
          `;
          container.appendChild(card);
        });
        applyFilter();
      })
      .catch((err) => {
        // Fallback: retains clean static pre-rendered cards
        console.log('[Projects] Serving pre-rendered showcase cards.');
      });
  }
}

/* ==========================================================================
   6. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initCopyActions() {
  document.querySelectorAll('.copy-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          const originalText = btn.innerHTML;
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        })
        .catch(() => {
          showToast(`Text: ${textToCopy}`);
        });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${escapeHtml(message)}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. CONTACT FORM HANDLER (Direct Backend API Integration)
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const statusEl = document.querySelector('.form-status');
  if (!form) return;

  const API_BASE = (window.API_BASE_URL || '').trim();
  const api = (path) => (API_BASE ? `${API_BASE.replace(/\/+$/, '')}${path}` : path);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const subject = formData.get('subject')?.toString().trim() || 'Portfolio Contact Inquiry';
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out all required fields.';
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending message...`;
    }

    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.style.display = 'none';
    }

    // Call Backend API
    fetch(api('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(() => {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.innerHTML = `<strong>Thank you, ${escapeHtml(name)}!</strong> Your message has been saved and sent. Krishna will get back to you shortly.`;
        }
        form.reset();
      })
      .catch((err) => {
        console.warn('Backend offline or failed:', err);
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.innerHTML = `<strong>Thank you, ${escapeHtml(name)}!</strong> Message noted. You can also reach Krishna directly at <a href="mailto:krishnaQ2004@gmail.com" style="color:#60a5fa;text-decoration:underline;">krishnaQ2004@gmail.com</a>.`;
        }
        form.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[s]);
}
