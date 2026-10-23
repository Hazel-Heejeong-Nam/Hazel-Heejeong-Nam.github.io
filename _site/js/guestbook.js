(function () {
  const panel = document.getElementById('anonymous-board');
  if (!panel) return;

  const toggle = panel.querySelector('.guestbook-toggle');
  const content = document.getElementById('guestbook-content');
  const form = document.getElementById('guestbook-form');
  const input = document.getElementById('guestbook-message');
  const count = document.getElementById('guestbook-count');
  const status = document.getElementById('guestbook-status');
  const messages = document.getElementById('guestbook-messages');
  const pagination = document.getElementById('guestbook-pagination');
  const pageLabel = document.getElementById('guestbook-page-label');
  const previousPage = pagination.querySelector('[data-guestbook-page="previous"]');
  const nextPage = pagination.querySelector('[data-guestbook-page="next"]');
  const submit = form.querySelector('button[type="submit"]');
  const endpoint = 'https://feed-pulse.com/api/threads';
  const threadKey = 'hazel-heejeong-nam.github.io/guestbook';
  let loaded = false;
  let allMessages = [];
  let currentPage = 1;
  const pageSize = 5;

  function render() {
    messages.replaceChildren();
    const totalPages = Math.max(1, Math.ceil(allMessages.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const pageItems = allMessages.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    pagination.hidden = totalPages < 2;
    pageLabel.textContent = `${currentPage} / ${totalPages}`;
    previousPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
    if (!pageItems.length) {
      const empty = document.createElement('p');
      empty.className = 'guestbook-empty';
      empty.textContent = 'Be the first to say hi.';
      messages.append(empty);
      return;
    }
    pageItems.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'guestbook-message';
      const body = document.createElement('p');
      body.textContent = item.body || '';
      article.append(body);
      if (item.created_at) {
        const time = document.createElement('time');
        time.dateTime = item.created_at;
        time.textContent = new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        article.append(time);
      }
      messages.append(article);
    });
  }

  async function loadMessages() {
    try {
      const response = await fetch(`${endpoint}/${encodeURIComponent(threadKey)}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load messages');
      const data = await response.json();
      allMessages = (data.comments || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      render();
      loaded = true;
      status.textContent = '';
    } catch (error) {
      status.textContent = 'Messages are temporarily unavailable.';
    }
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Collapse anonymous messages' : 'Expand anonymous messages');
    content.hidden = !open;
    if (open && !loaded) loadMessages();
  });

  previousPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      render();
    }
  });

  nextPage.addEventListener('click', () => {
    if (currentPage * pageSize < allMessages.length) {
      currentPage += 1;
      render();
    }
  });

  input.addEventListener('input', () => {
    count.textContent = `${input.value.length} / 100`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = input.value.trim();
    if (!body || body.length > 100) return;
    submit.disabled = true;
    status.textContent = 'Posting…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_key: threadKey, author: 'Anonymous', body, reply_to: null, mod_email: '' })
      });
      if (!response.ok) throw new Error('Could not post message');
      input.value = '';
      count.textContent = '0 / 100';
      currentPage = 1;
      await loadMessages();
      status.textContent = 'Your message is public now.';
    } catch (error) {
      status.textContent = 'Could not post. Please try again.';
    } finally {
      submit.disabled = false;
    }
  });
})();
