// Shared data store — loaded once, reused everywhere
const AppData = (() => {
	let cache = null;

	async function load() {
		if (cache) return cache; // Return cached data if already loaded

		const [pRes, sRes, rRes, tRes] = await Promise.all([
			fetch("js/prefixes.json"),
			fetch("js/suffixes.json"),
			fetch(
				"js/roots.json",
			) /* root words in document, also known as combining forms */,
			fetch("js/terms.json"),
		]);

		const prefixes = await pRes.json();
		const suffixes = await sRes.json();
		const roots = await rRes.json();
		const terms = await tRes.json();

		// Sorts terms from A to Z ignoring capitalization
		terms.sort((a, b) => a.word.localeCompare(b.word));

		// Map datasets by ID for quick relational lookups
		const prefixMap = new Map(prefixes.map((p) => [p.id, p]));
		const suffixMap = new Map(suffixes.map((s) => [s.id, s]));
		const rootMap = new Map(roots.map((r) => [r.id, r]));

		cache = { prefixes, suffixes, roots, terms, prefixMap, suffixMap, rootMap };
		return cache;
	}

	return { load };
})();
