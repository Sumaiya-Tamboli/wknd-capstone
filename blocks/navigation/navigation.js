(() => {
  const nav = document.querySelector('.navigation.block');
  if (!nav) return;

  const row = nav.querySelector(':scope > div:first-child');
  if (!row || row.children.length < 3) return;

  const logoCol   = row.children[0];
  const menuCol   = row.children[1];
  const searchCol = row.children[2];

  /* 1) Active state (yellow pill) */
  try{
    const here = window.location.pathname.replace(/\/+$/, '');
    let matched = false;
    menuCol.querySelectorAll('a[href]').forEach((a) => {
      try{
        const u = new URL(a.href, window.location.origin);
        const path = u.pathname.replace(/\/+$/, '');
        const exact   = path === here && path !== '';
        const section = path && here.startsWith(path) && (here.length === path.length || here.charAt(path.length) === '/');
        if(!matched && (exact || section)){ a.setAttribute('aria-current','page'); matched = true; }
      }catch{}
    });
  }catch{}

  /* 2) Burger for mobile (inserts before logo) */
  if(!logoCol.querySelector('.navigation__burger')){
    const burger = document.createElement('button');
    burger.className = 'navigation__burger';
    burger.type = 'button';
    burger.setAttribute('aria-label','Menu');
    burger.setAttribute('aria-expanded','false');
    burger.setAttribute('aria-controls','navigation-menu');
    burger.innerHTML = '<span aria-hidden="true"></span>';
    logoCol.prepend(burger);

    if(!menuCol.id) menuCol.id = 'navigation-menu';

    const open  = () => { menuCol.setAttribute('data-open','true');  burger.setAttribute('aria-expanded','true');  };
    const close = () => { menuCol.setAttribute('data-open','false'); burger.setAttribute('aria-expanded','false'); };
    const isOpen = () => menuCol.getAttribute('data-open') === 'true';

    burger.addEventListener('click', (e) => { e.stopPropagation(); isOpen() ? close() : open(); });
    document.addEventListener('click', (e) => { if(!row.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
  }

  /* 3) Make the "Search" pill clickable (placeholder) */
  const pill = searchCol.querySelector('p');
  if(pill){
    pill.setAttribute('role','button'); pill.setAttribute('tabindex','0');
    const openSearch = () => { /* hook your search overlay here */ };
    pill.addEventListener('click', openSearch);
    pill.addEventListener('keydown', (e) => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openSearch(); }});
  }
})();