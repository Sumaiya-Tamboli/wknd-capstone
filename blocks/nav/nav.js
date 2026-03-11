/**
 * Language dropdown behavior
 * - Click to toggle
 * - Close on outside click or Escape
 * - Keyboard navigation (ArrowUp/Down, Home/End, Enter)
 * - Keeps aria-expanded in sync
 */
(function initLangSwitcher() {
  const toggle = document.querySelector('.lang-toggle');
  const menu   = document.querySelector('#lang-menu');
  if (!toggle || !menu) return;

  const items = Array.from(menu.querySelectorAll('.locale'));

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    // focus the first locale for keyboard users
    const first = items[0];
    first && first.focus();
    document.addEventListener('pointerdown', onDocPointerDown);
    document.addEventListener('keydown', onDocKeydown);
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onDocPointerDown);
    document.removeEventListener('keydown', onDocKeydown);
    toggle.focus();
  }

  function isOpen() {
    return menu.classList.contains('open');
  }

  function onDocPointerDown(e) {
    if (!menu.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      closeMenu();
    }
  }

  function onDocKeydown(e) {
    if (!isOpen()) return;

    const currentIndex = items.indexOf(document.activeElement);
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        const next = items[(currentIndex + 1 + items.length) % items.length] || items[0];
        next && next.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = items[(currentIndex - 1 + items.length) % items.length] || items[items.length - 1];
        prev && prev.focus();
        break;
      }
      case 'Home':
        e.preventDefault();
        items[0] && items[0].focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1] && items[items.length - 1].focus();
        break;
      default:
        break;
    }
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closeMenu() : openMenu();
  });

  // Optional: close on Tab out of the menu
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // if last item focused and tab, close
      if (document.activeElement === items[items.length - 1]) {
        closeMenu();
      }
    }
  });
})();
