import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OrderManagement')
@Controller('order')
export class OrderManagementController {
  constructor() {}
}
