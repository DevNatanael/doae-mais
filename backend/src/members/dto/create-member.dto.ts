import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  firstName: string | undefined;

  @IsString()
  @IsNotEmpty()
  lastName: string | undefined;

  @IsEmail()
  email: string| undefined;

  @IsString()
  @IsNotEmpty()
  address: string| undefined;

  @IsDateString()
  dateOfBirth: string| undefined;
}
