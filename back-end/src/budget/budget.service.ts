import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private _budgetRepository: Repository<Budget>
    ) {}

    /**
     * Get all the budgets `BudgetInfoDto`
     */
    async getAllBudgetInfos(): Promise<BudgetInfoDto[]> {
        const budgets = await this._budgetRepository.find();
        if (budgets.length > 0) {
            return budgets.map((b) => this._mapBudgetInfoDto(b));
        }
        return [];
    }

    /**
     * Get a single budget `BudgetInfoDto`
     *
     * @param id
     */
    async getBudgetInfo(id: string): Promise<BudgetInfoDto | null> {
        const budget = await this.getBudget(id);
        if (budget) {
            return this._mapBudgetInfoDto(budget);
        }
        return null;
    }

    /**
     * Get a single budget `Budget`
     *
     * @param id
     */
    async getBudget(id: string): Promise<Budget | null> {
        return await this._budgetRepository.findOneBy({ budgetId: id });
    }

    /**
     * Create a new budget
     *
     * @param createBudgetDto
     */
    async createBudget(createBudgetDto: CreateBudgetDto): Promise<string | null> {
        try {
            const budget = new Budget();
            budget.name = createBudgetDto.name;

            const db = await this._budgetRepository.save(budget);
            return db.budgetId;
        } catch {
            return null;
        }
    }

    /**
     * Update an existing budget
     *
     * @param updateBudgetDto
     */
    async updateBudget(updateBudgetDto: UpdateBudgetDto): Promise<boolean> {
        try {
            const budget = await this.getBudget(updateBudgetDto.budgetId);
            if (budget) {
                budget.name = updateBudgetDto.name;

                await this._budgetRepository.save(budget);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // TODO: add soft-delete `this._budgetRepository.softDelete()`

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Budget` to a `BudgetInfoDto`
     *
     * @param budget
     */
    private _mapBudgetInfoDto(budget: Budget): BudgetInfoDto {
        return budget;
    }
}
