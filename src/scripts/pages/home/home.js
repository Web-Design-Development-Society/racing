import { DONATE_URL } from '../../constants.js';

/* --- JavaScript Functionality --- */
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const carouselContainer = document.querySelector('.carousel-container');

let currentSlide = 0;
const totalSlides = slides.length;
const slideInterval = 5000; // 5 seconds
let autoSlideTimer;

// Function to move the carousel and update the active dot
function updateCarousel() {
	// Calculate the distance to move the track (e.g., 0%, -100%, -200%)
	const offset = -currentSlide * 100;
	track.style.transform = `translateX(${offset}%)`;

	// Update the active dot state
	const dots = document.querySelectorAll('.indicator-dot');
	dots.forEach((dot) => dot.classList.remove('active'));
	if (dots[currentSlide]) {
		dots[currentSlide].classList.add('active');
	}
}

// Function to generate the dots and add click listeners
function createIndicators() {
	slides.forEach((slide, index) => {
		const dot = document.createElement('span');
		dot.classList.add('indicator-dot');
		dot.dataset.slideIndex = index;

		dot.addEventListener('click', (e) => {
			stopAutoSlide();
			// Set the current slide based on the dot's data attribute
			currentSlide = parseInt(e.target.dataset.slideIndex);
			updateCarousel();
			startAutoSlide();
		});

		indicatorsContainer.appendChild(dot);
	});
}

// Function to automatically advance the slide
function nextSlide() {
	// Wrap around: if we are on the last slide, go back to the first (0)
	currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
	updateCarousel();
}

// Function to start the automatic sliding
function startAutoSlide() {
	autoSlideTimer = setInterval(nextSlide, slideInterval);
}

// Function to stop the automatic sliding
function stopAutoSlide() {
	clearInterval(autoSlideTimer);
}

// Event listener for the 'Next' button
nextButton.addEventListener('click', () => {
	stopAutoSlide();
	nextSlide();
	startAutoSlide();
});

// Event listener for the 'Previous' button
prevButton.addEventListener('click', () => {
	stopAutoSlide();
	// Wrap around: if we are on the first slide, go to the last
	currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
	updateCarousel();
	startAutoSlide();
});

function initDonateBtn() {
	document.querySelector('.donate-btn').href = DONATE_URL;
}

// --- Initialization ---
export function initCarousel() {
	createIndicators();
	startAutoSlide();
	updateCarousel(); // Set initial state (position and active dot)
	initDonateBtn();
}
