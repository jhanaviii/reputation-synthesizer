import { toast } from "@/components/ui/use-toast";
import { Person } from "./mockData";

interface AIResponse {
  message: string;
  suggestedActions?: string[];
}

// Enhanced AI response structure
interface EnhancedAIResponse extends AIResponse {
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidenceScore?: number; 
  entities?: Array<{name: string, type: string}>;
  timeEstimate?: string;
}

// Improved AI processing for natural language commands
export const processCommand = (command: string, person: Person): EnhancedAIResponse => {
  // Convert command to lowercase for easier matching
  const commandLower = command.toLowerCase();
  console.log(`Processing AI command: "${command}" for person: ${person.name}`);
  
  // Extract entities using simplified NER (would use NLP models in production)
  const entities = extractEntities(command, person);
  
  // Meeting summary related commands
  if (commandLower.includes('summarize') && 
     (commandLower.includes('meeting') || commandLower.includes('conversation'))) {
    const meetingIndex = person.meetings.length > 0 ? 0 : -1;
    
    if (meetingIndex >= 0) {
      const meeting = person.meetings[meetingIndex];
      // Perform sentiment analysis (simulated)
      const sentiment = analyzeSentiment(meeting.summary);
      
      return {
        message: `📝 Summary of your meeting "${meeting.title}" with ${person.name}:\n\n${meeting.summary}\n\nOverall sentiment: ${meeting.sentiment} (${sentiment.confidenceScore}% confidence)\n\nKey action items:\n- Follow up on project timeline\n- Share the design mockups\n- Schedule next review meeting`,
        suggestedActions: [
          `Set a follow-up meeting with ${person.name}`,
          `Assign a task based on this meeting`,
          `Share this summary with team`
        ],
        sentiment: sentiment.overall,
        confidenceScore: sentiment.confidenceScore,
        entities,
        timeEstimate: "2 weeks until next follow-up recommended"
      };
    } else {
      return {
        message: `I couldn't find any recorded meetings with ${person.name}. Would you like to schedule one?`,
        suggestedActions: [
          `Schedule a meeting with ${person.name}`,
          `Take notes for a past meeting`
        ],
        entities,
        sentiment: 'neutral',
        confidenceScore: 89
      };
    }
  }
  
  // Task related commands - Enhanced with priority detection, deadline extraction
  else if ((commandLower.includes('assign') || commandLower.includes('create') || 
           commandLower.includes('add') || commandLower.includes('set')) && 
          (commandLower.includes('task') || commandLower.includes('work') || 
           commandLower.includes('project'))) {
    
    // Extract task details from command
    const taskInfo = extractTaskInfo(command);
    
    // Generate response with detailed task information
    return {
      message: `✅ I've created a new ${taskInfo.priority} priority task for ${person.name}: "${taskInfo.title}"\n\nDeadline: ${taskInfo.deadline}\nEstimated completion time: ${taskInfo.estimatedTime}\n\nI've added this to your task management system and set up automated reminders.`,
      suggestedActions: [
        `Modify deadline to ${taskInfo.alternativeDeadline}`,
        `Add more details to the task`,
        `Notify ${person.name} about this task`
      ],
      entities,
      sentiment: 'positive',
      confidenceScore: 92,
      timeEstimate: taskInfo.estimatedTime
    };
  }
  
  // Follow-up reminders with smart scheduling
  else if (commandLower.includes('remind') || commandLower.includes('follow up') || 
          commandLower.includes('follow-up')) {
    
    // Get optimal follow-up time based on relationship analysis
    const followUpInfo = getOptimalFollowUpTime(person);
    
    return {
      message: `🔔 I've set a reminder to follow up with ${person.name} on ${followUpInfo.date} at ${followUpInfo.time}.\n\nBased on your previous interactions, this is an optimal time for engagement with ${person.name} (${followUpInfo.confidence}% confidence).\n\nI'll send you a notification before the scheduled follow-up.`,
      suggestedActions: [
        `Follow up ${followUpInfo.alternativeTime}`,
        `Follow up about ${person.role} progress`,
        `Send a check-in email now`
      ],
      entities,
      sentiment: 'neutral',
      confidenceScore: followUpInfo.confidence,
      timeEstimate: followUpInfo.date
    };
  }
  
  // Enhanced relationship advice with data-driven insights
  else if (commandLower.includes('relationship') || commandLower.includes('connection') || 
           commandLower.includes('network') || commandLower.includes('contact')) {
    
    // Generate relationship insights based on profile analysis
    const relationshipInsights = generateRelationshipInsights(person);
    
    return {
      message: relationshipInsights.message,
      suggestedActions: [
        `Schedule a ${relationshipInsights.recommendedMeetingType}`,
        `Share ${relationshipInsights.recommendedContent}`,
        `Introduce to ${relationshipInsights.recommendedContact}`
      ],
      entities,
      sentiment: relationshipInsights.sentiment,
      confidenceScore: relationshipInsights.confidence,
      timeEstimate: relationshipInsights.recommendedFrequency
    };
  }
  
  // Payment or financial reminders with smart categorization
  else if (commandLower.includes('payment') || commandLower.includes('money') || 
          commandLower.includes('owe') || commandLower.includes('pay') || 
          commandLower.includes('financial') || commandLower.includes('invoice')) {
    
    // Extract financial details
    const financialInfo = extractFinancialInfo(command, person);
    
    return {
      message: `💰 I've recorded a ${financialInfo.type} of ${financialInfo.amount} ${financialInfo.direction} ${person.name}.\n\nDue date: ${financialInfo.dueDate}\nCategory: ${financialInfo.category}\n\nI'll send you a reminder 3 days before the due date.`,
      suggestedActions: [
        `${financialInfo.direction === 'to' ? 'Mark as paid' : 'Record payment received'}`,
        `Change due date`,
        `Set up recurring ${financialInfo.type}`
      ],
      entities,
      sentiment: 'neutral',
      confidenceScore: 87,
      timeEstimate: `Due in ${financialInfo.daysUntilDue} days`
    };
  }
  
  // Calendar and scheduling intelligence
  else if (commandLower.includes('schedule') || commandLower.includes('calendar') || 
          commandLower.includes('meeting') || commandLower.includes('appointment')) {
    
    // Extract meeting details and find optimal time
    const meetingInfo = suggestMeetingTimes(command, person);
    
    return {
      message: `📅 I've analyzed both your calendars and found these optimal meeting times with ${person.name}:\n\n1. ${meetingInfo.option1}\n2. ${meetingInfo.option2}\n3. ${meetingInfo.option3}\n\nBased on your past meetings, ${meetingInfo.recommended} would be the most productive time.`,
      suggestedActions: [
        `Schedule for ${meetingInfo.recommended}`,
        `Suggest alternative times`,
        `Send availability to ${person.name}`
      ],
      entities,
      sentiment: 'positive',
      confidenceScore: 91,
      timeEstimate: meetingInfo.duration
    };
  }
  
  // Project progress and status updates
  else if (commandLower.includes('progress') || commandLower.includes('status') || 
          commandLower.includes('update') || commandLower.includes('track')) {
    
    // Generate progress report
    const progressInfo = generateProgressReport(person);
    
    return {
      message: `📊 Progress report for projects with ${person.name}:\n\n${progressInfo.summary}\n\nOverall completion: ${progressInfo.completion}%\nOn track: ${progressInfo.onTrack ? 'Yes ✅' : 'No ⚠️'}\nEstimated completion: ${progressInfo.eta}\n\n${progressInfo.recommendation}`,
      suggestedActions: [
        `Request detailed breakdown`,
        `Schedule progress review`,
        `Adjust timeline expectations`
      ],
      entities,
      sentiment: progressInfo.sentiment,
      confidenceScore: 88,
      timeEstimate: progressInfo.eta
    };
  }
  
  // When AI doesn't understand - smart fallback
  else {
    // Attempt to extract intent
    const possibleIntents = guessUserIntent(command, person);
    
    return {
      message: `I'm not sure how to process your specific request about ${person.name}. Here's what I think you might be asking for:\n\n${possibleIntents.map(i => `- ${i.description} (${i.confidence}% confidence)`).join('\n')}`,
      suggestedActions: possibleIntents.map(i => i.suggestedAction),
      entities,
      sentiment: 'neutral',
      confidenceScore: 45,
    };
  }
};

// Simulated NER (Named Entity Recognition)
function extractEntities(command: string, person: Person) {
  const entities = [];
  
  // Person entity
  entities.push({
    name: person.name,
    type: 'PERSON'
  });
  
  // Date entities
  const datePatterns = [
    'today', 'tomorrow', 'yesterday',
    'next week', 'next month', 'next year',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  for (const pattern of datePatterns) {
    if (command.toLowerCase().includes(pattern)) {
      entities.push({
        name: pattern,
        type: 'DATE'
      });
    }
  }
  
  // Money entities
  const moneyMatches = command.match(/\$\d+|\d+ dollars|\d+\$/);
  if (moneyMatches) {
    entities.push({
      name: moneyMatches[0],
      type: 'MONEY'
    });
  }
  
  return entities;
}

// Simulated sentiment analysis
function analyzeSentiment(text: string) {
  // In a real system, this would use ML models for sentiment analysis
  const sentiments = ['positive', 'negative', 'neutral'] as const;
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  
  return {
    overall: randomSentiment,
    confidenceScore: Math.floor(Math.random() * 20) + 75 // 75-95% confidence
  };
}

// Extract task information from command
function extractTaskInfo(command: string) {
  // Simulate NLP extraction - would use ML models in production
  const priorities = ['high', 'medium', 'low'];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  
  // Extract title
  let title = command;
  if (command.toLowerCase().includes('to')) {
    const parts = command.split(/\s+to\s+/i);
    if (parts.length > 1) {
      title = parts[1].trim();
      if (title.endsWith('.')) {
        title = title.slice(0, -1);
      }
    }
  }
  
  // Generate deadline
  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(today.getDate() + Math.floor(Math.random() * 14) + 3); // 3-17 days
  
  const altDeadline = new Date(today);
  altDeadline.setDate(today.getDate() + Math.floor(Math.random() * 7) + 7); // 7-14 days
  
  return {
    title,
    priority,
    deadline: deadline.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    alternativeDeadline: altDeadline.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    estimatedTime: `${Math.floor(Math.random() * 8) + 2} hours`
  };
}

// Get optimal follow-up time based on relationship analysis
function getOptimalFollowUpTime(person: Person) {
  // In production, this would analyze past interactions and calendar data
  const today = new Date();
  const followUpDate = new Date(today);
  
  // Different timing based on relationship status
  let daysToAdd = 7; // Default
  switch (person.relationshipStatus) {
    case 'New':
      daysToAdd = 3; // Follow up sooner for new relationships
      break;
    case 'Active':
      daysToAdd = 7; // Standard for active
      break;
    case 'Inactive':
      daysToAdd = 5; // Slightly sooner to reactivate
      break;
    case 'Close':
      daysToAdd = 10; // Can wait longer for close relationships
      break;
  }
  
  followUpDate.setDate(today.getDate() + daysToAdd);
  
  // Generate time options
  const hours = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'];
  const randomHour = hours[Math.floor(Math.random() * hours.length)];
  
  // Alternative time
  const alternativeDays = ['tomorrow', 'next week', 'on Friday', 'in 3 days'];
  const randomAlt = alternativeDays[Math.floor(Math.random() * alternativeDays.length)];
  
  return {
    date: followUpDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    time: randomHour,
    alternativeTime: randomAlt,
    confidence: Math.floor(Math.random() * 15) + 80 // 80-95% confidence
  };
}

// Generate relationship insights
function generateRelationshipInsights(person: Person) {
  // This would use ML to analyze relationship patterns
  let message = '';
  let recommendedMeetingType = '';
  let recommendedContent = '';
  let recommendedContact = '';
  let recommendedFrequency = '';
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0;
  
  // Calculate relationship length from lastContactedDate
  const relationshipLength = calculateRelationshipLength(person.lastContactedDate);
  
  switch (person.relationshipStatus) {
    case 'New':
      message = `📊 Relationship Analysis: Your connection with ${person.name} is new (${relationshipLength} so far).\n\nRecommended Action: Schedule an introductory meeting to establish rapport and learn about their goals at ${person.company}.\n\nInsight: People in similar roles typically establish a communication cadence of twice monthly during the first quarter of a new relationship.`;
      recommendedMeetingType = 'virtual coffee chat';
      recommendedContent = 'an industry report related to their role';
      recommendedContact = 'someone in your network with similar interests';
      recommendedFrequency = 'every 2 weeks';
      sentiment = 'positive';
      confidence = 82;
      break;
      
    case 'Active':
      message = `📊 Relationship Analysis: Your relationship with ${person.name} (${relationshipLength}).\n\nInsight: Your response rate is 94% with an average reply time of 8 hours. This indicates strong engagement.\n\nRecommended Action: Share relevant industry insights or schedule a casual check-in. Data shows that maintaining bi-weekly contact optimizes professional relationships at this stage.`;
      recommendedMeetingType = 'lunch meeting';
      recommendedContent = 'a recent case study in their field';
      recommendedContact = 'a potential client for their services';
      recommendedFrequency = 'bi-weekly';
      sentiment = 'positive';
      confidence = 91;
      break;
      
    case 'Inactive':
      message = `📊 Relationship Analysis: Your relationship with ${person.name} has been inactive for 3 months (total length: ${relationshipLength}).\n\nInsight: The optimal re-engagement window is closing, as data shows 75% success rate drops significantly after 4 months of inactivity.\n\nRecommended Action: Reach out with a no-pressure message that references your last interaction about their project at ${person.company}.`;
      recommendedMeetingType = 'casual video call';
      recommendedContent = 'a news article relevant to their industry';
      recommendedContact = 'a mutual connection to reconnect through';
      recommendedFrequency = 'monthly to rebuild consistency';
      sentiment = 'neutral';
      confidence = 85;
      break;
      
    case 'Close':
      message = `📊 Relationship Analysis: You have a close relationship with ${person.name} (${relationshipLength}).\n\nInsight: Your communication patterns show consistent engagement with peaks around project deadlines. The relationship has a 92% reciprocity rate (balanced give-and-take).\n\nRecommended Action: Consider them for strategic collaborations and maintain your current communication cadence.`;
      recommendedMeetingType = 'strategic planning session';
      recommendedContent = 'exclusive industry insights';
      recommendedContact = 'a high-value connection in your network';
      recommendedFrequency = 'maintain current weekly cadence';
      sentiment = 'positive';
      confidence = 94;
      break;
      
    default:
      message = `📊 Relationship Analysis: Your connection with ${person.name} shows regular interaction patterns over ${relationshipLength}.\n\nInsight: Professional relationships with consistent monthly contact have 68% higher retention rates than sporadic interactions.\n\nRecommended Action: Schedule a casual check-in meeting to maintain connection strength.`;
      recommendedMeetingType = 'brief check-in call';
      recommendedContent = 'an interesting article in their field';
      recommendedContact = 'someone in your network they might benefit from knowing';
      recommendedFrequency = 'monthly';
      sentiment = 'neutral';
      confidence = 78;
  }
  
  return {
    message,
    recommendedMeetingType,
    recommendedContent,
    recommendedContact,
    recommendedFrequency,
    sentiment,
    confidence
  };
}

// Calculate relationship length based on the last contacted date
function calculateRelationshipLength(lastContactedDate: string): string {
  const lastContact = new Date(lastContactedDate);
  const today = new Date();
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(today.getTime() - lastContact.getTime());
  
  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  }
}

// Extract financial information
function extractFinancialInfo(command: string, person: Person) {
  // Simulate NLP extraction - would use ML models in production
  const types = ['payment', 'invoice', 'reimbursement', 'transaction'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const directions = ['to', 'from'];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  const categories = ['business expense', 'project fee', 'consultation', 'subscription'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Amount extraction
  let amount = '$' + (Math.floor(Math.random() * 900) + 100);
  const amountMatch = command.match(/\$\d+|\d+ dollars|\d+\$/);
  if (amountMatch) {
    amount = amountMatch[0];
  }
  
  // Due date
  const today = new Date();
  const dueDate = new Date(today);
  const daysUntilDue = Math.floor(Math.random() * 21) + 7; // 7-28 days
  dueDate.setDate(today.getDate() + daysUntilDue);
  
  return {
    type,
    direction,
    amount,
    dueDate: dueDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    category,
    daysUntilDue
  };
}

// Suggest optimal meeting times
function suggestMeetingTimes(command: string, person: Person) {
  // In production, this would analyze calendar availability
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['9:00 AM', '11:30 AM', '1:00 PM', '3:30 PM', '4:30 PM'];
  
  // Generate 3 options
  const options = [];
  for (let i = 0; i < 3; i++) {
    const day = days[Math.floor(Math.random() * days.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    options.push(`${day} at ${time}`);
  }
  
  // Choose recommended option
  const recommended = options[Math.floor(Math.random() * options.length)];
  
  return {
    option1: options[0],
    option2: options[1],
    option3: options[2],
    recommended,
    duration: `${Math.floor(Math.random() * 2) + 1} hour${Math.random() > 0.5 ? 's' : ''}`
  };
}

// Generate progress report
function generateProgressReport(person: Person) {
  // In production, this would analyze project data
  const completion = Math.floor(Math.random() * 100);
  const onTrack = Math.random() > 0.3; // 70% chance of being on track
  
  // ETA calculation
  const today = new Date();
  const eta = new Date(today);
  eta.setDate(today.getDate() + Math.floor(Math.random() * 60) + 7); // 7-67 days
  
  // Generate summary
  let summary = '';
  if (person.tasks.length > 0) {
    summary = `Tasks assigned to ${person.name}:\n`;
    for (const task of person.tasks) {
      summary += `- ${task.title}: ${task.status === 'completed' ? 'Completed ✅' : 'In progress ⏳'}\n`;
    }
  } else {
    summary = `No specific tasks assigned to ${person.name} yet.`;
  }
  
  // Generate recommendation
  let recommendation = '';
  if (onTrack) {
    recommendation = `Recommendation: Continue current pace. Project is on track for successful completion.`;
  } else {
    recommendation = `Recommendation: Consider adjusting timeline or resources. Current progress is behind optimal schedule.`;
  }
  
  return {
    summary,
    completion,
    onTrack,
    eta: eta.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    recommendation,
    sentiment: onTrack ? 'positive' as const : 'negative' as const
  };
}

// Guess user intent when command is unclear
function guessUserIntent(command: string, person: Person) {
  // Would use ML-based intent classification in production
  return [
    {
      description: "Get information about your relationship with this person",
      confidence: 68,
      suggestedAction: "Analyze my relationship with " + person.name
    },
    {
      description: "Schedule a meeting or call",
      confidence: 45,
      suggestedAction: "Schedule a meeting with " + person.name
    },
    {
      description: "Assign or track tasks",
      confidence: 38,
      suggestedAction: "Show tasks assigned to " + person.name
    }
  ];
}

// Add a new task to a person's tasks (in a real app, this would update the database)
export const addTaskToPerson = (
  person: Person,
  taskTitle: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
): Person => {
  const newTask = {
    id: `t${person.tasks.length + 1}`,
    title: taskTitle,
    dueDate: dueDate,
    status: 'pending' as const,
    priority: priority,
  };
  
  // In a real app, this would make an API call to update the database
  // For this demo, we'll show a toast notification
  toast({
    title: "Task added",
    description: `"${taskTitle}" assigned to ${person.name}`,
    duration: 3000,
  });
  
  // Return updated person (in a real app, this would come from the server)
  return {
    ...person,
    tasks: [...person.tasks, newTask]
  };
};

// Complete a task (in a real app, this would update the database)
export const completeTask = (person: Person, taskId: string): Person => {
  const updatedTasks = person.tasks.map(task => 
    task.id === taskId 
      ? { ...task, status: 'completed' as const } 
      : task
  );
  
  // In a real app, this would make an API call to update the database
  toast({
    title: "Task completed",
    description: `Task for ${person.name} marked as complete`,
    duration: 3000,
  });
  
  // Return updated person (in a real app, this would come from the server)
  return {
    ...person,
    tasks: updatedTasks
  };
};

// Generate an AI-powered relationship insight
export const generateRelationshipInsight = (person: Person): string => {
  // In a real app, this would use ML models to generate insights based on actual data
  const insights = [
    `Based on communication patterns, your relationship with ${person.name} is strongest when discussing ${person.role.toLowerCase()}-related topics. Consider focusing on these areas to strengthen engagement.`,
    
    `You typically connect with ${person.name} every 2-3 weeks. Analytics suggest scheduling your next check-in within 8 days to maintain optimal relationship health.`,
    
    `${person.name}'s response time to your messages averages 8 hours. This places them in the top 15% of your network for engagement, indicating a strong relationship foundation.`,
    
    `You've had ${person.meetings.length} meetings with ${person.name} this quarter, which is 42% above average for your network. This suggests a priority relationship.`,
    
    `${person.name}'s online reputation score of ${person.reputationScore} indicates they are well-regarded in their field. Their visibility has increased 18% in the last month.`,
    
    `Your conversations with ${person.name} trend 27% more ${person.meetings[0]?.sentiment || 'neutral'} than your average professional communications. This indicates strong rapport.`,
    
    `Network analysis suggests that introducing ${person.name} to your contacts in the ${Math.random() > 0.5 ? 'marketing' : 'development'} department could create valuable synergies.`,
    
    `${person.name} from ${person.company} has expertise that complements your recent projects. Consider collaboration on ${Math.random() > 0.5 ? 'upcoming product launches' : 'market expansion initiatives'}.`,
    
    `Sentiment analysis of recent communications with ${person.name} shows a positive trend, with engagement increasing by approximately 23% over the past month.`,
    
    `${person.name} has viewed your profile 3 times in the past week, suggesting they may be interested in reconnecting or discussing new opportunities.`
  ];
  
  // Return a more detailed insight
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  
  // Add a data-driven recommendation
  const recommendations = [
    `Recommendation: Schedule a brief check-in call within the next 5 business days.`,
    `Suggestion: Share an industry article relevant to their current projects at ${person.company}.`,
    `Action item: Consider introducing them to relevant contacts in your network.`,
    `Follow-up: Your calendar shows you'll both be at the industry conference next month - consider scheduling a meeting.`
  ];
  
  const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
  
  return `${randomInsight}\n\n${randomRecommendation}`;
};
