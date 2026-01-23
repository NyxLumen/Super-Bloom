import "./style.css";
import gsap from "gsap";

// --- THE LOKI EFFECT ---

const targetText = document.querySelector("#loki-text");
const originalString = targetText.innerText; // "SUPER BLOOM"

// 1. Break the text into spans (one for each letter)
// We replace the plain text with HTML: <span>S</span><span>U</span>...
const letters = originalString
	.split("")
	.map((char) => {
		if (char === " ") return `<span class="char">&nbsp;</span>`; // Handle spaces
		return `<span class="char font-1">${char}</span>`;
	})
	.join("");

targetText.innerHTML = letters;

// 2. Select all the new spans
const chars = document.querySelectorAll(".char");
const fontClasses = [
	"font-1",
	"font-2",
	"font-3",
	"font-4",
	"font-5",
	"font-6",
	"font-7",
];

// 3. Randomizer Function
function shuffleFonts() {
	chars.forEach((char) => {
		// Only shuffle sometimes (random chance) to make it look glitchy, not chaotic
		if (Math.random() > 0.7) {
			// Pick a random font class
			const randomFont =
				fontClasses[Math.floor(Math.random() * fontClasses.length)];

			// Remove old font classes
			char.classList.remove(...fontClasses);

			// Add new one
			char.classList.add(randomFont);
		}
	});
}

// 4. Run the shuffle loop
// Loki intro is fast. Let's run it every 100ms.
const lokiInterval = setInterval(shuffleFonts, 100);

// Optional: Stop the chaos after 3 seconds and settle on one font?
// Or keep it running forever? (Let's keep it running for the vibe)

// --- ARTIST ANIMATION ---
// Simple float in for the artist card
gsap.from(".artist-showcase", {
	y: 100,
	opacity: 0,
	duration: 1.5,
	ease: "power2.out",
	delay: 0.5,
});
