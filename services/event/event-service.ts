import { EventCreateInput, IEventEntity, eventCreateSchema, imageUrlSchema } from "@/domain/event";
import { EventRepository } from "@/repositories/event-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { CategoryNotFoundError } from "../category/category-service";

export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found");
    this.name = "EventNotFoundError";
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

  async create(input: EventCreateInput & { imageUrl: string }): Promise<IEventEntity> {
    // Validate event fields
    const eventParsed = eventCreateSchema.parse(input);

    // Validate image URL
    const urlParsed = imageUrlSchema.parse({ imageUrl: input.imageUrl });

    // Verify category exists
    const category = await this.categoryRepository.findById(eventParsed.categoryId);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    // Create event
    return this.eventRepository.create({
      title: eventParsed.title,
      description: eventParsed.description,
      imageUrl: urlParsed.imageUrl,
      categoryId: eventParsed.categoryId,
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
