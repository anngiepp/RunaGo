import { Router } from 'express';
import { getMe, patchMe, putIntereses } from '../controllers/me.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { interesesSchema } from '../validators/intereses.validator';
import { perfilSchema } from '../validators/perfil.validator';

const router = Router();

router.use(authenticate);
router.get('/', getMe);
router.patch('/', validate(perfilSchema), patchMe);
router.put('/interests', validate(interesesSchema), putIntereses);
// Nombre anterior, lo usa la app desde el Sprint 1
router.put('/intereses', validate(interesesSchema), putIntereses);

export default router;
