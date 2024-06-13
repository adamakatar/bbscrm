import { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
    },
  },
  { timestamps: true },
);

const STaskStatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TaskSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      // required: [true, 'Project is required'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    assignedTo: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      // required: [true, 'Assigned To are required'],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      // required: [true, 'Description is required'],
    },
    comments: { type: [CommentSchema], default: [] },
    type: {
      type: String,
      enum: ['task', 'template'],
      default: 'task',
    },
    active: {
      type: String,
      enum: ['active', 'in-active'],
      default: 'active',
    },
    // order: {
    //   type: Number,
    //   default: 0,
    // },
    noOfDays: {
      type: Number,
      default: 0,
    },
    deadlineDate: {
      type: Date,
      // required: [true, 'Deadline date is required'],
      default: null,
    },
  },
  { timestamps: true },
);

// TaskSchema.pre(/^find/, function (next) {
//   // const _this = this as any;

//   this.populate({
//     path: 'reviews',
//     select: 'message rating ',
//     match: { isActive: true },
//   });

//   next();
// });

const STaskSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'SProject',
      // required: [true, 'Project is required'],
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'STaskStatus',
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    assignees: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      // required: [true, 'Assigned To are required'],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      // required: [true, 'Description is required'],
    },
    comments: { type: [CommentSchema], default: [] },
    type: {
      type: String,
      enum: ['task', 'template'],
      default: 'task',
    },
    active: {
      type: String,
      enum: ['active', 'in-active'],
      default: 'active',
    },
    // order: {
    //   type: Number,
    //   default: 0,
    // },
    noOfDays: {
      type: Number,
      default: 0,
    },
    deadlineDate: {
      type: Date,
      // required: [true, 'Deadline date is required'],
      default: null,
    },
  },
  { timestamps: true },
);

export { TaskSchema, STaskStatusSchema, STaskSchema };
