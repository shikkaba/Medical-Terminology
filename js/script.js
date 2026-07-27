async function main() {
	try {
		// Load all data once — pass it into each feature
		const data = await AppData.load();

		// Initialize features, passing shared data down
		initDatabase(data);
		// initFlashcards(data);
		// initQuiz(data);
	} catch (error) {
		console.error("Failed to initialize app:", error);
	}
}

document.addEventListener("DOMContentLoaded", main());
