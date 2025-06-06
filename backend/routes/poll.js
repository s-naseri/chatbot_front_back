import express from 'express';
import Poll from '../models/Poll.js';
import User from '../models/User.js';

const router = express.Router();

// Submit poll answer and update user score
router.post('/polls/answer', async (req, res) => {
  try {
    const { pollId, userId, option, goalCount } = req.body;
    if (!pollId || !userId || !option) {
      return res.status(400).json({ error: 'pollId, userId and option are required' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // Check if user already answered
    const existingAnswer = poll.answers.find(a => a.userId.toString() === userId);
    if (existingAnswer) {
      return res.status(400).json({ error: 'User already answered this poll' });
    }

    // Calculate score
    let score = 0;
    if (option === poll.correctOption) {
      score += 3; // 3 points for correct prediction
    }
    if (typeof goalCount === 'number' && goalCount === poll.correctScore) {
      score += 1; // 1 point for correct goal count
    }

    // Save answer
    poll.answers.push({ userId, option, goalCount, score });
    await poll.save();

    // Update user total score
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.totalScore = (user.totalScore || 0) + score;
    await user.save();

    res.json({ message: 'Answer saved', score, totalScore: user.totalScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user total score
router.get('/users/:userId/score', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ totalScore: user.totalScore || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
