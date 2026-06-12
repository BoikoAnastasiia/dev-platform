import { Schema, model, models, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    // Slug is auto-generated from title in the pre-save hook; never set manually
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generates a URL-friendly slug: lowercase, spaces → hyphens, special chars stripped
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Returns a slug that is unique across the collection, appending -2, -3, … on
// collision (e.g. two events both titled "Cloud Next 2007"). The unique index on
// `slug` remains the source of truth; this just avoids the duplicate-key error in
// the common case. `currentId` excludes the document itself when checking.
async function generateUniqueSlug(
  title: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  currentId?: unknown,
): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let n = 2;
  while (await model.findOne({ slug, _id: { $ne: currentId } }).lean()) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Normalises an incoming date string to YYYY-MM-DD; throws on unparseable input
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format — provide a parseable date string');
  }
  return date.toISOString().split('T')[0];
}

// Normalises time to HH:MM (24-hour); accepts "HH:MM" or "H:MM AM/PM"
function normalizeTime(timeString: string): string {
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) {
    throw new Error('Invalid time format — use HH:MM or H:MM AM/PM');
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  if (hours < 0 || hours > 23 || parseInt(minutes, 10) > 59) {
    throw new Error('Time values out of range');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Handles slug generation and field normalisation before every save.
// Errors from helpers are forwarded through next() so Mongoose surfaces them correctly.
EventSchema.pre('save', async function () {
  // Slug is generated once at creation and then frozen, so editing the title
  // later never changes the event's URL (old links keep working).
  if (this.isNew) {
    this.slug = await generateUniqueSlug(this.title, this.constructor, this._id);
  }

  if (this.isModified('date')) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified('time')) {
    this.time = normalizeTime(this.time);
  }
});

// Compound index for listing/filtering events by date and format
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
