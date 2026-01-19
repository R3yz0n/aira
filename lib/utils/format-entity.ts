/**
 * Formats the `createdAt` and `updatedAt` fields of an entity to ISO strings.
 *
 * @param entity - The entity to format.
 * @returns The formatted entity.
 */
export function formatTimestamps<T extends { createdAt: any; updatedAt?: any }>(entity: T): T {
  return {
    ...entity,
    createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
    updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
  };
}

/**
 * Formats an entity or array of entities by ensuring `createdAt` and `updatedAt` are ISO strings.
 *
 * @param data - The entity or array of entities to format.
 * @returns The formatted entity or array of entities.
 */
export function formatEntityDates<T extends { createdAt: any; updatedAt?: any }>(
  data: T | T[]
): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item) => formatTimestamps(item));
  }

  return formatTimestamps(data);
}
