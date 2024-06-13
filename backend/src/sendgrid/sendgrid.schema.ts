import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Email extends Document {
  @Prop()
  to: string;

  @Prop()
  from: string;

  @Prop()
  subject: string;

  @Prop()
  text: string;

  @Prop({default: true})
  isRead: boolean;

  @Prop({ default: Date.now })
  sentAt: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);