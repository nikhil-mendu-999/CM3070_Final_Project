import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({ example: 123, description: 'User ID to add.' })
  @IsInt()
  userId: number;
}
