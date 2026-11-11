import { Router } from 'express';
import { getDistritos } from '../controllers/evento.controller';

const router = Router();

router.get('/', getDistritos);

export default router;
