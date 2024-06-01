/* eslint-disable prettier/prettier */
import { USER_TYPE } from '@app/constants/account';
import { Roles } from '@app/decorators/roles.decorator';
import { RolesGuard } from '@app/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
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
@UseGuards(AuthGuard)
@ApiTags('AccountManagement')
@Controller('account')
export class AccountManagerController {
  constructor(
    private readonly accountManagementService: AccountManagerService,
  ) {}

  // API CREATE ACCOUNT
  @Roles(USER_TYPE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
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
  @Post('list')
  async getAllAccount(
    @Body() BodyGetAllAccountData: filterAccountDto,
  ): Promise<AccountManagementModel[]> {
    return this.accountManagementService.getAllAccount(BodyGetAllAccountData);
  }

  // API GET DETAIL ACCOUNT
  @Get(':id')
  async getDetailAccount(
    @Param('id') id: string,
  ): Promise<AccountManagementModel> {
    return this.accountManagementService.getDetailAccount(id);
  }

  // API UPDATE ACCOUNT
  @Roles(USER_TYPE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: updateAccountDTO,
  ): Promise<AccountManagementModel> {
    return this.accountManagementService.updateAccount(id, updateAccountDto);
  }

  @Roles(USER_TYPE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteAccount(
    @Param('id') id: string,
  ): Promise<AccountManagementModel> {
    return await this.accountManagementService.deleteAccount(id);
  }
}
