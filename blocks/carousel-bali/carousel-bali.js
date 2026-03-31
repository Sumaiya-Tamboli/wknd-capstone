// carousel-bali.js

export default function decorate(block) {
  // ── 1. Collect slides (rows with a <picture>) ─────────────────────────
  const rows = [...block.querySelectorAll(':scope > div')];
  const slideRows = rows.filter((row) => row.querySelector('picture'));

  if (!slideRows.length) return;

  // ── 2. Build slide track ──────────────────────────────────────────────
  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Image carousel');
  track.setAttribute('aria-live', 'polite');

  const slides = slideRows.map((row, i) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide${i === 0 ? ' active' : ''}`;
    slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${slideRows.length}`);

    const picture = row.querySelector('picture');
    const img = picture.querySelector('img');

    // LCP: first image eager + high priority, rest lazy
    if (i === 0) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.setAttribute('loading', 'lazy');
    }

    slide.appendChild(picture);
    return slide;
  });

  slides.forEach((slide) => track.appendChild(slide));

  // ── 3. Build controls ─────────────────────────────────────────────────
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  // Dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Slide navigation');

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dotsContainer.appendChild(dot);
    return dot;
  });

  // Nav: ← and → as plain unicode characters — no SVG
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '←';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '→';

  nav.append(prevBtn, nextBtn);
  controls.append(dotsContainer, nav);

  // ── 4. Replace block content ──────────────────────────────────────────
  block.innerHTML = '';
  block.append(track, controls);

  // ── 5. Transition logic ───────────────────────────────────────────────
  let current = 0;
  const total = slides.length;

  function goTo(index) {
    const prev = current;
    current = (index + total) % total;
    if (prev === current) return;

    slides[prev].classList.remove('active');
    slides[prev].setAttribute('aria-hidden', 'true');
    dots[prev].classList.remove('active');
    dots[prev].setAttribute('aria-selected', 'false');

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');

    track.setAttribute('aria-label', `Slide ${current + 1} of ${total}`);
  }

  // ── 6. Event listeners ────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) goTo(current + (delta > 0 ? 1 : -1));
  }, { passive: true });

  block.setAttribute('tabindex', '0');
}