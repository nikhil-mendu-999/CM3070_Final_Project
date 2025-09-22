import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProfilesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  contextId?: number;
}
