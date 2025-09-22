import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContextDto {
  @ApiProperty({ example: 'Acme Corp', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;
}
