import { Booking } from '../models/Booking';

export interface IBookingRepository {
  save(booking: Booking): Booking;
  findById(bookingId: string): Booking | undefined;
  update(booking: Booking): Booking;
  findAll(): Booking[];
  findByCustomerId(customerId: string): Booking[];
  findByPropertyId(propertyId: string): Booking[];
}
