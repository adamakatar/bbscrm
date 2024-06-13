import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './notes.schema'
import { UpdateNoteDto } from './note-update-dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: any): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.noteModel.find();
  }

  async findNotesBySenderReceiver(receiver: string): Promise<Note[]> {
    return await this.noteModel.find({ $or: [{receiver: receiver}, {sender: receiver}] }).exec();
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    });
  }
}
