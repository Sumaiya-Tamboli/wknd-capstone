export default function decorate(block) {
  const rows = [...block.children];
 
  if (rows.length < 2) return;
 
  const image = rows[0].querySelector('picture');
  const categoryLink = rows[1].children[0].querySelector('a');
  const title = rows[1].children[1].textContent.trim();
 
  block.innerHTML = `
    <div class="magazine-image">
      ${image.outerHTML}
    </div>
 
    <div class="magazine-label">
      <span class="magazine-category">${categoryLink.outerHTML}</span>
      <span class="magazine-triangle"></span>
      <span class="magazine-title">${title}</span>
    </div>
  `;
}