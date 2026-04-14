import "./style.css";
import Experience from "./Experience/Experience.js";
import GSAP from "gsap";

// get our fontawesome imports
const experience = new Experience(document.querySelector(".experience-canvas"));

const inkCursor = document.querySelector(".ink-cursor");

if (inkCursor) {
	const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
	let lastX = null;
	let lastY = null;
	let moveTimer;
	let cursorIsMoving = false;
	let currentGazeX = 0;
	let currentGazeY = 0;
	let clearTimer;

	const brushPalette = [
		{ r: 20, g: 184, b: 109 },
		{ r: 0, g: 184, b: 212 },
		{ r: 99, g: 102, b: 241 },
		{ r: 236, g: 72, b: 153 },
		{ r: 249, g: 115, b: 22 },
		{ r: 18, g: 18, b: 18 },
	];
	let colorIndex = 0;
	let activeBrush = brushPalette[colorIndex];

	const rgba = (color, alpha) =>
		`rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

	const applyCursorColor = () => {
		const alpha = cursorIsMoving ? 0.52 : 0.96;
		inkCursor.style.setProperty(
			"--ink-cursor-color",
			`rgba(${activeBrush.r}, ${activeBrush.g}, ${activeBrush.b}, ${alpha})`
		);
		inkCursor.style.setProperty(
			"--ink-cursor-shadow",
			`0 0 0 2px ${rgba(activeBrush, cursorIsMoving ? 0.12 : 0.2)}, 0 0 14px ${rgba(
				activeBrush,
				cursorIsMoving ? 0.18 : 0.32
			)}`
		);
	};

	applyCursorColor();

	window.addEventListener("pointerdown", () => {
		colorIndex = (colorIndex + 1) % brushPalette.length;
		activeBrush = brushPalette[colorIndex];
		applyCursorColor();
	});

	const setCursorGaze = (dx, dy) => {
		const magnitude = Math.hypot(dx, dy) || 1;
		const maxOffset = 1.4;
		currentGazeX = (dx / magnitude) * maxOffset;
		currentGazeY = (dy / magnitude) * maxOffset;
		inkCursor.style.setProperty("--gaze-x", currentGazeX.toFixed(2));
		inkCursor.style.setProperty("--gaze-y", currentGazeY.toFixed(2));
	};

	if (!isTouchDevice) {
		window.addEventListener("mousemove", (event) => {
			const now = performance.now();
			inkCursor.style.opacity = "1";

			const dx = lastX === null ? 0 : event.clientX - lastX;
			const dy = lastY === null ? 0 : event.clientY - lastY;
			const speed = Math.hypot(dx, dy);
			setCursorGaze(dx, dy);

			GSAP.to(inkCursor, {
				x: event.clientX,
				y: event.clientY,
				scale: speed > 2 ? 3.0 : 1,
				opacity: 1,
				duration: 0.08,
				ease: "power2.out",
			});

			cursorIsMoving = speed > 0.2;
			applyCursorColor();

			inkCursor.classList.toggle("moving", cursorIsMoving);
			clearTimeout(moveTimer);
			moveTimer = setTimeout(() => {
				cursorIsMoving = false;
				applyCursorColor();
				inkCursor.classList.remove("moving");
				GSAP.to(inkCursor, {
					scale: 1,
					opacity: 1,
					duration: 0.16,
					ease: "power2.out",
				});
			}, 70);

			lastX = event.clientX;
			lastY = event.clientY;
		});

		window.addEventListener("mouseleave", () => {
			inkCursor.style.opacity = "0";
			inkCursor.classList.remove("moving");
			cursorIsMoving = false;
			applyCursorColor();
			GSAP.to(inkCursor, { scale: 1, opacity: 0, duration: 0.12, ease: "power2.out" });
			lastX = null;
			lastY = null;
		});

		window.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
		window.addEventListener("touchmove", (event) => {
			const touch = event.touches[0];
			if (!touch) {
				return;
			}

			const dx = lastX === null ? 0 : touch.clientX - lastX;
			const dy = lastY === null ? 0 : touch.clientY - lastY;
			const speed = Math.hypot(dx, dy);
			setCursorGaze(dx, dy);

			GSAP.to(inkCursor, {
				x: touch.clientX,
				y: touch.clientY,
				scale: speed > 2 ? 3.0 : 1,
				opacity: 1,
				duration: 0.08,
				ease: "power2.out",
			});

			cursorIsMoving = speed > 0.2;
			applyCursorColor();
			inkCursor.classList.toggle("moving", cursorIsMoving);

			clearTimeout(moveTimer);
			moveTimer = setTimeout(() => {
				cursorIsMoving = false;
				applyCursorColor();
				inkCursor.classList.remove("moving");
				GSAP.to(inkCursor, {
					scale: 1,
					opacity: 1,
					duration: 0.16,
					ease: "power2.out",
				});
			}, 70);

			lastX = touch.clientX;
			lastY = touch.clientY;
		}, { passive: true });

		window.addEventListener("touchend", () => {
			lastX = null;
			lastY = null;
		}, { passive: true });
	}
}
