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

const heroFlowerPrimary = document.querySelector(".hero-flower--primary");
const heroFlowerSecondary = document.querySelector(".hero-flower--secondary");
const heroFlowerTertiary = document.querySelector(".hero-flower--tertiary");

if (heroFlowerPrimary && heroFlowerSecondary && heroFlowerTertiary) {
	/* Flower variants live in /public. Two — occasionally three — are on stage
	   at a time, and every state re-composes them onto a different pair of
	   edges, so the frame around the typography keeps re-forming. */
	const FLOWER_VARIANTS = [
		"flower.svg",
		"flower-rose.svg",
		"flower-with-line.svg",
		"flower-with-rounded-petals.svg",
	];

	const ACID = "var(--accent-acid)";
	const PINK = "var(--accent-pink)";

	/* Edge positions are the flower's *centre* as a percentage of the hero, so
	   0 / 100 land exactly on an edge with half the flower cropped and pushing
	   the value further out crops more. That is what gives each state its own
	   silhouette.
	   The vertical values are not arbitrary: the navigation's black atmosphere
	   veils roughly the top 140px, and the headline plus subtitle occupy a band
	   through the middle that flowers must stay clear of. So the top slots sit
	   just below the atmosphere, the side slots sit in the clear band below the
	   subtitle, and small flowers only ever appear near the bottom where they
	   are actually legible. */
	const EDGES = {
		upperLeft: { left: -3, top: 6 },
		upperRight: { left: 97, top: 11 },
		leftEdge: { left: -5, top: 3 },
		rightEdge: { left: 103, top: 79 },
		bottomLeft: { left: 5, top: 95 },
		bottomRight: { left: 95, top: 92 },
		bottomCenter: { left: 50, top: 104 },
	};

	/* variant indexes FLOWER_VARIANTS, scale is relative to the slot's base
	   width, rotation is the resting angle. Between them the states vary
	   position, crop, size, angle, variant, colour and flower count. */
	const STATES = [
		{
			primary: {
				edge: "bottomLeft",
				variant: 0,
				color: ACID,
				scale: 1,
				rotation: -12,
			},
			secondary: {
				edge: "upperRight",
				variant: 1,
				color: PINK,
				scale: 0.62,
				rotation: 20,
			},
		},
		{
			primary: {
				edge: "leftEdge",
				variant: 2,
				color: PINK,
				scale: 0.9,
				rotation: 8,
			},
			secondary: {
				edge: "bottomRight",
				variant: 3,
				color: ACID,
				scale: 0.8,
				rotation: -26,
			},
		},
		{
			primary: {
				edge: "upperLeft",
				variant: 1,
				color: ACID,
				scale: 0.85,
				rotation: 14,
			},
			secondary: {
				edge: "rightEdge",
				variant: 0,
				color: PINK,
				scale: 0.66,
				rotation: -18,
			},
		},
		{
			primary: {
				edge: "bottomCenter",
				variant: 2,
				color: ACID,
				scale: 0.85,
				rotation: 6,
			},
			secondary: {
				edge: "upperRight",
				variant: 3,
				color: PINK,
				scale: 0.55,
				rotation: -22,
			},
		},
		{
			primary: {
				edge: "leftEdge",
				variant: 3,
				color: ACID,
				scale: 0.95,
				rotation: -10,
			},
			secondary: {
				edge: "bottomLeft",
				variant: 0,
				color: PINK,
				scale: 0.52,
				rotation: 28,
			},
			tertiary: {
				edge: "rightEdge",
				variant: 1,
				color: PINK,
				scale: 0.44,
				rotation: -14,
			},
		},
		{
			primary: {
				edge: "upperLeft",
				variant: 0,
				color: PINK,
				scale: 0.72,
				rotation: -20,
			},
			secondary: {
				edge: "bottomRight",
				variant: 2,
				color: ACID,
				scale: 0.95,
				rotation: 12,
			},
			tertiary: {
				edge: "bottomLeft",
				variant: 3,
				color: ACID,
				scale: 0.38,
				rotation: 24,
			},
		},
	];

	/* The navigation's black atmosphere is taller on small screens (190px) while
	   the flowers there are far smaller, so the top edges need pushing down or
	   they dissolve into the gradient instead of reading as flowers. */
	const topNudge = window.innerWidth <= 767 ? 17 : 0;
	const edgeFor = (name) => {
		const e = EDGES[name];
		return e.top < 50 ? { left: e.left, top: e.top + topNudge } : e;
	};

	const SLOT_OPACITY = { primary: 0.92, secondary: 0.85, tertiary: 0.72 };

	/* Half-ranges, so each flower travels ±value — and every slot gets its own
	   set of periods so nothing ever breathes in unison.
	   Rotation is deliberately the widest and slowest channel. A wide, very
	   low-frequency swing reads as a flower turning in a current, where a small
	   fast one would read as a twitch. It rides on the float wrapper, so it adds
	   to the base angle the layer holds for each state instead of overwriting
	   it — and because the two live on separate elements, the transition's own
	   rotation never has to fight the drift. */
	const AMBIENT = {
		primary: {
			y: 11,
			x: 8,
			rotation: 9,
			scale: 0.03,
			yDur: 5.2,
			xDur: 8.4,
			rotationDur: 11.5,
			scaleDur: 6.4,
		},
		secondary: {
			y: 12,
			x: 6,
			rotation: 12,
			scale: 0.026,
			yDur: 6.1,
			xDur: 7.1,
			rotationDur: 13.8,
			scaleDur: 7.3,
		},
		tertiary: {
			y: 9,
			x: 5,
			rotation: 15,
			scale: 0.032,
			yDur: 4.6,
			xDur: 6.6,
			rotationDur: 10.2,
			scaleDur: 5.6,
		},
	};

	const DWELL_MIN = 4.2;
	const DWELL_MAX = 5.8;
	const MORPH_MIN = 0.95;
	const MORPH_MAX = 1.2;

	const randomBetween = (min, max) => min + Math.random() * (max - min);

	const applyVariant = (layer, variant, colour) => {
		layer.style.setProperty("--flower-color", colour);
		const src = `url("/${FLOWER_VARIANTS[variant]}")`;
		layer.style.maskImage = src;
		layer.style.webkitMaskImage = src;
	};

	/* Which way is "off screen" for a given edge. Used to launch the incoming
	   flower from outside its new edge and to push the outgoing one further
	   out — motion always reads as born from an edge, never across the hero. */
	const outward = (edge) => ({
		xPercent: edge.left < 50 ? -16 : edge.left > 50 ? 16 : 0,
		yPercent: edge.top < 50 ? -16 : edge.top > 50 ? 16 : 0,
	});

	const createSlot = (element, name, initial) => {
		const layers = Array.from(element.querySelectorAll(".hero-flower__layer"));
		const edge = edgeFor(initial.edge);

		// Static half of the slot's transform: centre the flower on its edge
		// coordinate. Nothing else ever writes to it.
		gsap.set(element, { xPercent: -50, yPercent: -50 });
		applyVariant(layers[0], initial.variant, initial.color);
		gsap.set(layers[0], {
			opacity: 1,
			scale: initial.scale,
			rotation: initial.rotation,
			xPercent: 0,
			yPercent: 0,
		});
		gsap.set(layers[1], {
			opacity: 0,
			scale: initial.scale,
			rotation: initial.rotation,
		});
		gsap.set(element, { left: `${edge.left}%`, top: `${edge.top}%` });

		return {
			name,
			element,
			float: element.querySelector(".hero-flower__float"),
			layers,
			active: layers[0],
			edge: initial.edge,
			timeline: null,
		};
	};

	/* The slot's own transform is only ever the static centring offset, so the
	   ambient drift can own it outright without fighting anything else. */
	const startAmbient = (slot) => {
		const { float, name } = slot;
		const a = AMBIENT[name];

		const drift = (from, to, duration) => {
			const tween = gsap.fromTo(float, from, {
				...to,
				duration,
				ease: "sine.inOut",
				repeat: -1,
				yoyo: true,
			});
			// Drop each property at a random point in its own cycle, so the
			// three flowers never settle into step with one another.
			tween.progress(Math.random());
		};

		drift({ y: -a.y }, { y: a.y }, a.yDur);
		drift({ x: -a.x }, { x: a.x }, a.xDur);
		drift({ rotation: -a.rotation }, { rotation: a.rotation }, a.rotationDur);
		drift({ scale: 1 - a.scale }, { scale: 1 + a.scale }, a.scaleDur);
	};

	/* Cross-fade a slot onto its next variant *and* its next edge. The outgoing
	   flower dissolves outwards off the edge it was on, the slot travels while
	   almost nothing is on screen, then the incoming flower materialises from
	   just outside its new edge. The viewer reads a re-composing frame rather
	   than a flower flying across the hero. */
	const morphSlot = (slot, next) => {
		const incoming =
			slot.active === slot.layers[0] ? slot.layers[1] : slot.layers[0];
		const outgoing = slot.active;
		const edge = edgeFor(next.edge);

		applyVariant(incoming, next.variant, next.color);

		// A previous morph may still be in flight — drop it before starting so
		// transitions can never pile up.
		if (slot.timeline) slot.timeline.kill();
		gsap.killTweensOf([incoming, outgoing]);

		const d = randomBetween(MORPH_MIN, MORPH_MAX);
		const from = outward(edgeFor(slot.edge));
		const into = outward(edge);

		slot.timeline = gsap
			.timeline()
			.to(
				outgoing,
				{
					opacity: 0,
					xPercent: from.xPercent * 0.6,
					yPercent: from.yPercent * 0.6,
					scale: "*=1.05",
					rotation: "+=6",
					duration: d * 0.45,
					ease: "power2.in",
				},
				0,
			)
			// Re-position once the outgoing flower is fully dark and before the
			// incoming one starts. Tweening between edges instead would drag a
			// half-visible flower straight across the middle of the hero — the
			// one thing the framing must never do.
			.set(
				slot.element,
				{ left: `${edge.left}%`, top: `${edge.top}%` },
				d * 0.46,
			)
			// fromTo pins both ends, so a repeated state can never drift.
			.fromTo(
				incoming,
				{
					opacity: 0,
					xPercent: into.xPercent,
					yPercent: into.yPercent,
					scale: next.scale * 0.88,
					rotation: next.rotation - 9,
				},
				{
					opacity: 1,
					xPercent: 0,
					yPercent: 0,
					scale: next.scale,
					rotation: next.rotation,
					duration: d * 0.58,
					ease: "power2.out",
				},
				d * 0.5,
			);

		slot.active = incoming;
		slot.edge = next.edge;
	};

	// Property-scoped, so the infinite ambient tweens on the float survive.
	const fadeSlot = (slot, value, duration) => {
		gsap.killTweensOf(slot.element, "opacity");
		gsap.to(slot.element, {
			opacity: value,
			duration,
			ease: "power2.inOut",
		});
	};

	const slots = [
		createSlot(heroFlowerPrimary, "primary", STATES[0].primary),
		createSlot(heroFlowerSecondary, "secondary", STATES[0].secondary),
		createSlot(heroFlowerTertiary, "tertiary", STATES[4].tertiary),
	];

	// Each step arms exactly one follow-up, so the cycle never stacks up.
	const startStateCycle = () => {
		let index = 0;

		const step = () => {
			index = (index + 1) % STATES.length;
			const state = STATES[index];

			slots.forEach((slot) => {
				const next = state[slot.name];

				if (!next) {
					// Only the tertiary ever sits a state out.
					if (slot.name === "tertiary") fadeSlot(slot, 0, 0.9);
					return;
				}

				if (slot.name === "tertiary") {
					fadeSlot(slot, SLOT_OPACITY.tertiary, 1.1);
				}
				morphSlot(slot, next);
			});

			// A fresh dwell each time keeps the rhythm from turning metronomic.
			gsap.delayedCall(randomBetween(DWELL_MIN, DWELL_MAX), step);
		};

		gsap.delayedCall(randomBetween(DWELL_MIN, DWELL_MAX), step);
	};

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		// Park the opening composition and leave it: no drift, no cycling.
		slots.forEach((slot) => {
			const next = STATES[0][slot.name];
			if (!next) return;

			applyVariant(slot.active, next.variant, next.color);
			gsap.set(slot.active, {
				opacity: 1,
				scale: next.scale,
				rotation: next.rotation,
				xPercent: 0,
				yPercent: 0,
			});
			const parked = edgeFor(next.edge);
			gsap.set(slot.element, {
				left: `${parked.left}%`,
				top: `${parked.top}%`,
				opacity: SLOT_OPACITY[slot.name],
			});
			slot.edge = next.edge;
		});
	} else {
		const flowerIntro = gsap.timeline({
			delay: 0.15,
			defaults: { ease: "power4.out" },
			onComplete: () => {
				slots.forEach(startAmbient);
				startStateCycle();
			},
		});

		slots.forEach((slot, i) => {
			const next = STATES[0][slot.name];
			// The tertiary has no place in the opening composition.
			if (!next) return;

			const edge = edgeFor(next.edge);
			const out = outward(edge);
			const at = i * 0.16;

			// Begin further out than the state's edge, then settle onto it.
			gsap.set(slot.element, {
				left: `${edge.left + out.xPercent * 0.3}%`,
				top: `${edge.top + out.yPercent * 0.3}%`,
			});
			gsap.set(slot.active, {
				xPercent: out.xPercent,
				yPercent: out.yPercent,
				scale: next.scale * 0.85,
				rotation: next.rotation - 14,
			});

			flowerIntro
				.to(
					slot.element,
					{
						left: `${edge.left}%`,
						top: `${edge.top}%`,
						opacity: SLOT_OPACITY[slot.name],
						duration: 1.9,
					},
					at,
				)
				.to(
					slot.active,
					{
						xPercent: 0,
						yPercent: 0,
						scale: next.scale,
						rotation: next.rotation,
						duration: 1.9,
					},
					at,
				);
		});
	}
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

/* --- Scroll indicator ----------------------------------------------------
   The native scrollbar is hidden in CSS but still does all the scrolling, so
   wheel / trackpad / keyboard / touch / Home / End are untouched. This pill
   only reports position, and on a fine pointer can be dragged like a real one. */
const scrollPill = document.querySelector(".scroll-pill");

if (scrollPill) {
	// Long pages give a proportionally long pill; short ones stay grabbable.
	const MIN_HEIGHT = 64;
	let maxScroll = 0;
	let travel = 0;
	let dragging = null;
	let queued = false;

	const measure = () => {
		const docHeight = document.documentElement.scrollHeight;
		const viewport = window.innerHeight;
		maxScroll = docHeight - viewport;

		const thumb = Math.max(
			MIN_HEIGHT,
			Math.min(viewport, (viewport / docHeight) * viewport),
		);
		// Distance the pill's top edge may move before its bottom hits the fold.
		travel = viewport - thumb;

		scrollPill.style.height = `${thumb}px`;
		// Nothing to indicate on a page that already fits on screen.
		scrollPill.style.opacity = maxScroll > 1 ? "1" : "0";
	};

	const render = () => {
		if (maxScroll <= 0) return;
		const y = travel > 0 ? (window.scrollY / maxScroll) * travel : 0;
		scrollPill.style.transform = `translate3d(0, ${y}px, 0)`;
	};

	// Scroll fires far more often than the screen refreshes; coalesce to a frame.
	const schedule = (remeasure) => {
		if (queued) return;
		queued = true;
		requestAnimationFrame(() => {
			queued = false;
			if (remeasure) measure();
			render();
		});
	};

	scrollPill.addEventListener("pointerdown", (e) => {
		if (maxScroll <= 0) return;
		dragging = { startY: e.clientY, startScroll: window.scrollY };
		scrollPill.classList.add("is-dragging");
		// Keeps the drag alive once the cursor leaves the 5px pill. Capture can
		// throw for a pointer the browser no longer considers active; the drag
		// itself still works without it, so never let that become an error.
		try {
			scrollPill.setPointerCapture(e.pointerId);
		} catch {
			/* pointer already gone — nothing to capture */
		}
		e.preventDefault();
	});

	scrollPill.addEventListener("pointermove", (e) => {
		if (!dragging || travel <= 0) return;
		// Map pill travel back onto document travel, so the pill keeps up with
		// the cursor rather than drifting away from it on long pages.
		const delta = (e.clientY - dragging.startY) * (maxScroll / travel);
		window.scrollTo(0, dragging.startScroll + delta);
	});

	const endDrag = (e) => {
		if (!dragging) return;
		dragging = null;
		scrollPill.classList.remove("is-dragging");
		if (scrollPill.hasPointerCapture(e.pointerId)) {
			scrollPill.releasePointerCapture(e.pointerId);
		}
	};

	scrollPill.addEventListener("pointerup", endDrag);
	scrollPill.addEventListener("pointercancel", endDrag);

	window.addEventListener("scroll", () => schedule(false), { passive: true });
	window.addEventListener("resize", () => schedule(true), { passive: true });

	// Fonts and lazy images settle after first paint and change the page height.
	window.addEventListener("load", () => schedule(true));
	if (document.fonts) document.fonts.ready.then(() => schedule(true));

	measure();
	render();
}
