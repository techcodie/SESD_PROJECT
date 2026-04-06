import { Router } from 'express';
import { PropertyController } from '../controllers/PropertyController';

const router = Router();
const propertyController = new PropertyController();

router.post('/', propertyController.addProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);
router.patch('/:id/verify', propertyController.verifyProperty);
router.patch('/:id/status', propertyController.updateStatus);

export default router;
