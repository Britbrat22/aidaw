// AI Therapist Service - Simulates an AI couples therapist
// In production, this would connect to OpenAI, Claude, or similar

const THERAPY_RESPONSES = {
  greeting: [
    "Hi! I'm here to help you both communicate better. What's one thing you'd love to improve this month?",
    "Welcome! I'm your AI couples therapist. What brought you here today?",
    "Hello! I'm excited to help strengthen your relationship. What's on your mind?"
  ],

  listening: [
    "It sounds like you're feeling unheard during disagreements. That's a really common challenge, and the good news is there are proven techniques to help.",
    "I hear that communication is the main pain point. Many couples struggle with this, and small changes can make a big difference.",
    "Thank you for sharing that. Feeling like you're not being listened to can be incredibly frustrating."
  ],

  reframing: [
    "Try this reframe: Instead of 'You never listen,' try 'I feel unheard when I'm upset—can I share what I need?'",
    "Here's a different approach: 'I appreciate when you ___. It would mean a lot if we could try ___ together.'",
    "Consider saying: 'I'm feeling overwhelmed right now. Can we take a break and come back to this in 20 minutes?'"
  ],

  exercises: [
    "Let's try the '10-Minute Appreciation Chat.' Each of you takes 5 minutes to share what you appreciate about the other. The listener just says 'thank you'—no deflecting or arguing.",
    "This week's exercise: The Daily Check-in. Spend 5 minutes each day asking 'How was your day?' and really listening to the answer.",
    "Try the 'Pause and Breathe' technique. When you feel tension rising, take 3 deep breaths together before continuing the conversation."
  ],

  encouragement: [
    "That's wonderful progress! Recognizing these patterns is the first step to changing them.",
    "I'm so glad to hear that! Small wins like this build real momentum over time.",
    "You two are doing great work. Keep practicing these skills—they get easier with time."
  ],

  conflict: [
    "When tension rises, try to name the pattern: 'I notice we're both getting defensive. Can we reset?'",
    "It's okay to take a break. Say: 'I care about this conversation, but I need a few minutes to calm down.'",
    "Remember: it's you two against the problem, not you against each other."
  ],

  goals: [
    "Setting weekly intentions is a great idea! What would you like to focus on this week?",
    "Tracking your progress helps build momentum. Let's set a small, achievable goal for this week.",
    "Small, consistent actions matter more than perfect execution. What one thing can you both commit to?"
  ],

  closing: [
    "You're building healthier habits together. I'm here whenever you need support.",
    "Great session today! Remember, progress isn't linear—be patient with yourselves.",
    "I'm proud of the work you're doing. See you at your next check-in!"
  ]
};

const TOPICS = {
  communication: {
    title: "Communication Skills",
    intro: "Let's work on how you express needs and listen to each other.",
    exercises: ["Reflective Listening", "I-Statements Practice", "Daily Check-in"]
  },
  conflict: {
    title: "Healthy Conflict",
    intro: "Disagreements are normal—let's learn to navigate them better.",
    exercises: ["The Pause Technique", "Finding Common Ground", "Repair Attempts"]
  },
  trust: {
    title: "Building Trust",
    intro: "Trust is built through consistent small actions over time.",
    exercises: ["Transparency Exercise", "Vulnerability Practice", "Reliability Check"]
  },
  intimacy: {
    title: "Emotional Intimacy",
    intro: "Let's deepen your emotional connection.",
    exercises: ["Appreciation Ritual", "Dream Sharing", "Quality Time Planning"]
  },
  appreciation: {
    title: "Gratitude & Appreciation",
    intro: "Noticing the good strengthens your bond.",
    exercises: ["Daily Gratitude", "Love Languages", "Acknowledgment Practice"]
  }
};

class AIService {
  constructor() {
    this.conversationHistory = new Map();
  }

  // Generate a response based on user message and context
  async generateResponse(userMessage, sessionId, context = {}) {
    const message = userMessage.toLowerCase();
    
    // Simple intent detection
    if (this.containsAny(message, ['hello', 'hi', 'hey', 'start'])) {
      return this.getRandomResponse('greeting');
    }
    
    if (this.containsAny(message, ['listen', 'hear', 'ignore', 'talk'])) {
      return this.getRandomResponse('listening');
    }
    
    if (this.containsAny(message, ['reframe', 'say differently', 'better way'])) {
      return this.getRandomResponse('reframing');
    }
    
    if (this.containsAny(message, ['exercise', 'practice', 'try', 'activity'])) {
      return this.getRandomResponse('exercises');
    }
    
    if (this.containsAny(message, ['fight', 'argue', 'conflict', 'mad', 'angry'])) {
      return this.getRandomResponse('conflict');
    }
    
    if (this.containsAny(message, ['goal', 'intention', 'plan', 'focus'])) {
      return this.getRandomResponse('goals');
    }
    
    if (this.containsAny(message, ['thank', 'thanks', 'good', 'great', 'helped'])) {
      return this.getRandomResponse('encouragement');
    }
    
    if (this.containsAny(message, ['bye', 'goodbye', 'see you', 'later'])) {
      return this.getRandomResponse('closing');
    }

    // Default response
    return "I understand. Can you tell me more about that? I'm here to help you both communicate better and build a stronger relationship.";
  }

  // Start a guided session on a specific topic
  async startSession(topic) {
    const topicData = TOPICS[topic] || TOPICS.communication;
    return {
      title: topicData.title,
      message: topicData.intro,
      exercises: topicData.exercises
    };
  }

  // Get available topics
  getTopics() {
    return Object.entries(TOPICS).map(([key, data]) => ({
      id: key,
      title: data.title,
      description: data.intro
    }));
  }

  // Generate a reframing suggestion
  async reframeStatement(negativeStatement) {
    const reframes = [
      `Instead of "${negativeStatement}", try: "I feel concerned when..."`,
      `Consider: "I need your support with..."`,
      `A gentler approach: "I'd appreciate it if we could..."`,
      `Try expressing it as: "When ___ happens, I feel ___. I'd like ___"`
    ];
    return reframes[Math.floor(Math.random() * reframes.length)];
  }

  // Generate weekly goal suggestion
  async suggestGoal(userHistory = []) {
    const goals = [
      "Have one 10-minute appreciation chat this week",
      "Practice the pause technique during disagreements",
      "Do a daily check-in for 5 minutes each evening",
      "Write down 3 things you appreciate about your partner",
      "Plan one quality time activity together",
      "Practice reflective listening in one conversation"
    ];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  // Helper methods
  containsAny(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  getRandomResponse(category) {
    const responses = THERAPY_RESPONSES[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export default new AIService();
