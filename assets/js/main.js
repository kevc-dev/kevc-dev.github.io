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

// Scroll event listener for header color change
window.addEventListener("scroll", () => {
  // Get the hero section
  const heroSection = document.querySelector(".hero");
  const heroHeight = heroSection.offsetHeight;

  // Check if we've scrolled past the hero section
  // We'll change the header when the hero is at least 90% scrolled out of view
  if (window.scrollY > heroHeight * 0.9) {
    // We've scrolled past the hero section, change to yellow
    header.classList.add("scrolled");
  } else {
    // We're still in the hero section, keep it black
    header.classList.remove("scrolled");
  }
});

// Make sure DOM is loaded before adding shake event
document.addEventListener("DOMContentLoaded", function () {
  const shakeImage = document.getElementById("shake-image");

  // Check if the image exists before trying to add classes to it
  if (shakeImage) {
    // Add the shake class initially
    shakeImage.classList.add("shake");

    // Optional: Add event listeners to control the animation
    shakeImage.addEventListener("mouseenter", function () {
      this.classList.add("shake");
    });

    shakeImage.addEventListener("mouseleave", function () {
      // Keep the shake effect or remove it on mouse leave
      // Uncomment the next line if you want to stop the animation when mouse leaves
      // this.classList.remove('shake');
    });
  }
});

// Typewriter effect script
document.addEventListener("DOMContentLoaded", function () {
  const typewriterElement = document.querySelector(".typewriter");
  const typewriterContainer = document.querySelector(".typewriter-container");
  const text = "kevc-dev";

  // Calculate the width of the full text once
  typewriterElement.textContent = text;
  const fullWidth = typewriterElement.offsetWidth;
  typewriterContainer.style.minWidth = fullWidth + "px";

  function typeWriter() {
    let displayText = "";
    let isTyping = true;
    let charIndex = 0;

    function updateText() {
      if (isTyping) {
        // Typing phase
        if (charIndex < text.length) {
          displayText += text.charAt(charIndex);
          typewriterElement.textContent = displayText;
          charIndex++;
          setTimeout(updateText, 150);
        } else {
          // Pause at the end of typing
          isTyping = false;
          setTimeout(updateText, 2000);
        }
      } else {
        // Erasing phase
        if (charIndex > 0) {
          charIndex--;
          displayText = text.substring(0, charIndex);
          typewriterElement.textContent = displayText;
          setTimeout(updateText, 100);
        } else {
          // Start typing again
          isTyping = true;
          setTimeout(updateText, 1000);
        }
      }
    }

    updateText();
  }

  // Start the animation
  typeWriter();
});
