from flask import Flask, render_template, request, jsonify, session
import json
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

# @app.route('/quiz/<quiz_id>')
# def quiz(quiz_id):
#     with open('static/data/quiz_data.json') as f:
#         quiz_data = json.load(f)
#     question = quiz_data[quiz_id]
#     return render_template('quiz.html', question=question)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True) 