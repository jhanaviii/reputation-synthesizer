
import random
from datetime import datetime, timedelta
import os

class ProgressAnalyzer:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            # Would load progress analysis model
            print("Progress analyzer would load a predictive model here")
        else:
            print("Running ProgressAnalyzer in simulation mode")
    
    def generate_progress_report(self, person):
        """
        Generate a progress report for projects with a person.
        Returns a dictionary with project progress details.
        """
        if self.use_pretrained_model:
            return self._analyze_with_model(person)
        else:
            return self._simulate_progress_report(person)
    
    def _analyze_with_model(self, person):
        """Generate progress report using trained models"""
        # This would use predictive models to analyze project progress
        # For now, just call the simulation
        return self._simulate_progress_report(person)
    
    def _simulate_progress_report(self, person):
        """Simulate progress report generation for development"""
        # Generate overall completion percentage
        completion = random.randint(0, 100)
        
        # Determine if project is on track (with bias toward being on track)
        on_track = random.random() > 0.3  # 70% chance of being on track
        
        # Generate estimated completion date
        today = datetime.now()
        days_to_add = random.randint(7, 67)  # 7-67 days
        eta = today + timedelta(days=days_to_add)
        
        # Generate summary based on person's tasks
        summary = ""
        if person['tasks'] and len(person['tasks']) > 0:
            summary = f"Tasks assigned to {person['name']}:\n"
            for task in person['tasks']:
                status_icon = "✅" if task['status'] == 'completed' else "⏳" 
                summary += f"- {task['title']}: {task['status'] == 'completed' ? 'Completed ' + status_icon : 'In progress ' + status_icon}\n"
        else:
            summary = f"No specific tasks assigned to {person['name']} yet."
        
        # Generate recommendation based on progress
        recommendation = ""
        if on_track:
            recommendations = [
                f"Recommendation: Continue current pace. Project is on track for successful completion.",
                f"Recommendation: Schedule a mid-point review on {(today + timedelta(days=days_to_add//2)).strftime('%b %d')} to ensure continued progress.",
                f"Recommendation: Consider allocating additional resources to expedite completion ahead of schedule."
            ]
            recommendation = random.choice(recommendations)
        else:
            recommendations = [
                f"Recommendation: Consider adjusting timeline or resources. Current progress is behind optimal schedule.",
                f"Recommendation: Schedule a realignment meeting to address current bottlenecks and recalibrate expectations.",
                f"Recommendation: Break down remaining work into smaller deliverables to increase momentum."
            ]
            recommendation = random.choice(recommendations)
        
        return {
            "summary": summary,
            "completion": completion,
            "onTrack": on_track,
            "eta": eta.strftime('%b %d, %Y'),
            "recommendation": recommendation,
            "sentiment": "positive" if on_track else "negative"
        }
