import { AuthGuard } from '@app/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionDTO,
  FilterTransactionDto,
  UpdateTransactionDTO,
} from './dto/transaction.dto';
import { TransactionLinhKienService } from './transaction-linh-kien.service';

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
    console.log('query', query);
    return this.transactionService.getList(query);
  }

  @Post()
  async create(@Body() createDto: CreateTransactionDTO) {
    console.log('createDto', createDto);
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
  async delete(@Param('id') id: string, @Query('passcode') passcode: number) {
    return this.transactionService.delete(id, Number(passcode));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.transactionService.getById(id);
  }
}
