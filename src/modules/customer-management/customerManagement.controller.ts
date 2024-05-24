import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerManagerService } from './customerManagement.service';
import { QueryCustomerDto } from './dto/customerManagement.dto';

@ApiTags('CustomerManagement')
@Controller('CustomerManagement')
export class CustomerManagementController {
  constructor(
    private readonly customerManagementService: CustomerManagerService,
  ) {}

  @Get('list')
  async getAllCustomer(@Query() query: QueryCustomerDto): Promise<any> {
    console.log(query);
  }
}
