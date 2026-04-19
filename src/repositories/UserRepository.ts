import { User } from '../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { UserRole } from '../models/Enums';

export class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private users: User[] = [
    { userId: 'USR-MOCK-1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-2', name: 'Bob Builder', email: 'bob@example.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-3', name: 'Admin User', email: 'admin@propestate.com', role: UserRole.ADMIN },
    { userId: 'USR-MOCK-4', name: 'Diana Prince', email: 'diana@luxuryestates.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-5', name: 'Evan Broker', email: 'evan@cityhomes.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-6', name: 'Franklin Snow', email: 'franklin@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-7', name: 'Grace Hopper', email: 'grace@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-8', name: 'Hank Pym', email: 'hank@microestates.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-9', name: 'Ian Wright', email: 'ian@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-10', name: 'Jessica Jones', email: 'jessica@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-11', name: 'Kevin Flynn', email: 'kevin@gridhomes.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-12', name: 'Laura Croft', email: 'laura@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-13', name: 'Maxwell Lord', email: 'maxwell@imperialestates.com', role: UserRole.OWNER },
    { userId: 'USR-MOCK-14', name: 'Nina Williams', email: 'nina@example.com', role: UserRole.CUSTOMER },
    { userId: 'USR-MOCK-15', name: 'Oliver Queen', email: 'oliver@arrowprop.com', role: UserRole.OWNER }
  ];

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

  public deleteUser(userId: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.userId !== userId);
    return this.users.length < initialLength;
  }

  public updateUser(userId: string, update: Partial<User>): User | undefined {
    const user = this.findById(userId);
    if (user) {
      Object.assign(user, update);
    }
    return user;
  }
}
