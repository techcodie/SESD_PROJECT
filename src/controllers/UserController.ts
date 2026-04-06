import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserRole } from '../models/Enums';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = (req: Request, res: Response): void => {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role) {
        res.status(400).json({ error: 'name, email, and role are required' });
        return;
      }

      let user;
      if (role === UserRole.CUSTOMER) {
        user = this.userService.registerCustomer(name, email);
      } else if (role === UserRole.OWNER) {
        user = this.userService.registerOwner(name, email);
      } else if (role === UserRole.ADMIN) {
        user = this.userService.registerAdmin(name, email);
      } else {
        res.status(400).json({ error: 'Invalid role. Must be CUSTOMER, OWNER, or ADMIN' });
        return;
      }

      res.status(201).json(user);
    } catch (err: any) {
      res.status(409).json({ error: err.message });
    }
  };

  public getUser = (req: Request, res: Response): void => {
    const user = this.userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  };

  public getAllUsers = (req: Request, res: Response): void => {
    res.json(this.userService.getAllUsers());
  };
}
