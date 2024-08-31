import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BudgetMonthCategory } from './entities/budget-month-category.entity';
import { Category } from './entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BudgetMonthCategory, Category])],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
