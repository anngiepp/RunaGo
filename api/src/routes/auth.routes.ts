import { Router } from 'express';
import { login, registro } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registroSchema } from '../validators/auth.validator';

const router = Router();

router.post('/registro', validate(registroSchema), registro);
router.post('/login', validate(loginSchema), login);

export default router;
