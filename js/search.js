const searchInput = document.getElementById('search-box');
let debounceTimer;

searchInput.addEventListener('input', (e) => {
	clearTimeout(debounceTimer);

	// Wait 250ms after user stops typing to trigger search
	debounceTimer = setTimeout(async () => {
		const results = await AppData.search(e.target.value);
		renderSearchResults(results); 
	}, 250);
});

function renderSearchResults(results) {
	console.log("Found matches:", results);
	// Loop over your hydrated results here to update your DOM components
}
