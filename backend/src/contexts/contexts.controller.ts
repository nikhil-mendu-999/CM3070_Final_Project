import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, BadRequestException,
  UsePipes, ValidationPipe, Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ContextsService } from './contexts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContextDto } from './dto/create-context.dto';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('contexts')
@ApiBearerAuth()
@Controller('contexts')
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Get()
  @ApiOperation({ summary: 'List all identity contexts.' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Skip N records (pagination)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Return N records (pagination)' })
  @ApiResponse({ status: 200, description: 'Paginated contexts list.' })
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.contextsService.findAll(Number(skip) || 0, Number(take) || 25);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/export')
  @ApiOperation({ summary: 'Export all user data for GDPR (current user).' })
  @ApiResponse({ status: 200, description: 'User data exported.' })
  async exportMe(@Request() req) {
    return this.contextsService.exportUserData(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @ApiOperation({ summary: 'Delete user account and all data (GDPR).' })
  @ApiResponse({ status: 200, description: 'User and related data deleted.' })
  async deleteMe(@Request() req) {
    return this.contextsService.deleteUserAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get all contexts joined/owned by current user.' })
  @ApiResponse({ status: 200, description: 'List of joined/owned contexts.' })
  findMine(@Request() req) {
    return this.contextsService.findUserContexts(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get info about a specific context.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Context details.' })
  findOne(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) throw new BadRequestException('Invalid context id (not a number).');
    return this.contextsService.findOne(numId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new context (logged in user is owner).' })
  @ApiResponse({ status: 201, description: 'Context created.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  create(@Body() dto: CreateContextDto, @Request() req) {
    return this.contextsService.createContext(dto.name, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  @ApiOperation({ summary: 'Add a user to a context.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User added to context.' })
  addMember(@Param('id') contextId: string, @Body() dto: AddMemberDto) {
    return this.contextsService.addMember(Number(contextId), dto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a user from a context.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'User removed from context.' })
  removeMember(@Param('id') contextId: string, @Param('userId') userId: string) {
    return this.contextsService.removeMember(Number(contextId), Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Rename a context (must be owner).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Context renamed successfully.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async updateContext(@Param('id') id: string, @Body() body: { name: string }, @Request() req) {
    return this.contextsService.updateContext(Number(id), body.name, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a context (must be owner).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Context deleted.' })
  async deleteContext(@Param('id') id: string, @Request() req) {
    return this.contextsService.deleteContext(Number(id), req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/members')
  @ApiOperation({ summary: 'List all members of this context (with roles).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'List of context members.' })
  async listMembers(@Param('id') id: string) {
    return this.contextsService.listMembers(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId/role')
  @ApiOperation({ summary: "Set a user's role (member/admin) in the context (admin only)" })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: "User's role updated." })
  async setMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
    @Body() body: { role: string }
  ) {
    return this.contextsService.setMemberRole(
      Number(id), Number(userId), req.user.userId, body.role
    );
  }
}
