/**
 * recent-article block
 *
 * 1. Physically moves the .recent-article-wrapper to be the FIRST child
 *    of the section so CSS grid places it at row 1 col 2 correctly.
 * 2. Injects "Share This Story" label.
 * 3. Marks active item by current page path.
 */

export default async function decorate(block) {
  // 1. Move wrapper to first position in the section
  const wrapper = block.closest('.recent-article-wrapper');
  const section = wrapper?.parentElement;

  if (wrapper && section) {
    // Prepend to section — now it's the first DOM child,
    // grid-column:2 / grid-row:1 will place it top-right correctly
    section.prepend(wrapper);
  }

  // 2. "SHARE THIS STORY" label
  const label = document.createElement('span');
  label.className = 'share-label';
  label.textContent = 'Share This Story';
  block.prepend(label);

  // 3. Highlight item matching current page
  const currentPath = window.location.pathname;
  block.querySelectorAll(':scope > div').forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (linkPath === currentPath) row.classList.add('is-active');
    } catch {
      // malformed href — skip
    }
  });
}