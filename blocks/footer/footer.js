import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Map social platform keywords to Font Awesome icon classes
const SOCIAL_ICONS = {
  facebook: 'fa-brands fa-facebook-f',
  twitter: 'fa-brands fa-twitter',
  instagram: 'fa-brands fa-instagram',
  'x.com': 'fa-brands fa-x-twitter',
};

function decorateSocialIcons(block) {
  // Load Font Awesome dynamically
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    document.head.appendChild(fa);
  }

  // Find all social links and replace text with icons
  const socialLinks = block.querySelectorAll('a');
  socialLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.toLowerCase().trim();

    // Match by href or link text
    const platform = Object.keys(SOCIAL_ICONS).find(
      (key) => href.includes(key) || text.includes(key),
    );

    if (platform) {
      const icon = document.createElement('i');
      icon.className = SOCIAL_ICONS[platform];
      icon.setAttribute('aria-hidden', 'true');
      link.textContent = '';
      link.appendChild(icon);
      link.setAttribute('aria-label', platform);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);

  // Decorate social icons
  decorateSocialIcons(block);
}
