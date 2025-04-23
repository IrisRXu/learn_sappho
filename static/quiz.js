let quizData = [];
let currentQuestion = 0;
let score = 0;

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
    <p>${q.question}</p>
    <button onclick="answer(true)">True</button>
    <button onclick="answer(false)">False</button>
    <div>💫 ${'💫 '.repeat(currentQuestion)}</div>
  `;
}

function answer(userAnswer) {
  if (userAnswer === quizData[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    document.getElementById('quiz').innerHTML = `
      <p>Quiz complete! You scored ${score} out of ${quizData.length}.</p>
    `;
  }
}
