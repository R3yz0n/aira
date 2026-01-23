import {
  TCategoryCreateInput,
  TCategoryUpdateInput,
  ICategoryEntity,
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/domain/category";
import { CategoryRepository } from "@/repositories/category-repository";
import { EventRepository } from "@/repositories/event-repository";

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Category not found");
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async list(): Promise<ICategoryEntity[]> {
    return this.repository.list();
  }

  async create(input: TCategoryCreateInput): Promise<ICategoryEntity> {
    const parsed = categoryCreateSchema.parse(input);
    return this.repository.create({
      name: parsed.name,
      description: parsed.description,
    });
  }

  async update(id: string, input: TCategoryUpdateInput): Promise<ICategoryEntity> {
    const parsed = categoryUpdateSchema.parse(input);
    const updated = await this.repository.update(id, {
      name: parsed.name,
      description: parsed.description,
    });
    if (!updated) throw new CategoryNotFoundError();
    return updated;
  }

  /**
   * List categories including the total number of events for each category.
   * This implementation makes one repository call per category (simple and decoupled).
   */
  async listWithEventCounts(eventRepository: EventRepository): Promise<ICategoryEntity[]> {
    const categories = await this.repository.list();

    const results = await Promise.all(
      categories.map(async (c) => {
        const totalEvents = await eventRepository.countByCategory(c.id);
        return { ...c, totalEvents };
      }),
    );

    return results;
  }
}
