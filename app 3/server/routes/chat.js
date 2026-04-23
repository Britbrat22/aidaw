import express from 'express';
import { Session, Message } from '../database/db.js';
import aiService from '../services/aiService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new therapy session
router.post('/sessions', authMiddleware, async (req, res) => {
  try {
    const { title, topic } = req.body;
    const userId = req.userId;

    const session = Session.create(userId, title || 'New Session', topic);
    
    // Add initial AI greeting
    const greeting = await aiService.generateResponse('hello', session.id);
    Message.create(session.id, 'ai', greeting);

    res.status(201).json({
      message: 'Session created',
      session: {
        ...session,
        messages: [{ role: 'ai', content: greeting }]
      }
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all sessions for user
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const sessions = Session.findByUserId(userId);
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get session with messages
router.get('/sessions/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify ownership
    if (session.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = Message.findBySessionId(sessionId);
    
    res.json({
      session: {
        ...session,
        messages
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message and get AI response
router.post('/sessions/:sessionId/messages', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const session = Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify ownership
    if (session.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Save user message
    Message.create(sessionId, 'user', message);

    // Get AI response
    const aiResponse = await aiService.generateResponse(message, sessionId);
    
    // Save AI message
    Message.create(sessionId, 'ai', aiResponse);

    // Update session timestamp
    Session.update(sessionId, { updated_at: new Date().toISOString() });

    res.json({
      userMessage: { role: 'user', content: message },
      aiMessage: { role: 'ai', content: aiResponse }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available topics
router.get('/topics', authMiddleware, async (req, res) => {
  try {
    const topics = aiService.getTopics();
    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start a guided session on a topic
router.post('/sessions/:sessionId/topic', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { topic } = req.body;

    const session = Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const topicSession = await aiService.startSession(topic);
    
    // Save topic intro as AI message
    Message.create(sessionId, 'ai', topicSession.message);

    // Update session
    Session.update(sessionId, { topic: topicSession.title });

    res.json({
      topic: topicSession,
      message: { role: 'ai', content: topicSession.message }
    });
  } catch (error) {
    console.error('Start topic error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reframing suggestion
router.post('/reframe', authMiddleware, async (req, res) => {
  try {
    const { statement } = req.body;
    
    if (!statement) {
      return res.status(400).json({ error: 'Statement is required' });
    }

    const reframe = await aiService.reframeStatement(statement);
    res.json({ reframe });
  } catch (error) {
    console.error('Reframe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
