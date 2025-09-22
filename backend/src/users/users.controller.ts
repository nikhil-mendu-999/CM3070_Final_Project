import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  Delete,
  Patch,
  Body,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin-only). Supports pagination.' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take' })
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.usersService.findAll(Number(skip) || 0, Number(take) || 25);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user (profile & fields) via JWT.' })
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new Error('Invalid or missing user session');
    }
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (admin or self).' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id, 10));
  }

  @Get('me/linked-accounts')
  @ApiOperation({ summary: 'Get list of linked social/OAuth accounts for current user.' })
  @UseGuards(JwtAuthGuard)
  async getMyLinkedAccounts(@Request() req) {
    return this.usersService.getLinkedAccounts(req.user.userId);
  }

  @Delete('me/linked-accounts/:id')
  @ApiOperation({ summary: 'Remove linked OAuth/social account from current user.' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(JwtAuthGuard)
  async deleteMyLinkedAccount(@Request() req, @Param('id') id: string) {
    const accId = parseInt(id, 10);
    return this.usersService.deleteLinkedAccount(req.user.userId, accId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user with advanced identity/personal fields including language variants.' })
  @UseGuards(JwtAuthGuard)
  async updateMe(@Request() req, @Body() body: UserDto) {
    return this.usersService.updateUser(req.user.userId, body);
  }
}
