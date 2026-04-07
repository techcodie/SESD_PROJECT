import { User } from '../models/User';

export interface IUserRepository {
  save(user: User): User;
  findById(userId: string): User | undefined;
  findByEmail(email: string): User | undefined;
  findAll(): User[];
}
