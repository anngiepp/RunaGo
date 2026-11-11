import { Router } from 'express';
import { getPlan } from '../controllers/favorito.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getPlan);

export default router;
