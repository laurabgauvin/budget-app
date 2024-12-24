import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategoryDto } from '../transactions/dto/create-transaction.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { CategoryInfoDto } from './dto/category-info.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { TransactionCategory } from './entities/transaction-category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private _categoryRepository: Repository<Category>,
        @InjectRepository(TransactionCategory)
        private _transactionCategoryRepository: Repository<TransactionCategory>
    ) {}

    /**
     * Get all categories `CategoryInfoDto`
     */
    async getAllCategoryInfos(): Promise<CategoryInfoDto[]> {
        const categories = await this._categoryRepository.find();
        if (categories.length > 0) {
            return categories.map((c) => this._mapCategoryInfo(c));
        }
        return [];
    }

    /**
     * Get a single category `CategoryInfoDto`
     *
     * @param id
     */
    async getCategoryInfo(id: string): Promise<CategoryInfoDto | null> {
        const category = await this.getCategory(id);
        if (category) {
            return this._mapCategoryInfo(category);
        }
        return null;
    }

    /**
     * Get a single category `Category`
     *
     * @param id
     */
    async getCategory(id: string): Promise<Category | null> {
        return await this._categoryRepository.findOneBy({ categoryId: id });
    }

    /**
     * Create a new category
     *
     * @param createCategoryDto
     */
    async createCategory(createCategoryDto: CreateCategoryDto): Promise<string | null> {
        try {
            const category = new Category();
            category.name = createCategoryDto.name;

            const db = await this._categoryRepository.save(category);
            return db.categoryId;
        } catch {
            return null;
        }
    }

    /**
     * Update an existing category
     *
     * @param updateCategoryDto
     */
    async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<boolean> {
        try {
            const category = await this.getCategory(updateCategoryDto.categoryId);
            if (category) {
                category.name = updateCategoryDto.name;

                await this._categoryRepository.save(category);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Set the transaction categories
     *
     * @param categories
     * @param transaction
     */
    async setTransactionCategories(
        categories: TransactionCategoryDto[],
        transaction: Transaction
    ): Promise<TransactionCategory[]> {
        const transactionCategories: TransactionCategory[] = [];
        for (const c of categories) {
            const category = await this.getCategory(c.categoryId);
            if (category) {
                const tranCat = new TransactionCategory();
                tranCat.transaction = transaction;
                tranCat.category = category;
                tranCat.notes = c.notes;
                tranCat.amount = c.amount;
                transactionCategories.push(tranCat);
            }
        }
        return await this._transactionCategoryRepository.save(transactionCategories);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Category` to a `CategoryInfoDto`
     *
     * @param category
     */
    private _mapCategoryInfo(category: Category): CategoryInfoDto {
        return category;
    }
}
