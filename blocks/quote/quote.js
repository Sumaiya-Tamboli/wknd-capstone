/**
 * quote block
 *
 * Authored content (one <div><div>) can be either:
 *   A) Single <p> — just the quote text, no attribution
 *   B) Two <p> tags — first is the quote, second is the attribution
 *
 * This decorator:
 *   1. Marks the first <p> as the quote text.
 *   2. Injects the yellow <hr> rule after the quote text.
 *   3. Marks the second <p> (if present) as the attribution.
 */

export default async function decorate(block) {
  const inner = block.querySelector(':scope > div > div');
  if (!inner) return;

  const paragraphs = [...inner.querySelectorAll('p')];
  if (!paragraphs.length) return;

  // Mark quote text paragraph
  paragraphs[0].classList.add('quote-text');

  // Inject yellow rule after quote text
  const rule = document.createElement('span');
  rule.className = 'quote-rule';
  rule.setAttribute('aria-hidden', 'true');
  paragraphs[0].insertAdjacentElement('afterend', rule);

  // Mark attribution paragraph if present
  if (paragraphs[1]) {
    paragraphs[1].classList.add('quote-attribution');
  }
}