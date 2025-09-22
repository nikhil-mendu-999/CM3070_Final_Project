import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  UsePipes, ValidationPipe, UseInterceptors, UploadedFile
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { GetProfilesQueryDto } from './dto/get-profiles.query.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profiles, filtered by context and permissions.' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'contextId', required: false, type: Number, description: 'Limit profiles by context membership.' })
  @ApiResponse({ status: 200, description: 'Array of profiles according to visibility rules.' })
  async getUserProfiles(
    @Request() req,
    @Param('userId') userId: string,
    @Query() query: GetProfilesQueryDto,
  ) {
    const requestingUserId = req.user.userId;
    const uid = parseInt(userId, 10);
    const cid = query.contextId;
    return this.profilesService.getUserProfiles(requestingUserId, uid, cid);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiOperation({ summary: 'Create a new profile for current user.' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Profile created and linked to contexts.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async createProfile(
    @Request() req,
    @Body() body: CreateProfileDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const userId = req.user.userId;
    if (file) body.profilePicture = file.filename;
    return this.profilesService.createProfile(userId, body);
  }

  @Patch(':profileId')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async updateProfile(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    console.log('PATCH /users/:userId/profiles/:profileId body:', body);
    console.log('PATCH uploaded file:', file);
    const userId = req.user.userId;
    if (file) body.profilePicture = file.filename;
    try {
      const result = await this.profilesService.updateProfile(userId, parseInt(profileId, 10), body);
      console.log("PATCH result:", result);
      return result;
    } catch (err) {
      console.error("PATCH ERROR:", err);
      throw err;
    }
  }



  @Delete(':profileId')
  @ApiOperation({ summary: 'Delete a user profile.' })
  @ApiParam({ name: 'profileId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Profile deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Not the profile owner.' })
  async deleteProfile(
    @Request() req,
    @Param('userId') userId: string,
    @Param('profileId') profileId: string
  ) {
    return this.profilesService.deleteProfile(
      req.user.userId,
      parseInt(profileId, 10)
    );
  }
}
