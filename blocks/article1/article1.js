// article1.js

(function () {

  function initArticle1() {

    var block = document.querySelector('.article1.block');
    if (!block) {
      console.warn('article1: .article1.block not found');
      return;
    }

    // ── Read rows FIRST before any DOM changes ──
    var rows = Array.prototype.filter.call(
      block.children,
      function (el) { return el.tagName === 'DIV'; }
    );

    if (!rows.length) {
      console.warn('article1: No rows found');
      return;
    }

    // ── Store card data in plain objects first ──
    var cardDataList = [];

    rows.forEach(function (row) {

      var cols = Array.prototype.filter.call(
        row.children,
        function (el) { return el.tagName === 'DIV'; }
      );

      if (cols.length < 2) return;

      var imageCol   = cols[0];
      var contentCol = cols[1];

      // Picture/img
      var picture = imageCol.querySelector('picture')
                    ? imageCol.querySelector('picture').cloneNode(true)
                    : null;
      var imgEl = !picture && imageCol.querySelector('img')
                  ? imageCol.querySelector('img').cloneNode(true)
                  : null;

      // Title & href
      var titleLink = contentCol.querySelector('a.button, a');
      var titleText = titleLink ? titleLink.textContent.trim() : '';
      var titleHref = titleLink ? titleLink.href : '#';

      // Description
      var descText = '';
      var paras = contentCol.querySelectorAll('p');
      paras.forEach(function (p) {
        if (!descText && !p.classList.contains('button-wrapper')) {
          descText = p.textContent.trim();
        }
      });

      cardDataList.push({
        picture:   picture,
        imgEl:     imgEl,
        titleText: titleText,
        titleHref: titleHref,
        descText:  descText
      });
    });

    // ── Build Grid from stored data ──
    var grid = document.createElement('div');
    grid.className = 'article1-grid';

    cardDataList.forEach(function (data) {

      var card = document.createElement('a');
      card.className = 'article1-card';
      card.href = data.titleHref;

      // Image
      var imgWrap = document.createElement('div');
      imgWrap.className = 'article1-card-img';
      if (data.picture) {
        imgWrap.appendChild(data.picture);
      } else if (data.imgEl) {
        imgWrap.appendChild(data.imgEl);
      }

      // Title
      var titleEl = document.createElement('p');
      titleEl.className = 'article1-card-title';
      titleEl.textContent = data.titleText;

      // Description
      var descEl = document.createElement('p');
      descEl.className = 'article1-card-desc';
      descEl.textContent = data.descText;

      card.appendChild(imgWrap);
      card.appendChild(titleEl);
      card.appendChild(descEl);
      grid.appendChild(card);
    });

    // ── ALL ARTICLES Button ──
    var btn = document.createElement('a');
    btn.className = 'article1-all-btn';
    btn.href = '/us/en/magazine';
    btn.textContent = 'ALL ARTICLES';

    // ── Get insertion point (wrapper) ──
    var wrapper = block.parentNode;

    // ── Insert grid & button after wrapper ──
    wrapper.parentNode.insertBefore(grid, wrapper.nextSibling);
    wrapper.parentNode.insertBefore(btn, grid.nextSibling);

    // ── NOW hide raw block & wrapper ──
    block.style.display = 'none';

    // ── Hide last default-content-wrapper (raw ALL ARTICLES p) ──
    var container = document.querySelector('.article1-container');
    if (container) {
      var allWrappers = container.querySelectorAll('.default-content-wrapper');
      if (allWrappers.length > 1) {
        allWrappers[allWrappers.length - 1].style.display = 'none';
      }
    }

    console.log('article1: Built', cardDataList.length, 'cards successfully.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticle1);
  } else {
    initArticle1();
  }

})();