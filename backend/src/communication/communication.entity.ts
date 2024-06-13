import { Schema } from 'mongoose';

const ContactSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  contact: { type: String },
  email: { type: String },
  role: { type: [String] },
  readUserIds: { type: [String] },
});

const SSMSSchema = new Schema(
  {
    accountSid: {
      type: String,
      required: true,
    },
    apiVersion: { type: String },
    body: { type: String },
    dateCreated: { type: Date },
    dateUpdated: { type: Date },
    dateSent: { type: Date },
    direction: { type: String },
    errorCode: { type: String },
    errorMessage: { type: String },
    from: { type: String },
    messagingServiceSid: { type: String },
    numMedia: { type: String },
    numSegments: { type: String },
    price: { type: String },
    priceUnit: { type: String },
    sid: { type: String },
    status: { type: String },
    subresourceUris: { type: Object },
    to: { type: String },
    uri: { type: String },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const SCallSchema = new Schema(
  {
    accountSid: {
      type: String,
      required: true,
    },
    answeredBy: { type: String },
    apiVersion: { type: String },
    callerName: { type: String },
    dateCreated: { type: Date },
    dateUpdated: { type: Date },
    direction: { type: String },
    duration: { type: String },
    endTime: { type: Date },
    forwardedFrom: { type: String },
    from: { type: String },
    fromFormatted: { type: String },
    groupSid: { type: String },
    parentCallSid: { type: String },
    phoneNumberSid: { type: String },
    price: { type: String },
    priceUnit: { type: String },
    sid: { type: String },
    startTime: { type: Date },
    status: { type: String },
    subresourceUris: { type: Object },
    to: { type: String },
    toFormatted: { type: String },
    trunkSid: { type: String },
    uri: { type: String },
    queueTime: { type: String },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export { ContactSchema, SSMSSchema, SCallSchema };
