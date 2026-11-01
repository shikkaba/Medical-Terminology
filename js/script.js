async function main() {
	try {
		// Load all data once — pass it into each feature
		const data = await AppData.load();

		// Initialize features if their respective elements exist
		if (document.getElementById("database")) {
			initDatabase(data);
		}
		if (document.getElementById("quiz")) {
			initQuiz(data);
		}

	} catch (error) {
		console.error("Failed to initialize app:", error);
	}
}

document.addEventListener("DOMContentLoaded", main());
