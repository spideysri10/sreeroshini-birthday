// Canvas hearts animation
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let hearts = [];
class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 18 + 10;
    this.speed = Math.random() * 1.2 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#ff5e8e";
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, 0 - s/2);
    ctx.bezierCurveTo(-s, -s, -s, s/2, 0, s);
    ctx.bezierCurveTo(s, s/2, s, -s, 0, 0 - s/2);
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.y -= this.speed;
    this.rotation += this.rotationSpeed;
    if (this.y < -40) {
      this.y = canvas.height + 20;
      this.x = Math.random() * canvas.width;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (hearts.length < 60) hearts.push(new Heart());
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animate);
}
animate();

// Audio autoplay / unmute logic and small asset checks
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const unmuteBtn = document.getElementById('unmuteBtn');
  const photo = document.getElementById('photo');

  // Attempt to play (muted autoplay should succeed on modern browsers)
  if (audio) {
    audio.play().catch(err => {
      console.warn('Muted autoplay failed or was interrupted:', err);
      showUnmuteButton();
    });
  }

  // Try to unmute on first user gesture
  function tryUnmuteOnGesture() {
    if (!audio) return;
    audio.muted = false;
    audio.play().then(() => {
      hideUnmuteButton();
      console.log('Audio unmuted and playing after user gesture.');
    }).catch(err => {
      console.warn('Unmute/play blocked by browser:', err);
      audio.muted = true;
      showUnmuteButton();
    });
    // remove listeners after first attempt
    window.removeEventListener('click', tryUnmuteOnGesture);
    window.removeEventListener('touchstart', tryUnmuteOnGesture);
  }

  window.addEventListener('click', tryUnmuteOnGesture, { once: true });
  window.addEventListener('touchstart', tryUnmuteOnGesture, { once: true });

  // Unmute button fallback
  function showUnmuteButton() {
    if (!unmuteBtn) return;
    unmuteBtn.style.display = 'block';
    unmuteBtn.setAttribute('aria-hidden', 'false');
  }
  function hideUnmuteButton() {
    if (!unmuteBtn) return;
    unmuteBtn.style.display = 'none';
    unmuteBtn.setAttribute('aria-hidden', 'true');
  }

  if (unmuteBtn) {
    unmuteBtn.addEventListener('click', () => {
      if (!audio) return;
      audio.muted = false;
      audio.play().then(() => hideUnmuteButton())
      .catch(err => {
        console.error('Play failed after unmute click:', err);
      });
    });
  }

  // Image fallback logging
  if (photo) {
    photo.addEventListener('error', () => {
      console.error('Image failed to load:', photo.src);
      photo.alt = 'Image not available';
      photo.style.opacity = 0.6;
    });
  }

  // Audio error logging
  if (audio) {
    audio.addEventListener('error', (e) => {
      console.error('Audio failed to load or decode:', e);
    });
  }
});