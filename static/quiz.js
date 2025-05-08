let quizData = [];
let currentQuestion = 0;
let score = 0;
selectedCard = null;

function startQuiz() {
  fetch('/static/data/quiz_data.json')
    .then(response => response.json())
    .then(data => {
      quizData = data;
      currentQuestion = 0;
      score = 0;
      document.getElementById('intro').style.display = 'none';
      document.getElementById('quiz').style.display = 'block';
      showQuestion();
    });
}

function showQuestion() {
  const quiz = document.getElementById('quiz');
  const q = quizData[currentQuestion];

  quiz.innerHTML = `
    <div class="question-container">
      <div class="question">
        <h2>Which one is true?</h2>
      </div>
      <div class="cards">
        <div class="card" id="card1" data-answer="A" onclick="selectCard(this)">
          <div class="image-container">
            <img src="${q.photoA}" alt="photo matching description">
          </div>
          <div class="description">
            <p>${q.descriptionA}</p>
          </div>
        </div>
        <div class="card" id="card2" data-answer="B" onclick="selectCard(this)">
          <div class="image-container">
            <img src="${q.photoB}" alt="photo matching description">
          </div>
          <div class="description">
            <p>${q.descriptionB}</p>
          </div>
        </div>
      </div>
    </div>
    <button class="main-button primary" id="confirm" onclick="submitAnswer()">Confirm</button>
  `;

  selectedCard = null;
}

function selectCard(card) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedCard = card.dataset.answer;
}

function submitAnswer() {
  if (!selectedCard) {
    alert("Please select an answer before confirming.");
    return;
  }

  quizData[currentQuestion].userAnswer = selectedCard; // Track user's answer
  const isCorrect = selectedCard === quizData[currentQuestion].answer;
  if (isCorrect) {
    score++;
  }

  // Hide the unselected card and show feedback
  document.querySelectorAll('.card').forEach(card => {
    if (card.dataset.answer !== selectedCard) {
      card.innerHTML = `
        <div class="description">
          <h2>${isCorrect ? "Correct :-)" : "Incorrect :-("}</h2>
          <p>${quizData[currentQuestion].feedback}</p>
        </div>
      `;
    }
  });

  // Hide the "Confirm" button
  const confirmButton = document.getElementById('confirm'); // Select the button by its id
  if (confirmButton) {
    confirmButton.style.display = 'none';
  }

  // Add a "Next" button below the feedback
  const quiz = document.getElementById('quiz');
  quiz.innerHTML += `
    <button class="main-button primary" onclick="nextQuestion()">Next</button>
  `;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    document.getElementById('quiz').innerHTML = `
      <h2>Congratulations!</h2>
      <p>You scored ${score} out of ${quizData.length}.</p>
      <p>Thanks for taking a moment with Sappho.</p>
      <p>You’re carrying her voice with you—now let’s see what happens when we create something new from her fragments…</p>

      <div class="button-group">
        <button class="main-button secondary" onclick="startQuiz()">Restart Quiz</button>
        <button class="main-button primary" onclick="window.location.href='fragments'">Continue</button>
      </div>
    `;
  }
}
