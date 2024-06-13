import { Schema } from 'mongoose';

const sProjectSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      unique: true,
      required: [true, 'Business name is required'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator is required'],
    },
    name: { type: String, required: [true, 'Project Name is required'] },
    slug: { type: String, index: true, unique: true },
    isActive: { type: Boolean, default: true },
    assignees: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
      // required: [true, 'Event attendees are required'],
    },
  },
  { timestamps: true },
);

// sProjectSchema.index({ slug: 1 });

sProjectSchema.pre(/^find/, function (next) {
  // const _this = this as any;

  this.populate([
    { path: 'creator', select: 'firstName lastName photo role' },
    { path: 'assignees', select: 'firstName lastName photo role' },
    { path: 'business' },
    // select: 'firstName lastName photo',
  ]);

  next();
});

export { sProjectSchema };
