(function () {
	"use strict";

	var modal = document.getElementById("reg-modal");
	if (!modal) return;

	var agree = document.getElementById("reg-modal-agree");
	var continueBtn = document.getElementById("reg-modal-continue");
	var closeBtn = document.getElementById("reg-modal-close");
	var registerLinks = document.querySelectorAll("a.js-register");
	var pendingHref = null;
	var lastFocused = null;

	function openModal(href) {
		pendingHref = href;
		agree.checked = false;
		continueBtn.disabled = true;
		lastFocused = document.activeElement;
		modal.hidden = false;
		document.body.classList.add("reg-modal-active");
		closeBtn.focus();
	}

	function closeModal() {
		modal.hidden = true;
		pendingHref = null;
		document.body.classList.remove("reg-modal-active");
		if (lastFocused && typeof lastFocused.focus === "function") {
			lastFocused.focus();
		}
	}

	for (var i = 0; i < registerLinks.length; i++) {
		registerLinks[i].addEventListener("click", function (e) {
			e.preventDefault();
			openModal(this.getAttribute("href"));
		});
	}

	agree.addEventListener("change", function () {
		continueBtn.disabled = !agree.checked;
	});

	continueBtn.addEventListener("click", function () {
		if (!agree.checked || !pendingHref) return;
		window.open(pendingHref, "_blank", "noopener");
		closeModal();
	});

	closeBtn.addEventListener("click", closeModal);

	modal.addEventListener("click", function (e) {
		if (e.target === modal) closeModal();
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && !modal.hidden) closeModal();
	});
})();
