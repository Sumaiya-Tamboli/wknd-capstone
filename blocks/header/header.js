import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;
  const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
  if (navSectionExpanded && isDesktop.matches) {
    toggleAllNavSections(navSections);
    navSectionExpanded.focus();
  } else if (!isDesktop.matches) {
    toggleMenu(nav, navSections);
    nav.querySelector('button').focus();
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (nav.contains(e.relatedTarget)) return;
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;
  const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
  if (navSectionExpanded && isDesktop.matches) {
    toggleAllNavSections(navSections, false);
  } else if (!isDesktop.matches) {
    toggleMenu(nav, navSections, false);
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  if (focused.className !== 'nav-drop') return;
  if (e.code !== 'Enter' && e.code !== 'Space') return;
  const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
  toggleAllNavSections(focused.closest('.nav-sections'));
  focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools', 'search'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-sections');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const container = brandLink.closest('.button-container');
      if (container) container.className = '';
    }
  }

  const navLinks = nav.querySelector('.nav-tools');
  if (navLinks) {
    navLinks.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navLinks);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navLinks));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navLinks, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navLinks, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll effect
  let isScrolled = false;
  let rafPending = false;

  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        navWrapper.classList.toggle('scrolled', scrolled);
        isScrolled = scrolled;
      }
      rafPending = false;
    });
  }, { passive: true });

  // ✅ ✅ SIGN-IN MODAL (CORRECT PLACE)

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'signin-modal';

    modal.innerHTML = `
      <div class="signin-overlay"></div>
      <div class="signin-box">
        <h1>Sign In</h1>
        <div class="underline"></div>
        <h2>Welcome Back</h2>
        <input type="text" placeholder="USERNAME" />
        <input type="password" placeholder="PASSWORD" />
        <p class="forgot">FORGOT YOUR PASSWORD?</p>
        <button>SIGN IN</button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  createModal();

  const trigger = nav.querySelector('.default-content-wrapper p');

  if (trigger) {
    trigger.style.cursor = 'pointer';

    trigger.addEventListener('click', () => {
      document.querySelector('.signin-modal').classList.add('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('signin-overlay')) {
      document.querySelector('.signin-modal')?.classList.remove('open');
    }
  });
}