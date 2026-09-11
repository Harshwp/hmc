/* Restrained scroll parallax for HMC/URU decorative motifs only —
   never applied to type or layout. Two behaviours:
     [data-parallax="drift"]  hero track-bend motif drifts vertically,
                               tracking its own progress through the viewport
     [data-parallax="flow"]   URU movement-line dividers shift horizontally,
                               reading as the line flowing as you pass it
   No-ops entirely under prefers-reduced-motion. */
(function () {
	"use strict";

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	var drifters = Array.prototype.slice.call(
		document.querySelectorAll('[data-parallax="drift"]')
	);
	var flows = Array.prototype.slice.call(
		document.querySelectorAll('[data-parallax="flow"]')
	);
	if (!drifters.length && !flows.length) return;

	var ticking = false;

	function update() {
		var vh = window.innerHeight;

		drifters.forEach(function (el) {
			var host = el.parentElement.getBoundingClientRect();
			var progress = 1 - (host.top + host.height / 2) / (vh + host.height);
			var y = (progress * 44 - 22).toFixed(1);
			el.style.transform = "translateY(" + y + "px)";
		});

		flows.forEach(function (el) {
			var r = el.getBoundingClientRect();
			var x = ((vh - r.top) * 0.12).toFixed(1);
			el.style.backgroundPositionX = x + "px";
		});

		ticking = false;
	}

	function onScroll() {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
	update();
})();
