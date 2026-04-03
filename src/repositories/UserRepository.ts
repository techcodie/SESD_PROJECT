import { User } from '../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private users: User[] = [];

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  public save(user: User): User {
    this.users.push(user);
    return user;
  }

  public findById(userId: string): User | undefined {
    return this.users.find(u => u.userId === userId);
  }

  public findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  public findAll(): User[] {
    return this.users;
  }
}
