import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategoryDto } from '../transaction/dto/create-transaction.dto';
import { Transaction } from '../transaction/entities/transaction.entity';
import { CategoryInfoDto } from './dto/category-info.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { TransactionCategory } from './entities/transaction-category.entity';

interface UpdatedCategoryInfo {
    dto: TransactionCategoryDto;
    categoryChanged: boolean;
    amountChanged: boolean;
    notesChanged: boolean;
}

interface CompareTransactionCategories {
    added: TransactionCategoryDto[];
    removed: TransactionCategory[];
    updated: UpdatedCategoryInfo[];
}

@Injectable()
export class CategoryService {
    private readonly _logger = new Logger(CategoryService.name);

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
        try {
            const categories = await this._categoryRepository.find();
            if (categories.length > 0) {
                return categories.map((c) => this._mapCategoryInfo(c));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all Category:', e);
            return [];
        }
    }

    /**
     * Get a single category `CategoryInfoDto`
     *
     * @param id
     */
    async getCategoryInfo(id: string): Promise<CategoryInfoDto | null> {
        try {
            const category = await this.getCategory(id);
            if (category) {
                return this._mapCategoryInfo(category);
            }
            return null;
        } catch (e) {
            this._logger.error('Exception when getting Category:', e);
            return null;
        }
    }

    /**
     * Get a single category `Category`
     *
     * @param id
     */
    async getCategory(id: string): Promise<Category | null> {
        try {
            return await this._categoryRepository.findOneBy({ categoryId: id });
        } catch (e) {
            this._logger.error('Exception when reading Category:', e);
            return null;
        }
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
        } catch (e) {
            this._logger.error('Exception when creating Category:', e);
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
        } catch (e) {
            this._logger.error('Exception when updating Category:', e);
            return false;
        }
    }

    /**
     * Validate the `TransactionCategoryDto` data
     *
     * @param categories
     * @param transactionAmount
     */
    validateTransactionCategories(
        categories: TransactionCategoryDto[],
        transactionAmount: number
    ): boolean {
        // Validate sum of categories matches total transaction amount
        const sum = categories.reduce((s, c) => s + c.amount, 0);
        if (sum !== transactionAmount) {
            this._logger.error(
                `Incorrect TransactionCategory amount total, expected: ${transactionAmount}, actual: ${sum}`
            );
            return false;
        }

        // Validate order of categories is valid
        categories.sort((a, b) => a.order - b.order);
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].order !== i) {
                this._logger.error(
                    `Incorrect TransactionCategory order, expected: ${i}, actual: ${categories[i].order}`
                );
                return false;
            }
        }

        return true;
    }

    /**
     * Create new `TransactionCategory` relations for the passed categories and transaction
     *
     * @param categories
     * @param transaction
     */
    async createTransactionCategories(
        categories: TransactionCategoryDto[],
        transaction: Transaction
    ): Promise<TransactionCategory[]> {
        const transactionCategories: TransactionCategory[] = [];
        try {
            for (const c of categories) {
                const category = await this.getCategory(c.categoryId);
                if (category) {
                    const tranCat = new TransactionCategory();
                    tranCat.transaction = transaction;
                    tranCat.category = category;
                    tranCat.notes = c.notes;
                    tranCat.amount = c.amount;
                    tranCat.order = c.order;
                    transactionCategories.push(tranCat);
                }
            }
            return await this._transactionCategoryRepository.save(transactionCategories);
        } catch (e) {
            this._logger.error('Exception when creating TransactionCategory:', e);
            return [];
        }
    }

    /**
     * Update `TransactionCategory` relations to set the passed categories on the transaction
     *
     * @param categories
     * @param transaction
     */
    async updateTransactionCategories(
        categories: TransactionCategoryDto[],
        transaction: Transaction
    ): Promise<TransactionCategory[]> {
        try {
            // Get the changes to make
            const transactionCategories = await this._getTransactionCategories(
                transaction.transactionId
            );
            const compare = this._compareTransactionCategories(transactionCategories, categories);

            // Delete removed categories
            if (compare.removed.length > 0)
                await this._transactionCategoryRepository.remove(compare.removed);

            // Update categories
            if (compare.updated.length > 0) {
                const updatedList: TransactionCategory[] = [];
                for (const updated of compare.updated) {
                    const transactionCategory = transactionCategories.find(
                        (tc) => tc.order === updated.dto.order
                    );
                    if (transactionCategory) {
                        // Update category
                        if (updated.categoryChanged) {
                            const newCategory = await this.getCategory(updated.dto.categoryId);
                            if (newCategory) {
                                transactionCategory.category = newCategory;
                            }
                        }

                        // Update amount
                        if (updated.amountChanged) transactionCategory.amount = updated.dto.amount;

                        // Update notes
                        if (updated.notesChanged) transactionCategory.notes = updated.dto.notes;

                        updatedList.push(transactionCategory);
                    }
                }

                await this._transactionCategoryRepository.save(updatedList);
            }

            // Add new categories
            if (compare.added.length > 0)
                await this.createTransactionCategories(compare.added, transaction);

            // Return updated list
            const update =
                compare.removed.length > 0 || compare.added.length > 0 || compare.added.length > 0;
            return update
                ? await this._transactionCategoryRepository.findBy({
                      transaction: {
                          transactionId: transaction.transactionId,
                      },
                  })
                : transactionCategories;
        } catch (e) {
            this._logger.error('Exception when updating TransactionCategory:', e);
            return [];
        }
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
        return {
            categoryId: category.categoryId,
            name: category.name,
        };
    }

    /**
     * Get the `TransactionCategory` for the transaction ID. Loads `Category` relation
     *
     * @param transactionId
     */
    private async _getTransactionCategories(transactionId: string): Promise<TransactionCategory[]> {
        return await this._transactionCategoryRepository.find({
            where: {
                transaction: {
                    transactionId: transactionId,
                },
            },
            order: {
                order: 'asc',
            },
            relations: ['category'],
        });
    }

    /**
     * Compare the new and existing `TransactionCategory` and return the changes to make
     *
     * @param existingList
     * @param newList
     */
    private _compareTransactionCategories(
        existingList: TransactionCategory[],
        newList: TransactionCategoryDto[]
    ): CompareTransactionCategories {
        existingList.sort((a, b) => a.order - b.order);
        newList.sort((a, b) => a.order - b.order);

        const added: TransactionCategoryDto[] = [];
        const removed: TransactionCategory[] = [];
        const updated: UpdatedCategoryInfo[] = [];

        let i = 0,
            j = 0;

        if (existingList.length === 0) return { added: newList, removed: [], updated: [] };
        if (newList.length === 0) return { added: [], removed: existingList, updated: [] };

        while (i < existingList.length && j < newList.length) {
            const existing = existingList[i];
            const modified = newList[j];

            const categoryChanged = existing.category.categoryId !== modified.categoryId;
            const amountChanged = Number(existing.amount) !== modified.amount;
            const notesChanged = (existing.notes ?? '') !== modified.notes;

            if (categoryChanged || amountChanged || notesChanged) {
                updated.push({
                    dto: modified,
                    categoryChanged,
                    amountChanged,
                    notesChanged,
                });
            }
            i++;
            j++;
        }

        if (i < existingList.length) {
            removed.push(...existingList.slice(i, existingList.length + 1));
        } else if (j < newList.length) {
            added.push(...newList.slice(j, newList.length + 1));
        }

        return { added, removed, updated };
    }
}
