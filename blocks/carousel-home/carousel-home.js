export default function decorate(block) {
  const slides = [...block.children].filter((slide) => slide.querySelector('picture'));
  const total = slides.length;
 
  const frag = document.createDocumentFragment();
  const track = document.createElement('div');
  track.className = 'carousel-track';
 
  slides.forEach((slide, i) => {
    const [img, title, text, btn] = slide.children;
 
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.append(title, text, btn);
 
    slide.innerHTML = '';
    slide.append(img, card);
 
    const picture = slide.querySelector('picture');
    if (picture) {
      const imgEl = picture.querySelector('img');
      if (imgEl) {
        if (i === 0) {
          imgEl.loading = 'eager';
          imgEl.fetchPriority = 'high';
          imgEl.decoding = 'sync';
        } else {
          imgEl.loading = 'lazy';
          imgEl.decoding = 'async';
        }
      }
    }
 
    track.append(slide);
  });
 
  frag.append(track);
 
  const prev = document.createElement('div');
  prev.className = 'carousel-arrow prev';
  prev.textContent = '←';
  prev.setAttribute('role', 'button');
  prev.setAttribute('aria-label', 'Previous slide');
 
  const next = document.createElement('div');
  next.className = 'carousel-arrow next';
  next.textContent = '→';
  next.setAttribute('role', 'button');
  next.setAttribute('aria-label', 'Next slide');
 
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
 
  const dots = Array.from({ length: total }, (_, i) => {
    const dot = document.createElement('span');
    dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
    dotsContainer.append(dot);
    return dot;
  });
 
  frag.append(prev, next, dotsContainer);
  block.innerHTML = '';
  block.append(frag);
 
  let index = 0;
 
  function updateCarousel(newIndex) {
    dots[index].classList.remove('active');
    index = newIndex;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[index].classList.add('active');
  }
 
  // ── Auto-play every 3 seconds ──────────────────────────────────────
  let timer = setInterval(() => {
    updateCarousel((index + 1) % total);
  }, 3000);
 
  // Pause on hover, resume on leave
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => {
    timer = setInterval(() => updateCarousel((index + 1) % total), 4000);
  });
 
  // Event delegation — reset timer on manual interaction
  block.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) {
      clearInterval(timer);
      updateCarousel(dots.indexOf(dot));
      timer = setInterval(() => updateCarousel((index + 1) % total), 4000);
      return;
    }
    if (e.target.closest('.carousel-arrow.prev')) {
      clearInterval(timer);
      updateCarousel((index - 1 + total) % total);
      timer = setInterval(() => updateCarousel((index + 1) % total), 4000);
      return;
    }
    if (e.target.closest('.carousel-arrow.next')) {
      clearInterval(timer);
      updateCarousel((index + 1) % total);
      timer = setInterval(() => updateCarousel((index + 1) % total), 4000);
    }
  });
}