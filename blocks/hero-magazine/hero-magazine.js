const CHEVRON_SVG = `<svg viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><polyline points="1,1 5,5 1,9"/></svg>`;

function buildBreadcrumb(p) {
  const link = p.querySelector('a');
  const rawText = p.textContent;

  const parts = rawText.split(/\s*[>=|»]+\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return;

  const [parentLabel, ...rest] = parts;
  const articleTitle = rest.join(' ');

  const fragment = document.createDocumentFragment();

  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.title = link.title || parentLabel;
    a.textContent = parentLabel;
    fragment.appendChild(a);
  } else {
    const span = document.createElement('span');
    span.textContent = parentLabel;
    fragment.appendChild(span);
  }

  const sep = document.createElement('span');
  sep.className = 'hero-breadcrumb-sep';
  sep.setAttribute('aria-hidden', 'true');
  sep.innerHTML = CHEVRON_SVG;
  fragment.appendChild(sep);

  const title = document.createElement('span');
  title.className = 'hero-breadcrumb-title';
  title.textContent = articleTitle;
  fragment.appendChild(title);

  p.replaceChildren(fragment);
}

export default async function decorate(block) {
  // 1. LCP image — set priority hints before anything else
  const img = block.querySelector('picture img');
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.decoding = 'async';
  }

  // 2. Breadcrumb
  const breadcrumbP = block.querySelector(':scope > div:last-child p');
  if (breadcrumbP) buildBreadcrumb(breadcrumbP);
}