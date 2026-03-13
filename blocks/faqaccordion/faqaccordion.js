// faqaccordion.js

(function () {

  function initFaqAccordion() {

    var block = document.querySelector('.faqaccordion.block');

    if (!block) {
      console.warn('FAQ Accordion: Block not found. Check class names.');
      return;
    }

    // Collect only direct DIV children
    var items = Array.prototype.filter.call(
      block.children,
      function (el) { return el.tagName === 'DIV'; }
    );

    if (!items.length) {
      console.warn('FAQ Accordion: No child DIV items found.');
      return;
    }

    items.forEach(function (item) {

      var questionDiv = item.children[0];
      var answerDiv   = item.children[1];

      if (!questionDiv || !answerDiv) return;

      // ── Build the + icon ──
      var icon = document.createElement('span');
      icon.className   = 'faq-toggle-icon';
      icon.textContent = '+';
      icon.setAttribute('aria-hidden', 'true');
      questionDiv.appendChild(icon);

      // ── Accessibility ──
      questionDiv.setAttribute('role', 'button');
      questionDiv.setAttribute('tabindex', '0');
      questionDiv.setAttribute('aria-expanded', 'false');

      // ── Click Handler ──
      questionDiv.addEventListener('click', function () {

        var isOpen = item.classList.contains('faq-open');

        // Close all
        items.forEach(function (el) {
          el.classList.remove('faq-open');
          if (el.children[0]) {
            el.children[0].setAttribute('aria-expanded', 'false');
          }
        });

        // Open current if it was closed
        if (!isOpen) {
          item.classList.add('faq-open');
          questionDiv.setAttribute('aria-expanded', 'true');
        }
      });

      // ── Keyboard Support ──
      questionDiv.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          questionDiv.click();
        }
      });

    });

    console.log('FAQ Accordion ready — ' + items.length + ' items loaded.');
  }

  // ── Safe Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }

})();