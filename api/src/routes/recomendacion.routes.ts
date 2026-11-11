import { Router } from 'express';
import { getRecomendaciones } from '../controllers/recomendacion.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getRecomendaciones);

export default router;
