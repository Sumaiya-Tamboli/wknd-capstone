// page1.js

(function () {

  function initPage1() {

    var block = document.querySelector('.page1.block');
    if (!block) {
      console.warn('page1: .page1.block not found');
      return;
    }

    // ── Get the first row which contains both columns ──
    var row = block.querySelector(':scope > div');
    if (!row) {
      console.warn('page1: No row found inside block');
      return;
    }

    var cols = Array.prototype.filter.call(
      row.children,
      function (el) { return el.tagName === 'DIV'; }
    );

    if (cols.length < 2) {
      console.warn('page1: Expected 2 columns, found', cols.length);
      return;
    }

    var imageCol   = cols[0];
    var contentCol = cols[1];

    // ── Extract image ──
    var picture = imageCol.querySelector('picture');
    var imgEl   = imageCol.querySelector('img');

    // ── Extract content elements ──
    var allParas  = contentCol.querySelectorAll('p');
    var allLinks  = contentCol.querySelectorAll('a');
    var heading   = contentCol.querySelector('h1, h2, h3, h4');

    // Label = first <p> if it's short (like "Featured Article")
    var labelText = '';
    var descEl    = null;

    if (allParas.length > 0) {
      var firstPara = allParas[0];
      if (firstPara.textContent.trim().length < 40 && !firstPara.querySelector('a')) {
        labelText = firstPara.textContent.trim();
        descEl    = allParas[1] || null;
      } else {
        descEl = firstPara;
      }
    }

    // Title text
    var titleText = heading ? heading.textContent.trim() : '';

    // CTA link
    var ctaLink = allLinks.length > 0 ? allLinks[allLinks.length - 1] : null;
    var ctaHref = ctaLink ? ctaLink.href : '#';
    var ctaText = ctaLink ? ctaLink.textContent.trim() : 'Full Article';

    // ══════════════════════════
    // BUILD CARD
    // ══════════════════════════

    var card = document.createElement('div');
    card.className = 'page1-card';

    // ── Image side ──
    var imageDiv = document.createElement('div');
    imageDiv.className = 'page1-image';

    if (picture) {
      imageDiv.appendChild(picture.cloneNode(true));
    } else if (imgEl) {
      var img = imgEl.cloneNode(true);
      imageDiv.appendChild(img);
    }

    // ── Content side ──
    var contentDiv = document.createElement('div');
    contentDiv.className = 'page1-content';

    // Label
    if (labelText) {
      var label = document.createElement('span');
      label.className = 'page1-label';
      label.textContent = labelText;
      contentDiv.appendChild(label);
    }

    // Title
    if (titleText) {
      var title = document.createElement('h2');
      title.className = 'page1-title';
      title.textContent = titleText;
      contentDiv.appendChild(title);
    }

    // Description
    if (descEl) {
      var desc = document.createElement('div');
      desc.className = 'page1-desc';
      desc.innerHTML = descEl.innerHTML;
      contentDiv.appendChild(desc);
    }

    // CTA Button
    var cta = document.createElement('a');
    cta.className = 'page1-cta';
    cta.href = ctaHref;
    cta.textContent = ctaText.toUpperCase();
    contentDiv.appendChild(cta);

    // ── Assemble ──
    card.appendChild(imageDiv);
    card.appendChild(contentDiv);

    // ── Insert card & hide raw block ──
    block.parentNode.insertBefore(card, block.nextSibling);
    block.style.display = 'none';

    console.log('page1: Featured card initialized.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage1);
  } else {
    initPage1();
  }

})();