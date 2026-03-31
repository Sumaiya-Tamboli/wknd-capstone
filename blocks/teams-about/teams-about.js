// teams-about.js

(function () {

  // ── Local Icon Paths ──
  var ICONS = {
    facebook: '/icons/facebook.svg',
    twitter:  '/icons/x.svg',        // using x.svg for Twitter
    instagram:'/icons/instagram.svg'
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
      var iconPath = ICONS[platform] || ICONS['facebook'];

      var a = document.createElement('a');
      a.href = link.href || '#';
      a.setAttribute('aria-label', platform);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');

      // Create image element for icon
      var img = document.createElement('img');
      img.src = iconPath;
      img.alt = platform;
      img.className = 'team-icon';

      a.appendChild(img);
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