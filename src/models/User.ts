import { UserRole } from './Enums';

export abstract class User {
  constructor(
    public userId: string,
    public name: string,
    public email: string,
    public role: UserRole
  ) {}
}

export class Customer extends User {
  constructor(userId: string, name: string, email: string) {
    super(userId, name, email, UserRole.CUSTOMER);
  }
}

export class Owner extends User {
  constructor(userId: string, name: string, email: string) {
    super(userId, name, email, UserRole.OWNER);
  }
}

export class Admin extends User {
  constructor(userId: string, name: string, email: string) {
    super(userId, name, email, UserRole.ADMIN);
  }
}
