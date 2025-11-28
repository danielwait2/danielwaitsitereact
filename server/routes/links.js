const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const db = require('../database');

// Get all links (public)
router.get('/', async (req, res) => {
  try {
    const links = await db.all('SELECT * FROM links ORDER BY date_added DESC');
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Add new link (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const result = await db.run(
      'INSERT INTO links (title, url, description) VALUES (?, ?, ?)',
      [title.trim(), url.trim(), description ? description.trim() : null]
    );

    const link = await db.get('SELECT * FROM links WHERE id = ?', [result.lastID]);
    res.json(link);
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ error: 'Failed to add link' });
  }
});

// Update link (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    await db.run(
      'UPDATE links SET title = ?, url = ?, description = ? WHERE id = ?',
      [title.trim(), url.trim(), description ? description.trim() : null, id]
    );

    const link = await db.get('SELECT * FROM links WHERE id = ?', [id]);
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(link);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ error: 'Failed to update link' });
  }
});

// Delete link (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated click analytics
    await db.run('DELETE FROM click_analytics WHERE link_id = ?', [id]);

    // Delete the link
    await db.run('DELETE FROM links WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Track link click
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;

    await db.run('INSERT INTO click_analytics (link_id) VALUES (?)', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

module.exports = router;


