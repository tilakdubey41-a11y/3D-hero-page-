// --- 1. 3D Tilt Effect ---
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

// --- 2. Interactive Canvas Cloth Physics & Car Rendering ---
const canvas = document.getElementById('clothCanvas');
const ctx = canvas.getContext('2d');
const revealBadge = document.getElementById('revealBadge');

let width, height;
let isDragging = false;
let revealProgress = 0; // 0% to 100%

function resizeCanvas() {
  const rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  width = canvas.width;
  height = canvas.height;
  renderStage();
}

window.addEventListener('resize', resizeCanvas);

// Canvas-drawn Mustang Silhouette & Studio Environment
function drawMustang(isGold) {
  // Studio Gradient
  const bgGrad = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width*0.7);
  bgGrad.addColorStop(0, isGold ? '#1f1608' : '#111115');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Car Silhouette Studio Spotlights
  ctx.save();
  ctx.translate(width / 2, height / 2 + 20);

  // Body Outline
  ctx.beginPath();
  ctx.moveTo(-320, 40);
  ctx.quadraticCurveTo(-300, -20, -180, -35); // Front hood
  ctx.quadraticCurveTo(-80, -90, 40, -90);   // Roof
  ctx.quadraticCurveTo(180, -85, 280, 0);     // Fastback rear slope
  ctx.quadraticCurveTo(320, 20, 330, 50);    // Rear bumper
  ctx.lineTo(-320, 50);
  ctx.closePath();

  // Color fill
  const carGrad = ctx.createLinearGradient(-320, 0, 330, 0);
  if (isGold) {
    carGrad.addColorStop(0, '#e5a93c');
    carGrad.addColorStop(0.5, '#ffd275');
    carGrad.addColorStop(1, '#8a5810');
  } else {
    carGrad.addColorStop(0, '#4a4d55');
    carGrad.addColorStop(0.5, '#888c95');
    carGrad.addColorStop(1, '#22242a');
  }
  ctx.fillStyle = carGrad;
  ctx.fill();

  // Wheels
  ctx.fillStyle = '#08080a';
  ctx.beginPath();
  ctx.arc(-190, 50, 45, 0, Math.PI * 2);
  ctx.arc(190, 50, 45, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isGold ? '#e5a93c' : '#aaaaaa';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Windows & Highlights
  ctx.fillStyle = isGold ? '#fffae6' : '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(-70, -75);
  ctx.lineTo(30, -75);
  ctx.lineTo(110, -30);
  ctx.lineTo(-70, -30);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.restore();
}

function renderStage() {
  ctx.clearRect(0, 0, width, height);

  // 1. Base Layer: AI Color Graded Gold Mustang
  drawMustang(true);

  // 2. Top Layer: Cloth Covered / Monochromatic Car
  if (revealProgress < 100) {
    ctx.save();

    const revealX = (revealProgress / 100) * (width * 1.4);

    // Clip Unrevealed Portion
    ctx.beginPath();
    ctx.moveTo(revealX, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(Math.max(0, revealX - height * 0.5), height);
    ctx.closePath();
    ctx.clip();

    // Draw Dark Raw Covered Car
    drawMustang(false);

    // Fabric Texture Overlay / Crease Folds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    for (let i = -width; i < width * 2; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 150, height);
      ctx.stroke();
    }

    // Dynamic Peeling Fold Edge Highlight & Shadow
    const foldGrad = ctx.createLinearGradient(revealX - 25, 0, revealX + 25, 0);
    foldGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
    foldGrad.addColorStop(0.5, '#e5a93c');
    foldGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = foldGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  revealBadge.innerText = `${Math.min(100, Math.round(revealProgress))}% REVEALED`;
}

// Drag Interactions
function updateDrag(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  let percent = (x / width) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  revealProgress = percent;
  renderStage();
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  updateDrag(e.clientX);
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  updateDrag(e.clientX);
});

window.addEventListener('mouseup', () => { isDragging = false; });

canvas.addEventListener('touchstart', (e) => {
  isDragging = true;
  updateDrag(e.touches[0].clientX);
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  updateDrag(e.touches[0].clientX);
});

window.addEventListener('touchend', () => { isDragging = false; });

// Initial Render
setTimeout(resizeCanvas, 100);
