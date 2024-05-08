import { Module } from '@nestjs/common';
import { SubCategoryManagementProvider } from './models/subCategoryManagement.model';
import { SubCategoryManagerController } from './subCategoryManagement.controller';
import { SubCategoryManagerService } from './subCategoryManagement.service';

@Module({
  imports: [],
  controllers: [SubCategoryManagerController],
  providers: [SubCategoryManagementProvider, SubCategoryManagerService],
  exports: [SubCategoryManagerService],
})
export class SubCategoryManagerModule {}
