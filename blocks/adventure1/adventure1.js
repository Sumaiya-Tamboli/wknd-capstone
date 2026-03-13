export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  // Set row as positioning context for the overlay
  row.style.position = 'relative';

  // ===== Optimize hero image =====
  const img = block.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('decoding', 'async');
  }

  // ===== Add utility classes =====
  const imageCol = row.querySelector(':scope > div:first-child');
  const contentCol = row.querySelector(':scope > div:last-child');

  if (imageCol) imageCol.classList.add('adventure1-image');
  if (contentCol) contentCol.classList.add('adventure1-content');
}
