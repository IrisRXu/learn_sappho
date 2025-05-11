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
    # Check if learning is completed by reading the JSON file
    learning_completed = False
    try:
        if os.path.exists('learning_progress.json'):
            with open('learning_progress.json', 'r') as f:
                progress = json.load(f)
                learning_completed = progress.get('currentPage') == '6'
    except Exception as e:
        pass
    
    return render_template('home.html', learning_completed=learning_completed)

@app.route('/page<int:page_id>')
def learning_page(page_id):
    if 1 <= page_id <= 6:
        page_data = next((page for page in learning_data['pages'] if page['id'] == str(page_id)), None)
        if page_data:
            progress = session.get('learning_progress', {})
            return render_template(f'page{page_id}.html', page=page_data, progress=progress)
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

@app.route('/quiz-progress', methods=['GET'])
def get_quiz_progress():
    progress = session.get('quiz_progress', {})
    return jsonify(progress)

@app.route('/quiz-progress', methods=['POST'])
def save_quiz_progress():
    session['quiz_progress'] = request.json
    return jsonify({"status": "success"})

@app.route('/quiz/<id>')
def quiz(id=None):
    global quiz_data

    progress = session.get('quiz_progress', {})
    question = quiz_data[int(id)] if id and id.isdigit() and int(id) < len(quiz_data) else None
    
    if question:
        return render_template('quiz.html', question=question, progress=progress)
    else:
        return "Question not found", 404

@app.route('/quiz-finish')
def quiz_finish():
    progress = session.get('quiz_progress', {})
    total_questions = len(quiz_data)
    if not progress:
        return "No quiz progress found", 404
    return render_template('quiz-finish.html', progress=progress, totalQuestions=total_questions)

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
        results = quotes_data[:3]  # Default to top 3 quotes if no query is provided

    return render_template('create.html', results=results)

@app.route('/learning-progress', methods=['GET'])
def get_learning_progress():
    progress = session.get('learning_progress', {})
    return jsonify(progress)

@app.route('/learning-progress', methods=['POST'])
def save_learning_progress():
    data = request.json
    current_page = data.get('currentPage')
    
    # Save progress to a JSON file
    progress_data = {
        'currentPage': current_page,
        'completed': current_page == '6'
    }
    
    try:
        with open('learning_progress.json', 'w') as f:
            json.dump(progress_data, f)
    except Exception as e:
        pass
    
    return jsonify({"status": "success", "completed": progress_data['completed']})

@app.route('/page5-sensuality')
def page5_sensuality():
    return render_template('page5-sensuality.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)