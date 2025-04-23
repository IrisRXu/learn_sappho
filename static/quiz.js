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
    <div id="progress">${generateProgress()}</div>
  `;
}

function generateProgress() {
  return quizData
    .slice(0, currentQuestion)
    .map((q, index) => (q.userAnswer === q.answer ? '💫' : '❌'))
    .join(' ');
}

function answer(userAnswer) {
  quizData[currentQuestion].userAnswer = userAnswer; // Track user's answer
  const progress = document.getElementById('progress');
  if (userAnswer === quizData[currentQuestion].answer) {
    score++;
  }

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

  // window.location.href = '/templates/result.html?score=' + score + '&total=' + quizData.length;

}
