const state = {
  type: 'all',
  category: 'all',
  sort: 'newest',
  authMode: 'login'
};

const $ = id => document.getElementById(id);

const token = () => localStorage.getItem('up_token');


/* =========================================================
   CATEGORY DATA
========================================================= */

const categories = [
  ['🎨', 'AI Image Generation', 'Create stunning AI visuals'],
  ['⚙️', 'Technology', 'Technology, AI & futuristic ideas'],
  ['📈', 'Business & Marketing', 'Business, branding & campaigns'],
  ['💻', 'Web Development', 'Websites, apps & interfaces'],
  ['📱', 'Social Media', 'Posts, reels & content'],
  ['🏠', 'Architecture & Interior', 'Spaces, buildings & interiors'],
  ['🧊', '3D & Digital Art', '3D, CGI & digital artwork'],
  ['📚', 'Education', 'Learning, teaching & study']
];


/* =========================================================
   SVG ICONS
========================================================= */

function iconSvg(type) {

  const icons = {

    cinematic: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="M8 5v14"/>
        <path d="M16 5v14"/>
        <path d="M3 9h5"/>
        <path d="M16 9h5"/>
        <path d="M3 15h5"/>
        <path d="M16 15h5"/>
      </svg>
    `,

    portrait: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="12" cy="8" r="3"/>
        <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"/>
      </svg>
    `,

    anime: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M12 3l2.2 5.1L20 10l-5.8 1.9L12 17l-2.2-5.1L4 10l5.8-1.9L12 3z"/>
        <path d="M19 3v4"/>
        <path d="M17 5h4"/>
      </svg>
    `,

    product: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M5 7h14v12H5z"/>
        <path d="M9 7l1-3h4l1 3"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    `,

    fashion: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M9 4c.5 2 1.5 3 3 3s2.5-1 3-3"/>
        <path d="M9 5L5 8l2 4 2-1v8h6v-8l2 1 2-4-4-3"/>
      </svg>
    `,

    '3d': `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
        <path d="M4 7.5L12 12l8-4.5"/>
        <path d="M12 12v9"/>
      </svg>
    `,

    marketing: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M4 11v2"/>
        <path d="M7 9l10-4v14L7 15V9z"/>
        <path d="M7 15l1.5 5h3L10 15"/>
        <path d="M19 8c1 .8 1.5 1.8 1.5 4S20 15.2 19 16"/>
      </svg>
    `,

    coding: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M8 8l-4 4 4 4"/>
        <path d="M16 8l4 4-4 4"/>
        <path d="M14 5l-4 14"/>
      </svg>
    `,

    education: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M3 9l9-5 9 5-9 5-9-5z"/>
        <path d="M7 11v5c3 2 7 2 10 0v-5"/>
        <path d="M21 9v6"/>
      </svg>
    `,

    business: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2"/>
        <path d="M8 7V5h8v2"/>
        <path d="M3 12h18"/>
        <path d="M10 12v2h4v-2"/>
      </svg>
    `,

    social: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="M8.5 13.5l7-6"/>
        <path d="M8.5 13.5l7 4"/>
      </svg>
    `,

    writing: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M4 20h4L19 9l-4-4L4 16v4z"/>
        <path d="M13 6l4 4"/>
        <path d="M4 4h7"/>
      </svg>
    `,

    productivity: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 7v5l3 2"/>
        <path d="M12 2v2"/>
        <path d="M22 12h-2"/>
        <path d="M12 22v-2"/>
        <path d="M2 12h2"/>
      </svg>
    `,

    audio: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M4 10v4"/>
        <path d="M8 7v10"/>
        <path d="M12 4v16"/>
        <path d="M16 7v10"/>
        <path d="M20 10v4"/>
      </svg>
    `,

    food: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M6 3v8"/>
        <path d="M4 3v5a2 2 0 0 0 4 0V3"/>
        <path d="M6 10v11"/>
        <path d="M16 3v18"/>
        <path d="M16 3c3 2 4 5 0 8"/>
      </svg>
    `,

    travel: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M3 12l18-7-7 18-3-8-8-3z"/>
        <path d="M11 15l4-4"/>
      </svg>
    `,

    research: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5"/>
        <path d="M16 16l5 5"/>
        <path d="M8 10h5"/>
        <path d="M10.5 8v5"/>
      </svg>
    `,

    technology: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
        <path d="M9 2v4"/>
        <path d="M15 2v4"/>
        <path d="M9 18v4"/>
        <path d="M15 18v4"/>
        <path d="M2 9h4"/>
        <path d="M18 9h4"/>
        <path d="M2 15h4"/>
        <path d="M18 15h4"/>
        <circle cx="10" cy="11" r="1"/>
        <circle cx="14" cy="13" r="1"/>
      </svg>
    `,

    other: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="5" cy="12" r="1.2"/>
        <circle cx="12" cy="12" r="1.2"/>
        <circle cx="19" cy="12" r="1.2"/>
      </svg>
    `,

    image: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <circle cx="8.5" cy="9" r="1.5"/>
        <path d="M3 16l5-5 4 4 3-3 6 6"/>
      </svg>
    `,

    video: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="3" y="5" width="13" height="14" rx="2"/>
        <path d="M16 10l5-3v10l-5-3"/>
      </svg>
    `,

    text: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M5 4h14"/>
        <path d="M12 4v16"/>
        <path d="M8 20h8"/>
      </svg>
    `,

    user: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <circle cx="12" cy="8" r="3"/>
        <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"/>
      </svg>
    `,

    like: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M7 10v10"/>
        <path d="M7 20H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3"/>
        <path d="M7 10l4-7c.4-.7 1.4-.9 2-.4.5.4.7 1 .5 1.6L12.5 9H19c1.2 0 2 1.1 1.7 2.3l-1.6 7A2.2 2.2 0 0 1 17 20H7"/>
      </svg>
    `,

    copy: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <rect x="8" y="8" width="11" height="11" rx="2"/>
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>
      </svg>
    `,

    check: `
      <svg viewBox="0 0 24 24" fill="none"
        aria-hidden="true">
        <path d="M5 12l4 4L19 6"/>
      </svg>
    `
  };

  return `
    <span class="svg-icon">
      ${icons[type] || icons.other}
    </span>
  `;
}


/* =========================================================
   HELPERS
========================================================= */

function esc(v = '') {
  return String(v).replace(
    /[&<>'"]/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[c])
  );
}


function typeLabel(t) {
  return t === 'video'
    ? 'VIDEO'
    : t === 'text'
      ? 'TEXT'
      : 'IMAGE';
}


function typeIcon(t) {
  if (t === 'video') return iconSvg('video');
  if (t === 'text') return iconSvg('text');
  return iconSvg('image');
}


function safeUser() {
  try {
    return JSON.parse(
      localStorage.getItem('up_user') || 'null'
    );
  } catch {
    return null;
  }
}


function scrollToId(id) {
  $(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


/* =========================================================
   LOAD PROMPTS
========================================================= */

async function loadPrompts() {

  const grid = $('grid');

  grid.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
  `;

  const p = new URLSearchParams({
    q: $('q').value.trim(),
    type: state.type,
    category: state.category,
    sort: state.sort
  });

  try {

    const r = await fetch('/api/prompts?' + p);
    const data = await r.json();

    if (!r.ok) {
      throw new Error(data.message);
    }

    $('statPrompts').textContent = data.length;

    renderPrompts(data);

  } catch (e) {

    grid.innerHTML = `
      <div class="empty">
        <h3>Could not load prompts</h3>

        <p>
          Please make sure the server and database are running.
        </p>

        <button
          class="btn btn-primary"
          onclick="openPromptModal()"
        >
          + Publish a Prompt
        </button>
      </div>
    `;
  }
}


/* =========================================================
   RENDER PROMPTS
========================================================= */

function renderPrompts(data) {

  if (!data.length) {

    $('grid').innerHTML = `
      <div class="empty">
        <h3>No prompts found</h3>

        <p>
          Be the first person to publish a useful prompt.
        </p>

        <button
          class="btn btn-primary"
          onclick="openPromptModal()"
        >
          + Publish a Prompt
        </button>
      </div>
    `;

    return;
  }


  $('grid').innerHTML = data.map(x => `

    <article
      class="prompt-card"
      data-prompt-id="${esc(x._id)}"
    >

      <div class="card-media">

        ${
          x.imageUrl
            ? `
              <img
                src="${esc(x.imageUrl)}"
                alt="${esc(x.title)}"
                onerror="this.style.display='none'"
              >
            `
            : `
              <div class="media-placeholder">
                ${typeIcon(x.type)}
              </div>
            `
        }

        <span class="type-pill">
          ${typeLabel(x.type)}
        </span>

      </div>


      <div class="card-body">

        <div class="card-top">

          <div>

            <div class="card-category">
              ${esc(x.category || 'Other')}
            </div>

            <h3 class="card-title">
              ${esc(x.title)}
            </h3>

          </div>

        </div>


        ${
          x.description
            ? `
              <p class="card-desc">
                ${esc(x.description)}
              </p>
            `
            : ''
        }


        <div class="prompt-preview">
          ${esc(x.prompt)}
        </div>


        <div class="card-footer">

          <span class="author">

            ${esc(x.author?.name || 'Community')}

            ·

            <span class="like-count">
              ${x.likes || 0} likes
            </span>

            ·

            ${x.views || 0} views

          </span>


          <div class="card-actions">

            <button
              class="action-btn like-btn${x.liked ? ' liked' : ''}"
              type="button"
              data-action="like"
              aria-label="Like prompt"
            >

              <span class="like-icon">
                ${x.liked ? iconSvg('like') : iconSvg('like')}
              </span>

              <span>
                Like
              </span>

            </button>


            <button
              class="action-btn copy-btn"
              type="button"
              data-action="copy"
              aria-label="Copy prompt"
            >

              <span class="copy-icon">
                ${iconSvg('copy')}
              </span>

              <span>
                Copy
              </span>

            </button>

          </div>

        </div>

      </div>

    </article>

  `).join('');


  document
    .querySelectorAll(
      '.prompt-card [data-action=like]'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        () => likePrompt(
          btn.closest('.prompt-card').dataset.promptId,
          btn
        )
      );

    });


  document
    .querySelectorAll(
      '.prompt-card [data-action=copy]'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        () => {

          const card =
            btn.closest('.prompt-card');

          const prompt =
            data.find(
              x =>
                String(x._id) ===
                String(card.dataset.promptId)
            )?.prompt || '';

          copyPrompt(prompt, btn);

        }
      );

    });


  data.forEach(x => {

    fetch(
      '/api/prompts/' +
      x._id +
      '/view',
      {
        method: 'POST'
      }
    ).catch(() => {});

  });

}


/* =========================================================
   LIKE
========================================================= */

async function likePrompt(id, button) {

  if (!token()) {
    openAuth('login');
    return;
  }

  if (button?.disabled) {
    return;
  }

  if (button) {
    button.disabled = true;
  }

  try {

    const r = await fetch(
      '/api/prompts/' +
      id +
      '/like',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token()
        }
      }
    );

    const d = await r.json();

    if (!r.ok) {

      if (r.status === 401) {

        localStorage.removeItem('up_token');
        localStorage.removeItem('up_user');

        updateUser();
        openAuth('login');

      } else {

        toast(
          d.message ||
          'Could not update like.'
        );

      }

      return;
    }


    if (button) {

      button.classList.toggle(
        'liked',
        !!d.liked
      );


      const icon =
        button.querySelector('.like-icon');

      if (icon) {

        icon.innerHTML =
          iconSvg('like');

      }


      const count =
        button
          .closest('.card-footer')
          ?.querySelector('.like-count');

      if (count) {

        count.textContent =
          d.likes + ' likes';

      }

    }


    toast(
      d.liked
        ? 'Liked'
        : 'Like removed'
    );

  } catch (e) {

    toast(
      'Could not update like.'
    );

  } finally {

    if (button) {
      button.disabled = false;
    }

  }
}


/* =========================================================
   COPY PROMPT
========================================================= */

async function copyPrompt(text, button) {

  if (!text) {

    toast(
      'There is nothing to copy.'
    );

    return;
  }

  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        text
      );

    } else {

      const ta =
        document.createElement('textarea');

      ta.value = text;

      ta.style.position = 'fixed';
      ta.style.opacity = '0';

      document.body.appendChild(ta);

      ta.focus();
      ta.select();

      document.execCommand('copy');

      ta.remove();

    }


    if (button) {

      button.classList.add('copied');

      const old =
        button.innerHTML;

      button.innerHTML = `
        <span>
          ${iconSvg('check')}
        </span>

        <span>
          Copied
        </span>
      `;

      setTimeout(() => {

        button.classList.remove(
          'copied'
        );

        button.innerHTML = old;

      }, 1400);

    }


    toast(
      'Prompt copied'
    );

  } catch (e) {

    toast(
      'Could not copy the prompt. Please try again.'
    );

  }
}


/* =========================================================
   TOAST
========================================================= */

function toast(text) {

  const t = $('toast');

  t.textContent = text;

  t.classList.add('show');

  clearTimeout(
    window.__toast
  );

  window.__toast =
    setTimeout(
      () =>
        t.classList.remove('show'),
      2200
    );
}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {
  $(id)?.classList.add('open');
}


function closeModal(id) {
  $(id)?.classList.remove('open');
}


/* =========================================================
   AUTH
========================================================= */

function openAuth(mode = 'login') {

  state.authMode = mode;

  $('authMsg').textContent = '';

  $('loginTab').classList.toggle(
    'active',
    mode === 'login'
  );

  $('registerTab').classList.toggle(
    'active',
    mode === 'register'
  );

  $('authName').classList.toggle(
    'hidden',
    mode === 'login'
  );

  $('authName').value = '';

  $('authTitle').textContent =
    mode === 'login'
      ? 'Welcome back'
      : 'Create your account';

  $('authSubtitle').textContent =
    mode === 'login'
      ? 'Log in to publish, like, and manage your prompts.'
      : 'Create an account in a few seconds and start sharing prompts.';

  $('authSubmit').textContent =
    mode === 'login'
      ? 'Log In'
      : 'Sign Up';

  $('authPassword').value = '';

  openModal('authModal');
}


async function submitAuth() {

  const email =
    $('authEmail').value.trim();

  const password =
    $('authPassword').value;

  const body = {
    email,
    password
  };


  if (
    state.authMode === 'register'
  ) {

    body.name =
      $('authName').value.trim();

  }


  if (
    !email ||
    !password ||
    (
      state.authMode === 'register' &&
      !body.name
    )
  ) {

    $('authMsg').textContent =
      'Please fill in all required fields.';

    return;
  }


  const r = await fetch(
    '/api/auth/' +
    (
      state.authMode === 'register'
        ? 'register'
        : 'login'
    ),
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body:
        JSON.stringify(body)
    }
  );


  const d =
    await r.json();


  if (!r.ok) {

    $('authMsg').textContent =
      d.message ||
      'Authentication failed.';

    return;
  }


  localStorage.setItem(
    'up_token',
    d.token
  );

  localStorage.setItem(
    'up_user',
    JSON.stringify(d.user)
  );


  closeModal(
    'authModal'
  );

  updateUser();


  toast(
    state.authMode === 'login'
      ? 'Logged in successfully.'
      : 'Account created successfully.'
  );
}


/* =========================================================
   USER
========================================================= */

function updateUser() {

  const u =
    safeUser();


  $('loginBtn').classList.toggle(
    'hidden',
    !!u
  );

  $('registerBtn').classList.toggle(
    'hidden',
    !!u
  );

  $('userMenu').classList.toggle(
    'hidden',
    !u
  );


  if (u) {

    $('userMenu').innerHTML = `
      ${iconSvg('user')}
      <span>${esc(u.name)}</span>
    `;

  }
}


function openAccount() {

  const u =
    safeUser();


  if (!u) {

    openAuth('login');

    return;
  }


  $('accountName').textContent =
    u.name;

  $('accountEmail').textContent =
    u.email;

  $('myPrompts').classList.add(
    'hidden'
  );

  $('myPrompts').innerHTML = '';


  openModal(
    'accountModal'
  );
}


/* =========================================================
   PROMPT MODAL
========================================================= */

function openPromptModal() {

  if (!token()) {

    openAuth('login');

    return;
  }


  $('promptMsg').textContent = '';

  $('promptForm').reset();

  $('pCategory').value =
    'Cinematic';


  openModal(
    'promptModal'
  );
}


/* =========================================================
   CREATE PROMPT
========================================================= */

async function createPrompt(e) {

  e.preventDefault();

  $('promptMsg').textContent = '';


  if (!token()) {

    closeModal(
      'promptModal'
    );

    openAuth(
      'login'
    );

    return;
  }


  const body = {

    title:
      $('pTitle').value.trim(),

    prompt:
      $('pPrompt').value.trim(),

    description:
      $('pDescription').value.trim(),

    type:
      $('pType').value,

    category:
      $('pCategory').value,

    imageUrl:
      $('pImage').value.trim()

  };


  const r = await fetch(
    '/api/prompts',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',

        Authorization:
          'Bearer ' + token()
      },

      body:
        JSON.stringify(body)
    }
  );


  const d =
    await r.json();


  if (!r.ok) {

    $('promptMsg').textContent =
      d.message ||
      'Could not publish the prompt.';

    return;
  }


  closeModal(
    'promptModal'
  );


  state.type =
    'all';

  state.category =
    'all';


  document
    .querySelectorAll('.chip')
    .forEach(
      x =>
        x.classList.toggle(
          'active',
          x.dataset.type === 'all'
        )
    );


  await loadPrompts();

  scrollToId(
    'prompts'
  );


  toast(
    'Prompt published successfully'
  );
}


/* =========================================================
   MY PROMPTS
========================================================= */

async function loadMyPrompts() {

  const box =
    $('myPrompts');


  box.classList.remove(
    'hidden'
  );


  box.innerHTML = `
    <p class="muted">
      Loading your prompts...
    </p>
  `;


  const r = await fetch(
    '/api/prompts/mine',
    {
      headers: {
        Authorization:
          'Bearer ' + token()
      }
    }
  );


  const data =
    await r.json();


  if (!r.ok) {

    box.innerHTML = `
      <p class="form-msg">
        ${esc(
          data.message ||
          'Could not load your prompts.'
        )}
      </p>
    `;

    return;
  }


  if (!data.length) {

    box.innerHTML = `
      <div class="mini-empty">
        You have not published any prompts yet.
      </div>
    `;

    return;
  }


  box.innerHTML = `
    <div class="my-list">

      ${
        data.map(x => `

          <div class="my-item">

            <div>

              <b>
                ${esc(x.title)}
              </b>

              <span>
                ${esc(x.category)}
                ·
                ${x.likes || 0}
                likes
                ·
                ${x.views || 0}
                views
              </span>

            </div>

            <button
              class="icon-btn"
              onclick="deletePrompt('${x._id}')"
            >
              Delete
            </button>

          </div>

        `).join('')
      }

    </div>
  `;
}


/* =========================================================
   DELETE PROMPT
========================================================= */

async function deletePrompt(id) {

  if (
    !confirm(
      'Delete this prompt?'
    )
  ) {
    return;
  }


  const r = await fetch(
    '/api/prompts/' + id,
    {
      method: 'DELETE',

      headers: {
        Authorization:
          'Bearer ' + token()
      }
    }
  );


  const d =
    await r.json();


  if (!r.ok) {

    toast(
      d.message ||
      'Could not delete prompt'
    );

    return;
  }


  toast(
    'Prompt deleted'
  );


  await loadMyPrompts();

  await loadPrompts();
}


/* =========================================================
   CATEGORY RENDER
========================================================= */

function renderCategories() {

  $('categoryGrid').innerHTML =
    categories
      .map(c => `

        <button
          class="category-card"
          data-category="${esc(c[1])}"
          type="button"
        >

          <div class="cat-icon">

            ${iconSvg(c[0])}

          </div>

          <b>
            ${esc(c[1])}
          </b>

          <span>
            ${esc(c[2])}
          </span>

        </button>

      `)
      .join('');


  $('statCategories').textContent =
    categories.length;


  $('pCategory').innerHTML =
    categories
      .map(c => `

        <option
          value="${esc(c[1])}"
        >
          ${esc(c[1])}
        </option>

      `)
      .join('');


  document
    .querySelectorAll(
      '.category-card'
    )
    .forEach(b => {

      b.addEventListener(
        'click',
        () =>
          selectCategory(
            b.dataset.category
          )
      );

    });
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function selectCategory(category) {
  state.category = category;
  state.type = 'all';

  document.querySelectorAll('.chip').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.type === 'all'
    );
  });

  loadPrompts();
  scrollToId('prompts');
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    'up_token'
  );

  localStorage.removeItem(
    'up_user'
  );


  closeModal(
    'accountModal'
  );


  updateUser();


  toast(
    'You have been logged out.'
  );
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderCategories();

    updateUser();

    loadPrompts();


    $('loginBtn').onclick =
      () =>
        openAuth('login');


    $('registerBtn').onclick =
      () =>
        openAuth('register');


    $('userMenu').onclick =
      openAccount;


    $('loginTab').onclick =
      () =>
        openAuth('login');


    $('registerTab').onclick =
      () =>
        openAuth('register');


    $('authSubmit').onclick =
      submitAuth;


    $('addTopBtn').onclick =
      openPromptModal;


    $('heroAdd').onclick =
      openPromptModal;


    $('sectionAdd').onclick =
      openPromptModal;


    $('ctaAdd').onclick =
      openPromptModal;


    $('viewPromptsBtn').onclick =
      () =>
        scrollToId('prompts');


    $('searchBtn').onclick =
      loadPrompts;


    $('sort').onchange =
      e => {

        state.sort =
          e.target.value;

        loadPrompts();

      };


    $('q').addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Enter'
        ) {

          loadPrompts();

        }

      }
    );


    document
      .querySelectorAll('.chip')
      .forEach(
        b => {

          b.onclick =
            () => {

              state.type =
                b.dataset.type;


              document
                .querySelectorAll('.chip')
                .forEach(
                  x =>
                    x.classList.toggle(
                      'active',
                      x === b
                    )
                );


              loadPrompts();

            };

        }
      );


    $('promptForm')
      .addEventListener(
        'submit',
        createPrompt
      );


    $('logoutBtn').onclick =
      logout;


    $('myPromptsBtn').onclick =
      loadMyPrompts;


    document
      .querySelectorAll(
        '[data-close]'
      )
      .forEach(
        b => {

          b.onclick =
            () =>
              closeModal(
                b.dataset.close
              );

        }
      );


    window.addEventListener(
      'click',
      e => {

        if (
          e.target.classList.contains(
            'modal'
          )
        ) {

          e.target.classList.remove(
            'open'
          );

        }

      }
    );

  }
);