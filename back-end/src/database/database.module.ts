import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { TransactionCategory } from '../category/entities/transaction-category.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { DatabaseService } from './database.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account, Transaction, TransactionCategory])],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
