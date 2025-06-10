from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import json
import plotly.express as px

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if request.method == 'POST':
        player = request.form.get('player')
    else:
        player = request.args.get('player')
    return render_template('dashboard.html', player=player)

if __name__ == '__main__':
    app.run(debug=True)