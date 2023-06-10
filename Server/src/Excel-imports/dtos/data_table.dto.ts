import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDataDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Item_no: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Description: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Unit: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Quantity: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Rate: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Amount: string;
}
