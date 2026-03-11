export default function decorate(block) {
  // Make navigation items inline
  block.style.display = 'flex';
  block.style.alignItems = 'center';

  // Create a Search element (right side)
  const searchEl = document.createElement('div');
  searchEl.classList.add('nav-search');
  searchEl.innerHTML = `
    <span class="nav-search-icon">🔍</span>
    <span>SEARCH</span>
  `;

  // Append it to the navigation block
  block.append(searchEl);
}
