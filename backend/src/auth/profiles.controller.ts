import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesService } from '../profiles/profiles.service';
import { GetProfilesQueryDto } from './dto/get-profiles.query.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getUserProfiles(
    @Request() req,
    @Param('userId') userId: string,
    @Query() query: GetProfilesQueryDto,
  ) {
    const requestingUserId = req.user.userId;
    const uid = parseInt(userId, 10);
    const cid = query.contextId ? parseInt(query.contextId as any, 10) : undefined;

    return this.profilesService.getUserProfiles(requestingUserId, uid, cid);
  }
}
