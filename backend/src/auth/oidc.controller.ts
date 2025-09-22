import { Controller, Get, Post, Req, Body, Res, UseGuards, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-authguard';
import { OidcService } from './oidc.service';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('oidc')
@ApiBearerAuth()
@Controller('auth')
export class OidcController {
  constructor(private oidcService: OidcService) {}

  @Get('sharable-identities')
  @ApiOperation({ summary: 'List user identities which can be shared via OIDC.' })
  @ApiResponse({ status: 200, description: 'List of sharable identities.' })
  @UseGuards(JwtAuthGuard)
  async getSharableIdentities(@Req() req) {
    return this.oidcService.listSharableIdentities(req.user.userId);
  }

  @Post('consent')
  @ApiOperation({ summary: 'Grant OIDC consent for attributes and redirect.' })
  @ApiResponse({ status: 200, description: 'Consent granted; includes JWT token.' })
  @UseGuards(JwtAuthGuard)
  async grantConsent(@Req() req, @Body() body, @Res() res: Response) {
    const grant = await this.oidcService.createConsentGrant(req.user.userId, body);
    res.json({ redirectUrl: body.redirectUri + "?token=" + grant.token, token: grant.token });
  }

  @Get('consents/me')
  @ApiOperation({ summary: 'List consents granted by current user.' })
  @ApiResponse({ status: 200, description: 'Array of consent grants.' })
  @UseGuards(JwtAuthGuard)
  async getMyConsents(@Req() req) {
    return this.oidcService.listMyConsentGrants(req.user.userId);
  }

  @Patch('consent/:grantId/revoke')
  @ApiOperation({ summary: 'Revoke an OIDC consent grant by grantId.' })
  @ApiParam({ name: 'grantId', type: Number })
  @ApiResponse({ status: 200, description: 'Consent revoked.' })
  @UseGuards(JwtAuthGuard)
  async revokeConsent(@Req() req, @Param('grantId') grantId: number) {
    await this.oidcService.revokeConsentGrant(Number(grantId), req.user.userId);
    return { status: "revoked" };
  }
}
