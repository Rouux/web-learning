/**
 * @typedef {{iterations: number, run: (terminal: HTMLDivElement, ...args: unknown[]) => Promise<unknown>}} State
 */

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function writeInElementAt(text, element, ms = 0) {
	let index = 0;
	return new Promise(resolve => {
		const interval = setInterval(() => {
			element.textContent = text.substring(0, index++);
			if (index > text.length) {
				clearInterval(interval);
				resolve();
			}
		}, ms);
	});
}

async function writeInElementIn(text, element, ms = 0) {
	await writeInElementAt(text, element, ms / text.length);
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
			<button class="terminal-dot" style="background-color: red;"></button>
			<button class="terminal-dot" style="background-color: orange;"></button>
			<button class="terminal-dot" style="background-color: green;"></button>
			</div>
		</div>
		<div class="terminal-body"></div>
	</div>`;

	return buildTemplate(html);
}

async function writeInTerminal(text, terminal, ms = 0) {
	const paragraph = document.createElement('p');
	terminal.querySelector('.terminal-body').appendChild(paragraph);
	return writeInElementIn(text, paragraph, ms).then(() => paragraph);
}

async function writeTemplateInTerminal(html, terminal, ms = 0) {
	const template = buildTemplate(html);
	const text = template.textContent.replace(/\s+/g, ' ').trim();
	return writeInTerminal(text, terminal, ms).then(paragraph => {
		paragraph.replaceWith(template);
		return paragraph;
	});
}

async function eraseContentAt(element, ms = 20) {
	element.textContent = element.textContent.replace(/\s+/g, ' ').trim();
	return new Promise(resolve => {
		const interval = setInterval(() => {
			const length = element.textContent.length - 1;
			element.textContent = element.textContent.substring(0, length);
			if (length <= 0) {
				clearInterval(interval);
				resolve(element);
			}
		}, ms);
	});
}

async function cleanupTerminalParagraph(paragraph) {
	return eraseContentAt(paragraph, 25).then(() => paragraph.remove());
}

async function cleanupTerminal(terminal) {
	const ps = [...terminal.getElementsByTagName('p')].reverse();
	for (let index = 0; index < ps.length; index++) {
		await cleanupTerminalParagraph(ps[index]);
	}
}

function closeTab() {
	window.close();
}

/**
 * @typedef {Object.<string, State>} Game
 * @type {Object.<string, State>}
 */
const GAME = {
	START_GAME: {
		iterations: 0,
		run: async function (terminal) {
			await cleanupTerminal(terminal)
				.then(() => writeInTerminal('Who am I ?', terminal, 500))
				.then(() =>
					writeTemplateInTerminal(
						`<p><button onclick="playState('NOT_VERY_SMART')">Hello</button>
						| <button onclick="playState('NOT_VERY_SMART')">World</button></p>`,
						terminal,
						500
					)
				);
			this.iterations++;
		}
	},
	NOT_VERY_SMART: {
		iterations: 0,
		run: async function (terminal) {
			await cleanupTerminal(terminal)
				.then(() => writeInTerminal('Not very smart I see ...', terminal, 500))
				.then(() =>
					writeInTerminal("Let's try something a bit easier", terminal, 700)
				)
				.then(() => writeInTerminal("Who's the lowest ?", terminal, 500))
				.then(() =>
					writeTemplateInTerminal(
						`<p><button onclick="playState('BIT_EASIER')">2</button>
						| <button onclick="playState('BIT_EASIER')">3</button></p>`,
						terminal,
						500
					)
				);
			this.iterations++;
		}
	},
	BIT_EASIER: {
		iterations: 0,
		run: async function (terminal) {
			await cleanupTerminal(terminal)
				.then(() => writeInTerminal("Nah don't really care", terminal, 500))
				.then(() => sleep(1000))
				.then(() => writeInTerminal('What now ?', terminal, 500))
				.then(() => sleep(1000))
				.then(() => {
					const redDot = terminal.querySelector('.terminal-dot');
					redDot.addEventListener('click', () =>
						GAME.TRIED_CLOSING_ME.run(terminal)
					);
					return writeInTerminal(
						'Have you tried closing me atleast ? There is a red dot on my top left',
						terminal,
						500
					);
				});
			this.iterations++;
		}
	},
	TRIED_CLOSING_ME: {
		iterations: 0,
		run: async function (terminal) {
			switch (this.iterations) {
				case 0:
					await writeInTerminal(
						'And you instantly click on it ?',
						terminal,
						500
					);
					await writeInTerminal(
						'What if I was telling you to jump out of the windows ??',
						terminal,
						500
					);
					break;
				case 1:
					await writeInTerminal(
						"Stop now, that's embarassing for the both of us",
						terminal,
						500
					);
					break;
				default:
					await writeInTerminal(
						'You can stop that now, I need to go to sleep',
						terminal,
						500
					);
					break;
			}
			this.iterations++;
		}
	}
};

/**
 * @param {keyof Game} state
 * @param  {...any} args
 * @returns
 */
async function playState(state, ...args) {
	const terminal = document.getElementById('initial-terminal');
	return GAME[state].run(terminal, ...args);
}
