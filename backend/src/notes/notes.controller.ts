import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './notes.schema';
import { UpdateNoteDto } from './note-update-dto';
import { FindNoteDto } from './find-note-dto';

@Controller('/api/v1/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  async create(@Body() createNoteDto: any): Promise<Note> {
    console.log('-------------');
    return this.notesService.create(createNoteDto);
  }

  @Get('getNote/:receiver')
async getNotes(@Param('receiver') receiver: string): Promise<Note[]> {
  return this.notesService.findNotesBySenderReceiver(receiver);
};

@Get('getAllNotes')
async getAllNotes(): Promise<Note[]> {
  return this.notesService.getAllNotes();
}

  //...
    @Patch(':id')
    async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    ): Promise<Note> {
    return this.notesService.updateNote(id, updateNoteDto);
    }
    //...

}
