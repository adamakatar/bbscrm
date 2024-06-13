import { Document } from 'mongoose';

export interface ISSMS extends Document {
  accountSid: string;
  apiVersion: string;
  body: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateSent: Date;
  direction: string;
  errorCode: string;
  errorMessage: string;
  from: string;
  messagingServiceSid: string;
  numMedia: string;
  numSegments: string;
  price: string;
  priceUnit: string;
  sid: string;
  status: string;
  subresourceUris: { type: Object };
  to: string;
  uri: string;
  isRead: boolean;
}

export interface ISCall extends Document {
  accountSid: string;
  answeredBy: string;
  apiVersion: string;
  callerName: string;
  dateCreated: Date;
  dateUpdated: Date;
  direction: string;
  duration: string;
  endTime: Date;
  forwardedFrom: string;
  from: string;
  fromFormatted: string;
  groupSid: string;
  parentCallSid: string;
  phoneNumberSid: string;
  price: string;
  priceUnit: string;
  sid: string;
  startTime: Date;
  status: string;
  subresourceUris: object;
  to: string;
  toFormatted: string;
  trunkSid: string;
  uri: string;
  queueTime: string;
  isRead: boolean;
}
