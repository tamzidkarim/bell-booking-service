import { IsEmail, IsEnum, IsString, IsDateString, Min, Max, IsInt, IsNotEmpty } from 'class-validator';
import { RoomType } from '@interfaces/booking.interface';

export class CreateBookingDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  public email: string;

  @IsNotEmpty({ message: 'Please provide your first name' })
  @IsString()
  public firstName: string;

  @IsNotEmpty({ message: 'Please provide your last name' })
  @IsString()
  public lastName: string;

  @IsDateString()
  public checkIn: Date;

  @IsDateString()
  public checkOut: Date;

  @IsInt()
  @Min(1, { message: 'Minimum guests is 1' })
  @Max(3, { message: 'Maximum guests is 3' })
  totalGuests: number;

  @IsEnum(RoomType, { message: 'Room type must be one of the following: presidential suite' })
  public roomType: RoomType;
}
