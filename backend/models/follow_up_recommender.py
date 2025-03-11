
import datetime
import random
import os

class FollowUpRecommender:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            # Would load a trained recommendation model here
            print("Follow-up recommender would load a trained model here")
        else:
            print("Running FollowUpRecommender in simulation mode")
    
    def get_optimal_follow_up_time(self, person):
        """
        Determine the optimal time to follow up with a person.
        Returns a dictionary with follow-up details.
        """
        if self.use_pretrained_model:
            return self._recommend_with_model(person)
        else:
            return self._simulate_follow_up_recommendation(person)
    
    def _recommend_with_model(self, person):
        """Generate follow-up recommendation using a trained model"""
        # This would use a trained model to recommend optimal times
        # For now, just call the simulation
        return self._simulate_follow_up_recommendation(person)
    
    def _simulate_follow_up_recommendation(self, person):
        """Simulate follow-up recommendation for development"""
        today = datetime.datetime.now()
        
        # Different timing based on relationship status
        days_to_add = 7  # Default
        if person['relationshipStatus'] == 'New':
            days_to_add = 3  # Follow up sooner for new relationships
        elif person['relationshipStatus'] == 'Active':
            days_to_add = 7  # Standard for active
        elif person['relationshipStatus'] == 'Inactive':
            days_to_add = 5  # Slightly sooner to reactivate
        elif person['relationshipStatus'] == 'Close':
            days_to_add = 10  # Can wait longer for close relationships
        
        # Add some randomness to make it more realistic
        days_to_add += random.randint(-2, 2)
        days_to_add = max(1, days_to_add)  # No less than 1 day
        
        follow_up_date = today + datetime.timedelta(days=days_to_add)
        
        # Generate time options
        hours = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM']
        random_hour = random.choice(hours)
        
        # Alternative time suggestions
        alternative_days = ['tomorrow', 'next week', 'on Friday', 'in 3 days']
        random_alt = random.choice(alternative_days)
        
        # Confidence score based on relationship status
        base_confidence = 80
        if person['relationshipStatus'] == 'Close':
            confidence_boost = 15
        elif person['relationshipStatus'] == 'Active':
            confidence_boost = 10
        elif person['relationshipStatus'] == 'New':
            confidence_boost = 2
        else:
            confidence_boost = 5
        
        confidence = min(95, base_confidence + confidence_boost + random.randint(-5, 5))
        
        return {
            "date": follow_up_date.strftime('%A, %b %d'),
            "time": random_hour,
            "alternativeTime": random_alt,
            "confidence": confidence
        }
