/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TokenResult } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { AccountManagerService } from '../account-management/accountManagement.service';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accManagementService: AccountManagerService,
  ) {}

  // API FOR LOGIN
  @Post('login')
  async login(@Body() loginDto: AuthLoginDTO): Promise<TokenResult> {
    return await this.authService.login(loginDto);
  }

  // API FOR VERIFICATION USER AND GET INFO CURRENT USER
  @Get('/me')
  @UseGuards(AuthGuard)
  async checkReturnUserDetail(@Request() req) {
    return await this.accManagementService.getDetailAccount(
      req.user_data.data?.id,
    );
  }
}
