export interface BaseModel {
  id: number;
}

export abstract class BaseRepository<S extends BaseModel> {
  abstract getAll(limit?: number, offset?: number): Promise<S[]>;
  abstract getById(id: number): Promise<S | null>;
  abstract getById<TColumns extends { [key in keyof S]?: true }>(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof S ? S[K] : never;
      }
    | null
  >;
  abstract create(data: Omit<S, "id">): Promise<S>;
  abstract update(id: number, data: Partial<S>): Promise<S>;
  abstract delete(id: number): Promise<void>;
}
