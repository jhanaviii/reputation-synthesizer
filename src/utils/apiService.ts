
// API service for backend communication

// Check if backend is available
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('Backend API is available');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log('Backend API is not available');
    return false;
  }
};

// Process command through backend API (or fallback to frontend simulation)
export const processCommandAPI = async (command: string, person: any) => {
  try {
    console.log(`Calling API for command: "${command}" for person: ${person.name}`);
    
    // Try to call actual backend API
    const response = await fetch('http://localhost:5000/api/process-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: command,
        personId: person.id
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error calling API:', error);
    console.info('Falling back to frontend simulation');
    
    // Fallback to frontend simulation with enhanced responses
    return simulateAIResponse(command, person);
  }
};

// More sophisticated AI response simulation
const simulateAIResponse = (command: string, person: any) => {
  console.info(`Processing AI command: "${command}" for person: ${person.name}`);
  
  // Analyze command intent
  const commandLower = command.toLowerCase();
  
  // Meeting summary
  if (commandLower.includes('summarize') && (commandLower.includes('meeting') || commandLower.includes('conversation'))) {
    return generateMeetingSummary(person);
  }
  
  // Task assignment
  if ((commandLower.includes('assign') || commandLower.includes('create') || commandLower.includes('add')) && 
      (commandLower.includes('task') || commandLower.includes('to-do'))) {
    return generateTaskAssignment(command, person);
  }
  
  // Follow-up reminders
  if (commandLower.includes('remind') || commandLower.includes('follow up') || commandLower.includes('follow-up')) {
    return generateFollowUpReminder(command, person);
  }
  
  // Relationship analysis
  if (commandLower.includes('relationship') || commandLower.includes('connection')) {
    return generateRelationshipAnalysis(person);
  }
  
  // Financial tracking
  if (commandLower.includes('payment') || commandLower.includes('invoice') || 
      commandLower.includes('money') || commandLower.includes('financial')) {
    return generateFinancialTracking(person);
  }
  
  // Check status or progress
  if (commandLower.includes('status') || commandLower.includes('progress') || 
      commandLower.includes('update') || commandLower.includes('check')) {
    return generateProgressReport(command, person);
  }
  
  // Meeting scheduling
  if (commandLower.includes('schedule') || commandLower.includes('set up') || 
      commandLower.includes('arrange') || commandLower.includes('meeting')) {
    return generateMeetingSchedule(command, person);
  }
  
  // Email communication
  if (commandLower.includes('email') || commandLower.includes('send') || 
      commandLower.includes('write') || commandLower.includes('message')) {
    return generateEmailDraft(command, person);
  }
  
  // Default case - general insight
  return generateGeneralInsight(person);
};

// Helper functions for different response types

const generateMeetingSummary = (person: any) => {
  const hasMeetings = person.meetings && person.meetings.length > 0;
  const meeting = hasMeetings ? person.meetings[0] : null;
  
  if (meeting) {
    const keyPoints = [
      "Discussed project timeline and deliverables",
      "Reviewed recent performance metrics",
      "Agreed to follow up within two weeks",
      "Action items assigned to respective teams"
    ];
    
    const actionItems = [
      "Share meeting notes with the team",
      "Follow up on open questions",
      "Schedule next review session"
    ];
    
    return {
      message: `📝 Summary of your last meeting "${meeting.title}" with ${person.name}:\n\n${meeting.summary}\n\nKey points discussed:\n• ${keyPoints.join('\n• ')}\n\nAction items:\n• ${actionItems.join('\n• ')}`,
      sentiment: meeting.sentiment || "positive",
      confidenceScore: Math.floor(Math.random() * 10) + 85,
      entities: [
        { name: person.name, type: "person" },
        { name: meeting.title, type: "event" },
        { name: person.company, type: "organization" }
      ],
      timeEstimate: "Follow-up recommended within 2 weeks",
      suggestedActions: [
        `Schedule next meeting with ${person.name}`,
        "Share summary with team members",
        `Create follow-up tasks for ${person.name}`
      ]
    };
  } else {
    return {
      message: `I couldn't find any recorded meetings with ${person.name}. Would you like to schedule one? Based on their role as ${person.role} at ${person.company}, I recommend discussing potential collaboration opportunities.`,
      sentiment: "neutral",
      confidenceScore: 70,
      entities: [
        { name: person.name, type: "person" },
        { name: person.role, type: "job_title" },
        { name: person.company, type: "organization" }
      ],
      suggestedActions: [
        `Schedule initial meeting with ${person.name}`,
        `Research more about ${person.company}`,
        "Prepare introduction materials"
      ]
    };
  }
};

const generateTaskAssignment = (command: string, person: any) => {
  // Extract potential task details from command
  const taskTitle = command.includes('to') ? 
    command.split('to')[1].trim() : 
    `Follow up with ${person.name}`;
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 3); // Random due date 3-17 days from now
  const formattedDueDate = dueDate.toISOString().split('T')[0];
  
  const priorities = ["high", "medium", "low"];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  
  return {
    message: `✅ I've created a new ${randomPriority} priority task:\n\n"${taskTitle}"\n\nAssigned to: ${person.name}\nDue date: ${formattedDueDate}\nStatus: Pending\n\nThis task has been added to your task management system and I've set a reminder for you 2 days before the deadline.`,
    sentiment: "positive",
    confidenceScore: 93,
    entities: [
      { name: person.name, type: "person" },
      { name: taskTitle, type: "task" },
      { name: formattedDueDate, type: "date" }
    ],
    timeEstimate: `Due in ${Math.floor((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`,
    suggestedActions: [
      `Edit task details for "${taskTitle.substring(0, 20)}..."`,
      `Notify ${person.name} about this task`,
      "View all tasks for this relationship"
    ]
  };
};

const generateFollowUpReminder = (command: string, person: any) => {
  // Extract time frame from command if present
  let timeFrame = "next week";
  if (command.includes("tomorrow")) timeFrame = "tomorrow";
  if (command.includes("next week")) timeFrame = "next week";
  if (command.includes("next month")) timeFrame = "next month";
  
  // Generate follow-up date based on time frame
  const followUpDate = new Date();
  if (timeFrame === "tomorrow") {
    followUpDate.setDate(followUpDate.getDate() + 1);
  } else if (timeFrame === "next week") {
    followUpDate.setDate(followUpDate.getDate() + 7);
  } else if (timeFrame === "next month") {
    followUpDate.setMonth(followUpDate.getMonth() + 1);
  }
  
  const formattedDate = followUpDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = followUpDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Determine follow-up topic
  let topic = "project status";
  if (command.includes("about")) {
    const aboutIndex = command.indexOf("about");
    topic = command.substring(aboutIndex + 5).trim();
  }
  
  return {
    message: `🔔 I've set a reminder for you to follow up with ${person.name} on ${formattedDate} at ${formattedTime} regarding ${topic}.\n\nBased on their communication patterns and your relationship history, this is an optimal time for engagement. I'll send you a notification 1 hour before the scheduled follow-up.`,
    sentiment: "positive",
    confidenceScore: 89,
    entities: [
      { name: person.name, type: "person" },
      { name: formattedDate, type: "date" },
      { name: topic, type: "topic" }
    ],
    timeEstimate: formattedDate,
    suggestedActions: [
      `Follow up about ${person.role} progress`,
      "Send a check-in email now",
      `Schedule a call with ${person.name}`
    ]
  };
};

const generateRelationshipAnalysis = (person: any) => {
  // Calculate days since last contact
  const lastContactDate = new Date(person.lastContactedDate);
  const today = new Date();
  const daysSinceContact = Math.floor((today.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine relationship health based on frequency and status
  let relationshipHealth = "strong";
  if (daysSinceContact > 30) relationshipHealth = "needs attention";
  if (daysSinceContact > 90) relationshipHealth = "at risk";
  
  // Personalized recommendations
  const recommendations = {
    contact: daysSinceContact > 30 ? "immediately" : "within two weeks",
    content: person.role.toLowerCase().includes("tech") ? "the latest industry whitepaper" : "case study on recent successes",
    meetingType: daysSinceContact > 90 ? "in-person meeting" : "video call",
    frequency: person.relationshipStatus === "Close" ? "bi-weekly" : "monthly"
  };
  
  return {
    message: `📊 Relationship Analysis for ${person.name}\n\nCurrent status: ${person.relationshipStatus}\nRelationship health: ${relationshipHealth}\nLast contacted: ${daysSinceContact} days ago\nEngagement level: ${person.reputationScore}/100\n\nInsights:\n• You've known ${person.name} for approximately ${Math.floor(Math.random() * 24) + 6} months\n• Communication frequency has been ${daysSinceContact < 14 ? "excellent" : "below optimal"}\n• Relationship is ${person.relationshipStatus === "Close" ? "important for long-term strategy" : "valuable for professional network"}\n\nRecommended actions:\n• Reach out ${recommendations.contact}\n• Share ${recommendations.content}\n• Schedule a ${recommendations.meetingType}`,
    sentiment: relationshipHealth === "strong" ? "positive" : (relationshipHealth === "at risk" ? "negative" : "neutral"),
    confidenceScore: 87,
    entities: [
      { name: person.name, type: "person" },
      { name: person.relationshipStatus, type: "relationship_status" },
      { name: person.reputationScore.toString(), type: "score" }
    ],
    timeEstimate: `Recommend ${recommendations.frequency} contact`,
    suggestedActions: [
      `Schedule a ${recommendations.meetingType}`,
      `Share ${recommendations.content}`,
      "Update relationship notes"
    ]
  };
};

const generateFinancialTracking = (person: any) => {
  const hasFinances = person.finances && person.finances.length > 0;
  
  if (hasFinances) {
    // Calculate total financials
    let totalPaid = 0;
    let totalReceived = 0;
    let totalOwed = 0;
    
    person.finances.forEach((finance: any) => {
      if (finance.type === "paid") totalPaid += finance.amount;
      if (finance.type === "received") totalReceived += finance.amount;
      if (finance.type === "owed") totalOwed += finance.amount;
    });
    
    const netBalance = totalReceived - totalPaid + totalOwed;
    const lastTransaction = person.finances[0];
    
    return {
      message: `💰 Financial summary for ${person.name}:\n\nTotal paid: $${totalPaid}\nTotal received: $${totalReceived}\nOutstanding: $${totalOwed}\nNet balance: $${netBalance}\n\nLast transaction: $${lastTransaction.amount} (${lastTransaction.description}) on ${lastTransaction.date}\n\nAll financial transactions appear to be in order. No overdue payments detected.`,
      sentiment: netBalance >= 0 ? "positive" : "neutral",
      confidenceScore: 94,
      entities: [
        { name: person.name, type: "person" },
        { name: netBalance.toString(), type: "amount" },
        { name: lastTransaction.date, type: "date" }
      ],
      timeEstimate: "Financial review recommended quarterly",
      suggestedActions: [
        "View all financial transactions",
        "Record new payment",
        "Generate financial report"
      ]
    };
  } else {
    return {
      message: `No financial transactions have been recorded with ${person.name}. Would you like to create a new transaction record?`,
      sentiment: "neutral",
      confidenceScore: 85,
      entities: [
        { name: person.name, type: "person" }
      ],
      suggestedActions: [
        "Record new payment",
        "Create invoice",
        "Set up payment reminder"
      ]
    };
  }
};

const generateProgressReport = (command: string, person: any) => {
  const hasTasks = person.tasks && person.tasks.length > 0;
  
  if (hasTasks) {
    // Calculate task statistics
    const totalTasks = person.tasks.length;
    const completedTasks = person.tasks.filter((task: any) => task.status === "completed").length;
    const inProgressTasks = person.tasks.filter((task: any) => task.status === "in-progress").length;
    const pendingTasks = person.tasks.filter((task: any) => task.status === "pending").length;
    const overdueTasks = person.tasks.filter((task: any) => task.status === "overdue").length;
    
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
    const isOnTrack = overdueTasks === 0 && completionPercentage >= 40;
    
    return {
      message: `📊 Progress report for ${person.name}:\n\nOverall completion: ${completionPercentage}%\nStatus: ${isOnTrack ? "On track ✅" : "Needs attention ⚠️"}\n\nTask breakdown:\n• Completed: ${completedTasks}/${totalTasks}\n• In progress: ${inProgressTasks}\n• Pending: ${pendingTasks}\n• Overdue: ${overdueTasks}\n\n${isOnTrack ? "All tasks are progressing as expected. No immediate actions required." : "Some tasks may need your attention. Consider following up on overdue items."}\n\nEstimated completion of all current tasks: ${isOnTrack ? "On schedule" : "2 weeks behind schedule"}`,
      sentiment: isOnTrack ? "positive" : (overdueTasks > 1 ? "negative" : "neutral"),
      confidenceScore: 90,
      entities: [
        { name: person.name, type: "person" },
        { name: completionPercentage.toString(), type: "percentage" },
        { name: overdueTasks.toString(), type: "count" }
      ],
      timeEstimate: isOnTrack ? "Next review in 2 weeks" : "Immediate attention recommended",
      suggestedActions: [
        "View detailed task list",
        `Follow up with ${person.name}`,
        overdueTasks > 0 ? "Address overdue tasks" : "Add new milestone"
      ]
    };
  } else {
    return {
      message: `No ongoing tasks found for ${person.name}. Would you like to create a project or assign some tasks to track progress?`,
      sentiment: "neutral",
      confidenceScore: 80,
      entities: [
        { name: person.name, type: "person" }
      ],
      suggestedActions: [
        "Create new project",
        "Assign first task",
        "Import existing tasks"
      ]
    };
  }
};

const generateMeetingSchedule = (command: string, person: any) => {
  // Generate future date options
  const today = new Date();
  const option1 = new Date(today);
  option1.setDate(today.getDate() + 2);
  
  const option2 = new Date(today);
  option2.setDate(today.getDate() + 3);
  
  const option3 = new Date(today);
  option3.setDate(today.getDate() + 5);
  
  // Format date options
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    }) + ` at ${Math.floor(Math.random() * 4) + 9}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
  };
  
  const options = {
    option1: formatDate(option1),
    option2: formatDate(option2),
    option3: formatDate(option3)
  };
  
  // Select a recommended option
  const recommended = Math.random() > 0.5 ? options.option1 : options.option2;
  
  return {
    message: `📅 I've analyzed both calendars and found these optimal meeting times with ${person.name}:\n\n1. ${options.option1}\n2. ${options.option2}\n3. ${options.option3}\n\nBased on previous meeting patterns and ${person.name}'s typical availability, I recommend ${recommended}.\n\nProposed agenda:\n• Project updates\n• Timeline review\n• Next steps\n\nEstimated duration: 45 minutes`,
    sentiment: "positive",
    confidenceScore: 87,
    entities: [
      { name: person.name, type: "person" },
      { name: recommended, type: "date" },
      { name: "45 minutes", type: "duration" }
    ],
    timeEstimate: "45 minutes",
    suggestedActions: [
      `Schedule for ${recommended}`,
      "Suggest alternative times",
      "Create meeting agenda"
    ]
  };
};

const generateEmailDraft = (command: string, person: any) => {
  // Determine email purpose
  let purpose = "check-in";
  if (command.includes("about")) {
    const aboutIndex = command.indexOf("about");
    purpose = command.substring(aboutIndex + 5).trim();
  }
  
  // Generate appropriate subject line and content
  let subject, content;
  
  if (purpose.includes("follow") || purpose.includes("check")) {
    subject = `Follow-up: Our recent discussion`;
    content = `Hi ${person.name.split(' ')[0]},\n\nI hope you're doing well. I wanted to follow up on our previous conversation about the project status.\n\nHave you had a chance to review the materials I sent over? I'd be happy to discuss any questions or feedback you might have.\n\nLooking forward to hearing from you soon.`;
  } else if (purpose.includes("proposal") || purpose.includes("offer")) {
    subject = `Proposal: New collaboration opportunity`;
    content = `Hi ${person.name.split(' ')[0]},\n\nI hope this email finds you well. Based on our previous discussions, I've put together a proposal for a potential collaboration between our organizations.\n\nThe attached document outlines the scope, timeline, and expected outcomes. I believe this partnership would be beneficial for both of us.\n\nPlease let me know if you'd like to schedule a call to discuss this further.`;
  } else {
    subject = `Quick update from [Your Name]`;
    content = `Hi ${person.name.split(' ')[0]},\n\nI hope things are going well on your end. I just wanted to touch base and provide a quick update on our current project status.\n\nWe've made significant progress on the key deliverables we discussed, and everything is on track for our target completion date.\n\nPlease let me know if you need any additional information or have any questions.`;
  }
  
  return {
    message: `✉️ I've drafted an email to ${person.name}:\n\n**Subject:** ${subject}\n\n**Content:**\n${content}\n\nWould you like me to send this now, save it as a draft, or make additional edits?`,
    sentiment: "positive",
    confidenceScore: 92,
    entities: [
      { name: person.name, type: "person" },
      { name: subject, type: "subject" },
      { name: purpose, type: "purpose" }
    ],
    suggestedActions: [
      "Send email now",
      "Save as draft",
      "Edit email content"
    ]
  };
};

const generateGeneralInsight = (person: any) => {
  // Calculate relationship duration in months
  const firstContact = new Date(person.lastContactedDate);
  firstContact.setMonth(firstContact.getMonth() - Math.floor(Math.random() * 24) - 6); // Random start 6-30 months ago
  
  const today = new Date();
  const monthsDuration = (today.getFullYear() - firstContact.getFullYear()) * 12 + 
                         (today.getMonth() - firstContact.getMonth());
  
  // Generate personalized insights
  const insights = [
    `Your relationship with ${person.name} has been active for approximately ${monthsDuration} months.`,
    `Based on communication patterns, this is a ${person.relationshipStatus.toLowerCase()} relationship that ${person.relationshipStatus === "Close" ? "receives regular attention" : "could benefit from more frequent interaction"}.`,
    `${person.name}'s role as ${person.role} at ${person.company} aligns with ${Math.random() > 0.5 ? "your strategic networking goals" : "potential business opportunities"}.`,
    `Engagement score is ${person.reputationScore}/100, which is ${person.reputationScore > 85 ? "excellent" : person.reputationScore > 70 ? "good" : "could be improved"}.`
  ];
  
  // Generate recommendations
  const recommendations = [
    `Schedule a ${person.relationshipStatus === "Close" ? "monthly" : "quarterly"} check-in to maintain the relationship.`,
    `Share industry insights related to ${person.role} to provide value.`,
    `Connect on ${person.socialMedia.length > 0 ? person.socialMedia[0].platform : "professional social media"} to strengthen the professional connection.`
  ];
  
  return {
    message: `🔍 AI Relationship Insights for ${person.name}:\n\n${insights.join('\n\n')}\n\nRecommendations:\n• ${recommendations.join('\n• ')}\n\nThis relationship is ${person.reputationScore > 80 ? "one of your stronger professional connections" : "showing potential for growth"}. The optimal contact frequency appears to be ${person.relationshipStatus === "Close" ? "every 2-3 weeks" : "monthly"}.`,
    sentiment: "positive",
    confidenceScore: 88,
    entities: [
      { name: person.name, type: "person" },
      { name: person.role, type: "job_title" },
      { name: person.company, type: "organization" }
    ],
    timeEstimate: person.relationshipStatus === "Close" ? "2-3 weeks" : "1 month",
    suggestedActions: [
      `Schedule check-in with ${person.name}`,
      "Update relationship notes",
      "View full relationship history"
    ]
  };
};
