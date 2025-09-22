import {
  IsString, IsOptional, IsArray
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type VisibilityType =
  | 'public'
  | 'private'
  | 'context-members'
  | 'not-sharable';

export class CreateProfileDto {
  @ApiProperty({ example: 'Research Persona' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Job Search Persona' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ example: [1, 2], type: [Number], description: 'Context IDs to link' })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    // Accept array, single value, or undefined for FormData and JSON
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) return value.map(Number);
    return [Number(value)];
  })
  contextIds?: number[];

  @ApiPropertyOptional({ example: 'Alice Q. Example' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ example: 'Woman' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 'Straight' })
  @IsString()
  @IsOptional()
  sexuality?: string;

  @ApiPropertyOptional({ example: 'Single' })
  @IsString()
  @IsOptional()
  relationshipStatus?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile photo file path or URL'
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({
    example: 'Job Seeking',
    enum: [
      'Professional',
      'Job Seeking',
      'Social',
      'Personal',
      'Gaming',
      'Other'
    ]
  })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiPropertyOptional({
    enum: [
      'public',
      'private',
      'context-members',
      'not-sharable'
    ],
    example: 'public'
  })
  @IsString()
  @IsOptional()
  visibility?: VisibilityType;
}
