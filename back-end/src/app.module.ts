import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetModule } from './budget/budget.module';
import { Budget } from './budget/entities/budget.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
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
            entities: [Budget, Category],
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
