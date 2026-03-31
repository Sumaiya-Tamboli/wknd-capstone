import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_MAP = {
  fb:        { icon: 'facebook',  label: 'Facebook'  },
  facebook:  { icon: 'facebook',  label: 'Facebook'  },
  twitter:   { icon: 'x',        label: 'Twitter'   },
  x:         { icon: 'x',        label: 'X'         },
  insta:     { icon: 'instagram', label: 'Instagram' },
  instagram: { icon: 'instagram', label: 'Instagram' },
};

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const wrapper = footer.querySelector('.default-content-wrapper');
  if (!wrapper) {
    block.textContent = '';
    block.append(footer);
    return;
  }

  // ── FOOTER TOP ────────────────────────────────────────────
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  // 1. Logo — first <p> that contains a <picture> or <img>
  const logoPara = wrapper.querySelector('p:has(picture), p:has(img)');
  if (logoPara) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'footer-logo';
    const img = logoPara.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    logoDiv.append(logoPara);
    footerTop.append(logoDiv);
  }

  // 2. Nav — first <ul>
  const navUl = wrapper.querySelector('ul');
  if (navUl) {
    const navDiv = document.createElement('div');
    navDiv.className = 'footer-nav';
    navDiv.append(navUl);
    footerTop.append(navDiv);
  }

  // 3. Social — collect all <a> tags that match SOCIAL_MAP keys
  //    They may be in <p> tags, <ul>, or anywhere in wrapper
  const socialLinks = [];
  wrapper.querySelectorAll('a').forEach((a) => {
    const key = a.textContent.trim().toLowerCase().replace(/\s+/g, '');
    if (SOCIAL_MAP[key]) {
      socialLinks.push({ a, social: SOCIAL_MAP[key] });
    }
  });

  if (socialLinks.length) {
    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social';

    // "FOLLOW US" label
    const label = document.createElement('span');
    label.className = 'footer-social-label';
    label.textContent = 'FOLLOW US';
    socialDiv.append(label);

    // Icons container
    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'social-icons';

    socialLinks.forEach(({ a, social }) => {
      // Rebuild anchor cleanly
      const newA = document.createElement('a');
      newA.href = a.href || '#';
      newA.setAttribute('aria-label', social.label);
      newA.setAttribute('rel', 'noopener noreferrer');
      newA.setAttribute('target', '_blank');

      const img = document.createElement('img');
      img.src = `/icons/${social.icon}.svg`;
      img.alt = social.label;
      img.width = 20;
      img.height = 20;
      img.loading = 'lazy';
      img.decoding = 'async';

      newA.append(img);
      iconsDiv.append(newA);

      // Remove the original anchor's parent <p> if it only contained the link
      const parent = a.closest('p');
      if (parent && parent.textContent.trim() === a.textContent.trim()) {
        parent.remove();
      } else {
        a.remove();
      }
    });

    socialDiv.append(iconsDiv);
    footerTop.append(socialDiv);
  }

  // ── FOOTER BOTTOM ─────────────────────────────────────────
  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Move remaining <p> tags (copyright, description, etc.) to bottom
  wrapper.querySelectorAll('p, h4').forEach((el) => {
    footerBottom.append(el);
  });

  // Replace wrapper content
  wrapper.replaceChildren(footerTop, footerBottom);

  block.textContent = '';
  block.append(footer);
}