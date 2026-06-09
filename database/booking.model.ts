import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        // RFC 5322-compliant email check
        validator: (email: string) =>
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            email,
          ),
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Verifies the referenced event exists before persisting a booking.
// Only runs when eventId is new or modified to avoid redundant DB lookups.
BookingSchema.pre('save', async function (next) {
  if (!this.isModified('eventId') && !this.isNew) return next();

  try {
    const eventExists = await Event.findById(this.eventId).select('_id').lean();

    if (!eventExists) {
      return next(new Error(`Event with ID ${this.eventId} does not exist`));
    }
  } catch {
    return next(new Error('Invalid event ID format or database error'));
  }

  next();
});

// Speeds up queries that filter or join bookings by event
BookingSchema.index({ eventId: 1 });

// Supports paginated booking history per event (newest first)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Supports lookups of all bookings belonging to a given email
BookingSchema.index({ email: 1 });

// Prevents duplicate bookings: one registration per event per email address
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
