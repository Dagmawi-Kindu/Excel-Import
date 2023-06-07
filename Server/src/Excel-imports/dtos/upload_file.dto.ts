import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  efile: string;
}
