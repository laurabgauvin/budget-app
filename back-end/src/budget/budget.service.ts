import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private _budgetRepository: Repository<Budget>
    ) {}

    async getAllBudgets(): Promise<BudgetInfoDto[]> {
        const budgets = await this._budgetRepository.find();
        if (budgets.length > 0) {
            return budgets.map((b) => this._mapBudgetInfoDto(b));
        }
        return [];
    }

    async getBudget(id: string): Promise<BudgetInfoDto | null> {
        const budget = await this._budgetRepository.findOneBy({ budget_id: id });
        if (budget) {
            return this._mapBudgetInfoDto(budget);
        }
        return null;
    }

    async createBudget(createBudgetDto: CreateBudgetDto): Promise<string> {
        const budget = new Budget();
        budget.name = createBudgetDto.name;
        budget.year = createBudgetDto.year;
        budget.month = createBudgetDto.month;

        const db = await this._budgetRepository.save(budget);
        return db.budget_id;
    }

    /**
     * Map a `Budget` to a `BudgetInfoDto`
     *
     * @param budget
     */
    private _mapBudgetInfoDto(budget: Budget): BudgetInfoDto {
        return {
            budgetId: budget.budget_id,
            name: budget.name,
            year: budget.year,
            month: budget.month,
        };
    }
}
