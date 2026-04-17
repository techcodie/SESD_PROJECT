import { UserRepository } from '../repositories/UserRepository';
import { Customer, Owner, Admin } from '../models/User';
import { IUserService } from '../interfaces/IUserService';
import { v4 as uuidv4 } from 'uuid';

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  public registerCustomer(name: string, email: string): Customer {
    const existing = this.userRepository.findByEmail(email);
    if (existing) throw new Error('Email is already registered');

    const user = new Customer(uuidv4(), name, email);
    return this.userRepository.save(user) as Customer;
  }

  public registerOwner(name: string, email: string): Owner {
    const existing = this.userRepository.findByEmail(email);
    if (existing) throw new Error('Email is already registered');

    const user = new Owner(uuidv4(), name, email);
    return this.userRepository.save(user) as Owner;
  }

  public registerAdmin(name: string, email: string): Admin {
    const user = new Admin(uuidv4(), name, email);
    return this.userRepository.save(user) as Admin;
  }

  public getUserById(userId: string) {
    return this.userRepository.findById(userId);
  }

  public getAllUsers() {
    return this.userRepository.findAll();
  }

  public deleteUser(userId: string) {
    return this.userRepository.deleteUser(userId);
  }

  public updateUser(userId: string, data: any) {
    return this.userRepository.updateUser(userId, data);
  }
}
