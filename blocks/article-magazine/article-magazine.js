/**
 * article-magazine block
 *
 * Minimal decorator — no heavy logic.
 * Only sets lazy-load attributes correctly on inline images.
 * The first image in the article can be above the fold on some viewports,
 * so we leave it lazy (it is NOT the hero/LCP image — that's hero-magazine).
 */

export default async function decorate(block) {
  // All images inside the article body are below-the-fold content images.
  // Ensure loading="lazy" and explicit decoding="async" for performance.
  block.querySelectorAll('picture img').forEach((img) => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });
}