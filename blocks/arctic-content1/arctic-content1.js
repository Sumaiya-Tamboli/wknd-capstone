export default function decorate(block) {
  const rows = [...block.children];
 
  rows.forEach((row) => {
    const inner = row.firstElementChild;
    if (inner) {
      row.replaceWith(...inner.children);
    }
  });
}