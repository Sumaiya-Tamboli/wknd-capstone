export default function decorate(block) {
  const rows = [...block.children];
  const categories = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const categoryName = cols[0]?.querySelector('p')?.textContent?.trim().toUpperCase() || '';

    // Skip the ALL row from HTML since we add it manually
    if (categoryName === 'ALL' || categoryName === '') return;

    const cards = [];
    for (let i = 1; i < cols.length; i++) {
      const col = cols[i];
      const picture = col.querySelector('picture');
      const img = col.querySelector('img');
      const link = col.querySelector('a');
      const desc = col.querySelectorAll('p')[1];

      if (!picture && !img) continue;

      cards.push({
        img: picture ? picture.outerHTML : '',
        title: link ? link.textContent.trim() : (img ? img.alt : ''),
        href: link ? link.href : '#',
        desc: desc ? desc.textContent.trim() : '',
        category: categoryName,
      });
    }

    if (cards.length > 0) {
      categories.push({ name: categoryName, cards });
    }
  });

  // Gather all unique tab names - ALL is added only once manually
  const tabNames = ['ALL', ...categories.map((c) => c.name)];

  // Flatten all cards with their category
  const allCards = [];
  categories.forEach((cat) => {
    cat.cards.forEach((card) => {
      allCards.push({ ...card });
    });
  });

  // Build block HTML
  block.innerHTML = '';

  // Tabs
  const tabsEl = document.createElement('div');
  tabsEl.classList.add('adventurecurrent1-tabs');

  tabNames.forEach((tabName, idx) => {
    const tab = document.createElement('button');
    tab.classList.add('adventurecurrent1-tab');
    if (idx === 0) tab.classList.add('active');
    tab.textContent = tabName;
    tab.dataset.tab = tabName;
    tabsEl.appendChild(tab);
  });

  block.appendChild(tabsEl);

  // Grid
  const grid = document.createElement('div');
  grid.classList.add('adventurecurrent1-grid');

  allCards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('adventurecurrent1-card');
    cardEl.dataset.category = card.category;

    cardEl.innerHTML = `
      <a href="${card.href}" title="${card.title}">
        ${card.img}
        <p class="adventurecurrent1-card-title">${card.title}</p>
        <p class="adventurecurrent1-card-desc">${card.desc}</p>
      </a>
    `;

    grid.appendChild(cardEl);
  });

  block.appendChild(grid);

  // Tab click logic
  const tabs = tabsEl.querySelectorAll('.adventurecurrent1-tab');
  const cards = grid.querySelectorAll('.adventurecurrent1-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const selected = tab.dataset.tab;

      cards.forEach((card) => {
        if (selected === 'ALL' || card.dataset.category === selected) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
