function initDatabase({ terms, prefixMap, rootMap, suffixMap }) {
	// Generate HTML by stitching data structures together
	const container = document.getElementById("card-container");

	// Global tracking states for filters
	let currentLetter = null;
	let currentSystem = "";
	let heading = document.querySelector("h2");

	// Render only terms that match active letter AND system filters
	function renderTerms(letter = currentLetter, system = currentSystem) {
		// Update global tracking variables
		currentLetter = letter;
		currentSystem = system;

		// Apply BOTH filters simultaneously
		let filtered = terms;

		// Filter 1: Letter
		if (currentLetter && currentLetter !== "All") {
			filtered = filtered.filter(
				(term) =>
					term.word &&
					term.word.toLowerCase().startsWith(currentLetter.toLowerCase()),
			);
		}

		// Filter 2: System
		if (currentSystem && currentSystem !== "") {
			filtered = filtered.filter(
				(term) => term.system && term.system.includes(currentSystem),
			);
		}

		container.innerHTML = "";

		// Show message if no terms match the filters. Also update the heading.
		if (filtered.length === 0) {
			const message =
				currentLetter && currentLetter !== "All"
					? `No terms found for letter "${currentLetter}" in the selected system.`
					: `No terms found for the selected system.`;
			container.innerHTML = `<p>${message}</p>`;
			heading.innerText = `No Terms Found`;
			return;
		} else {
			if (
				(!currentSystem || currentSystem === "") &&
				currentLetter &&
				currentLetter !== null
			) {
				heading.innerText = `${currentLetter} Terms`;
			} else if (
				currentSystem &&
				currentSystem !== "" &&
				currentLetter &&
				currentLetter !== null
			) {
				heading.innerText = `${currentLetter} Terms in ${currentSystem}`;
			} else {
				heading.innerText = `All Terms`;
			}
		}

		filtered.forEach((term) => {
			// Resolve relationships
			const prefix = prefixMap.get(term.prefixId);
			const root = rootMap.get(term.rootId);
			const root2 = rootMap.get(term.rootId2);
			const suffix = suffixMap.get(term.suffixId);

			// Create UI card element
			const card = document.createElement("div");
			const systemClass = term.system?.[0]?.slice(0, 5).toLowerCase() || "";
			card.className = `card ${systemClass}`;
			card.innerHTML = `
				<div class="word"><h3>${term.word}</h3></div>
				<div class="definition">${term.definition}</div>
				<div class="breakdown">
					<div class="part"><span class="label">Prefix</span><strong>${prefix?.form || ""}</strong>: ${prefix?.meaning || "N/A"}</div>
					<div class="part"><span class="label">Root</span><strong>${root?.form || ""}</strong>: ${root?.meaning || "N/A"}</div>
					${root2 /* if root2 exists */ ? `<div class="part"><span class="label">Root 2</span><strong>${root2?.form}</strong>: ${root2?.meaning || "N/A"}</div>` : ""}
					<div class="part"><span class="label">Suffix</span><strong>${suffix?.form || ""}</strong>: ${suffix?.meaning || "N/A"}</div>
					<div class="part"><span class="label">System</span><strong>${term.system || ""} </strong></div>
				</div>
			`;

			// Toggle breakdown section on click
			card.addEventListener("click", () => {
				card.querySelector(".breakdown").classList.toggle("active");
			});
			container.appendChild(card);
		});
	}

	// Build the A–Z nav buttons
	const nav = document.getElementById("letter-nav");
	const allBtn = document.createElement("button");
	allBtn.textContent = "All";
	allBtn.classList.add("btn");
	allBtn.addEventListener("click", () => renderTerms("All", "")); // Refresh letter and system
	nav.appendChild(allBtn);

	"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter) => {
		const btn = document.createElement("button");
		btn.textContent = letter;
		btn.classList.add("btn");
		btn.addEventListener("click", () => renderTerms(letter, currentSystem)); // Retain active system
		nav.appendChild(btn);
	});

	// Build the system filter dropdown
	const systemNav = document.getElementById("filter");
	const systemFilter = document.createElement("select");
	systemFilter.id = "system-filter";
	systemFilter.innerHTML = '<option value="">All Systems</option>';

	// Extract unique systems from terms
	const systems = [
		...new Set(terms.flatMap((term) => term.system || [])),
	].sort();

	// Get existing values from the dropdown
	const existingValues = new Set(
		Array.from(systemFilter.options).map((opt) => opt.value),
	);

	// Loop and append only unique items
	systems.forEach((system) => {
		if (!existingValues.has(system)) {
			const option = document.createElement("option");
			option.value = system;
			option.textContent = system;
			systemFilter.appendChild(option);

			// Add to tracking set
			existingValues.add(system);
		}
	});

	systemNav.appendChild(systemFilter);

	// Add the Change Event Listener
	systemFilter.addEventListener("change", (event) => {
		const selectedSystem = event.target.value;
		// Update the grid passing the new system while retaining the active letter
		renderTerms(currentLetter, selectedSystem);
	});

	// Initial render (all terms)
	renderTerms();
}
