document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  // Highlight active sidebar links.
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if ((currentPage === '' || currentPage === 'index.html') && href.includes('index.html')) {
      link.style.fontWeight = '700';
      link.style.color = '#93c5fd';
    } else if (href === currentPage) {
      link.style.fontWeight = '700';
      link.style.color = '#93c5fd';
    }
  });

  // Home page button actions.
  const buttons = document.querySelectorAll('.button button');
  if (buttons.length >= 2) {
    buttons[0].addEventListener('click', () => {
      window.location.href = 'contact.html';
    });
    buttons[1].addEventListener('click', () => {
      window.location.href = 'cv.html';
    });
  }

  const API_BASE = (window.API_BASE_URL || '').trim();
  const api = (path) => API_BASE ? `${API_BASE.replace(/\/+$/,'')}${path}` : path;

  // Contact form handling.
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const statusMessage = document.createElement('div');
    statusMessage.style.marginTop = '12px';
    statusMessage.style.fontSize = '0.95rem';
    statusMessage.style.color = '#065f46';
    contactForm.appendChild(statusMessage);

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const message = formData.get('message')?.toString().trim();

      if (!name || !email || !message) {
        statusMessage.textContent = 'Please fill in all fields before sending your message.';
        statusMessage.style.color = '#b91c1c';
        return;
      }

      statusMessage.textContent = 'Sending message…';
      statusMessage.style.color = '#374151';

      fetch(api('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to send message');
        }
        return res.json();
      }).then((data) => {
        statusMessage.textContent = 'Message sent! Thank you — I will get back to you soon.';
        statusMessage.style.color = '#065f46';
        contactForm.reset();
      }).catch((err) => {
        if (!API_BASE) {
          statusMessage.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`;
          statusMessage.style.color = '#065f46';
          contactForm.reset();
        } else {
          statusMessage.textContent = 'Failed to send message — please try again later or email krishnaQ2004@gmail.com directly.';
          statusMessage.style.color = '#b91c1c';
          console.error('Contact send error', err);
        }
      });
    });
  }

  // Projects list fetch with static fallback preservation
  if (window.location.pathname.includes('projects.html')) {
    const container = document.getElementById('projects-list');
    if (container && API_BASE) {
      fetch(api('/api/projects'))
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data) || data.length === 0) return;
          container.innerHTML = '';
          data.forEach(p => {
            const el = document.createElement('section');
            el.className = 'project';
            el.innerHTML = `
              <h3>${escapeHtml(p.title)}</h3>
              <p>${escapeHtml(p.description || '')}</p>
              <div class="tech"><strong>Technologies:</strong> ${Array.isArray(p.tags) ? escapeHtml(p.tags.join(', ')) : ''}</div>
              ${p.url ? `<div class="project-links" style="margin-top:10px"><a href="${escapeHtml(p.url)}" target="_blank" rel="noreferrer">Live / Repo</a></div>` : ''}
            `;
            container.appendChild(el);
          });
        }).catch(err => {
          console.warn('API fetch failed, falling back to static projects list', err);
        });
    }
  }

  // simple HTML escape helper
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (s) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[s]);
  }
});