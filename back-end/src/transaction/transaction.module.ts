import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { CategoryModule } from '../category/category.module';
import { PayeeModule } from '../payee/payee.module';
import { TagModule } from '../tag/tag.module';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        forwardRef(() => AccountModule),
        CategoryModule,
        PayeeModule,
        TagModule,
    ],
    providers: [TransactionService],
    controllers: [TransactionController],
    exports: [TransactionService],
})
export class TransactionModule {}
