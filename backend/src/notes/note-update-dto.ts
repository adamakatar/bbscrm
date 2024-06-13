import { IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  text?: string;
}