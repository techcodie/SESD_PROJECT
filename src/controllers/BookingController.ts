import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  public requestBooking = (req: Request, res: Response): void => {
    try {
      const { customerId, propertyId } = req.body;

      if (!customerId || !propertyId) {
        res.status(400).json({ error: 'customerId and propertyId are required' });
        return;
      }

      const booking = this.bookingService.requestBooking(customerId, propertyId);
      res.status(201).json(booking);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  };

  public acceptBooking = (req: Request, res: Response): void => {
    const booking = this.bookingService.acceptBooking(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(booking);
  };

  public rejectBooking = (req: Request, res: Response): void => {
    const booking = this.bookingService.rejectBooking(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(booking);
  };

  public getBookingsByCustomer = (req: Request, res: Response): void => {
    const bookings = this.bookingService.getBookingsForCustomer(req.params.customerId);
    res.json(bookings);
  };

  public getBookingsByProperty = (req: Request, res: Response): void => {
    const bookings = this.bookingService.getBookingsForProperty(req.params.propertyId);
    res.json(bookings);
  };
}
