import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountInfoDto } from './dto/account-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly _accountService: AccountService) {}

    @Get()
    getAllAccounts(): Promise<AccountInfoDto[]> {
        return this._accountService.getAllAccountInfos();
    }

    @Get(':id')
    getAccountById(@Param('id') id: string): Promise<AccountInfoDto | null> {
        return this._accountService.getAccountInfo(id);
    }

    @Post()
    createAccount(@Body() dto: CreateAccountDto): Promise<string | null> {
        return this._accountService.createAccount(dto);
    }

    @Put()
    updateAccount(@Body() dto: UpdateAccountDto): Promise<boolean> {
        return this._accountService.updateAccount(dto);
    }

    @Delete(':id')
    deleteAccount(@Param('id') id: string): Promise<boolean> {
        return this._accountService.deleteAccount(id);
    }
}
