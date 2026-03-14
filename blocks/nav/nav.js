export default function decorate(block) {
  // 1) Ensure a header wrapper exists (if not, create it and move pieces in)
  let header = block.closest('.site-header');
  if (!header) {
    header = document.createElement('header');
    header.className = 'site-header';
    // place header before the block, then move block inside it
    block.parentElement.insertBefore(header, block);
    header.appendChild(block);
  }

  // 2) BRAND (left): add if missing
  if (!header.querySelector('.brand')) {
    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.innerHTML = `<a href="/" aria-label="WKND home">WKND</a>`;
    header.insertBefore(brand, header.firstChild);
  }

  // 3) RIGHT SIDE: Search (add if missing)
  if (!header.querySelector('.nav-right')) {
    const right = document.createElement('div');
    right.className = 'nav-right';
    right.innerHTML = `
      <button class="nav-search" type="button">
        <span class="nav-search-icon" aria-hidden="true">🔍</span>
        <span>SEARCH</span>
      </button>
    `;
    header.appendChild(right);
  }

  // 4) Flatten authoring wrappers -> wrap items in links if needed
  // This turns each <p> into a clickable link placeholder (for now)
  [...block.querySelectorAll('p')].forEach((p) => {
    // If author already placed a link, keep it
    if (!p.querySelector('a')) {
      const label = p.textContent.trim();
      const a = document.createElement('a');
      a.textContent = label;
      a.href = '#'; // TODO: set real URLs later
      a.setAttribute('role', 'link');
      // Replace p content with <a>
      p.textContent = '';
      p.appendChild(a);
    }
  });

  // 5) Improve hit area & hover for anchor
  block.querySelectorAll('a').forEach((a) => {
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    a.style.padding = '6px 0';
    a.style.display = 'inline-block';
  });

  // 6) (Optional) Hook up Search to an actual search route/modal
  const searchBtn = header.querySelector('.nav-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      // replace with your EDS search path or open a modal
      window.location.href = '/search';
    });
  }
}