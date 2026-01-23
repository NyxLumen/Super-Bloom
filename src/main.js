import "./style.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { minorArtists, headliners } from "./artists.js";

gsap.registerPlugin(ScrollTrigger);

const targetText = document.querySelector("#loki-text");
const fontClasses = [
	"font-1",
	"font-2",
	"font-3",
	"font-4",
	"font-5",
	"font-6",
	"font-7",
];

if (targetText) {
	const originalString = targetText.innerText;
	targetText.innerHTML = originalString
		.split("")
		.map((char) => {
			return char === " "
				? `<span class="char">&nbsp;</span>`
				: `<span class="char font-1">${char}</span>`;
		})
		.join("");

	const chars = document.querySelectorAll(".char");

	setInterval(() => {
		chars.forEach((char) => {
			if (Math.random() > 0.85) {
				const randomFont =
					fontClasses[Math.floor(Math.random() * fontClasses.length)];
				char.classList.remove(...fontClasses);
				char.classList.add(randomFont);
			}
		});
	}, 100);
}

// GSAP: Reveal Subtitle only
gsap.from(".hero-sub", {
	y: 20,
	opacity: 0,
	duration: 1,
	delay: 0.5,
	ease: "power3.out",
});
gsap.from(".countdown", {
	y: 20,
	opacity: 0,
	duration: 1,
	delay: 1.5,
	ease: "power3.out",
});

// --- 2. MINOR ARTISTS (Infinite Scroll Loop) ---
const minorTrack = document.getElementById("minor-track");

if (minorTrack) {
	const generateMinorCards = (list) =>
		list
			.map(
				(artist) => `
        <article class="minor-card">
            <img src="${artist.image}" alt="${artist.name}" loading="lazy">
            <div class="minor-overlay">
                <h4 class="minor-name">${artist.name}</h4>
                <p class="minor-genre">${artist.genre}</p>
            </div>
        </article>
    `,
			)
			.join("");

	// Inject cards TWICE to create the seamless loop illusion
	minorTrack.innerHTML =
		generateMinorCards(minorArtists) + generateMinorCards(minorArtists);

	// GSAP: Move the track infinitely to the left
	const loop = gsap.to(minorTrack, {
		xPercent: -50, // Move exactly half the width (the length of one set)
		ease: "none",
		duration: 30, // Adjust for speed
		repeat: -1,
	});
}

// --- 3. HEADLINERS (Cinematic Render) ---
const headlinerGrid = document.getElementById("headliner-grid");

if (headlinerGrid) {
	headlinerGrid.innerHTML = headliners
		.map(
			(artist) => `
        <article class="headliner-card">
            <video class="headliner-bg-video" autoplay muted loop playsinline>
                <source src="${artist.video}" type="video/mp4">
            </video>
            <div class="headliner-content">
                <img src="${artist.portrait}" alt="${artist.name}" class="headliner-portrait">
                <h3 class="headliner-name">${artist.name}</h3>
            </div>
        </article>
    `,
		)
		.join("");
}

gsap.from(".mission-section .mission-grid", {
	y: 50,
	opacity: 0,
	duration: 1,
	ease: "power2.out",
	scrollTrigger: {
		trigger: ".mission-section",
		start: "top 80%",
	},
});

// 2. Hype Section (Only target the grid inside hype-section)
gsap.from(".hype-section .mission-grid", {
	y: 50,
	opacity: 0,
	duration: 1,
	ease: "power2.out",
	scrollTrigger: {
		trigger: ".hype-section",
		start: "top 80%",
	},
});

// 3. Headliners
gsap.utils.toArray(".headliner-card").forEach((card) => {
	gsap.from(card.querySelector(".headliner-content"), {
		y: 100,
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		scrollTrigger: {
			trigger: card,
			start: "top 75%",
		},
	});
});

console.log("🌸 SUPER BLOOM: SYSTEM ONLINE");

// --- 4. COUNTDOWN TIMER ---
const targetDate = new Date("December 31, 2026 00:00:00").getTime();

const updateTimer = () => {
	const now = new Date().getTime();
	const distance = targetDate - now;

	// Time calculations
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Helper to add leading zeros (e.g. "9" -> "09")
	const format = (num) => (num < 10 ? `0${num}` : num);

	// Inject into DOM (Check if elements exist first)
	if (document.getElementById("days")) {
		document.getElementById("days").innerText = days;
		document.getElementById("hours").innerText = format(hours);
		document.getElementById("minutes").innerText = format(minutes);
		document.getElementById("seconds").innerText = format(seconds);
	}
};

// Run immediately, then every second
setInterval(updateTimer, 1000);
updateTimer();
