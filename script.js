async function initApp() {
	try {
		// 1. Fetch all 4 relational files at the same time
		const [pRes, sRes, rRes, tRes] = await Promise.all([
			fetch('prefixes.json'),
			fetch('suffixes.json'),
			fetch('roots.json'),
			fetch('terms.json')
		]);
		const prefixes = await pRes.json();
		const suffixes = await sRes.json();
		const roots = await rRes.json();
		const terms = await tRes.json();

		// Sorts terms from A to Z ignoring capitalization
		terms.sort((a, b) => a.word.localeCompare(b.word));

		// 2. Map datasets by ID for quick relational lookups
		const prefixMap = new Map(prefixes.map(p => [p.id, p]));
		const suffixMap = new Map(suffixes.map(s => [s.id, s]));
		const rootMap = new Map(roots.map(r => [r.id, r]));

		// 3. Generate HTML by stitching data structures together
		const container = document.getElementById('card-container');

		// 4. Render only terms that start with the given letter, or all if no letter given
		function renderTerms(letter = null) {
			const filtered = letter
				? terms.filter(term => term.word.toLowerCase().startsWith(letter.toLowerCase()))
				: terms;

			container.innerHTML = '';

			// Show message if no terms match the letter
			if (filtered.length === 0) {
				container.innerHTML = `<p>No terms found for "${letter}".</p>`;
				return;
			}

			filtered.forEach(term => {
				// Resolve relationships
				const prefix = prefixMap.get(term.prefixId);
				const root = rootMap.get(term.rootId);
				const suffix = suffixMap.get(term.suffixId);

				// Create UI card element
				const card = document.createElement('div');
				card.className = 'card';
				card.innerHTML = `
					<div class="word">${term.word}</div>
					<div class="definition">${term.definition}</div>
					<div class="breakdown">
						<div class="part"><span class="label">Prefix</span><strong>${prefix?.form || ''}</strong>: ${prefix?.meaning || 'N/A'}</div>
						<div class="part"><span class="label">Root</span><strong>${root?.form || ''}</strong>: ${root?.meaning || 'N/A'}</div>
						<div class="part"><span class="label">Suffix</span><strong>${suffix?.form || ''}</strong>: ${suffix?.meaning || 'N/A'}</div>
					</div>
				`;
				// Toggle breakdown section on click
				card.addEventListener('click', () => {
					card.querySelector('.breakdown').classList.toggle('active');
				});
				container.appendChild(card);
			});
		}

		// 5. Build the A–Z nav buttons
		const nav = document.getElementById('letter-nav');
		const allBtn = document.createElement('button');
		allBtn.textContent = 'All';
		allBtn.addEventListener('click', () => renderTerms());
		nav.appendChild(allBtn);

		'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
			const btn = document.createElement('button');
			btn.textContent = letter;
			btn.addEventListener('click', () => renderTerms(letter));
			nav.appendChild(btn);
		});

		// 6. Initial render (all terms)
		renderTerms();

	} catch (error) {
		document.getElementById('card-container').innerText = 'Error loading JSON files. Make sure you are running a local server.';
		console.error(error);
	}
}

initApp();