import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetInfoDto } from './dto/budget-info.dto';
import { BudgetMonthCategoryDataDto } from './dto/budget-month-category-data.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetMonthCategory } from './entities/budget-month-category.entity';
import { BudgetMonth } from './entities/budget-month.entity';
import { Budget } from './entities/budget.entity';
import { BudgetView } from './entities/budget.view';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private _budgetRepository: Repository<Budget>,
        @InjectRepository(BudgetMonth)
        private _budgetMonthRepository: Repository<BudgetMonth>,
        @InjectRepository(BudgetMonthCategory)
        private _budgetMonthCategoryRepository: Repository<BudgetMonthCategory>,
        @InjectRepository(BudgetView)
        private _budgetViewRepository: Repository<BudgetView>
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
     * Get the budgeted categories and amounts for the given month
     *
     * @param id
     * @param year
     * @param month
     */
    async getBudgetMonth(
        id: string,
        year: number,
        month: number
    ): Promise<BudgetMonthCategoryDataDto[] | []> {
        const budgetView = await this._budgetViewRepository.findBy({
            budgetId: id,
            year: year,
            month: month,
        });
        if (budgetView) {
            return budgetView.map(
                (bv): BudgetMonthCategoryDataDto => ({
                    ...bv,
                    categoryName: bv.categoryName ?? '',
                    amountBudgeted: bv.amountBudgeted ?? 0,
                    amountSpent: bv.amountSpent ?? 0,
                    amountAvailable: bv.amountAvailable ?? 0,
                })
            );
        }
        return [];
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

    /**
     * Delete an existing budget
     *
     * @param budgetId
     */
    async deleteBudget(budgetId: string): Promise<boolean> {
        try {
            const budget = await this.getBudget(budgetId);
            if (budget) {
                await this._budgetRepository.softRemove(budget);
                return true;
            }
            return true;
        } catch {
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Budget` to a `BudgetInfoDto`
     *
     * @param budget
     */
    private _mapBudgetInfoDto(budget: Budget): BudgetInfoDto {
        return {
            budgetId: budget.budgetId,
            name: budget.name,
        };
    }
}
