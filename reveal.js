(function () {
	"use strict";

	var prefersReduced = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReduced || !("IntersectionObserver" in window)) return;

	var roots = document.querySelectorAll("main, .site-foot");
	if (!roots.length) return;

	/* Repeating card/row components reveal as one block, so their
	   own heading/label children are NOT also queued separately —
	   see the closest() guard below. */
	var BLOCK_SELECTOR =
		".stat, .step, .person, .event-card, .tier, .run, .fact, .band__inner";
	var TEXT_SELECTOR =
		"h1.display, h2.display, h3.display, .lede, .prose > p, .note, .label, .cobrand, .hero__logo, .uru-logo, .route-map, address";

	var targets = [];

	roots.forEach(function (root) {
		root.querySelectorAll(BLOCK_SELECTOR).forEach(function (el) {
			targets.push(el);
		});
		root.querySelectorAll(TEXT_SELECTOR).forEach(function (el) {
			if (!el.closest(BLOCK_SELECTOR)) targets.push(el);
		});
	});

	if (!targets.length) return;

	targets.forEach(function (el) {
		el.classList.add("reveal");
	});

	var io = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					io.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
	);

	targets.forEach(function (el) {
		io.observe(el);
	});
})();
