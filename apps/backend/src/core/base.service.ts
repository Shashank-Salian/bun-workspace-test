import type { BaseModel, BaseRepository } from "./base.repository";

export class BaseService<
  TRow extends BaseModel,
  Repository extends BaseRepository<TRow>,
> {
  protected readonly repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: number) {
    return this.repository.getById(id);
  }

  async create(data: Omit<TRow, "id">) {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<TRow>) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
