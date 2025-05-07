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
    <div class="cards">
      <div class="card" id="card1" data-answer="A" onclick="selectCard(this)">
        <img src="${q.photoA}" alt="photo matching description">
        <p>${q.descriptionA}</p>
      </div>
      <div class="card" id="card2" data-answer="B" onclick="selectCard(this)">
        <img src="${q.photoB}" alt="photo matching description">
        <p>${q.descriptionB}</p>
      </div>
    </div>
    <button class="main-button primary" onclick="submitAnswer()">Confirm</button>
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
  if (selectedCard === quizData[currentQuestion].answer) {
    score++;
  }

  // Show feedback based on the selected answer
    document.getElementById('quiz').innerHTML = `
    <p>${quizData[currentQuestion].feedback}</p>
    <button class="main-button primary" onclick="nextQuestion()">Next</button>
  `;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    document.getElementById('quiz').innerHTML = `
      <p>Quiz complete! You scored ${score} out of ${quizData.length}.</p>
      <p>Thanks for taking a moment with Sappho.</p>
      <p>You’re carrying her voice with you—now let’s see what happens when we create something new from her fragments…</p>

      <button onclick="startQuiz()">Restart Quiz</button>
      <button onclick="window.location.href='fragments'">Continue</button>
    `;
  }
}
