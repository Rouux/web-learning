function buildDot(color) {
	const dot = document.createElement('div');
	dot.classList.add('terminal-dot');
	dot.style.backgroundColor = color;
	return dot;
}

function buildTerminalButtons() {
	const dotsWrapper = document.createElement('div');
	dotsWrapper.classList.add('terminal-dots--wrapper');
	['red', 'orange', 'green'].forEach(color =>
		dotsWrapper.appendChild(buildDot(color))
	);
	return dotsWrapper;
}

document.addEventListener('DOMContentLoaded', () => {
	const terminals = document.getElementsByClassName('terminal');
	[...terminals].forEach(terminal => {
		const header = terminal.getElementsByClassName('terminal-header').item(0);
		header.insertBefore(buildTerminalButtons(), header.firstChild);
	});
});
