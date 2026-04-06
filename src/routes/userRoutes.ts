import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

export default router;
