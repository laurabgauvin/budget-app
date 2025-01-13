import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountInfoDto } from './dto/account-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly _accountService: AccountService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ GET
    // -----------------------------------------------------------------------------------------------------

    @Get()
    getAllAccounts(): Promise<AccountInfoDto[]> {
        return this._accountService.getAllAccountInfos();
    }

    @Get(':id')
    getAccountById(@Param('id', ParseUUIDPipe) id: string): Promise<AccountInfoDto | null> {
        return this._accountService.getAccountInfoById(id);
    }

    @Get('name/:name')
    getAccountByName(@Param('name') name: string): Promise<AccountInfoDto | null> {
        return this._accountService.getAccountInfoByName(name);
    }

    @Get('balance/:id')
    getAccountBalance(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
        return this._accountService.getAccountBalance(id);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ POST
    // -----------------------------------------------------------------------------------------------------

    @Post()
    createAccount(@Body() dto: CreateAccountDto): Promise<string | null> {
        return this._accountService.createAccount(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ PUT
    // -----------------------------------------------------------------------------------------------------

    @Put()
    updateAccount(@Body() dto: UpdateAccountDto): Promise<boolean> {
        return this._accountService.updateAccount(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ DELETE
    // -----------------------------------------------------------------------------------------------------

    @Delete(':id')
    deleteAccount(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._accountService.deleteAccount(id);
    }
}
