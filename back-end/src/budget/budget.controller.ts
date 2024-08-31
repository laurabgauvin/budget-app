import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';

@ApiTags('Budget')
@Controller('budget')
export class BudgetController {
    constructor(private readonly _budgetService: BudgetService) {}

    @Get()
    getAllBudgets(): Promise<BudgetInfoDto[]> {
        return this._budgetService.getAllBudgets();
    }

    @Get(':id')
    getBudgetById(@Param('id') id: string): Promise<BudgetInfoDto | null> {
        return this._budgetService.getBudget(id);
    }

    @Post()
    createBudget(@Body() dto: CreateBudgetDto): Promise<string | null> {
        return this._budgetService.createBudget(dto);
    }
}
