import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

const router = Router();
const bookingController = new BookingController();

router.post('/', bookingController.requestBooking);
router.get('/', bookingController.getAllBookings);
router.patch('/:id/accept', bookingController.acceptBooking);
router.patch('/:id/reject', bookingController.rejectBooking);
router.get('/customer/:customerId', bookingController.getBookingsByCustomer);
router.get('/property/:propertyId', bookingController.getBookingsByProperty);
router.delete('/:id', bookingController.deleteBooking);

export default router;
