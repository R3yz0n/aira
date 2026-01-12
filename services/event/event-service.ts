import { EventCreateInput, IEventEntity, eventCreateSchema } from "@/domain/event";
import { EventRepository } from "@/repositories/event-repository";
import { CategoryRepository } from "@/repositories/category-repository";

export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found");
    this.name = "EventNotFoundError";
  }
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Category not found");
    this.name = "CategoryNotFoundError";
  }
}

export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async list(): Promise<IEventEntity[]> {
    return this.eventRepository.list();
  }

  async findById(id: string): Promise<IEventEntity> {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new EventNotFoundError();
    return event;
  }

  async findByCategory(categoryId: string): Promise<IEventEntity[]> {
    return this.eventRepository.findByCategory(categoryId);
  }

  async create(input: EventCreateInput): Promise<IEventEntity> {
    // Validate input
    const parsed = eventCreateSchema.parse(input);

    // Verify category exists
    const category = await this.categoryRepository.list();
    const categoryExists = category.some((cat) => cat.id === parsed.categoryId);
    if (!categoryExists) {
      throw new CategoryNotFoundError();
    }

    // Create event
    return this.eventRepository.create({
      title: parsed.title,
      description: parsed.description,
      imageUrl: parsed.imageUrl,
      categoryId: parsed.categoryId,
    });
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.eventRepository.deleteById(id);
    if (!deleted) throw new EventNotFoundError();
  }

  async countByCategory(categoryId: string): Promise<number> {
    return this.eventRepository.countByCategory(categoryId);
  }
}
