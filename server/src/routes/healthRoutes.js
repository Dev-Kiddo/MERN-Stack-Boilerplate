import express from 'express';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

/**
 * @desc    Check server and database status
 * @route   GET /api/health
 */
router.get('/', (req, res) => {
  const db = getDBStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: db.status,
      connected: db.stateCode === 1,
      host: db.host,
      name: db.name,
    },
  });
});

export default router;
