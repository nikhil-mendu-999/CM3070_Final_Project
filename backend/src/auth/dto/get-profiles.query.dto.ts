import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProfilesQueryDto {
  @ApiPropertyOptional({ type: Number, description: 'Context ID filter.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  contextId?: number;
}
