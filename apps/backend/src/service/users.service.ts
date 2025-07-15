import type { users } from "../schemas/users";
import { UsersRepository } from "../repository/users.repository";
import { BaseService } from "../core/base.service";

const usersRepository = new UsersRepository();

export class UsersService extends BaseService<
  typeof users.$inferSelect,
  UsersRepository
> {
  constructor() {
    super(usersRepository);
  }
}
