import { decorateIcons } from '../../scripts/aem.js';

/**
 * photographer block
 *
 * Authored rows:
 *   row 0 — picture
 *   row 1 — "Name"         | value
 *   row 2 — "Title"        | value
 *   row 3 — "Social Links" | links (FB, Twitter, Insta)
 *
 * Icon mapping uses your project's /icons/ folder via EDS decorateIcons().
 * Icons expected: facebook.svg, x.svg, instagram.svg
 */

// Map link text / title / hostname → icon name matching your /icons/ filenames
function resolveIconName(anchor) {
  const text = (anchor.textContent || '').toLowerCase().trim();
  const title = (anchor.title || '').toLowerCase().trim();
  const href = (anchor.href || '').toLowerCase();

  if (text.includes('fb') || title.includes('fb') || href.includes('facebook')) return 'facebook';
  if (text.includes('twitter') || title.includes('twitter') || href.includes('twitter') || href.includes('x.com')) return 'x';
  if (text.includes('insta') || title.includes('insta') || href.includes('instagram')) return 'instagram';
  return null;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // ── Extract authored data ──────────────────────────────────────────────
  const picEl     = rows[0]?.querySelector('picture');
  const nameText  = rows[1]?.querySelectorAll('div')[1]?.textContent?.trim() || '';
  const titleText = rows[2]?.querySelectorAll('div')[1]?.textContent?.trim() || '';
  const linkEls   = [...(rows[3]?.querySelectorAll('a') || [])];

  // ── Clear block ────────────────────────────────────────────────────────
  block.innerHTML = '';

  // ── Identity (left) ───────────────────────────────────────────────────
  const identity = document.createElement('div');
  identity.className = 'photographer-identity';

  if (picEl) {
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'photographer-avatar';
    const img = picEl.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    avatarWrap.appendChild(picEl);
    identity.appendChild(avatarWrap);
  }

  const info = document.createElement('div');
  info.className = 'photographer-info';

  if (nameText) {
    const name = document.createElement('p');
    name.className = 'photographer-name';
    name.textContent = nameText;
    info.appendChild(name);
  }

  if (titleText) {
    const jobTitle = document.createElement('p');
    jobTitle.className = 'photographer-title';
    jobTitle.textContent = titleText;
    info.appendChild(jobTitle);
  }

  identity.appendChild(info);
  block.appendChild(identity);

  // ── Social bar (right) ────────────────────────────────────────────────
  if (linkEls.length) {
    const social = document.createElement('div');
    social.className = 'photographer-social';

    linkEls.forEach((a) => {
      const iconName = resolveIconName(a);
      if (!iconName) return;

      const link = document.createElement('a');
      link.href = a.href;
      link.title = a.title || a.textContent.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // EDS icon span — decorateIcons() will inject the SVG from /icons/<name>.svg
      link.innerHTML = `<span class="icon icon-${iconName}"></span>`;

      social.appendChild(link);
    });

    if (social.children.length) {
      block.appendChild(social);
      // Let EDS load and inject the SVGs from /icons/
      await decorateIcons(social);
    }
  }
}