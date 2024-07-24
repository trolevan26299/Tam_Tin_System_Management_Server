import { Module } from '@nestjs/common';
import { SalaryProvider } from './models/salary.model';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';

@Module({
  imports: [],
  controllers: [SalaryController],
  providers: [SalaryProvider, SalaryService],
  exports: [],
})
export class SalaryModule {}
