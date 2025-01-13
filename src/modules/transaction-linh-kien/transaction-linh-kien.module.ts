import { forwardRef, Module } from '@nestjs/common';

import { TransactionLinhKienProvider } from './models/transactionLinhKien.model';
import { TransactionLinhKienController } from './transaction-linh-kien.controller';
import { TransactionLinhKienService } from './transaction-linh-kien.service';
import { LinhKienModule } from '../linh-kien/linhKien.module';
import { LinhKienProvider } from '../linh-kien/models/linhKien.model';

@Module({
  imports: [forwardRef(() => LinhKienModule)],
  controllers: [TransactionLinhKienController],
  providers: [
    TransactionLinhKienProvider,
    TransactionLinhKienService,
    LinhKienProvider,
  ],
  exports: [TransactionLinhKienService, TransactionLinhKienProvider],
})
export class TransactionLinhKienModule {}
