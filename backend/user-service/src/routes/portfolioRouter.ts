import { Router } from 'express';
import { addFunds, getCurrentPortfolio, removeFunds } from '../controllers/portfolioController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getCurrentPortfolio);
router.post('/fund/add', addFunds);
router.post('/fund/remove', removeFunds);


export default router;
