import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
