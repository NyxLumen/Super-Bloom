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
		.map((char) =>
			char === " "
				? `<span class="char">&nbsp;</span>`
				: `<span class="char font-1">${char}</span>`,
		)
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

	minorTrack.innerHTML =
		generateMinorCards(minorArtists) + generateMinorCards(minorArtists);

	gsap.to(minorTrack, {
		xPercent: -50,
		ease: "none",
		duration: 30,
		repeat: -1,
	});
}

const headlinerGrid = document.getElementById("headliner-grid");

if (headlinerGrid) {
	headlinerGrid.innerHTML = headliners
		.map(
			(artist) => `
        <article class="headliner-card">
            <video 
                class="headliner-bg-video" 
                autoplay muted loop playsinline 
                preload="none"
                poster="${artist.portrait}"
            >
                <source src="${artist.video}" type="video/mp4">
            </video>
            <div class="headliner-content">
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

const targetDate = new Date("December 31, 2026 00:00:00").getTime();

const updateTimer = () => {
	const now = new Date().getTime();
	const distance = targetDate - now;

	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	const format = (num) => (num < 10 ? `0${num}` : num);

	if (document.getElementById("days")) {
		document.getElementById("days").innerText = days;
		document.getElementById("hours").innerText = format(hours);
		document.getElementById("minutes").innerText = format(minutes);
		document.getElementById("seconds").innerText = format(seconds);
	}
};

setInterval(updateTimer, 1000);
updateTimer();

const ticketForm = document.getElementById("ticket-form");

if (ticketForm) {
	ticketForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const btn = ticketForm.querySelector(".btn-submit");
		const input = ticketForm.querySelector(".signup-input");

		const originalText = btn.innerText;
		btn.innerText = "PROCESSING...";
		btn.style.opacity = "0.7";

		setTimeout(() => {
			btn.innerText = "ACCESS GRANTED";
			btn.style.background = "var(--accent-cyan)";
			btn.style.opacity = "1";
			input.value = "";
			input.placeholder = "SEE YOU IN 2026";
		}, 1500);
	});
}
