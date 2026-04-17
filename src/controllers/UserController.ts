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

  public deleteUser = (req: Request, res: Response): void => {
    const success = this.userService.deleteUser(req.params.id);
    if (success) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  };

  public updateUser = (req: Request, res: Response): void => {
    const updated = this.userService.updateUser(req.params.id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  };

  public login = (req: Request, res: Response): void => {
    // Simple mock login via email
    const users = this.userService.getAllUsers();
    const user = users.find(u => u.email === req.body.email);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };
}
