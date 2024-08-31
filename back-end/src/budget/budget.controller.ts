import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@ApiTags('Budget')
@Controller('budget')
export class BudgetController {
    constructor(private readonly _budgetService: BudgetService) {}

    @Get()
    getAllBudgets(): Promise<BudgetInfoDto[]> {
        return this._budgetService.getAllBudgetInfos();
    }

    @Get(':id')
    getBudgetById(@Param('id') id: string): Promise<BudgetInfoDto | null> {
        return this._budgetService.getBudgetInfo(id);
    }

    @Post()
    createBudget(@Body() dto: CreateBudgetDto): Promise<string | null> {
        return this._budgetService.createBudget(dto);
    }

    @Put()
    updateBudget(@Body() dto: UpdateBudgetDto): Promise<boolean> {
        return this._budgetService.updateBudget(dto);
    }
}
