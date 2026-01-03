const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 15 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.5;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ff5e8e";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x - this.size/2, this.y - this.size/2, this.x - this.size, this.y + this.size/3, this.x, this.y + this.size);
    ctx.bezierCurveTo(this.x + this.size, this.y + this.size/3, this.x + this.size/2, this.y - this.size/2, this.x, this.y);
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.y -= this.speed;
    if (this.y < -10) this.y = canvas.height + 10;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (hearts.length < 50) hearts.push(new Heart());
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animate);
}
animate();

// --- Additional small checks and handlers to help if assets fail to load ---

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const photo = document.getElementById('photo');

  // Image load fallback
  if (photo) {
    photo.addEventListener('error', () => {
      console.error('Image failed to load:', photo.src);
      photo.alt = 'Image not available';
      photo.style.opacity = 0.6;
    });
  }

  // Log audio load/playback issues
  if (audio) {
    audio.addEventListener('error', (e) => {
      console.error('Audio failed to load or decode:', e);
    });
    audio.addEventListener('play', () => {
      console.log('Audio playback started');
    });
  }
});