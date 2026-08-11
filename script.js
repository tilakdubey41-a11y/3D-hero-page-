// --- 1. Interactive 3D Card Tilt Effect ---
const stageContainer = document.getElementById('stageContainer');
const viewportCard = document.getElementById('viewportCard');

stageContainer.addEventListener('mousemove', (e) => {
  const rect = stageContainer.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  const rotateX = (-y / rect.height) * 12;
  const rotateY = (x / rect.width) * 12;

  viewportCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

stageContainer.addEventListener('mouseleave', () => {
  viewportCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// --- 2. Interactive Cloth Reveal Canvas Simulation ---
const canvas = document.getElementById('clothCanvas');
const ctx = canvas.getContext('2d');
const revealBadge = document.getElementById('revealBadge');

let width, height;
let isDragging = false;
let revealProgress = 0; // 0 to 100%

// Load monochrome stock image for the cloth sheet surface
const clothTexture = new Image();
clothTexture.crossOrigin = 'Anonymous';
clothTexture.src = 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1800&q=80';

function resizeCanvas() {
  const rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  width = canvas.width;
  height = canvas.height;
  drawCloth();
}

window.addEventListener('resize', resizeCanvas);

function drawCloth() {
  ctx.clearRect(0, 0, width, height);

  if (revealProgress < 100) {
    ctx.save();

    // Create dynamic diagonal peeling path for realistic sheet removal
    const revealX = (revealProgress / 100) * (width * 1.5);

    ctx.beginPath();
    ctx.moveTo(revealX, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(Math.max(0, revealX - height * 0.5), height);
    ctx.closePath();
    ctx.clip();

    // Draw monochromatic classic stock car (Representing cloth covered stage)
    ctx.filter = 'grayscale(100%) contrast(120%) brightness(0.65)';
    ctx.drawImage(clothTexture, 0, 0, width, height);
    ctx.filter = 'none';

    // Add Realistic Cloth Fold Highlight Line & Shadow Gradient
    const gradient = ctx.createLinearGradient(
      revealX - 30, 0, revealX + 30, 0
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  revealBadge.innerText = `${Math.min(100, Math.round(revealProgress))}% REVEALED`;
}

// Drag Handling
function handleDrag(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  let percent = (x / width) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  revealProgress = percent;
  drawCloth();
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  handleDrag(e.clientX);
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  handleDrag(e.clientX);
});

window.addEventListener('mouseup', () => { isDragging = false; });

// Touch support for mobile devices
canvas.addEventListener('touchstart', (e) => {
  isDragging = true;
  handleDrag(e.touches[0].clientX);
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  handleDrag(e.touches[0].clientX);
});

window.addEventListener('touchend', () => { isDragging = false; });

clothTexture.onload = () => {
  resizeCanvas();
};
