import sys
import os
sys.path.append(r'C:\Users\pc\AppData\Roaming\Python\Python311\site-packages')
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from utils import extract_text_from_pdf, extract_text_from_txt, extract_text_from_docx
from textblob import TextBlob

load_dotenv()

app = Flask(__name__)
CORS(app)

def calculate_similarity(cv_text, job_desc):
    if not cv_text or not job_desc:
        return 0, "Low"
    
    # Create the vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # Fit and transform the texts
    try:
        tfidf_matrix = vectorizer.fit_transform([cv_text, job_desc])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Round to 2 decimals
        score = round(float(similarity), 2)
        
        # Determine ranking
        if score > 0.7:
            ranking = "High"
        elif score > 0.4:
            ranking = "Medium"
        else:
            ranking = "Low"
            
        return score, ranking
    except Exception as e:
        print(f"Error in similarity calculation: {e}")
        return 0, "Low"

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "AI Service (TF-IDF + Cosine Similarity) is active!"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
        
    cv_text = data.get('cv_text', '')
    cv_path = data.get('cv_path', '')
    job_description = data.get('job_description', '')
    
    # If path is provided, extract text
    if cv_path and os.path.exists(cv_path):
        if cv_path.lower().endswith('.pdf'):
            cv_text = extract_text_from_pdf(cv_path)
        elif cv_path.lower().endswith('.txt'):
            cv_text = extract_text_from_txt(cv_path)
        elif cv_path.lower().endswith('.docx'):
            cv_text = extract_text_from_docx(cv_path)
            
    if not cv_text:
        return jsonify({"success": False, "error": "No text could be extracted or provided"}), 400
    
    score, ranking = calculate_similarity(cv_text, job_description)
    
    return jsonify({
        "success": True,
        "score": score,
        "ranking": ranking
    })

@app.route('/sentiment', methods=['POST'])
def sentiment():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"success": False, "error": "No text provided"}), 400
        
    text = data.get('text', '')
    analysis = TextBlob(text)
    
    # polarity is in range [-1, 1]
    polarity = analysis.sentiment.polarity
    
    if polarity > 0.1:
        sentiment_label = "Positive"
    elif polarity < -0.1:
        sentiment_label = "Negative"
    else:
        sentiment_label = "Neutral"
        
    return jsonify({
        "success": True,
        "score": round(polarity, 2),
        "sentiment": sentiment_label
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
