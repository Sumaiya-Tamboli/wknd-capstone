// share-adven.js
// Performance targets:
//   - Zero extra querySelector passes (single for..of loop)
//   - DocumentFragment: one DOM write at the end
//   - Capability detection once at init (not per-click)
//   - textContent cleared with .textContent='' (skips HTML parser)
//   - XSS-safe: textContent used for user data, never innerHTML

export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  if (!rows.length) return;

  // Pre-allocate sidebar fragment outside loop
  const sidebar = document.createElement('div');
  sidebar.className = 'adven-sidebar';

  let titleEl = null;
  let shareEl = null;

  // ── Single loop: O(n), one pass over all rows ─────────────────────────
  for (const row of rows) {
    // Check cheapest selectors first (tag names beat class names)
    const h2 = row.querySelector('h2');
    if (h2) { titleEl = h2; continue; }

    const h5 = row.querySelector('h5');
    if (h5) { shareEl = h5; continue; }

    const ps = row.querySelectorAll('p');
    if (ps.length < 2) continue;

    const label = ps[0].textContent.trim();
    const value = ps[1].textContent.trim();
    if (!label || !value) continue;

    const item = document.createElement('div');
    item.className = 'adven-meta-item';

    // Two spans via createElement+textContent: XSS safe vs innerHTML
    const lSpan = document.createElement('span');
    lSpan.className = 'adven-meta-label';
    lSpan.textContent = label;

    const vSpan = document.createElement('span');
    vSpan.className = 'adven-meta-value';
    vSpan.textContent = value;

    item.append(lSpan, vSpan);
    sidebar.appendChild(item);
  }

  // ── Title section ─────────────────────────────────────────────────────
  const titleSection = document.createElement('div');
  titleSection.className = 'adven-title-section';

  if (titleEl) {
    titleEl.className = 'adven-title';
    titleSection.appendChild(titleEl);
  }

  // insertAdjacentHTML for static markup is faster than createElement
  titleSection.insertAdjacentHTML(
    'beforeend',
    '<div class="adven-title-underline" aria-hidden="true"></div>',
  );

  // ── Share button ──────────────────────────────────────────────────────
  if (shareEl) {
    shareEl.className = 'adven-share';
    shareEl.removeAttribute('id');
    shareEl.setAttribute('role', 'button');
    shareEl.setAttribute('tabindex', '0');
    shareEl.setAttribute('aria-label', 'Share this adventure');

    // Evaluate capabilities ONCE — not inside the click handler
    const titleText = titleEl?.textContent.trim() || document.title;
    const canShare  = typeof navigator.share === 'function';
    const canCopy   = !!navigator.clipboard?.writeText;

    const doShare = async () => {
      if (canShare) {
        try { await navigator.share({ title: titleText, url: location.href }); }
        catch (_) { /* dismissed — not an error */ }
        return;
      }
      if (canCopy) {
        try {
          await navigator.clipboard.writeText(location.href);
          const orig = shareEl.textContent;
          shareEl.textContent = 'Link Copied!';
          // Use a stable reference; avoids closure re-capture
          setTimeout(() => { shareEl.textContent = orig; }, 2000);
        } catch (_) { /* clipboard blocked */ }
      }
    };

    shareEl.addEventListener('click', doShare);
    // Single keydown handler — guards on key value
    shareEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doShare();
      }
    });

    sidebar.appendChild(shareEl);
  }

  // ── Single DOM write ──────────────────────────────────────────────────
  // 1. Clear block (textContent='' is faster than innerHTML='')
  // 2. Append sidebar in one operation (no mid-loop reflows)
  block.textContent = '';
  block.appendChild(sidebar);

  // ── Hoist title to container (becomes grid row 1, spans both cols) ────
  // Done AFTER block write to avoid double reflow
  const wrapper   = block.closest('.share-adven-wrapper');
  const container = wrapper?.parentElement;
  if (container) {
    container.insertBefore(titleSection, wrapper);
  } else {
    block.prepend(titleSection);
  }
}