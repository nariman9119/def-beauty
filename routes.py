from app import app
from flask import request
import os
from flask import Flask, render_template
import pandas as pd
from PIL import Image

    
@app.route("/")
def home():
    
    return "Welcome!"

@app.route("/predict/<photo>")
def predict(photo=None):
    path = 'outputs/' + photo + '.output.jpg'
    csv_path = 'static/outputs/scores.csv' 
    scores = pd.read_csv(csv_path)
    
        
    try:
        im = Image.open('static/'+path)
        score = scores.loc[scores['name'] == photo, 'score'].iloc[0]
        
    except:
        try:
            from model.predict import beauty_predict

            score = beauty_predict('static/' + photo + '.jpg')
            row = pd.DataFrame([[photo,score]], columns=['name', 'score'])
            scores = scores.append(row)
            scores.to_csv(csv_path)
        except:
            return "Something went wrong"
    
    return render_template("prediction.html", path = path, score = score)
