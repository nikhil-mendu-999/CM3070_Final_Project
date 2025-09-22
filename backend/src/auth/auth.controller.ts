import {
  Controller, Post, Body, UnauthorizedException, Get, Req, Res,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { getJwks } from './jwks.util';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('jwks')
  @ApiOperation({ summary: 'Get JWKS for public key discovery (OIDC/OAuth).' })
  @ApiResponse({ status: 200, description: 'JWKS containing public key(s).' })
  async getJwks() { return await getJwks(); }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email and password. Returns access JWT.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Successful login returns JWT.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email and password.' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User created.' })
  async register(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }

  // OAuth endpoints (these are typically used by external redirects)
  @Get('google')
  @ApiOperation({ summary: 'Start Google OAuth login.' })
  @UseGuards(AuthGuard('google')) googleAuth() {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle callback from Google OAuth.' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.handleOAuthLogin(req.user, 'google');
    const jwtPayload = await this.authService.login(user);
    return res.redirect(`http://localhost:5173/?token=${jwtPayload.access_token}`);
  }

  @Get('github')
  @ApiOperation({ summary: 'Start GitHub OAuth login.' })
  @UseGuards(AuthGuard('github')) githubAuth() {}

  @Get('github/callback')
  @ApiOperation({ summary: 'Handle callback from GitHub OAuth.' })
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.handleOAuthLogin(req.user, 'github');
    const jwtPayload = await this.authService.login(user);
    return res.redirect(`http://localhost:5173/?token=${jwtPayload.access_token}`);
  }

  private async handleOAuthLogin(userData: any, provider: string) {
    const user = await this.authService.validateOAuthUser(userData, provider);
    return user;
  }
}
