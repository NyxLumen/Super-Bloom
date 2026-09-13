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

const heroFlowerLeft = document.querySelector(".hero-flower--left");
const heroFlowerRight = document.querySelector(".hero-flower--right");
const heroFlowerAccent = document.querySelector(".hero-flower--accent");

if (heroFlowerLeft && heroFlowerRight && heroFlowerAccent) {
	/* Flower variants live in /public. Only a few are on stage at once; the
	   composition drifts between states so the framing keeps evolving. */
	const FLOWER_VARIANTS = [
		"flower.svg",
		"flower-rose.svg",
		"flower-with-line.svg",
		"flower-with-rounded-petals.svg",
	];

	const ACID = "var(--accent-acid)";
	const PINK = "var(--accent-pink)";

	// [variantIndex, colour] per anchor. The small bottom-right flower is
	// secondary, so it only rises in some states.
	const FLOWER_STATES = [
		{ left: [0, ACID], right: [0, PINK], accent: null },
		{ left: [1, PINK], right: [2, ACID], accent: [3, ACID] },
		{ left: [3, ACID], right: [1, PINK], accent: null },
		{ left: [2, PINK], right: [3, ACID], accent: [0, PINK] },
		{ left: [0, PINK], right: [1, ACID], accent: null },
	];

	const ACCENT_OPACITY = 0.75;
	const DWELL_MIN = 6.5;
	const DWELL_MAX = 9.5;
	const MORPH_MIN = 1.25;
	const MORPH_MAX = 1.7;

	const randomBetween = (min, max) => min + Math.random() * (max - min);

	const applyVariant = (layer, [variant, colour]) => {
		layer.style.setProperty("--flower-color", colour);
		const src = `url("/${FLOWER_VARIANTS[variant]}")`;
		layer.style.maskImage = src;
		layer.style.webkitMaskImage = src;
	};

	const createSlot = (element, initial) => {
		const layers = Array.from(
			element.querySelectorAll(".hero-flower__layer"),
		);
		applyVariant(layers[0], initial);
		gsap.set(layers[0], { opacity: 1, scale: 1, rotation: 0 });
		gsap.set(layers[1], { opacity: 0, scale: 1, rotation: 0 });
		return { element, layers, active: layers[0] };
	};

	// Cross-fade a slot onto its next variant: the outgoing flower drifts and
	// rotates out while the incoming one fades up underneath it, so the two
	// overlap briefly instead of one replacing the other outright.
	const morphSlot = (slot, next) => {
		const incoming = slot.active === slot.layers[0] ? slot.layers[1] : slot.layers[0];
		const outgoing = slot.active;

		applyVariant(incoming, next);

		// A previous cross-fade may still be in flight on these two layers.
		gsap.killTweensOf([incoming, outgoing]);

		const duration = randomBetween(MORPH_MIN, MORPH_MAX);

		gsap.to(outgoing, {
			opacity: 0,
			scale: 1.06,
			rotation: 6,
			duration,
			ease: "power2.inOut",
		});

		// fromTo resets both ends every time, so repeated states can't drift.
		// The incoming starts almost immediately and finishes sooner than the
		// outgoing, so the two overlap without dipping through a dim trough.
		gsap.fromTo(
			incoming,
			{ opacity: 0, scale: 0.93, rotation: -5 },
			{
				opacity: 1,
				scale: 1,
				rotation: 0,
				duration: duration * 0.8,
				delay: duration * 0.12,
				ease: "power2.inOut",
			},
		);

		slot.active = incoming;
	};

	const showAccent = (slot, next) => {
		// Kill only the opacity tween; the infinite ambient drift stays put.
		gsap.killTweensOf(slot.element, "opacity");
		gsap.to(slot.element, {
			opacity: ACCENT_OPACITY,
			duration: 1.4,
			ease: "power2.inOut",
		});
		morphSlot(slot, next);
	};

	const hideAccent = (slot) => {
		gsap.killTweensOf(slot.element, "opacity");
		gsap.to(slot.element, {
			opacity: 0,
			duration: 1.2,
			ease: "power2.inOut",
		});
	};

	const slots = {
		left: createSlot(heroFlowerLeft, FLOWER_STATES[0].left),
		right: createSlot(heroFlowerRight, FLOWER_STATES[0].right),
		accent: createSlot(heroFlowerAccent, [0, ACID]),
	};

	const startAmbientDrift = () => {
		gsap.to(heroFlowerLeft, {
			yPercent: -4,
			scale: 1.05,
			duration: 11,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});

		gsap.to(heroFlowerLeft, {
			xPercent: 1.5,
			rotation: "-=5",
			duration: 15,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});

		gsap.to(heroFlowerRight, {
			yPercent: 5,
			scale: 1.04,
			duration: 13,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});

		gsap.to(heroFlowerRight, {
			xPercent: -2,
			rotation: "+=7",
			duration: 17,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});

		gsap.to(heroFlowerAccent, {
			yPercent: -6,
			rotation: 9,
			duration: 14,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});
	};

	// Each step arms exactly one follow-up, so transitions never stack up.
	const startStateCycle = () => {
		let index = 0;

		const step = () => {
			index = (index + 1) % FLOWER_STATES.length;
			const state = FLOWER_STATES[index];

			morphSlot(slots.left, state.left);
			morphSlot(slots.right, state.right);

			if (state.accent) {
				showAccent(slots.accent, state.accent);
			} else {
				hideAccent(slots.accent);
			}

			// Fresh dwell each time keeps the rhythm from feeling metronomic.
			gsap.delayedCall(randomBetween(DWELL_MIN, DWELL_MAX), step);
		};

		gsap.delayedCall(randomBetween(DWELL_MIN, DWELL_MAX), step);
	};

	const flowerIntro = gsap.timeline({
		delay: 0.15,
		defaults: { ease: "power4.out" },
		onComplete: () => {
			startAmbientDrift();
			startStateCycle();
		},
	});

	flowerIntro
		.fromTo(
			heroFlowerLeft,
			{ xPercent: -55, yPercent: 60, rotation: -70, scale: 0.5, opacity: 0 },
			{
				xPercent: 0,
				yPercent: 0,
				rotation: -14,
				scale: 1,
				opacity: 0.9,
				duration: 1.9,
			},
			0,
		)
		.fromTo(
			heroFlowerRight,
			{ xPercent: 60, yPercent: -55, rotation: 65, scale: 0.5, opacity: 0 },
			{
				xPercent: 0,
				yPercent: 0,
				rotation: 18,
				scale: 1,
				opacity: 0.85,
				duration: 2.1,
			},
			0.15,
		);
}

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
