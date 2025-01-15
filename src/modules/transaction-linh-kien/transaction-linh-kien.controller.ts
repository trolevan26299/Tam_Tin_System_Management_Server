import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionLinhKienService } from './transaction-linh-kien.service';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  DeleteTransactionDTO,
  FilterTransactionDto,
} from './dto/transaction.dto';
import { AuthGuard } from '@app/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('TransactionLinhKien')
@Controller('transaction-linh-kien')
export class TransactionLinhKienController {
  constructor(
    private readonly transactionService: TransactionLinhKienService,
  ) {}

  @Get()
  async getList(@Query() query: FilterTransactionDto) {
    return this.transactionService.getList(query);
  }

  @Post()
  async create(@Body() createDto: CreateTransactionDTO) {
    return this.transactionService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDTO,
  ) {
    return this.transactionService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Body() deleteDto: DeleteTransactionDTO,
  ) {
    return this.transactionService.delete(id, deleteDto.passcode);
  }
}
