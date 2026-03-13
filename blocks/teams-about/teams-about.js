// teams-about.js

(function () {

  // ── SVG Icons ──
  var SVG = {
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    twitter:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.37 4.07 3.58 1.64.9a4.52 4.52 0 0 0-.61 2.27c0 1.57.8 2.95 2.01 3.76a4.49 4.49 0 0 1-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43a4.54 4.54 0 0 1-2.04.08 4.53 4.53 0 0 0 4.22 3.14A9.07 9.07 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 23 3z"/></svg>',
    instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
  };

  // ── Build a single team card ──
  function buildCard(imgEl, nameText, roleText, socialLinks) {

    var card = document.createElement('div');
    card.className = 'team-card';

    // Image - use existing picture element or fallback
    if (imgEl) {
      var picture = imgEl.closest('picture') || imgEl.parentElement;
      var picClone = picture ? picture.cloneNode(true) : null;

      if (picClone) {
        // Force circular style on the img inside picture
        var clonedImg = picClone.querySelector('img');
        if (clonedImg) {
          clonedImg.className = 'team-img';
          clonedImg.removeAttribute('width');
          clonedImg.removeAttribute('height');
        }
        card.appendChild(picClone);
      }
    }

    // Name
    var nameEl = document.createElement('p');
    nameEl.className = 'team-name';
    nameEl.textContent = nameText || '';
    card.appendChild(nameEl);

    // Role
    var roleEl = document.createElement('p');
    roleEl.className = 'team-role';
    roleEl.textContent = roleText || '';
    card.appendChild(roleEl);

    // Social Bar
    var socialBar = document.createElement('div');
    socialBar.className = 'team-social';

    socialLinks.forEach(function (link) {
      var platform = (link.title || link.textContent || '').toLowerCase().trim();
      var iconSVG  = SVG[platform] || SVG['facebook'];

      var a = document.createElement('a');
      a.href = link.href || '#';
      a.setAttribute('aria-label', platform);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.innerHTML = iconSVG;
      socialBar.appendChild(a);
    });

    card.appendChild(socialBar);
    return card;
  }

  // ── Process each teams-about block ──
  function initTeamsAboutBlock(block) {

    var rows = Array.prototype.filter.call(
      block.children,
      function (el) { return el.tagName === 'DIV'; }
    );

    // Row 0 = images, Row 1 = names/roles, Row 2 = social links
    if (rows.length < 3) {
      console.warn('teams-about: Expected 3 rows, found', rows.length);
      return;
    }

    var imageRow  = rows[0];
    var nameRow   = rows[1];
    var socialRow = rows[2];

    // Collect columns from each row
    var imageCols  = Array.prototype.filter.call(imageRow.children,  function(el){ return el.tagName === 'DIV'; });
    var nameCols   = Array.prototype.filter.call(nameRow.children,   function(el){ return el.tagName === 'DIV'; });
    var socialCols = Array.prototype.filter.call(socialRow.children, function(el){ return el.tagName === 'DIV'; });

    var count = imageCols.length;

    // Build grid
    var grid = document.createElement('div');
    grid.className = 'teams-grid ' + (count >= 4 ? 'cols-4' : 'cols-3');

    for (var i = 0; i < count; i++) {

      // Image
      var imgEl = imageCols[i] ? imageCols[i].querySelector('img') : null;

      // Name & Role
      var nameText = '';
      var roleText = '';
      if (nameCols[i]) {
        var nameP  = nameCols[i].querySelector('p');
        var nameH3 = nameCols[i].querySelector('h3');
        var roleH5 = nameCols[i].querySelector('h5');
        nameText = nameP  ? nameP.textContent.trim()
                 : nameH3 ? nameH3.textContent.trim()
                 : '';
        roleText = roleH5 ? roleH5.textContent.trim() : '';
      }

      // Social links
      var links = [];
      if (socialCols[i]) {
        links = Array.prototype.slice.call(socialCols[i].querySelectorAll('a'));
      }

      var card = buildCard(imgEl, nameText, roleText, links);
      grid.appendChild(card);
    }

    // Insert grid after the block, hide original rows
    block.parentNode.insertBefore(grid, block.nextSibling);
    block.style.display = 'none';

    console.log('teams-about: built ' + count + '-column grid (' + (count >= 4 ? 'cols-4' : 'cols-3') + ')');
  }

  // ── Init all teams-about blocks on page ──
  function init() {
    var blocks = document.querySelectorAll('.teams-about.block');
    if (!blocks.length) {
      console.warn('teams-about: No .teams-about.block found');
      return;
    }
    blocks.forEach(function (block) {
      initTeamsAboutBlock(block);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
