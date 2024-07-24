import { AuthGuard } from '@app/guards/auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalaryService } from './salary.service';

@ApiBearerAuth()
@ApiTags('Salary')
@UseGuards(AuthGuard)
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // get list
}
