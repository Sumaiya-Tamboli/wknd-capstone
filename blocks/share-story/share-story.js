export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const title = cols[0].textContent.trim();
    const date = cols[1].textContent.trim();

    row.innerHTML = `
<div class="story-card">
<span class="story-title">${title}</span>
<span class="story-date">${date}</span>
</div>
    `;
  });
}
