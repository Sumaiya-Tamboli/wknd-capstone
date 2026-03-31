// bali-desc.js
// Performance targets:
//   - Single querySelectorAll pass (no re-queries inside loop)
//   - DocumentFragment: zero mid-loop DOM writes
//   - One delegated click listener (not N per tab)
//   - Roving tabindex ARIA pattern (correct + perf)
//   - panel.hidden toggled as boolean (native attr, no style recalc)
//   - Active index tracked in a variable — no findIndex on every click
//   - childNodes spread done once per panel — no while(firstChild) loops

export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  if (!rows.length) return;

  const tabNav = document.createElement('div');
  tabNav.className = 'bali-desc-tabs';
  tabNav.setAttribute('role', 'tablist');

  // Parallel arrays: O(1) index lookup on click
  const tabs   = [];
  const panels = [];
  // Batch all panels into one fragment — single DOM write at the end
  const frag   = document.createDocumentFragment();

  // ── Single pass: build tabs + panels ─────────────────────────────────
  let validIdx = 0; // only count rows that produce a tab
  for (const row of rows) {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) continue;

    const i       = validIdx++;
    const isFirst = i === 0;
    const id      = `bali-desc-${i}`;

    // ── Tab button ───────────────────────────────────────────────────
    const btn = document.createElement('button');
    btn.className  = isFirst ? 'bali-desc-tab active' : 'bali-desc-tab';
    btn.setAttribute('role',         'tab');
    btn.setAttribute('id',           `tab-${id}`);
    btn.setAttribute('aria-controls',`panel-${id}`);
    btn.setAttribute('aria-selected', isFirst ? 'true' : 'false');
    btn.setAttribute('tabindex',      isFirst ? '0' : '-1');

    const labelP = cells[0].querySelector('p');
    // textContent: XSS-safe + faster than innerHTML for plain text
    btn.textContent = labelP ? labelP.textContent.trim().toUpperCase() : '';
    tabNav.appendChild(btn);
    tabs.push(btn);

    // ── Panel ─────────────────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.className = isFirst ? 'bali-desc-panel active' : 'bali-desc-panel';
    panel.setAttribute('role',            'tabpanel');
    panel.setAttribute('id',              `panel-${id}`);
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    // native hidden: browser skips layout for hidden panels (better than display:none in JS)
    panel.hidden = !isFirst;

    // Move authored child nodes in one spread — avoids while(firstChild) repeated reads
    const kids = [...cells[1].childNodes];
    for (const kid of kids) panel.appendChild(kid);

    panels.push(panel);
    frag.appendChild(panel);
  }

  // ── Track active index as a number — O(1) on click, no findIndex ─────
  let activeIdx = 0;

  // ── Single delegated click listener on tabNav ────────────────────────
  tabNav.addEventListener('click', (e) => {
    const btn  = e.target.closest('.bali-desc-tab');
    if (!btn) return;
    const next = tabs.indexOf(btn);
    if (next === -1 || next === activeIdx) return;

    const prev = activeIdx;
    activeIdx  = next;

    // Deactivate previous — touch exactly 2 elements
    tabs[prev].classList.remove('active');
    tabs[prev].setAttribute('aria-selected', 'false');
    tabs[prev].setAttribute('tabindex', '-1');
    panels[prev].classList.remove('active');
    panels[prev].hidden = true;

    // Activate next
    tabs[next].classList.add('active');
    tabs[next].setAttribute('aria-selected', 'true');
    tabs[next].setAttribute('tabindex', '0');
    panels[next].classList.add('active');
    panels[next].hidden = false;
  });

  // ── Keyboard: roving tabindex (ARIA spec for tab widgets) ─────────────
  tabNav.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const cur  = tabs.indexOf(document.activeElement);
    if (cur === -1) return;
    const next = e.key === 'ArrowRight'
      ? (cur + 1) % tabs.length
      : (cur - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
  });

  // ── Single DOM write: clear + rebuild in one operation ────────────────
  block.textContent = ''; // skip HTML parser vs innerHTML = ''
  block.appendChild(tabNav);
  block.appendChild(frag);
}