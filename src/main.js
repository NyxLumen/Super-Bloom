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

// GSAP: Animate Headliner Content on Scroll
gsap.utils.toArray(".headliner-card").forEach((card) => {
	gsap.from(card.querySelector(".headliner-content"), {
		y: 100,
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		scrollTrigger: {
			trigger: card,
			start: "top 75%", // Animation starts when card is 75% down the viewport
		},
	});
});

console.log("🌸 SUPER BLOOM: SYSTEM ONLINE");
