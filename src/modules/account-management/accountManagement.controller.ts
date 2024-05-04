/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { AccountManagerService } from './accountManagement.service';
import {
  createAccountDTO,
  filterAccountDto,
  updateAccountDTO,
} from './dto/accountManagement.dto';
import { AccountManagementModel } from './models/accountManagement.model';

@ApiBearerAuth()
@ApiTags('AccountManagement')
@Controller('account')
export class AccountManagerController {
  constructor(
    private readonly accountManagementService: AccountManagerService,
  ) {}

  // API CREATE ACCOUNT
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createAccountDto: createAccountDTO,
    @Request() req: any,
  ): Promise<any> {
    return this.accountManagementService.createAccount(
      createAccountDto,
      req.user_data.data,
    );
  }

  // API GET ALL ACCOUNT
  @UseGuards(AuthGuard)
  @Post('list')
  async getAllAccount(
    @Body() BodyGetAllAccountData: filterAccountDto,
  ): Promise<AccountManagementModel[]> {
    return this.accountManagementService.getAllAccount(BodyGetAllAccountData);
  }

  // API GET DETAIL ACCOUNT
  @UseGuards(AuthGuard)
  @Get(':id')
  async getDetailAccount(
    @Param('id') id: string,
  ): Promise<AccountManagementModel> {
    return this.accountManagementService.getDetailAccount(id);
  }

  // API UPDATE ACCOUNT
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: updateAccountDTO,
  ): Promise<AccountManagementModel> {
    return this.accountManagementService.updateAccount(id, updateAccountDto);
  }
}
