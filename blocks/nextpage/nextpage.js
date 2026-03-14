// nextpage.js

(function () {

  function initNextPage() {

    var blocks = document.querySelectorAll('.nextpage.block');

    if (!blocks.length) {
      console.warn('nextpage: No .nextpage.block found');
      return;
    }

    blocks.forEach(function (block) {

      // ── Get first row ──
      var row = block.querySelector(':scope > div');
      if (!row) {
        console.warn('nextpage: No row found');
        return;
      }

      var cols = Array.prototype.filter.call(
        row.children,
        function (el) { return el.tagName === 'DIV'; }
      );

      if (cols.length < 2) {
        console.warn('nextpage: Expected 2 columns, found', cols.length);
        return;
      }

      var imageCol   = cols[0];
      var contentCol = cols[1];

      // ── Extract image ──
      var picture = imageCol.querySelector('picture');
      var imgEl   = imageCol.querySelector('img');

      // ── Extract content ──
      var heading  = contentCol.querySelector('h1, h2, h3, h4');
      var allParas = contentCol.querySelectorAll('p');
      var allLinks = contentCol.querySelectorAll('a');

      // Title
      var titleText = heading ? heading.textContent.trim() : '';

      // Description HTML - exclude pure CTA paragraphs
      var descHTML = '';
      var ctaKeywords = ['see trip', 'full article', 'read more', 'learn more'];

      allParas.forEach(function (p) {
        var text = p.textContent.trim().toLowerCase();
        var isCTA = ctaKeywords.some(function (k) { return text === k; });
        if (!isCTA && text.length > 10) {
          descHTML += p.outerHTML;
        }
      });

      // CTA - last link in content
      var ctaLink = allLinks.length > 0 ? allLinks[allLinks.length - 1] : null;
      var ctaHref = ctaLink ? ctaLink.href  : '#';
      var ctaText = ctaLink ? ctaLink.textContent.trim() : 'See Trip';

      // ══════════════════
      // BUILD CARD
      // ══════════════════

      var card = document.createElement('div');
      card.className = 'nextpage-card';

      // ── Image ──
      var imageDiv = document.createElement('div');
      imageDiv.className = 'nextpage-image';
      if (picture) {
        imageDiv.appendChild(picture.cloneNode(true));
      } else if (imgEl) {
        var img = imgEl.cloneNode(true);
        imageDiv.appendChild(img);
      }

      // ── Content ──
      var contentDiv = document.createElement('div');
      contentDiv.className = 'nextpage-content';

      if (titleText) {
        var title = document.createElement('h2');
        title.className = 'nextpage-title';
        title.textContent = titleText;
        contentDiv.appendChild(title);
      }

      if (descHTML) {
        var desc = document.createElement('div');
        desc.className = 'nextpage-desc';
        desc.innerHTML = descHTML;
        contentDiv.appendChild(desc);
      }

      var cta = document.createElement('a');
      cta.className = 'nextpage-cta';
      cta.href = ctaHref;
      cta.textContent = ctaText.toUpperCase();
      contentDiv.appendChild(cta);

      // ── Assemble ──
      card.appendChild(imageDiv);
      card.appendChild(contentDiv);

      // ── Insert & hide raw block ──
      block.parentNode.insertBefore(card, block.nextSibling);
      block.style.display = 'none';

      console.log('nextpage: Card built —', titleText);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNextPage);
  } else {
    initNextPage();
  }

})();