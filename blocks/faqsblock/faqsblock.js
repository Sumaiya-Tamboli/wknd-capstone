export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: Title row -> "FAQs"
  const titleRow = rows[0];
  const titleText = titleRow?.querySelector('p')?.textContent?.trim() || 'FAQs';

  // Row 1: Image (col 0) + Need more help (col 1)
  const contentRow = rows[1];
  const imageCols = contentRow ? [...contentRow.children] : [];
  const pictureEl = imageCols[0]?.querySelector('picture');
  const helpContent = imageCols[1];

  // Row 2: Description text (col 0)
  const descRow = rows[2];
  const descText = descRow?.children[0]?.querySelector('p');

  // Clear block
  block.innerHTML = '';

  // Title
  const titleEl = document.createElement('h2');
  titleEl.classList.add('faqsblock-title');
  titleEl.textContent = titleText;
  block.appendChild(titleEl);

  // Two column content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('faqsblock-content');

  // Left column
  const leftCol = document.createElement('div');
  leftCol.classList.add('faqsblock-left');

  // Add image
  if (pictureEl) {
    leftCol.appendChild(pictureEl.cloneNode(true));
  }

  // Add description text below image
  if (descText) {
    const descEl = document.createElement('p');
    descEl.classList.add('faqsblock-description');
    descEl.innerHTML = descText.innerHTML;
    leftCol.appendChild(descEl);
  }

  // Right column
  const rightCol = document.createElement('div');
  rightCol.classList.add('faqsblock-right');

  if (helpContent) {
    rightCol.innerHTML = helpContent.innerHTML;
  }

  contentWrapper.appendChild(leftCol);
  contentWrapper.appendChild(rightCol);
  block.appendChild(contentWrapper);
}
