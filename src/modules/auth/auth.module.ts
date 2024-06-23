/* eslint-disable prettier/prettier */
import * as APP_CONFIG from '../../app.config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountManagementProvider } from '../account-management/models/accountManagement.model';
import { AccountManagerService } from '../account-management/accountManagement.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: APP_CONFIG.AUTH.jwtSecret,
      signOptions: {
        expiresIn: APP_CONFIG.AUTH.expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AccountManagementProvider, AuthService, AccountManagerService],
  exports: [AuthService],
})
export class AuthModule {}
