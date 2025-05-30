from flask import Flask, render_template, request, jsonify, session
import json
import os
import logging
import gzip
import random

# Configure logging
logging.basicConfig(level=logging.DEBUG)

from rich import _console

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Add context processor to provide current_page to all templates
@app.context_processor
def utility_processor():
    def is_learning_completed():
        return session.get('learning_completed', False)
    return {'learning_completed': is_learning_completed()}
    
@app.context_processor
def utility_processor():
    def is_quiz_completed():
        return session.get('quiz_completed', False)  # Default to False if not set

    return {'quiz_completed': is_quiz_completed()}

# load data from JSON files with error handling
try:
    with open('static/data/quiz_data.json') as f:
        quiz_data = json.load(f)
except FileNotFoundError:
    logging.error("quiz_data.json not found in static/data/")
    quiz_data = []
except json.JSONDecodeError:
    logging.error("Error decoding quiz_data.json")
    quiz_data = []

try:
    with open('static/data/quotes_data.json') as f:
        quotes_data = json.load(f)
except FileNotFoundError:
    logging.error("quotes_data.json not found in static/data/")
    quotes_data = []
except json.JSONDecodeError:
    logging.error("Error decoding quotes_data.json")
    quotes_data = []

try:
    with open('static/data/learning_data.json') as f:
        learning_data = json.load(f)
except FileNotFoundError:
    logging.error("learning_data.json not found in static/data/")
    learning_data = {"pages": []}
except json.JSONDecodeError:
    logging.error("Error decoding learning_data.json")
    learning_data = {"pages": []}

@app.route('/')
def home():
    print("\n=== HOME ROUTE ===")

    learning_completed = session.get('learning_completed', False)
    quiz_completed = session.get('quiz_completed', False)
    
    # Debug prints for verification
    print(f"Learning completed: {learning_completed}")
    print(f"Quiz completed: {quiz_completed}")
    
    # Pass both values to the template
    return render_template('home.html', learning_completed=learning_completed, quiz_completed=quiz_completed, body_class="home-page")

@app.route('/page<int:page_id>')
def learning_page(page_id):
    if 1 <= page_id <= 7:  # Updated to handle 7 pages
        page_data = next((page for page in learning_data['pages'] if page['id'] == str(page_id)), None)
        if page_data:
            # Update current page in learning progress
            progress_data = {'currentPage': page_id}
            with open('learning_progress.json', 'w') as f:
                json.dump(progress_data, f)
            
            return render_template(f'page{page_id}.html', page=page_data)
    return "Page not found", 404

@app.route('/test')
def test():
    query = request.args.get('query', '').strip()
    if query:
        results = [
            item for item in quotes_data
            if query.lower() in item['quote'].lower() 
            or any(query.lower() in theme.lower() for theme in item['theme'])
        ]
    else:
        results = quotes_data[:3]  # Default to top 3 quotes if no query is provided
    return render_template('test.html', results=results)

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/quiz-intro')
def quiz_intro():
    return render_template('quiz-intro.html')

@app.route('/quiz-score', methods=['GET'])
def get_quiz_score():
    score = session.get('quiz_score', {})
    return jsonify(score)

@app.route('/quiz-score', methods=['POST'])
def save_quiz_score():
    data = request.json
    print(f"Received data for quiz score: {data}")  # Debugging
    session['quiz_score'] = data
    print(f"Updated session data: {session['quiz_score']}")  # Debugging
    return jsonify({"status": "success"})

@app.route('/quiz/<id>')
def quiz(id=None):
    global quiz_data

    progress = session.get('quiz_score', {})
    question = quiz_data[int(id)] if id and id.isdigit() and int(id) < len(quiz_data) else None
    
    if question:
        return render_template('quiz.html', question=question, progress=progress)
    else:
        return "Question not found", 404

@app.route('/quiz-finish')
def quiz_finish():
    progress = session.get('quiz_score', {})
    if not progress:
        return "No quiz progress found", 404

    # Calculate the score
    question_results = progress.get('questionResults', {})
    score = sum(1 for correct in question_results.values() if correct)  # Count True values
    total_questions = len(quiz_data)

    print(f"Progress: {progress}")  # Debugging
    print(f"Score: {score}, Total Questions: {total_questions}")  # Debugging

    return render_template('quiz-finish.html', progress=progress, score=score, totalQuestions=total_questions)

@app.route('/fragments')
def fragments():
    return render_template('fragments.html')

@app.route('/create', methods=['GET'])
def create():
    query = request.args.get('query', '').strip()
    if query:
        results = [
            item for item in quotes_data
            if query.lower() in item['quote'].lower() 
            or any(query.lower() in theme.lower() for theme in item['theme'])
        ]
    else:
        results = quotes_data  # Default to top 3 quotes if no query is provided

    return render_template('create.html', results=results)

@app.route('/learning-progress', methods=['GET'])
def get_learning_progress():
    print(f"Session data in GET route: {session}")  # Debug print
    learning_completed = session.get('learning_completed', False)
    return jsonify({"learning_completed": learning_completed})

@app.route('/learning-progress', methods=['POST'])
def save_learning_progress():
    data = request.json
    print(f"Received POST data: {data}")  # Debugging
    learning_completed = data.get('learning_completed', False)
    session['learning_completed'] = learning_completed
    print(f"Session data after saving learning progress: {session}")  # Debug print

    return jsonify({"status": "success", "learning_completed": learning_completed})

@app.route('/quiz-progress', methods=['POST'])
def save_quiz_progress():
    data = request.json
    quiz_completed = data.get('quiz_completed', False)
    session['quiz_completed'] = quiz_completed  # Save to session
    print(f"Session data after saving quiz progress: {session}")
    return jsonify({"status": "success", "quiz_completed": quiz_completed})

if __name__ == '__main__':
    app.run(debug=True, port=5001)