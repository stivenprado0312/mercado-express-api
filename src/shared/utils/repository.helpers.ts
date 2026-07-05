import { NotFoundError } from '../errors';

export interface FindByIdRepository {
  findById(id: string): Promise<unknown>;
}

export async function getByIdOrThrow<T>(
  repository: { findById(id: string): Promise<T | null> },
  id: string,
  entityName: string
): Promise<T> {
  const entity = await repository.findById(id);
  if (!entity) {
    throw new NotFoundError(`${entityName} con id ${id} no encontrada`);
  }
  return entity;
}
