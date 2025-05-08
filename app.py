from flask import Flask, render_template, request, jsonify, session
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

from rich import _console

app = Flask(__name__)
app.secret_key = os.urandom(24)

# load data from JSON file with error handling
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

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/page1')
def page1():
    return render_template('page1.html')

@app.route('/page2')
def page2():
    return render_template('page2.html')

@app.route('/page3')
def page3():
    return render_template('page3.html')

@app.route('/page4')
def page4():
    return render_template('page4.html')

@app.route('/page4-sensuality')
def page4_sensuality():
    return render_template('page4-sensuality.html')

@app.route('/page4-death')
def page4_death():
    return render_template('page4-death.html')

@app.route('/page5-death')
def page5_death():
    return render_template('page5-death.html')

@app.route('/page5-sensuality')
def page5_sensuality():
    return render_template('page5-sensuality.html')

@app.route('/page6')
def page6():
    return render_template('page6.html')

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
    print(f"Total questions: {total_questions}")
    if not progress:
        return "No quiz progress found", 404
    return render_template('quiz-finish.html', progress=progress, {'totalQuestions': total_questions})


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

if __name__ == '__main__':
    app.run(debug=True, port=5001)