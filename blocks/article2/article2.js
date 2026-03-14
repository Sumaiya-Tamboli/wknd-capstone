// article2.js

(function () {

  function initArticle2() {

    var block = document.querySelector('.article2.block');
    if (!block) {
      console.warn('article2: .article2.block not found');
      return;
    }

    // ── Collect all rows (each row = one article item) ──
    var rows = Array.prototype.filter.call(
      block.children,
      function (el) { return el.tagName === 'DIV'; }
    );

    if (!rows.length) {
      console.warn('article2: No rows found');
      return;
    }

    // ── Build Grid ──
    var grid = document.createElement('div');
    grid.className = 'article2-grid';

    rows.forEach(function (row) {

      var cols = Array.prototype.filter.call(
        row.children,
        function (el) { return el.tagName === 'DIV'; }
      );

      if (cols.length < 2) return;

      var imageCol   = cols[0];
      var contentCol = cols[1];

      // ── Image ──
      var picture = imageCol.querySelector('picture');
      var imgEl   = imageCol.querySelector('img');

      // ── Title: first link or heading ──
      var titleLink = contentCol.querySelector('a');
      var heading   = contentCol.querySelector('h1,h2,h3,h4,h5');
      var titleText = titleLink ? titleLink.textContent.trim()
                    : heading  ? heading.textContent.trim()
                    : '';
      var titleHref = titleLink ? titleLink.href : '#';

      // ── Description: first paragraph text (not a link) ──
      var descText = '';
      var paras = contentCol.querySelectorAll('p');
      paras.forEach(function (p) {
        if (!descText && !p.querySelector('a') && p.textContent.trim().length > 4) {
          descText = p.textContent.trim();
        } else if (!descText && p.textContent.trim().length > 4) {
          // para with mixed content - get text without link
          var clone = p.cloneNode(true);
          var links = clone.querySelectorAll('a');
          links.forEach(function(a){ a.remove(); });
          if (clone.textContent.trim().length > 4) {
            descText = clone.textContent.trim();
          } else {
            // Use the link text as description if that's all there is
            descText = p.textContent.trim();
          }
        }
      });

      // ── Build Card ──
      var card = document.createElement('a');
      card.className = 'article2-card';
      card.href = titleHref;

      // Image
      var imgWrap = document.createElement('div');
      imgWrap.className = 'article2-card-img';
      if (picture) {
        imgWrap.appendChild(picture.cloneNode(true));
      } else if (imgEl) {
        imgWrap.appendChild(imgEl.cloneNode(true));
      }

      // Title
      var titleEl = document.createElement('p');
      titleEl.className = 'article2-card-title';
      titleEl.textContent = titleText;

      // Description
      var descEl = document.createElement('p');
      descEl.className = 'article2-card-desc';
      descEl.textContent = descText;

      card.appendChild(imgWrap);
      card.appendChild(titleEl);
      card.appendChild(descEl);
      grid.appendChild(card);
    });

    // ── ALL TRIPS Button ──
    var btn = document.createElement('a');
    btn.className = 'article2-all-btn';
    btn.href = '/us/en/adventures';
    btn.textContent = 'ALL TRIPS';

    // ── Insert into DOM ──
    block.parentNode.insertBefore(grid, block.nextSibling);
    block.parentNode.insertBefore(btn, grid.nextSibling);

    // ── Hide raw block ──
    block.style.display = 'none';

    console.log('article2: Grid built with', rows.length, 'cards.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticle2);
  } else {
    initArticle2();
  }

})();