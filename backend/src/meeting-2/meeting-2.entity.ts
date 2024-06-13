import { Schema } from 'mongoose';

const MeetingSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator is required'],
    },
    creatorZoomEmail: {
      type: String,
      required: [true, 'Meeting email is required.'],
    },
    meetingType: {
      type: Number,
      required: [true, 'Meeting type is required.'],
    },
    topic: {
      type: String,
    },
    invitees: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    startUrl: {
      type: String,
    },
    joinUrl: {
      type: String,
    },
    startAt: {
      type: Date,
      required: [true, 'Meeting start time is required.'],
    },
    endAt: {
      type: Date,
      required: [true, 'Meeting end time is required.'],
    },
    calendar: {
      type: Schema.Types.ObjectId,
      ref: 'Calendar',
    },
  },
  { timestamps: true },
);

export { MeetingSchema };
