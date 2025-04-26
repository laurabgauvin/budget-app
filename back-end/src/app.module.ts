import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { BudgetModule } from './budget/budget.module';
import { BudgetMonthCategory } from './budget/entities/budget-month-category.entity';
import { BudgetMonth } from './budget/entities/budget-month.entity';
import { Budget } from './budget/entities/budget.entity';
import { BudgetView } from './budget/entities/budget.view';
import { GoalMonthCategory } from './budget/entities/goal-month-category.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { TransactionCategory } from './category/entities/transaction-category.entity';
import { DatabaseModule } from './database/database.module';
import { InsertDefaultValues1736724703103 } from './database/migrations/1736724703103-insert-default-values';
import { NAMING_STRATEGY } from './database/utilities/naming-strategy';
import { Goal } from './goal/entities/goal.entity';
import { GoalModule } from './goal/goal.module';
import { Payee } from './payee/entities/payee.entity';
import { PayeeModule } from './payee/payee.module';
import { Schedule } from './schedule/entities/schedule.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { Tag } from './tag/entities/tag.entity';
import { TagModule } from './tag/tag.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionSubscriber } from './transaction/entities/transaction.subscriber';
import { TransactionModule } from './transaction/transaction.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.development.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                schema: configService.get('DB_SCHEMA'),
                entities: [
                    Account,
                    Budget,
                    BudgetMonth,
                    BudgetMonthCategory,
                    BudgetView,
                    Category,
                    Goal,
                    GoalMonthCategory,
                    Payee,
                    Schedule,
                    Tag,
                    Transaction,
                    TransactionCategory,
                ],
                namingStrategy: NAMING_STRATEGY,
                subscribers: [TransactionSubscriber],
                synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
                migrationsRun: configService.get('DB_MIGRATIONS_RUN') === 'true',
                migrations: [InsertDefaultValues1736724703103],
            }),
            inject: [ConfigService],
        }),
        AccountModule,
        BudgetModule,
        CategoryModule,
        GoalModule,
        PayeeModule,
        TagModule,
        TransactionModule,
        DatabaseModule,
        ScheduleModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
