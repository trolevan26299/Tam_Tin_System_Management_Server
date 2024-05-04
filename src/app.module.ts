/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler';
import { AppController } from './app.controller';

// framework
import { ValidationPipe } from './pipes/validation.pipe';

// middlewares
import { CorsMiddleware } from './middlewares/cors.middleware';
import { OriginMiddleware } from './middlewares/origin.middleware';

// universal modules
import { AuthModule } from './modules/auth/auth.module';
import { AccountManagerModule } from './modules/account-management/accountManagement.module';
import { DatabaseModule } from './processors/database/database.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: minutes(5), // 5 minutes = 300s
        limit: 300, // 300 limit
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
      },
    ]),
    DatabaseModule,
    AuthModule,
    AccountManagerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
