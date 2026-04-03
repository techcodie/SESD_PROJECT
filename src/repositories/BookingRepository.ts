import { Booking } from '../models/Booking';
import { IBookingRepository } from '../interfaces/IBookingRepository';

export class BookingRepository implements IBookingRepository {
  private static instance: BookingRepository;
  private bookings: Booking[] = [];

  private constructor() {}

  public static getInstance(): BookingRepository {
    if (!BookingRepository.instance) {
      BookingRepository.instance = new BookingRepository();
    }
    return BookingRepository.instance;
  }

  public save(booking: Booking): Booking {
    this.bookings.push(booking);
    return booking;
  }

  public findById(bookingId: string): Booking | undefined {
    return this.bookings.find(b => b.bookingId === bookingId);
  }

  public update(booking: Booking): Booking {
    const index = this.bookings.findIndex(b => b.bookingId === booking.bookingId);
    if (index !== -1) this.bookings[index] = booking;
    return booking;
  }

  public findAll(): Booking[] {
    return this.bookings;
  }

  public findByCustomerId(customerId: string): Booking[] {
    return this.bookings.filter(b => b.customerId === customerId);
  }

  public findByPropertyId(propertyId: string): Booking[] {
    return this.bookings.filter(b => b.propertyId === propertyId);
  }
}
