var row = block.querySelector(':scope > div');
var cols = row.querySelectorAll(':scope > div');

// Insert at TOP of container
container.insertBefore(bar, container.firstChild);

// Hide original raw block
block.style.display = 'none';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSignIn);
} else {
  initSignIn(); // DOM already ready, run immediately
}