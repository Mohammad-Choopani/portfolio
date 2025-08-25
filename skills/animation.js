const img = document.getElementById("animation-frame");
const speedInput = document.getElementById("speed");

let currentFrame = 0;
const totalFrames = 10; // یا تعداد واقعی فریم‌ها
let intervalId = null;

function updateFrame() {
  img.src = `../assets/images/animation/frame${currentFrame + 1}.jpg`;
  currentFrame = (currentFrame + 1) % totalFrames;
}

function startAnimation(speed) {
  clearInterval(intervalId);
  intervalId = setInterval(updateFrame, speed);
}

speedInput.addEventListener("input", (e) => {
  const speed = parseInt(e.target.value, 10);
  startAnimation(speed);
});

// شروع اولیه
startAnimation(parseInt(speedInput.value, 10));
