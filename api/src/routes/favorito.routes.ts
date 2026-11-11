import { Router } from 'express';
import {
  deleteFavorito,
  getFavoritos,
  postFavorito,
  putPlan,
} from '../controllers/favorito.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { planSchema } from '../validators/eventos.validator';

const router = Router();

router.use(authenticate);
router.get('/', getFavoritos);
router.post('/:eventId', postFavorito);
router.delete('/:eventId', deleteFavorito);
router.put('/:eventId/plan', validate(planSchema), putPlan);

export default router;
