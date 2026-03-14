
(function(){
  // Target the two <p>’s inside your block
  const bar = document.querySelector('.section.search-container .search.block > div > div');
  if(!bar) return;

  const signIn = bar.querySelector('p:nth-child(1)');
  const locale = bar.querySelector('p:nth-child(2)');

  // Improve semantics for screen readers
  if(signIn){
    signIn.setAttribute('role','link');
    signIn.setAttribute('tabindex','0');
    signIn.setAttribute('aria-label','Sign in');
    // TODO: hook click/Enter to your signin URL
    signIn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ /* window.location.href='/signin.html' */ }});
    signIn.addEventListener('click', (e)=>{ e.preventDefault(); /* window.location.href='/signin.html' */ });
  }

  if(locale){
    locale.setAttribute('role','button');
    locale.setAttribute('tabindex','0');
    locale.setAttribute('aria-haspopup','listbox');
    locale.setAttribute('aria-expanded','false');
    locale.setAttribute('aria-label','Change language');

    const open = () => {
      locale.classList.add('is-open');
      locale.setAttribute('aria-expanded','true');
      document.addEventListener('keydown', onEsc);
      document.addEventListener('click', onOutside, true);
    };
    const close = () => {
      locale.classList.remove('is-open');
      locale.setAttribute('aria-expanded','false');
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('click', onOutside, true);
    };
    const toggle = () => (locale.classList.contains('is-open') ? close() : open());
    const onEsc = (e) => { if(e.key === 'Escape') close(); };
    const onOutside = (e) => { if(!locale.contains(e.target)) close(); };

    locale.addEventListener('click', (e)=>{ e.preventDefault(); toggle(); });
    locale.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); } });

    // If you add a dropdown later, insert it next to 'locale' and show/hide on open/close.
  }
})();

