/* Restrained scroll parallax for HMC/URU decorative motifs, plus a
   subtle drift on major headings. Three behaviours:
     [data-parallax="drift"]  hero track-bend motif drifts vertically,
                               tracking its own progress through the viewport
     [data-parallax="flow"]   URU movement-line dividers shift horizontally,
                               reading as the line flowing as you pass it
     h1.display/h2.display/h3.display in <main> drift a few px
                               vertically — much smaller amplitude than
                               the decorative motifs, so type stays legible
   Sets transform only (reveal.js only ever touches opacity on the
   same elements, so the two never fight). No-ops entirely under
   prefers-reduced-motion. */
(function () {
	"use strict";

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	var drifters = Array.prototype.slice.call(
		document.querySelectorAll('[data-parallax="drift"]')
	);
	var flows = Array.prototype.slice.call(
		document.querySelectorAll('[data-parallax="flow"]')
	);
	var textDrifters = Array.prototype.slice.call(
		document.querySelectorAll(
			"main h1.display, main h2.display, main h3.display"
		)
	);
	if (!drifters.length && !flows.length && !textDrifters.length) return;

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

		textDrifters.forEach(function (el) {
			var r = el.getBoundingClientRect();
			var progress = 1 - (r.top + r.height / 2) / (vh + r.height);
			var y = (progress * 16 - 8).toFixed(1);
			el.style.transform = "translateY(" + y + "px)";
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
