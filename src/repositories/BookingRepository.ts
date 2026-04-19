import { Booking } from '../models/Booking';
import { IBookingRepository } from '../interfaces/IBookingRepository';
import { BookingStatus } from '../models/Enums';

export class BookingRepository implements IBookingRepository {
  private static instance: BookingRepository;
  private bookings: Booking[] = [
    new Booking('BKG-MOCK-1', 'USR-MOCK-1', 'PROP-MOCK-1', new Date(Date.now() - 86400000), BookingStatus.ACCEPTED),
    new Booking('BKG-MOCK-2', 'USR-MOCK-6', 'PROP-MOCK-3', new Date(), BookingStatus.PENDING),
    new Booking('BKG-MOCK-3', 'USR-MOCK-6', 'PROP-MOCK-4', new Date(Date.now() - 172800000), BookingStatus.REJECTED),
    new Booking('BKG-MOCK-4', 'USR-MOCK-7', 'PROP-MOCK-6', new Date(Date.now() - 3600000), BookingStatus.PENDING),
    new Booking('BKG-MOCK-5', 'USR-MOCK-9', 'PROP-MOCK-7', new Date(Date.now() - 40000000), BookingStatus.ACCEPTED),
    new Booking('BKG-MOCK-6', 'USR-MOCK-10', 'PROP-MOCK-15', new Date(Date.now() - 86400000 * 3), BookingStatus.ACCEPTED),
    new Booking('BKG-MOCK-7', 'USR-MOCK-12', 'PROP-MOCK-8', new Date(Date.now() - 5000000), BookingStatus.REJECTED),
    new Booking('BKG-MOCK-8', 'USR-MOCK-14', 'PROP-MOCK-11', new Date(Date.now() - 90000000), BookingStatus.COMPLETED),
    new Booking('BKG-MOCK-9', 'USR-MOCK-1', 'PROP-MOCK-13', new Date(), BookingStatus.PENDING),
    new Booking('BKG-MOCK-10', 'USR-MOCK-7', 'PROP-MOCK-9', new Date(Date.now() - 100000), BookingStatus.PENDING),
    new Booking('BKG-MOCK-11', 'USR-MOCK-14', 'PROP-MOCK-16', new Date(Date.now() - 86400000 * 5), BookingStatus.ACCEPTED)
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
