export default function decorate(block) {
  const rows = [...block.children];
 
  rows.forEach((row) => {
    const p = row.querySelector('p');
 
    const parts = p.innerHTML.split('<br>');
 
    const title = parts[0].trim();
    const date = parts[1].trim();
 
    row.innerHTML = `
      <div class="story-card">
        <span class="story-title">${title}</span>
        <span class="story-date">${date}</span>
      </div>
    `;
  });
}