import { BookingStatus } from './Enums';

export class Booking {
  constructor(
    public bookingId: string,
    public customerId: string,
    public propertyId: string,
    public requestDate: Date,
    public status: BookingStatus
  ) {}

  public updateStatus(newStatus: BookingStatus) {
    this.status = newStatus;
  }
}
