import { Router } from 'express';
import { getEvento, getEventos, getEventosCerca } from '../controllers/evento.controller';
import { authOptional } from '../middlewares/auth.middleware';

const router = Router();

router.use(authOptional);
router.get('/', getEventos);
// Va antes de /:id para que "near" no se tome como un id
router.get('/near', getEventosCerca);
router.get('/:id', getEvento);

export default router;
