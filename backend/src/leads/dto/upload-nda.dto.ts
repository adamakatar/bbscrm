import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UploadNdaDTO {
    @IsNotEmpty({ message: 'First name is required.' })
    @IsString()
    firstName: string;
  
    @IsNotEmpty({ message: 'Last name is required.' })
    @IsString()
    lastName: string;
  
    @IsNotEmpty({ message: 'Contact no. is required.' })
    @IsString()
    contact: string;
  
    @IsNotEmpty({ message: 'Email is required.' })
    @IsString()
    email: string;
  
    @IsOptional()
    @IsString()
    streetAddress: string;
  
    @IsOptional()
    @IsString()
    city: string;
  
    @IsOptional()
    @IsString()
    state: string;
  
    @IsOptional()
    @IsNumber()
    zipCode: number;
    
    @IsOptional({ message: 'Preferred location is required' })
    @IsArray()
    preferredLocation: string[];
  
    @IsOptional({ message: 'Capital available for purchase is required' })
    @IsArray()
    capitalAvailable: string[];
  
    @IsOptional()
    @IsString()
    currentOccupation: string;
  
    @IsOptional()
    @IsString()
    businessInterested: string;
  
    @IsOptional({ message: 'Time allocated for business is required.' })
    @IsString()
    timeAllocatedForBusiness: string;
  
    @IsOptional()
    @IsString()
    minAnnualIncomeNeeds: string;  
}
  