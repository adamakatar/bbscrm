import { IsNotEmpty, IsString, IsOptional, IsDate, ArrayMinSize, IsArray } from 'class-validator';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Email can not be empty.' })
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  contact: string;
  
  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  passwordResetToken?: string;

  @IsOptional()
  @IsDate()
  passwordResetExpires?: Date;
}
