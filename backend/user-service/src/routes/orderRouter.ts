import { Router } from 'express';
import { createOrder, cancelOrder } from '../controllers/orderController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/create', createOrder);
router.post('/:orderId/cancel', cancelOrder);

export default router;
