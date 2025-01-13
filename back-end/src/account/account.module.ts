import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayeeModule } from '../payee/payee.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        PayeeModule,
        forwardRef(() => TransactionModule),
    ],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {}
