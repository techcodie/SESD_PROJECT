import { Booking } from '../models/Booking';

export interface IBookingService {
  requestBooking(customerId: string, propertyId: string): Booking | null;
  acceptBooking(bookingId: string): Booking | null;
  rejectBooking(bookingId: string): Booking | null;
  getBookingsForCustomer(customerId: string): Booking[];
  getBookingsForProperty(propertyId: string): Booking[];
}
