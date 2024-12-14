import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { BudgetModule } from './budget/budget.module';
import { BudgetMonth } from './budget/entities/budget-month.entity';
import { Budget } from './budget/entities/budget.entity';
import { BudgetView } from './budget/entities/budget.view';
import { CategoryModule } from './category/category.module';
import { BudgetMonthCategory } from './category/entities/budget-month-category.entity';
import { Category } from './category/entities/category.entity';
import { TransactionCategory } from './category/entities/transaction-category.entity';
import { Payee } from './payee/entities/payee.entity';
import { PayeeModule } from './payee/payee.module';
import { Tag } from './tags/entities/tag.entity';
import { TransactionTag } from './tags/entities/transaction-tag.entity';
import { TagsModule } from './tags/tags.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'pux1qucvdzznc4CAV',
            database: 'postgres',
            schema: 'public',
            entities: [
                Account,
                Budget,
                BudgetMonth,
                BudgetMonthCategory,
                BudgetView,
                Category,
                Payee,
                Tag,
                Transaction,
                TransactionCategory,
                TransactionTag,
            ],
            // PROD: synchronize true should not be used in prod
            synchronize: true,
        }),
        TransactionsModule,
        BudgetModule,
        CategoryModule,
        PayeeModule,
        AccountModule,
        TagsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
