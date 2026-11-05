import { Router } from 'express';
import { getMe, putIntereses } from '../controllers/me.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { interesesSchema } from '../validators/intereses.validator';

const router = Router();

router.use(authenticate);
router.get('/', getMe);
router.put('/intereses', validate(interesesSchema), putIntereses);

export default router;
