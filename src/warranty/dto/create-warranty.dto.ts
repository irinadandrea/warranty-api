import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWarrantyDto {
  @IsString()
  @MinLength(1)
  productName!: string;

  @Type(() => Date)
  @IsDate()
  purchaseDate!: Date;

  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;

  @IsOptional()
  @IsString()
  receiptImage?: string;
}