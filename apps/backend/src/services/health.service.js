export const checkHealth = async () => {
  return {
    status: 'ok',
    message: 'Mini OMS Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
};
