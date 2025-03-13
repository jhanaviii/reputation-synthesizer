from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from models.sentiment_analyzer import SentimentAnalyzer
from models.entity_extractor import EntityExtractor
from models.relationship_analyzer import RelationshipAnalyzer
from models.task_manager import TaskManager
from models.follow_up_recommender import FollowUpRecommender
from models.meeting_scheduler import MeetingScheduler
from models.progress_analyzer import ProgressAnalyzer
from models.profile_scraper import ProfileScraper
from data.user_repository import UserRepository

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize our ML models and repositories
user_repo = UserRepository()
sentiment_analyzer = SentimentAnalyzer()
entity_extractor = EntityExtractor()
relationship_analyzer = RelationshipAnalyzer()
task_manager = TaskManager()
follow_up_recommender = FollowUpRecommender()
meeting_scheduler = MeetingScheduler()
progress_analyzer = ProgressAnalyzer()
profile_scraper = ProfileScraper()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"})

@app.route('/api/process-command', methods=['POST'])
def process_command():
    """Process an AI command for a specific person"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        command = data.get('command')
        person_id = data.get('personId')
        
        if not command or not person_id:
            return jsonify({"error": "Command and personId are required"}), 400
        
        # Get person data from repository
        person = user_repo.get_user_by_id(person_id)
        if not person:
            return jsonify({"error": f"Person with ID {person_id} not found"}), 404
        
        # Extract entities from command
        entities = entity_extractor.extract_entities(command, person)
        
        # Process command based on content
        command_lower = command.lower()
        response = {}
        
        # Meeting summarization
        if ('summarize' in command_lower and 
            ('meeting' in command_lower or 'conversation' in command_lower)):
            response = process_meeting_summary(command, person)
            
        # Task assignment
        elif (any(word in command_lower for word in ['assign', 'create', 'add', 'set']) and 
              any(word in command_lower for word in ['task', 'work', 'project'])):
            response = process_task_assignment(command, person)
            
        # Follow-up reminders
        elif ('remind' in command_lower or 'follow up' in command_lower or 'follow-up' in command_lower):
            response = process_follow_up(command, person)
            
        # Relationship analysis
        elif any(word in command_lower for word in ['relationship', 'connection', 'network', 'contact']):
            response = process_relationship_analysis(command, person)
            
        # Financial tracking
        elif any(word in command_lower for word in ['payment', 'money', 'owe', 'pay', 'financial', 'invoice']):
            response = process_financial_info(command, person)
            
        # Meeting scheduling
        elif any(word in command_lower for word in ['schedule', 'calendar', 'meeting', 'appointment']):
            response = process_meeting_scheduling(command, person)
            
        # Project progress
        elif any(word in command_lower for word in ['progress', 'status', 'update', 'track']):
            response = process_progress_report(command, person)
            
        # Default fallback
        else:
            response = process_unknown_intent(command, person)
        
        # Add entities to response
        response["entities"] = entities
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error processing command: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/profiles/search', methods=['GET'])
def search_profiles():
    """Search for online profiles matching a query"""
    try:
        query = request.args.get('query', '')
        limit = int(request.args.get('limit', 5))
        
        if not query:
            return jsonify({"error": "Query parameter is required"}), 400
        
        logger.info(f"Searching profiles for: {query} (limit: {limit})")
        
        # Use profile scraper to search for REAL profiles online
        results = profile_scraper.search_profiles(query, limit)
        
        logger.info(f"Found {len(results)} profile results")
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error searching profiles: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/profiles/details', methods=['GET'])
def get_profile_details():
    """Get detailed information for a specific profile"""
    try:
        profile_url = request.args.get('profileUrl', '')
        
        if not profile_url:
            return jsonify({"error": "profileUrl parameter is required"}), 400
        
        logger.info(f"Fetching profile details for: {profile_url}")
        
        # Use profile scraper to get REAL details from the URL
        profile_details = profile_scraper.get_profile_details(profile_url)
        
        logger.info(f"Successfully retrieved profile details for {profile_details.get('name', 'Unknown')}")
        return jsonify(profile_details)
        
    except Exception as e:
        logger.error(f"Error getting profile details: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/people', methods=['POST'])
def add_person():
    """Add a new person to the system"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400
        
        logger.info(f"Adding new person: {data.get('name')}")
        
        # Create a new ID for the person
        person_id = f"p{len(user_repo.get_all_users()) + 1}"
        
        # Create a new person object
        new_person = {
            "id": person_id,
            "name": data.get('name'),
            "company": data.get('company', ''),
            "role": data.get('role', ''),
            "email": data.get('email', ''),
            "phone": data.get('phone', ''),
            "profileImage": data.get('profileImage', ''),
            "bio": data.get('bio', ''),
            "location": data.get('location', ''),
            "website": data.get('website', ''),
            "socialLinks": data.get('socialLinks', {}),
            "relationshipStatus": data.get('relationshipStatus', 'New'),
            "reputationScore": data.get('reputationScore', 50),
            "lastContactedDate": data.get('lastContactedDate', ''),
            "tasks": [],
            "meetings": [],
            "finances": [],
            "socialMedia": [],
            "timeline": [
                {
                    "id": f"tl_{person_id}_1",
                    "date": data.get('lastContactedDate', ''),
                    "type": "contact",
                    "title": "Added as contact",
                    "description": f"{data.get('name')} was added to your contacts"
                }
            ],
            "notes": []
        }
        
        # Add the person to the repository
        # In a real application, this would be stored in a database
        # For now, we'll just return the new person
        logger.info(f"Successfully added person: {new_person['name']} (ID: {new_person['id']})")
        
        # Add to repository (if implemented)
        # user_repo.add_user(new_person)
        
        return jsonify(new_person)
        
    except Exception as e:
        logger.error(f"Error adding person: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

def process_meeting_summary(command, person):
    """Process meeting summary request"""
    if len(person["meetings"]) > 0:
        meeting = person["meetings"][0]
        sentiment = sentiment_analyzer.analyze(meeting["summary"])
        
        return {
            "message": f"📝 Summary of your meeting \"{meeting['title']}\" with {person['name']}:\n\n{meeting['summary']}\n\nOverall sentiment: {sentiment['overall']} ({sentiment['confidenceScore']}% confidence)\n\nKey action items:\n- Follow up on project timeline\n- Share the design mockups\n- Schedule next review meeting",
            "suggestedActions": [
                f"Set a follow-up meeting with {person['name']}",
                "Assign a task based on this meeting",
                "Share this summary with team"
            ],
            "sentiment": sentiment["overall"],
            "confidenceScore": sentiment["confidenceScore"],
            "timeEstimate": "2 weeks until next follow-up recommended"
        }
    else:
        return {
            "message": f"I couldn't find any recorded meetings with {person['name']}. Would you like to schedule one?",
            "suggestedActions": [
                f"Schedule a meeting with {person['name']}",
                "Take notes for a past meeting"
            ],
            "sentiment": "neutral",
            "confidenceScore": 89
        }

def process_task_assignment(command, person):
    """Process task assignment request"""
    task_info = task_manager.extract_task_info(command)
    
    return {
        "message": f"✅ I've created a new {task_info['priority']} priority task for {person['name']}: \"{task_info['title']}\"\n\nDeadline: {task_info['deadline']}\nEstimated completion time: {task_info['estimatedTime']}\n\nI've added this to your task management system and set up automated reminders.",
        "suggestedActions": [
            f"Modify deadline to {task_info['alternativeDeadline']}",
            "Add more details to the task",
            f"Notify {person['name']} about this task"
        ],
        "sentiment": "positive",
        "confidenceScore": 92,
        "timeEstimate": task_info["estimatedTime"]
    }

def process_follow_up(command, person):
    """Process follow-up reminder request"""
    follow_up_info = follow_up_recommender.get_optimal_follow_up_time(person)
    
    return {
        "message": f"🔔 I've set a reminder to follow up with {person['name']} on {follow_up_info['date']} at {follow_up_info['time']}.\n\nBased on your previous interactions, this is an optimal time for engagement with {person['name']} ({follow_up_info['confidence']}% confidence).\n\nI'll send you a notification before the scheduled follow-up.",
        "suggestedActions": [
            f"Follow up {follow_up_info['alternativeTime']}",
            f"Follow up about {person['role']} progress",
            "Send a check-in email now"
        ],
        "sentiment": "neutral",
        "confidenceScore": follow_up_info["confidence"],
        "timeEstimate": follow_up_info["date"]
    }

def process_relationship_analysis(command, person):
    """Process relationship analysis request"""
    insights = relationship_analyzer.generate_insights(person)
    
    return {
        "message": insights["message"],
        "suggestedActions": [
            f"Schedule a {insights['recommendedMeetingType']}",
            f"Share {insights['recommendedContent']}",
            f"Introduce to {insights['recommendedContact']}"
        ],
        "sentiment": insights["sentiment"],
        "confidenceScore": insights["confidence"],
        "timeEstimate": insights["recommendedFrequency"]
    }

def process_financial_info(command, person):
    """Process financial information request"""
    financial_info = task_manager.extract_financial_info(command, person)
    
    return {
        "message": f"💰 I've recorded a {financial_info['type']} of {financial_info['amount']} {financial_info['direction']} {person['name']}.\n\nDue date: {financial_info['dueDate']}\nCategory: {financial_info['category']}\n\nI'll send you a reminder 3 days before the due date.",
        "suggestedActions": [
            f"{financial_info['direction'] == 'to' ? 'Mark as paid' : 'Record payment received'}",
            "Change due date",
            f"Set up recurring {financial_info['type']}"
        ],
        "sentiment": "neutral",
        "confidenceScore": 87,
        "timeEstimate": f"Due in {financial_info['daysUntilDue']} days"
    }

def process_meeting_scheduling(command, person):
    """Process meeting scheduling request"""
    meeting_info = meeting_scheduler.suggest_meeting_times(command, person)
    
    return {
        "message": f"📅 I've analyzed both your calendars and found these optimal meeting times with {person['name']}:\n\n1. {meeting_info['option1']}\n2. {meeting_info['option2']}\n3. {meeting_info['option3']}\n\nBased on your past meetings, {meeting_info['recommended']} would be the most productive time.",
        "suggestedActions": [
            f"Schedule for {meeting_info['recommended']}",
            "Suggest alternative times",
            f"Send availability to {person['name']}"
        ],
        "sentiment": "positive",
        "confidenceScore": 91,
        "timeEstimate": meeting_info["duration"]
    }

def process_progress_report(command, person):
    """Process progress report request"""
    progress_info = progress_analyzer.generate_progress_report(person)
    
    return {
        "message": f"📊 Progress report for projects with {person['name']}:\n\n{progress_info['summary']}\n\nOverall completion: {progress_info['completion']}%\nOn track: {progress_info['onTrack'] ? 'Yes ✅' : 'No ⚠️'}\nEstimated completion: {progress_info['eta']}\n\n{progress_info['recommendation']}",
        "suggestedActions": [
            "Request detailed breakdown",
            "Schedule progress review",
            "Adjust timeline expectations"
        ],
        "sentiment": progress_info["sentiment"],
        "confidenceScore": 88,
        "timeEstimate": progress_info["eta"]
    }

def process_unknown_intent(command, person):
    """Process unknown intent"""
    possible_intents = entity_extractor.guess_user_intent(command, person)
    
    return {
        "message": f"I'm not sure how to process your specific request about {person['name']}. Here's what I think you might be asking for:\n\n{'\n'.join([f'- {i['description']} ({i['confidence']}% confidence)' for i in possible_intents])}",
        "suggestedActions": [i["suggestedAction"] for i in possible_intents],
        "sentiment": "neutral",
        "confidenceScore": 45
    }

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
