import * as APP_CONFIG from '../../app.config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type jwt from 'jsonwebtoken';
import { AccountManagerController } from './accountManagement.controller';
import { AccountManagerService } from './accountManagement.service';
import { JwtStrategy } from './jwt.strategy';
import { AccountManagementProvider } from './models/accountManagement.model';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: APP_CONFIG.AUTH.jwtSecret as jwt.Secret,
      signOptions: {
        expiresIn: APP_CONFIG.AUTH.expiresIn as number,
      },
    }),
  ],
  controllers: [AccountManagerController],
  providers: [AccountManagementProvider, AccountManagerService, JwtStrategy],
  exports: [AccountManagerService],
})
export class AccountManagerModule {}
