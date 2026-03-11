/**
 * EDS carousel decorator
 * Turns your authored <picture> list into a WKND-like hero carousel.
 */
export default function decorate(block) {
  // Collect authored slides (any child that contains a <picture>)
  const rawSlides = [...block.children].filter((div) => div.querySelector('picture'));
  if (!rawSlides.length) return;

  // ------ Build structure: viewport -> track -> slides ------
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  viewport.appendChild(track);

  // Turn each authored <div> into .carousel-slide
  const slides = rawSlides.map((srcDiv) => {
    const wrap = document.createElement('div');
    wrap.className = 'carousel-slide';
    // move picture in
    const pic = srcDiv.querySelector('picture');
    wrap.appendChild(pic);
    return wrap;
  });

  slides.forEach((s) => track.appendChild(s));

  // Clear the block and inject our viewport
  block.innerHTML = '';
  block.appendChild(viewport);

  // ------ Caption Card (from wrapper data-*, or defaults) ------
  const wrapper = block.closest('.carousel-wrapper') || block.parentElement;
  const caption = document.createElement('div');
  caption.className = 'carousel-caption';

  const title = wrapper?.dataset?.title || 'WKND Adventures';
  const desc = wrapper?.dataset?.desc || 'Join us on one of our next adventures. Browse our list of curated experiences and sign up for one when you\'re ready to explore with us.';
  const ctaText = wrapper?.dataset?.ctaText || 'VIEW TRIPS';
  const ctaHref = wrapper?.dataset?.ctaHref || '#';

  caption.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <a class="cta" href="${ctaHref}">${ctaText}</a>
  `;
  block.appendChild(caption);

  // ------ Dots ------
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot';
    d.type = 'button';
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    return d;
  });
  block.appendChild(dotsWrap);

  // ------ Arrows ------
  const arrows = document.createElement('div');
  arrows.className = 'carousel-arrows';
  arrows.innerHTML = `
    <button class="carousel-arrow prev" aria-label="Previous slide" type="button">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <button class="carousel-arrow next" aria-label="Next slide" type="button">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
    </button>
  `;
  block.appendChild(arrows);

  const prevBtn = arrows.querySelector('.prev');
  const nextBtn = arrows.querySelector('.next');

  // ------ State & navigation ------
  let index = 0;
  const last = slides.length - 1;

  function update() {
    const offset = -index * viewport.clientWidth;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(last, i));
    update();
    // lazy-load images on demand if needed
    const img = slides[index].querySelector('img[loading="lazy"]');
    if (img && img.dataset && img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
  }

  function next() { goTo(index === last ? 0 : index + 1); }
  function prev() { goTo(index === 0 ? last : index - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Keyboard support when focus is inside the carousel
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
  });
  block.setAttribute('tabindex', '0'); // make focusable for keyboard

  // Resize handling for correct width transforms
  const ro = new ResizeObserver(() => update());
  ro.observe(viewport);

  // Optional: Auto-play (comment out if not needed)
  let timer = setInterval(next, 7000);
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => { timer = setInterval(next, 7000); });

  // Start
  goTo(0);
}