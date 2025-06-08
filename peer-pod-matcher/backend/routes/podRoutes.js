import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { matchUserToPod } from '../services/matchinService.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const mockDataPath = path.join(__dirname, '../../data/mockProfiles.json');
    const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf8'));
    res.json(mockData || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/match', async (req, res) => {
  try {
    console.log('Received pod match request:', req.body);
    const userData = req.body;
    if (!userData.name) {
      throw new Error('Missing required field: name');
    }
    const pod = await matchUserToPod(userData);
    req.io.to(userData.name).emit('podAssigned', pod);
    res.json(pod);
  } catch (error) {
    console.error('Error matching pod:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to match pod', details: error.message });
  }
});

export default router;