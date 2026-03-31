export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];

  const image = cols[0];
  const name = cols[1];
  const role = cols[2];
  const socials = cols[3];

  /* wrap name + role */

  const info = document.createElement('div');
  info.className = 'author-info';
  info.append(name, role);

  /* wrap icons */

  const socialBox = document.createElement('div');
  socialBox.className = 'author-social';

  const icons = socials.querySelectorAll('a');
  icons.forEach((icon) => socialBox.append(icon));

  /* rebuild layout */

  row.innerHTML = '';
  row.append(image, info, socialBox);
}
