
import re
import random
import datetime
from dateutil.relativedelta import relativedelta
import os

class TaskManager:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            # Load ML model for task extraction if available
            print("Task manager would load a trained model here")
        else:
            print("Running TaskManager in simulation mode")
    
    def extract_task_info(self, command):
        """
        Extract task information from the command.
        Returns a dictionary with task details.
        """
        if self.use_pretrained_model:
            return self._extract_with_model(command)
        else:
            return self._simulate_task_extraction(command)
    
    def extract_financial_info(self, command, person):
        """
        Extract financial information from the command.
        Returns a dictionary with financial details.
        """
        if self.use_pretrained_model:
            return self._extract_financial_with_model(command, person)
        else:
            return self._simulate_financial_extraction(command, person)
    
    def _extract_with_model(self, command):
        """Extract task information using an ML model"""
        # This would use a named entity recognition or task-specific model
        # For now, just call the simulation
        return self._simulate_task_extraction(command)
    
    def _simulate_task_extraction(self, command):
        """Simulate task information extraction for development"""
        # Determine priority
        priorities = ['high', 'medium', 'low']
        priority = random.choice(priorities)
        
        # Try to extract a meaningful title from the command
        title = command
        # Look for patterns like "assign X to do Y" or "create task to do Z"
        to_match = re.search(r'(?:assign|create|add|set).*(?:to|for|about) (.*?)(?:$|\.|\;|\,)', command, re.IGNORECASE)
        if to_match:
            title = to_match.group(1).strip()
        else:
            # Look for direct mentions of task
            task_match = re.search(r'task (?:to |for |about )?(.*?)(?:$|\.|\;|\,)', command, re.IGNORECASE)
            if task_match:
                title = task_match.group(1).strip()
            # If still nothing meaningful, just use a generic task title
            elif len(title) > 50:
                title = f"Task related to {title[:30]}..."
        
        # Generate deadline dates
        today = datetime.datetime.now()
        deadline_days = random.randint(3, 17)  # 3-17 days from now
        deadline = today + datetime.timedelta(days=deadline_days)
        
        alt_deadline_days = random.randint(7, 14)  # 7-14 days from now
        alt_deadline = today + datetime.timedelta(days=alt_deadline_days)
        
        # Format the dates nicely
        deadline_str = deadline.strftime('%A, %b %d')
        alt_deadline_str = alt_deadline.strftime('%A, %b %d')
        
        # Estimated time to complete
        est_hours = random.randint(2, 10)
        
        return {
            "title": title,
            "priority": priority,
            "deadline": deadline_str,
            "alternativeDeadline": alt_deadline_str,
            "estimatedTime": f"{est_hours} hours"
        }
    
    def _extract_financial_with_model(self, command, person):
        """Extract financial information using an ML model"""
        # This would use a financial entity extraction model
        # For now, just call the simulation
        return self._simulate_financial_extraction(command, person)
    
    def _simulate_financial_extraction(self, command, person):
        """Simulate financial information extraction for development"""
        # Transaction types
        types = ['payment', 'invoice', 'reimbursement', 'transaction']
        transaction_type = random.choice(types)
        
        # Direction (to/from)
        directions = ['to', 'from']
        direction = random.choice(directions)
        
        # Categories
        categories = ['business expense', 'project fee', 'consultation', 'subscription']
        category = random.choice(categories)
        
        # Try to extract an amount from the command
        amount = None
        amount_match = re.search(r'\$(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?) dollars?', command, re.IGNORECASE)
        if amount_match:
            # Extract the amount value (either from group 1 or 2)
            amount_value = amount_match.group(1) or amount_match.group(2)
            amount = f"${amount_value}"
        else:
            # Generate a random amount if none found
            amount = f"${random.randint(100, 1000)}"
        
        # Generate due date
        today = datetime.datetime.now()
        days_until_due = random.randint(7, 28)
        due_date = today + datetime.timedelta(days=days_until_due)
        due_date_str = due_date.strftime('%A, %b %d')
        
        return {
            "type": transaction_type,
            "direction": direction,
            "amount": amount,
            "dueDate": due_date_str,
            "category": category,
            "daysUntilDue": days_until_due
        }
