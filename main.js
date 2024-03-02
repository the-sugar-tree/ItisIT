document.body.addEventListener("mousemove", (evt) => {
	const mouseX = evt.clientX;
	const mouseY = evt.clientY;

	gsap.set(".cursor", {
		x: mouseX,
		y: mouseY,
	});
});

window.addEventListener("keydown", (text) => {
	let t = text.key.toUpperCase();
	let k = document.querySelector(`#${t}`);
    if(k) {
        k.classList.add("key-pressed");
    }
});

window.addEventListener("keyup", (text) => {
	let t = text.key.toUpperCase();
	let k = document.querySelector(`#${t}`);
    if(k) {
        k.classList.remove("key-pressed");
    }
});

