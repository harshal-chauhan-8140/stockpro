import { Router } from 'express';
import { getStocksWithCandles } from '../controllers/stockController';

const router = Router();

router.get('/', getStocksWithCandles);

export default router;