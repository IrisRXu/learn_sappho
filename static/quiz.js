// let quizData = [];
// let currentQuestion = 0;
// let score = 0;
let selectedCard = null;
let quizLength = 7;

function startQuiz() {
  fetch('/quiz-score', { 
    method: 'POST', 
    body: JSON.stringify({ 
      currentQuestion: 1,
      questionResults: {},
    }), 
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
  const questionID = questionData.id;
  const isCorrect = selectedAnswer === correctAnswer;

  fetch('/quiz-score', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(currentScore => {
    // console.log("Current score being sent:", currentScore);
    // const newScore = currentScore.score || 0;
    // const updatedScore = isCorrect ? newScore + 1 : newScore;

    // Track correctness for each question
    const questionResults = currentScore.questionResults || {};
    questionResults[questionID] = isCorrect;

    const updatedProgress = {
      currentQuestion: questionID,
      // score: updatedScore,
      questionResults: questionResults
    };

    console.log("Updated progress being sent:", updatedProgress);

    return fetch('/quiz-score', {
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
      } else if (card.dataset.answer === correctAnswer) {
        card.style = 'background-color:rgb(192, 212, 195);';
      } else {
        card.style = 'background-color:rgb(212, 192, 192);';
      }
    });
    
    const feedback = document.getElementById('feedback-container');
    feedback.innerHTML = ''; // Clear any existing content

    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'feedback';

    const feedbackHeading = document.createElement('h2');
    feedbackHeading.className = isCorrect ? 'correct' : 'incorrect';
    feedbackHeading.textContent = isCorrect ? 'Correct :-)' : 'Incorrect :-(';

    const feedbackParagraph = document.createElement('p');
    feedbackParagraph.textContent = questionData.feedback;

    feedbackDiv.appendChild(feedbackHeading);
    feedbackDiv.appendChild(feedbackParagraph);
    feedback.appendChild(feedbackDiv);

    // Hide the "Confirm" button
    const confirmButton = document.getElementById('confirm');
    if (confirmButton) {
      confirmButton.style.display = 'none';
    }

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

function prevQuestion() {
  console.log("current question id:", questionData.id);
  console.log("total length:", quizLength);

  if (questionData.id > 1) {
    window.location.href=`/quiz/${questionData.id - 2}`;
  } else {
    window.location.href=`/quiz-intro`;
  }
}

