
import re
import random
from transformers import pipeline
import os

class EntityExtractor:
    def __init__(self):
        self.use_pretrained_model = os.environ.get('USE_PRETRAINED_MODEL', 'false').lower() == 'true'
        
        if self.use_pretrained_model:
            try:
                # Initialize the NER pipeline
                self.ner_pipeline = pipeline("ner")
                print("Loaded NER model successfully")
            except Exception as e:
                print(f"Warning: Failed to load NER model: {e}")
                self.ner_pipeline = None
        else:
            print("Running EntityExtractor in simulation mode")
    
    def extract_entities(self, command, person):
        """
        Extract named entities from the command text.
        Returns a list of entities found in the text.
        """
        if self.use_pretrained_model and self.ner_pipeline:
            return self._extract_with_model(command, person)
        else:
            return self._simulate_entity_extraction(command, person)
    
    def _extract_with_model(self, command, person):
        """Use the actual NER model to extract entities"""
        try:
            # Run NER pipeline
            ner_results = self.ner_pipeline(command)
            
            # Process and format results
            entities = []
            current_entity = None
            
            for item in ner_results:
                if current_entity is None or item['entity'].startswith('B-'):
                    # Start of a new entity
                    if current_entity:
                        entities.append(current_entity)
                    
                    current_entity = {
                        'name': item['word'],
                        'type': item['entity'].split('-')[1]  # Remove B- or I- prefix
                    }
                elif item['entity'].startswith('I-'):
                    # Continuation of current entity
                    current_entity['name'] += ' ' + item['word']
            
            # Add the last entity if there is one
            if current_entity:
                entities.append(current_entity)
            
            # Always add the person as an entity
            person_entity = {
                'name': person['name'],
                'type': 'PERSON'
            }
            
            # Check if person is already in the entities
            if not any(e['name'] == person['name'] and e['type'] == 'PERSON' for e in entities):
                entities.append(person_entity)
            
            return entities
        
        except Exception as e:
            print(f"Error in NER model: {e}")
            # Fall back to simulation on error
            return self._simulate_entity_extraction(command, person)
    
    def _simulate_entity_extraction(self, command, person):
        """Simulate entity extraction for development without models"""
        entities = []
        
        # Always add the person as an entity
        entities.append({
            'name': person['name'],
            'type': 'PERSON'
        })
        
        # Date entities
        date_patterns = [
            'today', 'tomorrow', 'yesterday',
            'next week', 'next month', 'next year',
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ]
        
        for pattern in date_patterns:
            if pattern in command.lower():
                entities.append({
                    'name': pattern,
                    'type': 'DATE'
                })
        
        # Money entities using regex
        money_matches = re.findall(r'\$\d+|\d+ dollars|\d+\$', command)
        if money_matches:
            for match in money_matches:
                entities.append({
                    'name': match,
                    'type': 'MONEY'
                })
        
        # Organization entities - extract company names
        if person['company'] in command:
            entities.append({
                'name': person['company'],
                'type': 'ORG'
            })
        
        # Role entities if mentioned
        if person['role'] in command:
            entities.append({
                'name': person['role'],
                'type': 'ROLE'
            })
        
        return entities
    
    def guess_user_intent(self, command, person):
        """
        Attempt to guess the user's intent when the command is unclear.
        Returns a list of possible intents with confidence scores.
        """
        # Define intent patterns (simplified NLU)
        intent_patterns = [
            {
                "intent": "relationship_analysis",
                "patterns": ["relationship", "connection", "network", "contact", "interact"],
                "description": "Get information about your relationship with this person",
                "action": f"Analyze my relationship with {person['name']}"
            },
            {
                "intent": "schedule_meeting",
                "patterns": ["schedule", "meeting", "call", "appointment", "calendar", "meet"],
                "description": "Schedule a meeting or call",
                "action": f"Schedule a meeting with {person['name']}"
            },
            {
                "intent": "task_management",
                "patterns": ["task", "assign", "work", "project", "todo", "to-do", "complete"],
                "description": "Assign or track tasks",
                "action": f"Show tasks assigned to {person['name']}"
            },
            {
                "intent": "follow_up",
                "patterns": ["follow up", "follow-up", "remind", "reminder", "check in", "check-in"],
                "description": "Set a reminder to follow up",
                "action": f"Remind me to follow up with {person['name']}"
            },
            {
                "intent": "payment_tracking",
                "patterns": ["payment", "invoice", "money", "pay", "financial", "transaction"],
                "description": "Track payments or financial transactions",
                "action": f"Check payment status with {person['name']}"
            }
        ]
        
        # Calculate matches against patterns
        command_lower = command.lower()
        scored_intents = []
        
        for intent in intent_patterns:
            # Count how many patterns match
            matches = sum(1 for pattern in intent["patterns"] if pattern in command_lower)
            if matches > 0:
                # Calculate confidence based on number of matches
                confidence = min(95, 30 + matches * 15)
                
                # Add some randomness for realism
                confidence += random.randint(-10, 10)
                confidence = max(30, min(95, confidence))
                
                scored_intents.append({
                    "description": intent["description"],
                    "confidence": confidence,
                    "suggestedAction": intent["action"]
                })
        
        # If no intents matched well, add some default options
        if not scored_intents or all(intent["confidence"] < 40 for intent in scored_intents):
            default_intents = [
                {
                    "description": "Get information about this person",
                    "confidence": 35 + random.randint(0, 10),
                    "suggestedAction": f"Tell me about {person['name']}"
                },
                {
                    "description": "Show recent activity",
                    "confidence": 30 + random.randint(0, 10),
                    "suggestedAction": f"Show recent activity with {person['name']}"
                }
            ]
            
            scored_intents.extend(default_intents)
        
        # Sort by confidence and return top 3
        return sorted(scored_intents, key=lambda x: x["confidence"], reverse=True)[:3]
