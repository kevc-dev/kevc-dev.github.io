// ============================================
// MAIN.JS — Apple-inspired scroll animations
// ============================================

(function () {
  "use strict";

  // Mobile navigation toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector("header");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // ============================================
  // 1. SCROLL-TRIGGERED SECTION REVEALS
  // ============================================
  function initScrollReveals() {
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Don't unobserve — allows re-triggering if needed
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================
  // 2. HERO PARALLAX + SCALE EFFECT
  // ============================================
  function initHeroEffects() {
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");
    const h1 = document.querySelector(".hero h1");

    if (!hero || !heroContent) return;

    // Particle canvas background
    const canvas = document.createElement("canvas");
    canvas.classList.add("hero-particles");
    hero.insertBefore(canvas, hero.firstChild);
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.3 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 184, 0, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 184, 0, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    // Parallax + scale on scroll
    window.addEventListener(
      "scroll",
      () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);

        if (h1) {
          const scale = 1 - progress * 0.15;
          const opacity = 1 - progress * 0.6;
          h1.style.transform = `scale(${scale})`;
          h1.style.opacity = opacity;
        }

        if (heroImage) {
          heroImage.style.transform = `translateY(${progress * -40}px)`;
          heroImage.style.opacity = 1 - progress * 0.8;
        }

        if (heroContent) {
          heroContent.style.transform = `translateY(${progress * 30}px)`;
        }
      },
      { passive: true }
    );
  }

  // ============================================
  // 3. SCROLL-DRIVEN NUMBER COUNTERS
  // ============================================
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = "true";
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const suffixReveal = el.dataset.suffixReveal === "true";
      const duration = 2000;
      const start = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);

        // Hide suffix during counting if suffixReveal is set
        const showSuffix = suffixReveal ? (progress >= 1) : true;
        el.textContent =
          prefix + current.toLocaleString() + (showSuffix ? suffix : "");

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(update);
    }
  }

  // ============================================
  // 4. TEXT REVEAL ON SCROLL
  // ============================================
  function initTextReveal() {
    const revealTexts = document.querySelectorAll(".text-reveal");

    revealTexts.forEach((container) => {
      const text = container.textContent.trim();
      container.textContent = "";
      const words = text.split(/\s+/);

      words.forEach((word, i) => {
        const span = document.createElement("span");
        span.classList.add("reveal-word");
        span.textContent = word;
        span.style.transitionDelay = `${i * 0.03}s`;
        container.appendChild(span);
      });
    });

    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("text-revealed");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".text-reveal").forEach((el) =>
      textObserver.observe(el)
    );
  }

  // ============================================
  // 5. ANIMATED TIMELINE
  // ============================================
  function initTimeline() {
    const timeline = document.querySelector(".journey-timeline");
    if (!timeline) return;

    const timelineLine = timeline.querySelector(".timeline-progress-line");
    const dots = timeline.querySelectorAll(".timeline-dot");
    const items = timeline.querySelectorAll(".timeline-item");

    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Calculate how much of the timeline is visible
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(
              Math.max((windowHeight - rect.top) / (rect.height + windowHeight * 0.5), 0),
              1
            );

            if (timelineLine) {
              timelineLine.style.height = `${scrollProgress * 100}%`;
            }
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    timelineObserver.observe(timeline);

    // Scroll listener for fine-grained timeline progress
    window.addEventListener(
      "scroll",
      () => {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.min(
          Math.max((windowHeight - rect.top) / (rect.height + windowHeight * 0.3), 0),
          1
        );

        if (timelineLine) {
          timelineLine.style.height = `${scrollProgress * 100}%`;
        }

        // Activate dots and items based on their position
        dots.forEach((dot, i) => {
          const dotRect = dot.getBoundingClientRect();
          if (dotRect.top < windowHeight * 0.7) {
            dot.classList.add("active");
            if (items[i]) items[i].classList.add("revealed");
          }
        });
      },
      { passive: true }
    );
  }

  // ============================================
  // 5b. TIMELINE EXPANDABLE CARDS
  // ============================================
  function initTimelineExpand() {
    const cards = document.querySelectorAll(".timeline-expandable");
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    cards.forEach((card) => {
      // Click/tap to toggle (works on both desktop and mobile)
      card.addEventListener("click", (e) => {
        e.stopPropagation();

        // Close other open cards
        cards.forEach((other) => {
          if (other !== card) other.classList.remove("expanded");
        });

        card.classList.toggle("expanded");
      });

      // On desktop: also expand on hover
      if (!isTouchDevice) {
        let hoverTimeout;

        card.addEventListener("mouseenter", () => {
          hoverTimeout = setTimeout(() => {
            card.classList.add("expanded");
          }, 200);
        });

        card.addEventListener("mouseleave", () => {
          clearTimeout(hoverTimeout);
          // Only collapse on mouseleave if it wasn't explicitly clicked
          if (!card.dataset.clicked) {
            card.classList.remove("expanded");
          }
        });

        // Track explicit clicks to keep card open after mouse leaves
        card.addEventListener("click", () => {
          if (card.classList.contains("expanded")) {
            card.dataset.clicked = "true";
          } else {
            delete card.dataset.clicked;
          }
        });
      }
    });

    // Close cards when clicking outside
    document.addEventListener("click", () => {
      cards.forEach((card) => {
        card.classList.remove("expanded");
        delete card.dataset.clicked;
      });
    });
  }

  // ============================================
  // 6. HEADER SCROLL EFFECT
  // ============================================
  function initHeaderScroll() {
    window.addEventListener(
      "scroll",
      () => {
        const heroSection = document.querySelector(".hero");
        if (!heroSection) return;
        const heroHeight = heroSection.offsetHeight;

        if (window.scrollY > heroHeight * 0.9) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      },
      { passive: true }
    );
  }

  // ============================================
  // 7. SHAKE IMAGE
  // ============================================
  function initShakeImage() {
    const shakeImage = document.getElementById("shake-image");
    if (shakeImage) {
      shakeImage.classList.add("shake");
      shakeImage.addEventListener("mouseenter", function () {
        this.classList.add("shake");
      });
    }
  }

  // ============================================
  // 8. TYPEWRITER EFFECT
  // ============================================
  function initTypewriter() {
    const typewriterElement = document.querySelector(".typewriter");
    const typewriterContainer = document.querySelector(
      ".typewriter-container"
    );
    if (!typewriterElement || !typewriterContainer) return;

    const text = "kevc-dev";
    typewriterElement.textContent = text;
    const fullWidth = typewriterElement.offsetWidth;
    typewriterContainer.style.minWidth = fullWidth + "px";

    function typeWriter() {
      let displayText = "";
      let isTyping = true;
      let charIndex = 0;

      function updateText() {
        if (isTyping) {
          if (charIndex < text.length) {
            displayText += text.charAt(charIndex);
            typewriterElement.textContent = displayText;
            charIndex++;
            setTimeout(updateText, 150);
          } else {
            isTyping = false;
            setTimeout(updateText, 2000);
          }
        } else {
          if (charIndex > 0) {
            charIndex--;
            displayText = text.substring(0, charIndex);
            typewriterElement.textContent = displayText;
            setTimeout(updateText, 100);
          } else {
            isTyping = true;
            setTimeout(updateText, 1000);
          }
        }
      }

      updateText();
    }

    typeWriter();
  }

  // ============================================
  // 9. SMOOTH SECTION TRANSITIONS (gradient blends)
  // ============================================
  function initSectionTransitions() {
    const sections = document.querySelectorAll(".section, .focus-section");

    sections.forEach((section) => {
      const next = section.nextElementSibling;
      if (!next) return;

      const sectionBg = getComputedStyle(section).backgroundColor;
      const nextBg = getComputedStyle(next).backgroundColor;

      // Only add transition if colors differ
      if (sectionBg !== nextBg) {
        section.classList.add("has-transition");
      }
    });
  }

  // ============================================
  // 10. SKILL TAGS STAGGER ANIMATION
  // ============================================
  function initSkillTags() {
    const skillLists = document.querySelectorAll(".skill-list");

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll(".skill-tag");
            tags.forEach((tag, i) => {
              tag.style.transitionDelay = `${i * 0.05}s`;
              tag.classList.add("tag-revealed");
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    skillLists.forEach((list) => skillObserver.observe(list));
  }

  // ============================================
  // INIT ALL
  // ============================================
  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveals();
    initHeroEffects();
    initCounters();
    initTextReveal();
    initTimeline();
    initTimelineExpand();
    initHeaderScroll();
    initShakeImage();
    initTypewriter();
    initSectionTransitions();
    initSkillTags();
  });
})();
