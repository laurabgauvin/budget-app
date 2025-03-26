import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { BudgetMonthCategoryDataDto } from './dto/budget-month-category-data.dto';
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
    getBudgetById(@Param('id', ParseUUIDPipe) id: string): Promise<BudgetInfoDto | null> {
        return this._budgetService.getBudgetInfo(id);
    }

    @Get('month/:id/:year/:month')
    getBudgetMonth(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('year') year: number,
        @Param('month') month: number
    ): Promise<BudgetMonthCategoryDataDto[] | []> {
        return this._budgetService.getBudgetMonth(id, year, month);
    }

    @Get('month/:id')
    getCurrentBudgetMonth(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<BudgetMonthCategoryDataDto[] | []> {
        return this._budgetService.getCurrentBudgetMonth(id);
    }

    @Post()
    createBudget(@Body() dto: CreateBudgetDto): Promise<string | null> {
        return this._budgetService.createBudget(dto);
    }

    @Put()
    updateBudget(@Body() dto: UpdateBudgetDto): Promise<boolean> {
        return this._budgetService.updateBudget(dto);
    }

    @Delete(':id')
    deleteBudget(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._budgetService.deleteBudget(id);
    }
}
