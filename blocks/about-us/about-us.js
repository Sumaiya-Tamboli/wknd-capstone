// about-us.js

(function () {

  function initAboutUs() {

    var block = document.querySelector('.about-us.block');

    if (!block) {
      console.warn('About Us: .about-us.block not found');
      return;
    }

    // Verify required elements exist
    var h1 = block.querySelector('h1');
    var h2 = block.querySelector('h2');
    var p  = block.querySelector('p');

    if (!h1 || !h2) {
      console.warn('About Us: h1 or h2 not found inside block');
      return;
    }

    // ── Add aria roles for accessibility ──
    h1.setAttribute('role', 'heading');
    h1.setAttribute('aria-level', '1');

    h2.setAttribute('role', 'heading');
    h2.setAttribute('aria-level', '2');

    // ── Mark block as initialized ──
    block.setAttribute('data-initialized', 'true');

    console.log('About Us block initialized successfully.');
  }

  // ── Safe Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutUs);
  } else {
    initAboutUs();
  }

})();