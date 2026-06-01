import { checkHealth } from '../services/health.service.js';

export const getHealthStatus = async (req, res, next) => {
  try {
    const healthData = await checkHealth();
    res.status(200).json(healthData);
  } catch (error) {
    next(error);
  }
};
