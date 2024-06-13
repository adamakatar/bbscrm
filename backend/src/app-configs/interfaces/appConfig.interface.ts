import { Document } from 'mongoose';

type contactInfo = {
  email: string;
  address: string;
  contact: string;
  cell: string;
  url: string;
  name: string;
  designation: string;
};
export interface IAppConfig extends Document {
  ContactInfo: contactInfo;
}

export { contactInfo };
