import { BookingRepository } from '../repositories/BookingRepository';
import { PropertyRepository } from '../repositories/PropertyRepository';
import { Booking } from '../models/Booking';
import { BookingStatus } from '../models/Enums';
import { IBookingService } from '../interfaces/IBookingService';
import { v4 as uuidv4 } from 'uuid';

export class BookingService implements IBookingService {
  private bookingRepository: BookingRepository;
  private propertyRepository: PropertyRepository;

  constructor() {
    this.bookingRepository = BookingRepository.getInstance();
    this.propertyRepository = PropertyRepository.getInstance();
  }

  public requestBooking(customerId: string, propertyId: string): Booking | null {
    const property = this.propertyRepository.findById(propertyId);
    if (!property) throw new Error('Property not found');

    const booking = new Booking(
      uuidv4(),
      customerId,
      propertyId,
      new Date(),
      BookingStatus.PENDING
    );

    return this.bookingRepository.save(booking);
  }

  public acceptBooking(bookingId: string): Booking | null {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) return null;

    booking.updateStatus(BookingStatus.ACCEPTED);
    return this.bookingRepository.update(booking);
  }

  public rejectBooking(bookingId: string): Booking | null {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) return null;

    booking.updateStatus(BookingStatus.REJECTED);
    return this.bookingRepository.update(booking);
  }

  public getBookingsForCustomer(customerId: string): Booking[] {
    return this.bookingRepository.findByCustomerId(customerId);
  }

  public getBookingsForProperty(propertyId: string): Booking[] {
    return this.bookingRepository.findByPropertyId(propertyId);
  }

  public deleteBooking(bookingId: string): boolean {
    return this.bookingRepository.deleteBooking(bookingId);
  }

  public getAllBookings(): Booking[] {
    return this.bookingRepository.findAll();
  }
}
