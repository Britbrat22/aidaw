import express from 'express';
import { Goal, Checkin } from '../database/db.js';
import aiService from '../services/aiService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new goal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const goal = Goal.create(userId, title, description);
    res.status(201).json({ message: 'Goal created', goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all goals for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const goals = Goal.findByUserId(userId);
    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get goal suggestion from AI
router.get('/suggestion', authMiddleware, async (req, res) => {
  try {
    const suggestion = await aiService.suggestGoal();
    res.json({ suggestion });
  } catch (error) {
    console.error('Get suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment goal streak
router.post('/:goalId/streak', authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;
    const goal = Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (goal.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = Goal.incrementStreak(goalId);
    res.json({ message: 'Streak updated', goal: updated });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete goal
router.post('/:goalId/complete', authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;
    const goal = Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (goal.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = Goal.complete(goalId);
    res.json({ message: 'Goal completed', goal: updated });
  } catch (error) {
    console.error('Complete goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create checkin
router.post('/checkins', authMiddleware, async (req, res) => {
  try {
    const { mood, notes } = req.body;
    const userId = req.userId;

    const checkin = Checkin.create(userId, mood, notes);
    res.status(201).json({ message: 'Checkin created', checkin });
  } catch (error) {
    console.error('Create checkin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get checkins
router.get('/checkins', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 30;
    const checkins = Checkin.findByUserId(userId, limit);
    res.json({ checkins });
  } catch (error) {
    console.error('Get checkins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
