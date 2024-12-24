import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { CategoryModule } from '../category/category.module';
import { PayeeModule } from '../payee/payee.module';
import { TagsModule } from '../tags/tags.module';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        AccountModule,
        CategoryModule,
        PayeeModule,
        TagsModule,
    ],
    providers: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}
