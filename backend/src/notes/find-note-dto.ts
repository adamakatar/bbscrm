import { IsString, IsOptional } from 'class-validator';

export class FindNoteDto {
    @IsString()
    readonly receiver: string;
  }