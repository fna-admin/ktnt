// Mobile Menu Toggle
const mobileMenu = document.querySelector(".nav-bar");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Testimonial Slider
const track = document.querySelector(".testimonial-track");
const cards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentIndex = 0;
let cardWidth;

function updateCardWidth() {
  cardWidth =
    cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
}

function updateSlider() {
  updateCardWidth();
  const maxTranslate =
    (cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth)) *
    cardWidth;
  let translateX = currentIndex * cardWidth;

  // Prevent sliding beyond the last card
  if (translateX > maxTranslate) {
    translateX = maxTranslate;
    currentIndex = Math.floor(maxTranslate / cardWidth);
  }

  track.style.transform = `translateX(-${translateX}px)`;

  // Update button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = translateX >= maxTranslate;
}

prevBtn.addEventListener("click", () => {
  currentIndex = Math.max(currentIndex - 1, 0);
  updateSlider();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateSlider();
});

// Initialize slider and update on window resize
window.addEventListener("load", updateSlider);
window.addEventListener("resize", updateSlider);

// Form Handling
const form = document.getElementById("contactForm");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      if (response.status == 200) {
        result.innerHTML = "Our Team Will Contact You Soon !";
        result.classList.add("success");
        form.reset();
      } else {
        const json = await response.json();
        result.innerHTML = json.message;
        result.classList.add("error");
      }
    })
    .catch((error) => {
      result.innerHTML = "Something went wrong!";
      result.classList.add("error");
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      // Clear success/error message after 3 seconds
      setTimeout(() => {
        result.innerHTML = "";
        result.classList.remove("success", "error");
      }, 3000);
    });
});
