import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { Payee } from './entities/payee.entity';
import { PayeeController } from './payee.controller';
import { PayeeService } from './payee.service';

@Module({
    imports: [TypeOrmModule.forFeature([Payee]), CategoryModule],
    providers: [PayeeService],
    controllers: [PayeeController],
    exports: [PayeeService],
})
export class PayeeModule {}
