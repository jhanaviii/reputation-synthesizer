
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import random
import os
import numpy as np
from transformers import pipeline

class SentimentAnalyzer:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            # Download NLTK data if we're using the real model
            try:
                nltk.data.find('vader_lexicon')
            except LookupError:
                nltk.download('vader_lexicon')
            
            self.sia = SentimentIntensityAnalyzer()
            
            # Alternatively use Hugging Face transformers
            try:
                self.transformer_model = pipeline("sentiment-analysis")
            except:
                print("Warning: Failed to load transformer model, falling back to VADER")
                self.transformer_model = None
        else:
            # In simulation mode, we don't need to load the model
            print("Running SentimentAnalyzer in simulation mode")
    
    def analyze(self, text):
        """
        Analyze the sentiment of the provided text.
        Returns a dictionary with the sentiment classification and confidence score.
        """
        if self.use_pretrained_model:
            return self._analyze_with_model(text)
        else:
            return self._simulate_sentiment_analysis(text)
    
    def _analyze_with_model(self, text):
        """Use the actual sentiment analysis model"""
        # Try transformer model first if available
        if hasattr(self, 'transformer_model') and self.transformer_model:
            try:
                result = self.transformer_model(text)
                label = result[0]['label'].lower()
                score = result[0]['score'] * 100
                
                # Map to our simplified sentiment categories
                if 'positive' in label:
                    sentiment = 'positive'
                elif 'negative' in label:
                    sentiment = 'negative'
                else:
                    sentiment = 'neutral'
                    
                return {
                    "overall": sentiment,
                    "confidenceScore": int(score)
                }
            except Exception as e:
                print(f"Error using transformer model: {e}, falling back to VADER")
        
        # Fall back to VADER
        scores = self.sia.polarity_scores(text)
        
        # Determine overall sentiment
        if scores['compound'] >= 0.05:
            sentiment = 'positive'
        elif scores['compound'] <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        # Calculate confidence score (simplified)
        confidence = int(abs(scores['compound']) * 100)
        # Ensure confidence is at least 60%
        confidence = max(confidence, 60)
        
        return {
            "overall": sentiment,
            "confidenceScore": confidence
        }
    
    def _simulate_sentiment_analysis(self, text):
        """Simulate sentiment analysis for development without models"""
        # Simple keyword-based simulation
        positive_words = ['good', 'great', 'excellent', 'positive', 'happy', 'success', 'beneficial']
        negative_words = ['bad', 'poor', 'negative', 'unhappy', 'fail', 'issue', 'problem', 'concern']
        
        text_lower = text.lower()
        
        # Count positive and negative words
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        # Determine sentiment based on counts
        if positive_count > negative_count:
            sentiment = 'positive'
            base_confidence = 75 + (positive_count - negative_count) * 5
        elif negative_count > positive_count:
            sentiment = 'negative'
            base_confidence = 75 + (negative_count - positive_count) * 5
        else:
            # If equal or no matches, simulate based on text length
            if len(text) % 3 == 0:
                sentiment = 'positive'
            elif len(text) % 3 == 1:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            base_confidence = 70
        
        # Add some randomness to make it more realistic
        confidence = min(95, max(60, base_confidence + random.randint(-5, 5)))
        
        return {
            "overall": sentiment,
            "confidenceScore": confidence
        }
