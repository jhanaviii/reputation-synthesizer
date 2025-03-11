
import datetime
import random
import math
from dateutil.parser import parse as parse_date
import os

class RelationshipAnalyzer:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            # Load trained model if available
            print("Relationship analyzer would load a trained model here")
            # self.model = joblib.load('models/relationship_model.pkl')
        else:
            print("Running RelationshipAnalyzer in simulation mode")
    
    def generate_insights(self, person):
        """
        Generate relationship insights based on profile analysis.
        Returns a dictionary with insights and recommendations.
        """
        if self.use_pretrained_model:
            return self._generate_with_model(person)
        else:
            return self._simulate_relationship_insights(person)
    
    def _generate_with_model(self, person):
        """Generate insights using a trained model"""
        # This would use a trained model to analyze relationship data
        # For now, just call the simulation as a placeholder
        return self._simulate_relationship_insights(person)
    
    def _simulate_relationship_insights(self, person):
        """Simulate relationship insights for development"""
        # Calculate relationship length from lastContactedDate
        relationship_length = self._calculate_relationship_length(person['lastContactedDate'])
        
        # Default values
        message = ""
        recommended_meeting_type = ""
        recommended_content = ""
        recommended_contact = ""
        recommended_frequency = ""
        sentiment = "neutral"
        confidence = 0
        
        # Generate different insights based on relationship status
        if person['relationshipStatus'] == 'New':
            message = f"📊 Relationship Analysis: Your connection with {person['name']} is new ({relationship_length} so far).\n\nRecommended Action: Schedule an introductory meeting to establish rapport and learn about their goals at {person['company']}.\n\nInsight: People in similar roles typically establish a communication cadence of twice monthly during the first quarter of a new relationship."
            recommended_meeting_type = 'virtual coffee chat'
            recommended_content = 'an industry report related to their role'
            recommended_contact = 'someone in your network with similar interests'
            recommended_frequency = 'every 2 weeks'
            sentiment = 'positive'
            confidence = 82
            
        elif person['relationshipStatus'] == 'Active':
            message = f"📊 Relationship Analysis: Your relationship with {person['name']} ({relationship_length}).\n\nInsight: Your response rate is 94% with an average reply time of 8 hours. This indicates strong engagement.\n\nRecommended Action: Share relevant industry insights or schedule a casual check-in. Data shows that maintaining bi-weekly contact optimizes professional relationships at this stage."
            recommended_meeting_type = 'lunch meeting'
            recommended_content = 'a recent case study in their field'
            recommended_contact = 'a potential client for their services'
            recommended_frequency = 'bi-weekly'
            sentiment = 'positive'
            confidence = 91
            
        elif person['relationshipStatus'] == 'Inactive':
            message = f"📊 Relationship Analysis: Your relationship with {person['name']} has been inactive for 3 months (total length: {relationship_length}).\n\nInsight: The optimal re-engagement window is closing, as data shows 75% success rate drops significantly after 4 months of inactivity.\n\nRecommended Action: Reach out with a no-pressure message that references your last interaction about their project at {person['company']}."
            recommended_meeting_type = 'casual video call'
            recommended_content = 'a news article relevant to their industry'
            recommended_contact = 'a mutual connection to reconnect through'
            recommended_frequency = 'monthly to rebuild consistency'
            sentiment = 'neutral'
            confidence = 85
            
        elif person['relationshipStatus'] == 'Close':
            message = f"📊 Relationship Analysis: You have a close relationship with {person['name']} ({relationship_length}).\n\nInsight: Your communication patterns show consistent engagement with peaks around project deadlines. The relationship has a 92% reciprocity rate (balanced give-and-take).\n\nRecommended Action: Consider them for strategic collaborations and maintain your current communication cadence."
            recommended_meeting_type = 'strategic planning session'
            recommended_content = 'exclusive industry insights'
            recommended_contact = 'a high-value connection in your network'
            recommended_frequency = 'maintain current weekly cadence'
            sentiment = 'positive'
            confidence = 94
            
        else:
            message = f"📊 Relationship Analysis: Your connection with {person['name']} shows regular interaction patterns over {relationship_length}.\n\nInsight: Professional relationships with consistent monthly contact have 68% higher retention rates than sporadic interactions.\n\nRecommended Action: Schedule a casual check-in meeting to maintain connection strength."
            recommended_meeting_type = 'brief check-in call'
            recommended_content = 'an interesting article in their field'
            recommended_contact = 'someone in your network they might benefit from knowing'
            recommended_frequency = 'monthly'
            sentiment = 'neutral'
            confidence = 78
        
        return {
            "message": message,
            "recommendedMeetingType": recommended_meeting_type,
            "recommendedContent": recommended_content,
            "recommendedContact": recommended_contact,
            "recommendedFrequency": recommended_frequency,
            "sentiment": sentiment,
            "confidence": confidence
        }
    
    def _calculate_relationship_length(self, last_contacted_date):
        """Calculate the length of a relationship based on the last contacted date"""
        try:
            # Parse the date string to a datetime object
            last_contact = parse_date(last_contacted_date)
            today = datetime.datetime.now()
            
            # Calculate difference in days
            diff_days = (today - last_contact).days
            
            if diff_days < 30:
                return f"{diff_days} days"
            elif diff_days < 365:
                months = math.floor(diff_days / 30)
                return f"{months} month{'s' if months > 1 else ''}"
            else:
                years = math.floor(diff_days / 365)
                remaining_months = math.floor((diff_days % 365) / 30)
                
                if remaining_months == 0:
                    return f"{years} year{'s' if years > 1 else ''}"
                else:
                    return f"{years} year{'s' if years > 1 else ''} and {remaining_months} month{'s' if remaining_months > 1 else ''}"
        except Exception as e:
            print(f"Error calculating relationship length: {e}")
            return "unknown duration"
