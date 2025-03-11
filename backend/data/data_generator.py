
from faker import Faker
import random
import json
from datetime import datetime, timedelta
import os

fake = Faker()

def generate_mock_dataset(num_people=100, output_file='data/mock_users.json'):
    """Generate a fake dataset with the specified number of people"""
    people = []
    
    # Relationship statuses
    relationship_statuses = ['New', 'Active', 'Inactive', 'Close']
    
    # Task statuses
    task_statuses = ['pending', 'in-progress', 'completed', 'overdue']
    
    # Task priorities
    task_priorities = ['low', 'medium', 'high']
    
    # Meeting sentiments
    meeting_sentiments = ['positive', 'neutral', 'negative']
    
    # Finance types
    finance_types = ['owed', 'paid', 'received']
    
    # Timeline types
    timeline_types = ['meeting', 'task', 'payment', 'contact']
    
    # Social media platforms
    social_platforms = [
        {'platform': 'LinkedIn', 'icon': 'linkedin'},
        {'platform': 'Twitter', 'icon': 'twitter'},
        {'platform': 'Instagram', 'icon': 'instagram'},
        {'platform': 'Facebook', 'icon': 'facebook'},
        {'platform': 'GitHub', 'icon': 'github'},
        {'platform': 'Dribbble', 'icon': 'dribbble'},
        {'platform': 'Medium', 'icon': 'medium'},
        {'platform': 'YouTube', 'icon': 'youtube'}
    ]
    
    # Common roles
    roles = [
        'Product Designer', 'Marketing Director', 'Backend Developer', 'Frontend Developer',
        'UI/UX Designer', 'Data Scientist', 'Project Manager', 'CEO', 'CTO', 'CFO',
        'Sales Representative', 'Customer Success Manager', 'Content Writer', 'HR Manager',
        'Operations Director', 'Business Analyst', 'Growth Hacker', 'Social Media Manager'
    ]
    
    # Common companies
    companies = [
        'TechCorp', 'DesignHub', 'DataInsights', 'CloudNine', 'SoftSolutions',
        'MarketBoost', 'GrowthGenius', 'InnovateTech', 'WebWizards', 'AppArchitects',
        'CreativeMinds', 'DigitalDynamo', 'FutureFocus', 'SmartSystems', 'PeakPerformance'
    ]
    
    # Generate people
    for i in range(1, num_people + 1):
        person_id = str(i)
        first_name = fake.first_name()
        last_name = fake.last_name()
        name = f"{first_name} {last_name}"
        
        # Generate profile image URL (using placeholder for simplicity)
        gender = 'men' if random.random() > 0.5 else 'women'
        profile_image = f"https://randomuser.me/api/portraits/{gender}/{random.randint(1, 99)}.jpg"
        
        # Generate role and company
        role = random.choice(roles)
        company = random.choice(companies)
        
        # Generate contact info
        email = fake.email()
        phone = fake.phone_number()
        
        # Generate reputation score (60-100)
        reputation_score = random.randint(60, 100)
        
        # Generate last contacted date (within last 6 months)
        days_ago = random.randint(0, 180)
        last_contacted_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
        
        # Generate social media
        num_socials = random.randint(1, 4)
        chosen_platforms = random.sample(social_platforms, num_socials)
        social_media = []
        
        for platform in chosen_platforms:
            username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 99)}"
            social_media.append({
                'platform': platform['platform'],
                'url': f"https://{platform['platform'].lower()}.com/{username}",
                'username': username,
                'icon': platform['icon']
            })
        
        # Generate relationship status
        relationship_status = random.choice(relationship_statuses)
        
        # Generate meetings (0-3)
        num_meetings = random.randint(0, 3)
        meetings = []
        
        for j in range(1, num_meetings + 1):
            meeting_days_ago = random.randint(0, 90)
            meeting_date = (datetime.now() - timedelta(days=meeting_days_ago)).strftime('%Y-%m-%d')
            
            meeting_titles = [
                f"{role} Discussion",
                "Project Review",
                "Strategy Session",
                "Quarterly Planning",
                "Initial Consultation",
                "Product Demo",
                "Feedback Session"
            ]
            
            meeting_title = random.choice(meeting_titles)
            meeting_sentiment = random.choice(meeting_sentiments)
            
            # Generate meeting summary
            meeting_summary = fake.paragraph(nb_sentences=random.randint(3, 6))
            
            meetings.append({
                'id': f"m{j}",
                'date': meeting_date,
                'title': meeting_title,
                'summary': meeting_summary,
                'sentiment': meeting_sentiment
            })
        
        # Generate tasks (0-5)
        num_tasks = random.randint(0, 5)
        tasks = []
        
        for j in range(1, num_tasks + 1):
            due_days = random.randint(-10, 30)  # Some tasks may be overdue
            due_date = (datetime.now() + timedelta(days=due_days)).strftime('%Y-%m-%d')
            
            # Task titles related to role
            task_title = fake.sentence(nb_words=random.randint(4, 8)).rstrip('.')
            task_status = random.choice(task_statuses)
            task_priority = random.choice(task_priorities)
            
            tasks.append({
                'id': f"t{j}",
                'title': task_title,
                'dueDate': due_date,
                'status': task_status,
                'priority': task_priority
            })
        
        # Generate finances (0-3)
        num_finances = random.randint(0, 3)
        finances = []
        
        for j in range(1, num_finances + 1):
            finance_date = (datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d')
            finance_amount = random.randint(100, 5000)
            finance_type = random.choice(finance_types)
            
            finance_descriptions = [
                "Project payment",
                "Consultation fee",
                "Retainer",
                "Service invoice",
                "Product purchase",
                "Subscription renewal"
            ]
            
            finance_description = random.choice(finance_descriptions)
            
            finances.append({
                'id': f"f{j}",
                'amount': finance_amount,
                'currency': 'USD',
                'date': finance_date,
                'description': finance_description,
                'type': finance_type
            })
        
        # Generate timeline events
        timeline = []
        
        # Add meetings to timeline
        for meeting in meetings:
            timeline.append({
                'id': f"tl_m{meeting['id'][1:]}",
                'date': meeting['date'],
                'type': 'meeting',
                'title': meeting['title'],
                'description': f"Meeting: {meeting['title']}"
            })
        
        # Add tasks to timeline
        for task in tasks:
            timeline.append({
                'id': f"tl_t{task['id'][1:]}",
                'date': task['dueDate'],
                'type': 'task',
                'title': task['title'],
                'description': f"Task due: {task['title']}"
            })
        
        # Add finances to timeline
        for finance in finances:
            timeline.append({
                'id': f"tl_f{finance['id'][1:]}",
                'date': finance['date'],
                'type': 'payment',
                'title': finance['description'],
                'description': f"{finance['type'].capitalize()}: ${finance['amount']} - {finance['description']}"
            })
        
        # Add contact events to timeline
        num_contacts = random.randint(1, 3)
        for j in range(1, num_contacts + 1):
            contact_days_ago = random.randint(0, 120)
            contact_date = (datetime.now() - timedelta(days=contact_days_ago)).strftime('%Y-%m-%d')
            
            contact_descriptions = [
                "Email exchange",
                "Phone call",
                "LinkedIn message",
                "Video call",
                "In-person meeting",
                "Text message"
            ]
            
            contact_title = random.choice(contact_descriptions)
            
            timeline.append({
                'id': f"tl_c{j}",
                'date': contact_date,
                'type': 'contact',
                'title': contact_title,
                'description': f"Contact via {contact_title.lower()}"
            })
        
        # Sort timeline by date (most recent first)
        timeline.sort(key=lambda x: x['date'], reverse=True)
        
        # Create the person object
        person = {
            'id': person_id,
            'name': name,
            'profileImage': profile_image,
            'role': role,
            'company': company,
            'email': email,
            'phone': phone,
            'reputationScore': reputation_score,
            'lastContactedDate': last_contacted_date,
            'socialMedia': social_media,
            'relationshipStatus': relationship_status,
            'meetings': meetings,
            'tasks': tasks,
            'finances': finances,
            'timeline': timeline
        }
        
        people.append(person)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(people, f, indent=2)
    
    print(f"Generated {num_people} mock users and saved to {output_file}")
    return people

if __name__ == "__main__":
    generate_mock_dataset(100, 'data/mock_users.json')
