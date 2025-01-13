import { forwardRef, Module } from '@nestjs/common';
import { LinhKienService } from './linhKien.service';
import { LinhKienController } from './linhKien.controller';
import { TransactionLinhKienModule } from '../transaction-linh-kien/transaction-linh-kien.module';
import { LinhKienProvider } from './models/linhKien.model';
import { TransactionLinhKienProvider } from '../transaction-linh-kien/models/transactionLinhKien.model';

@Module({
  imports: [forwardRef(() => TransactionLinhKienModule)],
  controllers: [LinhKienController],
  providers: [LinhKienService, LinhKienProvider, TransactionLinhKienProvider],
  exports: [LinhKienService, LinhKienProvider],
})
export class LinhKienModule {}
