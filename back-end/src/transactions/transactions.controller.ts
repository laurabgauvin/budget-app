import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly _transactionService: TransactionsService) {}

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto): Promise<string | null> {
        return this._transactionService.createTransaction(dto);
    }

    @Put()
    updateTransaction(@Body() dto: UpdateTransactionDto): Promise<boolean> | null {
        return null;
    }
}
