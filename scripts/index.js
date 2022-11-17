const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function writeInElementAtMilliseconds(text, element, time) {
	let index = 0;
	return new Promise(resolve => {
		const interval = setInterval(() => {
			element.textContent = text.substring(0, index++);
			if (index > text.length) {
				clearInterval(interval);
				resolve();
			}
		}, time);
	});
}

async function writeInElementInMilliseconds(text, element, time) {
	await writeInElementAtMilliseconds(text, element, time / text.length);
}

function buildTemplate(html) {
	html = html.trim();
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.firstChild;
}

function buildTerminal() {
	let html = `
	<div class="terminal">
		<div class="terminal-header">
			<div class="terminal-dots--wrapper">
				<div class="terminal-dot" style="background-color: red;"></div>
				<div class="terminal-dot" style="background-color: orange;"></div>
				<div class="terminal-dot" style="background-color: green;"></div>
			</div>
		</div>
		<div class="terminal-body"></div>
	</div>`;

	return buildTemplate(html);
}

async function writeInTerminalInMilliseconds(text, terminal, time) {
	const body = terminal.querySelector('.terminal-body');
	const p = document.createElement('p');
	body.appendChild(p);
	await writeInElementInMilliseconds(text, p, time);
	return p;
}

async function eraseContentAt(element, time = 20) {
	element.textContent = element.textContent.replace(/\s+/g, ' ').trim();
	return new Promise(resolve => {
		const interval = setInterval(() => {
			const length = element.textContent.length - 1;
			element.textContent = element.textContent.substring(0, length);
			if (length <= 0) {
				clearInterval(interval);
				resolve(element);
			}
		}, time);
	});
}

async function cleanupTerminal(terminal) {
	const ps = [...terminal.getElementsByTagName('p')].reverse();
	for (let index = 0; index < ps.length; index++) {
		const element = ps[index];
		await eraseContentAt(element, 25);
		element.remove();
	}
}

async function startGame() {
	const terminal = document.getElementById('initial-terminal');
	await cleanupTerminal(terminal);
	await writeInTerminalInMilliseconds('Who am I ?', terminal, 500);
	await writeInTerminalInMilliseconds('Hello / World', terminal, 500);
	const body = terminal.querySelector('.terminal-body');
	const template = buildTemplate(`
			<p>
				<button onclick="notVerySmart()">Hello</button>
				/
				<button onclick="notVerySmart()">World</button>
			</p>`);
	body.lastChild.remove();
	body.appendChild(template);
}

async function notVerySmart() {
	const terminal = document.getElementById('initial-terminal');
	await cleanupTerminal(terminal);
	await writeInTerminalInMilliseconds(
		'Not very smart I see ...',
		terminal,
		500
	);
	await writeInTerminalInMilliseconds(
		"Let's try something a bit easier",
		terminal,
		750
	);
	await writeInTerminalInMilliseconds("Who's the lowest ?", terminal, 500);
	await writeInTerminalInMilliseconds('2 / 3', terminal, 500);
	const body = terminal.querySelector('.terminal-body');
	const template = buildTemplate(`
			<p>
				<button onclick="bitEasier(2)">2</button>
				/
				<button onclick="bitEasier(3)">3</button>
			</p>`);
	body.lastChild.remove();
	body.appendChild(template);
}

async function bitEasier() {
	const terminal = document.getElementById('initial-terminal');
	await cleanupTerminal(terminal);
	await writeInTerminalInMilliseconds("Nah don't really care", terminal, 500);
	await sleep(1000);
	await writeInTerminalInMilliseconds('What now ?', terminal, 500);
	await sleep(1000);
	const redDot = terminal.querySelector('.terminal-dot');
	redDot.addEventListener('click', triedClosingMe);
	await writeInTerminalInMilliseconds(
		'Have you tried closing me atleast ? There is a red dot on my top left',
		terminal,
		500
	);
}

let iteration = 0;
async function triedClosingMe() {
	const terminal = document.getElementById('initial-terminal');
	switch (iteration) {
		case 0:
			await writeInTerminalInMilliseconds(
				'And you instantly click on it ?',
				terminal,
				500
			);
			await writeInTerminalInMilliseconds(
				'What if I was telling you to jump out of the windows ??',
				terminal,
				500
			);
			break;
		case 1:
			await writeInTerminalInMilliseconds(
				"Stop now, that's embarassing for the both of us",
				terminal,
				500
			);
			break;
		default:
			await writeInTerminalInMilliseconds(
				'You can stop that now, I need to go to sleep',
				terminal,
				500
			);
			break;
	}
	iteration++;
}

function closeTab() {
	window.close();
}
