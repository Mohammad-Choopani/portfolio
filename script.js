document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar hamburger toggle ---
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("show");

      if (navList.classList.contains("show")) {
        navList.removeAttribute("hidden");
      } else {
        navList.setAttribute("hidden", "");
      }
    });
    
      // --- Scrollspy ---
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  // کمک: پیدا کردن لینک مربوط به یک سکشن
  const linkFor = (id) => navLinks.find(a => a.getAttribute("href") === `#${id}`);

  // به خاطر منوی sticky، کمی offset می‌دیم:
  const navHeight = document.querySelector(".main-nav")?.offsetHeight || 64;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linkFor(id);
      if (!link) return;

      // وقتی سکشن به اندازه کافی داخل ویو هست فعال کن
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, {
    root: null,
    threshold: 0.6,            // 60% از سکشن دیده بشه
    rootMargin: `-${navHeight}px 0px -40% 0px`
  });

  sections.forEach(sec => observer.observe(sec));


    // Smooth scroll for navigation links + close menu on click
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("href").substring(1);
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        navList.classList.remove("show");
        navList.setAttribute("hidden", "");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Contact form validation (frontend) ---
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (form && formMessage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "red";
        return;
      }

      if (!validateEmail(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "red";
        return;
      }

      formMessage.textContent = "Sending...";
      formMessage.style.color = "black";

      // Simulated send
      setTimeout(() => {
        formMessage.textContent = "Thanks for contacting me! I’ll respond soon.";
        form.reset();
        formMessage.style.color = "green";
      }, 1200);
    });
  }

  // --- Current year in footer ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Moving light on submit button ---
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener("mousemove", (e) => {
      const rect = submitBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      submitBtn.style.setProperty("--x", `${x}px`);
      submitBtn.style.setProperty("--y", `${y}px`);
    });
  }

  // --- Particles.js init (single, optimized) ---
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 160, density: { enable: true, value_area: 1000 } },
        color: { value: ["#ffffff", "#88f2ff", "#ffccff"] },
        shape: { type: ["circle", "edge"], stroke: { width: 0, color: "#000" } },
        opacity: { value: 0.8, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.2, sync: false } },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 1 },
        move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // --- Helpers ---
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('SW registered', reg.scope))
      .catch(err => console.error('SW register failed', err));
  });
}
