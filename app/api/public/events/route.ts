import { NextRequest } from "next/server";
import { IEventEntity } from "@/domain/event";
import { MongoEventRepository } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";

/**
 * GET /api/public/events
 * List all events (public endpoint, no auth required).
 * - Query: ?categoryId=xxx (optional filter by category)
 * - 200: array of events
 * - 500: INTERNAL_ERROR
 */
export async function GET(req: NextRequest) {}
