document.addEventListener("DOMContentLoaded", () => {

  const heroVideo  = document.getElementById('hero-video');
  const heroScroll = document.getElementById('hero-scroll');
  const heroReveal = document.getElementById('hero-reveal');
  const heroText   = document.getElementById('hero-text');
  const scrollHint = document.getElementById('scrollHint');
  const nav        = document.getElementById('nav');

  const TRIGGER = 0.52;

  if (!heroVideo || !heroScroll) return;

  let videoReady = false;

  heroVideo.addEventListener("loadedmetadata", () => {
    videoReady = true;

    heroVideo.play().then(() => {
      heroVideo.pause();
    }).catch(() => {});
  });

  function getHeroProgress() {
    const rect = heroScroll.getBoundingClientRect();
    const scrollable = heroScroll.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    return Math.max(0, Math.min(1, scrolled / scrollable));
  }

  function heroLoop() {
    requestAnimationFrame(heroLoop);

    const progress = getHeroProgress();

    if (videoReady && heroVideo.duration) {
      const targetTime = progress * heroVideo.duration;

      if (Math.abs(heroVideo.currentTime - targetTime) > 0.03) {
        heroVideo.currentTime = targetTime;
      }
    }

    if (progress >= TRIGGER) {
      heroReveal?.classList.add('visible');
      heroText && (heroText.style.opacity = '0');
      heroVideo.style.opacity = '0';
      scrollHint && (scrollHint.style.opacity = '0');
    } else {
      heroReveal?.classList.remove('visible');
      heroText && (heroText.style.opacity = '1');
      heroVideo.style.opacity = '1';
      scrollHint && (scrollHint.style.opacity = progress < 0.08 ? '1' : '0');
    }
  }

  heroLoop();

  /* NAV SCROLL */
  window.addEventListener('scroll', () => {
    if (!nav || !heroScroll) return;

    const pastHero = window.scrollY > (heroScroll.offsetHeight - window.innerHeight);
    nav.classList.toggle('scrolled', pastHero);
  });

});

/* REVEAL ANIMATION (only once) */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

/* MOBILE MENU */
const menu = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
const links = document.querySelectorAll(".nav-links a");

function toggleMenu(){
  menu.classList.toggle("show");
  menuBtn.innerHTML = menu.classList.contains("show") ? "✖" : "☰";
}

links.forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("show");
    menuBtn.innerHTML = "☰";
  });
});
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
    menu.classList.remove("show");
    menuBtn.innerHTML = "☰";
  }
});
