import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 'changeme' })
  password?: string;

  // Main identity fields
  @ApiPropertyOptional({ example: 'Alice Q. Example' })
  legalName?: string;

  @ApiPropertyOptional({ type: Object, description: 'Map of legal name variants' })
  legalNameVariants?: Record<string, string>;

  @ApiPropertyOptional({ example: 'Ali' })
  preferredName?: string;

  @ApiPropertyOptional({ type: Object, description: 'Map of preferred name variants' })
  preferredNameVariants?: Record<string, string>;

  @ApiPropertyOptional({ example: 'aliceq' })
  username?: string;

  @ApiPropertyOptional({ example: 'Ally' })
  nickname?: string;

  @ApiPropertyOptional({ example: 'AliEx' })
  stageName?: string;

  @ApiPropertyOptional({ example: 'Sister Alice' })
  religiousName?: string;

  @ApiPropertyOptional({ example: 'female' })
  gender?: string;

  @ApiPropertyOptional({ type: Object, description: 'Map of gender variants' })
  genderVariants?: Record<string, string>;

  @ApiPropertyOptional({ example: 'she/her' })
  pronouns?: string;

  @ApiPropertyOptional({ type: Object, description: 'Map of pronoun variants' })
  pronounsVariants?: Record<string, string>;

  @ApiPropertyOptional({ example: '1993-09-15' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'en-US' })
  locale?: string;

  @ApiPropertyOptional({ example: 'http://cdn.example.com/profilephoto.jpg' })
  profilePhoto?: string;

  @ApiPropertyOptional({ type: Object, description: 'Per-field privacy settings.' })
  fieldVisibilities?: Record<string, 'public' | 'private' | 'context-members'>;
}
