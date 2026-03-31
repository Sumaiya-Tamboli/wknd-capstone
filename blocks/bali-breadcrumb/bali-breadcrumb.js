// bali-breadcrumb.js

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [linkCell, labelCell] = [...row.querySelectorAll(':scope > div')];
  if (!linkCell || !labelCell) return;

  // ── 1. Strip ALL EDS button classes from the anchor and its wrapper ──
  const anchor = linkCell.querySelector('a');
  if (anchor) {
    anchor.classList.remove('button', 'primary', 'secondary');

    // Remove button-wrapper from the <p> so no button CSS ever applies
    const wrapper = anchor.closest('.button-wrapper');
    if (wrapper) wrapper.classList.remove('button-wrapper');

    if (!anchor.getAttribute('aria-label')) {
      anchor.setAttribute('aria-label', `${anchor.textContent.trim()} - back to listing`);
    }
  }

  // ── 2. Mark current page for accessibility ────────────────────────────
  const currentLabel = labelCell.querySelector('p');
  if (currentLabel) {
    currentLabel.setAttribute('aria-current', 'page');
  }

  // ── 3. JSON-LD BreadcrumbList for SEO ────────────────────────────────
  const breadcrumbItems = [];

  if (anchor) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 1,
      name: anchor.textContent.trim(),
      item: anchor.href,
    });
  }

  if (currentLabel) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: currentLabel.textContent.trim(),
      item: window.location.href,
    });
  }

  if (breadcrumbItems.length) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    });
    document.head.appendChild(script);
  }
}