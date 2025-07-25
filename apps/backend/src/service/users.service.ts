import { BaseService } from "../core/base.service";
import { UsersRepository } from "../repository/users.repository";
import type { users } from "../schemas/users";

const usersRepository = new UsersRepository();

export class UsersService extends BaseService<
  typeof users.$inferSelect,
  UsersRepository
> {
  constructor() {
    super(usersRepository);
  }
}
