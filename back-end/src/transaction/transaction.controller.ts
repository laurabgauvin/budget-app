import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MoveToPayeeDto } from './dto/move-to-payee.dto';
import { TransactionInfoDto } from './dto/transaction-info.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ GET
    // -----------------------------------------------------------------------------------------------------

    @Get()
    getAllTransactions(): Promise<TransactionInfoDto[]> {
        return this._transactionService.getAllTransactionInfos();
    }

    @Get('account/:id')
    getTransactionsByAccount(@Param('id') id: string): Promise<TransactionInfoDto[]> {
        return this._transactionService.getTransactionInfosByAccount(id);
    }

    @Get('payee/:id')
    getTransactionsByPayee(@Param('id') id: string): Promise<TransactionInfoDto[]> {
        return this._transactionService.getTransactionInfosByPayee(id);
    }

    @Get('category/:id')
    getTransactionsByCategory(@Param('id') id: string): Promise<TransactionInfoDto[]> {
        return this._transactionService.getTransactionInfosByCategory(id);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ POST
    // -----------------------------------------------------------------------------------------------------

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto): Promise<string | null> {
        return this._transactionService.createTransaction(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ PUT
    // -----------------------------------------------------------------------------------------------------

    @Put()
    updateTransaction(@Body() dto: UpdateTransactionDto): Promise<boolean> {
        return this._transactionService.updateTransaction(dto);
    }

    @Put('move/payee')
    moveAllToNewPayee(@Body() dto: MoveToPayeeDto): Promise<number> {
        return this._transactionService.moveToPayee(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ DELETE
    // -----------------------------------------------------------------------------------------------------

    @Delete(':id')
    deleteTransaction(@Param('id') id: string): Promise<boolean> {
        return this._transactionService.deleteTransaction(id);
    }
}
