
import json
import os
from data.data_generator import generate_mock_dataset

class UserRepository:
    def __init__(self, data_file='data/mock_users.json'):
        self.data_file = data_file
        self.users = self._load_users()
    
    def _load_users(self):
        """Load users from JSON file or generate if not exists"""
        try:
            if not os.path.exists(self.data_file):
                # Generate mock data if file doesn't exist
                print(f"Data file {self.data_file} not found. Generating mock data...")
                users = generate_mock_dataset(100, self.data_file)
                return users
            
            with open(self.data_file, 'r') as f:
                users = json.load(f)
                print(f"Loaded {len(users)} users from {self.data_file}")
                return users
                
        except Exception as e:
            print(f"Error loading users: {e}")
            print("Generating fallback mock data...")
            return generate_mock_dataset(100, self.data_file)
    
    def get_all_users(self):
        """Get all users"""
        return self.users
    
    def get_user_by_id(self, user_id):
        """Get a user by ID"""
        for user in self.users:
            if user['id'] == user_id:
                return user
        return None
    
    def find_user_by_name(self, name):
        """Find users by name (partial match)"""
        name_lower = name.lower()
        matching_users = [
            user for user in self.users
            if name_lower in user['name'].lower()
        ]
        return matching_users
    
    def add_task_to_user(self, user_id, task_data):
        """Add a new task to a user"""
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Generate task ID
        task_id = f"t{len(user['tasks']) + 1}"
        
        # Create the new task
        new_task = {
            'id': task_id,
            'title': task_data.get('title', 'Untitled Task'),
            'dueDate': task_data.get('dueDate', ''),
            'status': task_data.get('status', 'pending'),
            'priority': task_data.get('priority', 'medium')
        }
        
        # Add task to user
        user['tasks'].append(new_task)
        
        # Add to timeline
        timeline_entry = {
            'id': f"tl_t{task_id[1:]}",
            'date': new_task['dueDate'],
            'type': 'task',
            'title': new_task['title'],
            'description': f"Task assigned: {new_task['title']}"
        }
        user['timeline'].insert(0, timeline_entry)
        
        # Save changes
        self._save_users()
        
        return new_task
    
    def complete_task(self, user_id, task_id):
        """Mark a task as completed"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        # Find the task
        for task in user['tasks']:
            if task['id'] == task_id:
                task['status'] = 'completed'
                
                # Update timeline entry if it exists
                timeline_id = f"tl_t{task_id[1:]}"
                for timeline_item in user['timeline']:
                    if timeline_item['id'] == timeline_id:
                        timeline_item['description'] = f"Task completed: {task['title']}"
                        break
                
                # Save changes
                self._save_users()
                return True
        
        return False
    
    def add_meeting(self, user_id, meeting_data):
        """Add a new meeting to a user"""
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Generate meeting ID
        meeting_id = f"m{len(user['meetings']) + 1}"
        
        # Create the new meeting
        new_meeting = {
            'id': meeting_id,
            'date': meeting_data.get('date', ''),
            'title': meeting_data.get('title', 'Untitled Meeting'),
            'summary': meeting_data.get('summary', ''),
            'sentiment': meeting_data.get('sentiment', 'neutral')
        }
        
        # Add meeting to user
        user['meetings'].append(new_meeting)
        
        # Add to timeline
        timeline_entry = {
            'id': f"tl_m{meeting_id[1:]}",
            'date': new_meeting['date'],
            'type': 'meeting',
            'title': new_meeting['title'],
            'description': f"Meeting: {new_meeting['title']}"
        }
        user['timeline'].insert(0, timeline_entry)
        
        # Save changes
        self._save_users()
        
        return new_meeting
    
    def _save_users(self):
        """Save users to JSON file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            
            with open(self.data_file, 'w') as f:
                json.dump(self.users, f, indent=2)
                
            print(f"Saved {len(self.users)} users to {self.data_file}")
            return True
        except Exception as e:
            print(f"Error saving users: {e}")
            return False
