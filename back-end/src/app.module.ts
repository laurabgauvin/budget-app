import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetModule } from './budget/budget.module';
import { Budget } from './budget/entities/budget.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoryModule } from './category/category.module';

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
            entities: [Budget],
            // PROD: synchronize true should not be used in prod
            synchronize: true,
        }),
        TransactionsModule,
        BudgetModule,
        CategoryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
