import { IBookingEntity } from "./booking";
import { IEventEntity } from "./event";

export interface IPaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IStatsSummary {
  totalEvents: number;
  totalBookings: number;
  totalCategories: number;
  latestEvents: IEventEntity[];
  latestBookings: IBookingEntity[];
}
