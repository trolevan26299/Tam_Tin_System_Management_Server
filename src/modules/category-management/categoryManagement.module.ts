import { Module } from '@nestjs/common';
import { CategoryManagerController } from './categoryManagement.controller';
import { CategoryManagerService } from './categoryManagement.service';
import { CategoryManagementProvider } from './models/categoryManagement.model';

@Module({
  imports: [],
  controllers: [CategoryManagerController],
  providers: [CategoryManagementProvider, CategoryManagerService],
  exports: [CategoryManagerService],
})
export class CategoryManagerModule {}
