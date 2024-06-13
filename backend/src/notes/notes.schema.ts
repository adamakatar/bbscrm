import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ required: true })
  writer: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
