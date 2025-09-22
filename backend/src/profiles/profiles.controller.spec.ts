import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('users/:userId/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getUserProfiles(
    @Param('userId') userId: string,
    @Query('contextId') contextId?: string,
  ) {
    const uid = parseInt(userId, 10);
    const cid = contextId ? parseInt(contextId, 10) : undefined;
    return this.profilesService.getUserProfiles(uid, cid);
  }
}
