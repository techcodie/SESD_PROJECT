import { Customer, Owner, Admin } from '../models/User';

export interface IUserService {
  registerCustomer(name: string, email: string): Customer;
  registerOwner(name: string, email: string): Owner;
  registerAdmin(name: string, email: string): Admin;
  getUserById(userId: string): any;
  getAllUsers(): any[];
}
