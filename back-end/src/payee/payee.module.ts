import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payee } from './entities/payee.entity';

@Module({ imports: [TypeOrmModule.forFeature([Payee])] })
export class PayeeModule {}
