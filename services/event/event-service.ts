import {
  TEventCreateInput,
  IEventEntity,
  eventCreateSchema,
  eventUpdateSchema,
  imageUrlSchema,
} from "@/domain/event";
import { EventRepository } from "@/repositories/event-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { CategoryNotFoundError } from "../category/category-service";
import { IPaginationResult } from "@/domain/event";

export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found");
    this.name = "EventNotFoundError";
  }
}

export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async list(options: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
  }): Promise<IPaginationResult<IEventEntity>> {
    return this.eventRepository.list(options);
  }

  async findById(id: string): Promise<IEventEntity> {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new EventNotFoundError();
    return event;
  }

  async findByCategory(categoryId: string): Promise<IEventEntity[]> {
    return this.eventRepository.findByCategory(categoryId);
  }

  async create(
    input: TEventCreateInput & { imageUrl: string; publicId: string },
  ): Promise<IEventEntity> {
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
      publicId: input.publicId,
    });
  }

  async delete(id: string): Promise<IEventEntity> {
    const deleted = await this.eventRepository.deleteById(id);
    if (!deleted) throw new EventNotFoundError();
    return deleted;
  }

  async countByCategory(categoryId: string): Promise<number> {
    return this.eventRepository.countByCategory(categoryId);
  }

  async update(id: string, data: Partial<IEventEntity>): Promise<IEventEntity> {
    // Validate event fields using the domain schema
    const parsed = eventUpdateSchema.parse(data);

    const updatedEvent = await this.eventRepository.updateById(id, parsed);
    if (!updatedEvent) {
      throw new EventNotFoundError();
    }

    return updatedEvent;
  }
}
