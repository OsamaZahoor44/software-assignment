// routes/searchHistory.js

import express from 'express';
import { saveSearchHistoryToDb, getSearchHistoryFromDb, clearSearchHistoryInDb } from '../db/searchHistory.js'; // Import the DB functions

const router = express.Router();

// POST route to save search history
router.post('/', async (req, res) => {
  const { userId, query, mediaType, extensions } = req.body;

  if (!userId || !query || !mediaType) {
    return res.status(400).json({ error: 'userId, query, and mediaType are required' });
  }

  try {
    await saveSearchHistoryToDb(userId, query, mediaType, extensions);
    res.status(200).json({ message: 'Search history saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save search history' });
  }
});

// GET route to fetch search history for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const searchHistory = await getSearchHistoryFromDb(userId); // Fetch history for the specific user
    res.status(200).json(searchHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE route to clear all search history
// DELETE route to clear search history for a specific user
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Pass the userId to the DB function that clears history
    await clearSearchHistoryInDb(userId);
    res.status(200).json({ message: 'Search history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear search history' });
  }
});

export default router;
