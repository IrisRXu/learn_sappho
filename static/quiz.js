// let quizData = [];
// let currentQuestion = 0;
// let score = 0;
let selectedCard = null;
let quizLength = 5;

function startQuiz() {
  fetch('/quiz-progress', { 
    method: 'POST', 
    body: JSON.stringify({ currentQuestion: 1, score: 0 }), 
    headers: { 'Content-Type': 'application/json' } 
  }).then(() => {
    window.location.href = '/quiz/0';
  });
}

function selectCard(card) {
  document.querySelectorAll('.card').forEach(c =>
     c.classList.remove('selected'));

  card.classList.add('selected');
  selectedAnswer = card.dataset.answer;
  console.log("Selected answer:", selectedAnswer);
}

function submitAnswer() {
  if (!selectedAnswer) {
    alert("Please select an answer before confirming.");
    return;
  }

  const correctAnswer = questionData.answer;
  const questionID  = questionData.id;
  // console.log("Selected answer:", selectedAnswer);
  // console.log("current question id:", questionID);
  const isCorrect = selectedAnswer === correctAnswer;
  
  fetch('/quiz-progress', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(currentProgress => {
    const newScore = currentProgress.score || 0;
    const updatedScore = isCorrect ? newScore + 1 : newScore;
    const updatedProgress = {
      currentQuestion: questionID + 1,
      score: updatedScore,
    };

    // console.log("2 current question id:", questionID);

    return fetch('/quiz-progress', {
      method: 'POST',
      body: JSON.stringify(updatedProgress),
      headers: { 'Content-Type': 'application/json' }
    });
  })
  .then(() => {
    // Show feedback
    document.querySelectorAll('.card').forEach(card => {
      if (card.dataset.answer !== selectedAnswer) {
        card.style.display = 'none';
      }
    });
    
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = isCorrect ? 
      `<h2 class="correct">Correct!</h2>` : 
      `<h2 class="incorrect">Incorrect.</h2>`;
    feedback.innerHTML += `
      <p>${questionData.feedback}</p>
    `;

    // Hide the "Confirm" button
    const confirmButton = document.getElementById('confirm');
    if (confirmButton) {
      confirmButton.style.display = 'none';
    }

    // console.log("3 current question id:", questionID);

    // Add a "Next" button below the feedback
    const quiz = document.getElementById('quiz-buttons');
    quiz.innerHTML += `
      <button class="main-button primary" onclick="nextQuestion()">Next</button>
    `;
  });
}

function nextQuestion() {
  console.log("current question id:", questionData.id);
  console.log("total length:", quizLength);
  if (questionData.id < quizLength) {
    window.location.href=`/quiz/${questionData.id}`;
  } else {
    window.location.href=`/quiz-finish`;
  }
}
