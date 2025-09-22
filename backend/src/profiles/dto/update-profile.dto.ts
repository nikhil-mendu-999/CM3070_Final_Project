import {
  IsString, IsOptional, IsArray, ValidateNested,
  IsNumber, IsIn, IsObject, IsDefined
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { VisibilityType } from './create-profile.dto';

export class ContextChangeDto {
  @IsDefined()
  @IsNumber()
  contextId: number;

  @IsDefined()
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  @IsIn(['public', 'private', 'context-members', 'not-sharable'])
  visibility?: VisibilityType;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  label?: string;
  @IsString()
  @IsOptional()
  displayName?: string;
  @IsString()
  @IsOptional()
  gender?: string;
  @IsString()
  @IsOptional()
  genderCustom?: string;
  @IsString()
  @IsOptional()
  sexuality?: string;
  @IsString()
  @IsOptional()
  sexualityCustom?: string;
  @IsString()
  @IsOptional()
  relationshipStatus?: string;
  @IsString()
  @IsOptional()
  relationshipStatusCustom?: string;
  @IsString()
  @IsOptional()
  profilePicture?: string;
  @IsString()
  @IsIn(['public', 'private', 'context-members', 'not-sharable'])
  @IsOptional()
  visibility?: VisibilityType;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContextChangeDto)
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try { const arr = JSON.parse(value); return Array.isArray(arr) ? arr : []; } catch { return []; }
    }
    return [];
  })
  @IsOptional()
  contextChanges?: ContextChangeDto[];
  @IsObject()
  @IsOptional()
  fieldVisibilities?: Record<string, VisibilityType>;
  @IsObject()
  @IsOptional()
  legalNameVariants?: Record<string, string>;
}
