import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionInfoDto } from './dto/transaction-info.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly _transactionService: TransactionsService) {}

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

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto): Promise<string | null> {
        return this._transactionService.createTransaction(dto);
    }

    @Put()
    updateTransaction(@Body() dto: UpdateTransactionDto): Promise<boolean> {
        return this._transactionService.updateTransaction(dto);
    }

    @Delete(':id')
    deleteTransaction(@Param('id') id: string): Promise<boolean> {
        return this._transactionService.deleteTransaction(id);
    }
}
