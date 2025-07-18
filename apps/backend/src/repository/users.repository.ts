import { BaseRepository } from "../core/base.repository";
import { users } from "../schemas";
import type { User } from "../schemas/users";

export class UsersRepository extends BaseRepository<User, typeof users> {
  table;

  constructor() {
    super();
    this.table = users;
  }
}
