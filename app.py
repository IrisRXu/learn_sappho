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

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True) 