import express from 'express';
import healthRoutes from './health.routes.js';
import productRoutes from './product.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);

export default router;
