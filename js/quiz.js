function initQuiz({ roots, prefixes, suffixes }) {
	const question = document.getElementById("quiz-question");
	const choices = document.getElementById("quiz-choices");
	const feedback = document.getElementById("quiz-feedback");
	const scoreDisplay = document.getElementById("quiz-score");
	const nextButton = document.getElementById("quiz-next");

	// Combine roots, prefixes, and suffixes into a single pool of terms for the quiz
	const pool = [...roots, ...prefixes, ...suffixes].filter(
		(item) => item.form && item.meaning,
	);

	if (pool.length < 2) {
		question.textContent = "Not enough data to start the quiz.";
		return;
	}

	// Shuffle items to randomize their order
	function shuffle(items) {
		const result = [...items];
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	}

	let round;
	let questionIndex;
	let score;
	let finished;

	// Start a new round of the quiz with a random selection of terms
	function startRound() {
		round = shuffle(pool).slice(0, Math.min(10, pool.length));
		questionIndex = 0;
		score = 0;
		finished = false;
		showQuestion();
	}

	// Display the current question and its answer options
	function showQuestion() {
		const answer = round[questionIndex];
		const distractors = shuffle(
			pool.filter((item) => item.form !== answer.form),
		).slice(0, 3);

		question.textContent = `Which term means “${answer.meaning}”?`;
		feedback.textContent = "";
		scoreDisplay.textContent =
			`Question ${questionIndex + 1} of ${round.length} | Score: ${score}`;
		choices.replaceChildren();
		nextButton.hidden = true;

		shuffle([answer, ...distractors]).forEach((item) => {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = item.form;
			button.addEventListener("click", () => checkAnswer(item, answer));
			choices.appendChild(button);
		});
	}

	// Check the user's answer and provide feedback
	function checkAnswer(selected, answer) {
		choices.querySelectorAll("button").forEach((button) => {
			button.disabled = true;
		});

		if (selected.form === answer.form) {
			score++;
			feedback.textContent = "Correct!";
		} else {
			feedback.textContent = `Not quite. The answer is ${answer.form}.`;
		}

		scoreDisplay.textContent =
			`Question ${questionIndex + 1} of ${round.length} | Score: ${score}`;
		nextButton.textContent =
			questionIndex === round.length - 1 ? "See results" : "Next question";
		nextButton.hidden = false;
	}

	// click to proceed to the next question or restart the quiz
	nextButton.addEventListener("click", () => {
		if (finished) {
			startRound();
		} else if (questionIndex === round.length - 1) {
			finished = true;
			question.textContent =
				`Quiz complete! You scored ${score} out of ${round.length}.`;
			choices.replaceChildren();
			feedback.textContent = "";
			scoreDisplay.textContent = "";
			nextButton.textContent = "Try again";
		} else {
			questionIndex++;
			showQuestion();
		}
	});

	startRound();
}