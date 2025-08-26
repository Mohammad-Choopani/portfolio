// script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ------------------ Navbar hamburger toggle ------------------ */
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  if (hamburger && navList) {
    const closeMenu = () => {
      navList.classList.remove("show");
      navList.setAttribute("hidden", "");
      hamburger.setAttribute("aria-expanded", "false");
    };

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

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("show")) return;
      const clickedInside =
        e.target === navList ||
        navList.contains(e.target) ||
        e.target === hamburger ||
        hamburger.contains(e.target);
      if (!clickedInside) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    /* ------------------ Scrollspy ------------------ */
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const linkFor = (id) => navLinks.find((a) => a.getAttribute("href") === `#${id}`);
    const navHeight = document.querySelector(".main-nav")?.offsetHeight || 64;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = linkFor(id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { root: null, threshold: 0.6, rootMargin: `-${navHeight}px 0px -40% 0px` }
    );

    sections.forEach((sec) => observer.observe(sec));

    // Smooth scroll + close menu on click
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("href").substring(1);
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        closeMenu();
      });
    });
  }

  /* ------------------ Contact form (real submit) ------------------ */
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const submitBtn =
    document.getElementById("contact-submit") ||
    (form ? form.querySelector('button[type="submit"]') : null);

  if (form && formMessage && submitBtn) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name?.value.trim() || "";
      const email = form.email?.value.trim() || "";
      const message = form.message?.value.trim() || "";
      const honeypot = form.querySelector('input[name="_gotcha"]');

      // Bot trap
      if (honeypot && honeypot.value) return;

      // Basic validation
      if (!name || !email || !message) {
        setMsg("Please fill in all fields.", "red");
        return;
      }
      if (!isValidEmail(email)) {
        setMsg("Please enter a valid email address.", "red");
        return;
      }

      // Ensure endpoint exists (Formspree action on the <form>)
      if (!form.action) {
        setMsg("Form endpoint missing. Set <form action='https://formspree.io/f/xldwekay'>.", "red");
        return;
      }

      // Prepare data for Formspree
      const data = new FormData(form);
      if (!data.has("_replyto")) data.set("_replyto", email);
      if (!data.has("_subject")) data.set("_subject", "New message from portfolio");

      // UI state
      submitBtn.disabled = true;
      form.setAttribute("aria-busy", "true");
      setMsg("Sending...", "black");

      try {
        const res = await fetch(form.action, {
          method: form.method || "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          setMsg("Thanks! Your message has been sent.", "green");
        } else {
          let errText = "Something went wrong. Please try again.";
          try {
            const j = await res.json();
            if (j?.errors?.length) errText = j.errors[0].message;
          } catch {}
          setMsg(errText, "red");
        }
      } catch {
        setMsg("Network error — please try again.", "red");
      } finally {
        submitBtn.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });

    function setMsg(text, color) {
      formMessage.textContent = text;
      formMessage.style.color = color;
    }
  }

  /* ------------------ Current year ------------------ */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ------------------ Button hover light ------------------ */
  const submitBtnEl = document.querySelector('button[type="submit"]');
  if (submitBtnEl) {
    submitBtnEl.addEventListener("mousemove", (e) => {
      const rect = submitBtnEl.getBoundingClientRect();
      submitBtnEl.style.setProperty("--x", `${e.clientX - rect.left}px`);
      submitBtnEl.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  }

  /* ------------------ Particles.js init ------------------ */
  try {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced && window.particlesJS) {
      particlesJS("particles-js", {
        particles: {
          number: { value: 160, density: { enable: true, value_area: 1000 } },
          color: { value: ["#ffffff", "#88f2ff", "#ffccff"] },
          shape: { type: ["circle", "edge"], stroke: { width: 0, color: "#000" } },
          opacity: { value: 0.8, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.2, sync: false } },
          size: { value: 2.5, random: true },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 1 },
          move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false },
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } },
        },
        retina_detect: true,
      });
    }
  } catch (e) {
    console.warn("Particles init skipped:", e);
  }

  /* ------------------ Helpers ------------------ */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});

/* ------------------ Service Worker (PWA) ------------------ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW register failed:", err));
  });
}
