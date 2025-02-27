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
import { DeviceManagerModule } from './modules/device-management/deviceManagement.module';
import { DatabaseModule } from './processors/database/database.module';
import { CategoryManagerModule } from './modules/category-management/categoryManagement.module';
import { StaffManagerModule } from './modules/staff-management/staffManagement.module';
import { SubCategoryManagerModule } from './modules/sub-category-management/subCategoryManagement.module';
import { CustomerManagerModule } from './modules/customer-management/customerManagement.module';
import { OrderManagerModule } from './modules/order-management/orderManagement.module';
import { KanbanModule } from './modules/kanban/kanban.module';
import { StaffAccessoriesManagerModule } from './modules/staff-accessories-management/staffAccessoriesManagement.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AnalyticsManagementModule } from './modules/analytics-management/analyticsManagement.module';
import { SalaryModule } from './modules/salary/salary.module';
import { LinhKienModule } from './modules/linh-kien/linhKien.module';
import { TransactionLinhKienModule } from './modules/transaction-linh-kien/transaction-linh-kien.module';
import { OrderLinhKienModule } from './modules/order-linh-kien/orderLinhKien.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: minutes(5), // 5 minutes = 300s
        limit: 300, // 300 limit
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
      },
    ]),
    OrderLinhKienModule,
    LinhKienModule,
    TransactionLinhKienModule,
    DatabaseModule,
    AuthModule,
    SalaryModule,
    AccountManagerModule,
    CategoryManagerModule,
    DeviceManagerModule,
    StaffManagerModule,
    SubCategoryManagerModule,
    CustomerManagerModule,
    OrderManagerModule,
    KanbanModule,
    CalendarModule,
    StaffAccessoriesManagerModule,
    AnalyticsManagementModule,
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
