import { Booking } from '../models/Booking';
import { IBookingRepository } from '../interfaces/IBookingRepository';
import { BookingStatus } from '../models/Enums';

export class BookingRepository implements IBookingRepository {
  private static instance: BookingRepository;
  private bookings: Booking[] = [
    new Booking('BKG-MOCK-1', 'USR-MOCK-1', 'PROP-MOCK-1', new Date(Date.now() - 86400000), BookingStatus.ACCEPTED),
    new Booking('BKG-MOCK-2', 'USR-MOCK-6', 'PROP-MOCK-3', new Date(), BookingStatus.PENDING),
    new Booking('BKG-MOCK-3', 'USR-MOCK-6', 'PROP-MOCK-4', new Date(Date.now() - 172800000), BookingStatus.REJECTED)
  ];

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

  public deleteBooking(bookingId: string): boolean {
    const initialLength = this.bookings.length;
    this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
    return this.bookings.length < initialLength;
  }
}
