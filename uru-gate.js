(function () {
	"use strict";

	var gate = document.getElementById("uru-gate");
	if (!gate || sessionStorage.getItem("uruGateUnlocked") === "1") return;

	var panel = gate.querySelector(".uru-gate__panel");
	var choices = gate.querySelectorAll(".uru-gate__choice");
	var feedback = document.getElementById("uru-gate-feedback");
	var result = document.getElementById("uru-gate-result");

	function playPop() {
		try {
			var Ctx = window.AudioContext || window.webkitAudioContext;
			var ctx = new Ctx();
			var osc = ctx.createOscillator();
			var gain = ctx.createGain();
			osc.type = "square";
			osc.frequency.setValueAtTime(220, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
			gain.gain.setValueAtTime(0.15, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.2);
		} catch (e) {
			/* Web Audio unavailable — the visual glitch still plays without it */
		}
	}

	function unlock() {
		sessionStorage.setItem("uruGateUnlocked", "1");
		playPop();
		gate.classList.add("is-unlocking");

		panel
			.querySelectorAll(
				".uru-gate__title, .uru-gate__prompt, .uru-gate__riddle, .uru-gate__choices, .uru-gate__feedback"
			)
			.forEach(function (el) {
				el.hidden = true;
			});
		result.hidden = false;

		setTimeout(function () {
			gate.classList.add("is-fading");
			document.body.classList.remove("uru-gate-active");
		}, 900);

		setTimeout(function () {
			gate.style.display = "none";
		}, 1500);
	}

	choices.forEach(function (btn) {
		btn.addEventListener("click", function () {
			if (btn.getAttribute("data-correct") === "true") {
				unlock();
				return;
			}
			feedback.textContent = "Not quite — try again.";
			btn.classList.add("is-wrong");
			setTimeout(function () {
				btn.classList.remove("is-wrong");
			}, 500);
		});
	});
})();
