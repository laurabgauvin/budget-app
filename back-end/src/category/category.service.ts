import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { DatabaseService } from '../database/database.service';
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

export type CategoryRelations = 'budgetMonths' | 'transactionCategories' | 'goals';

@Injectable()
export class CategoryService {
    private readonly _logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(Category)
        private readonly _categoryRepository: Repository<Category>,
        @InjectRepository(TransactionCategory)
        private readonly _transactionCategoryRepository: Repository<TransactionCategory>,
        private readonly _databaseService: DatabaseService
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

            this._logger.log('No categories found');
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all categories:', e);
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
            const category = await this.getCategoryById(id);
            if (category) {
                return this._mapCategoryInfo(category);
            }

            this._logger.warn(`Could not find category ${id}`);
            return null;
        } catch (e) {
            this._logger.error(`Exception when getting category ${id}:`, e);
            return null;
        }
    }

    /**
     * Get a single category `Category`
     *
     * @param id
     * @param loadRelations
     */
    async getCategoryById(
        id: string,
        loadRelations: CategoryRelations[] = []
    ): Promise<Category | null> {
        try {
            return await this._categoryRepository.findOne({
                where: {
                    categoryId: id,
                },
                relations: loadRelations,
            });
        } catch (e) {
            this._logger.error(`Exception when reading category ${id}:`, e);
            return null;
        }
    }

    /**
     * Get a `Category` by name
     *
     * @param name
     */
    async getCategoryByName(name: string): Promise<Category | null> {
        try {
            const category = await this._categoryRepository.findOne({
                where: {
                    name: name,
                },
            });
            if (category) return category;

            this._logger.log(`No category found with name: '${name}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting the category by name:', e);
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
            // Check if a category with that name already exists
            const existingCategory = await this.getCategoryByName(createCategoryDto.name);
            if (existingCategory) {
                this._logger.error(
                    `A category with this name: '${createCategoryDto.name}' already exists`
                );
                return null;
            }

            const category = new Category();
            category.name = createCategoryDto.name;

            const db = await this._databaseService.save(category);
            if (db) return db.categoryId;

            this._logger.error(`Could not create category: ${category.name}`);
            return null;
        } catch (e) {
            this._logger.error('Exception when creating category:', e);
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
            // Check if a category with that name already exists
            const existingCategory = await this.getCategoryByName(updateCategoryDto.name);
            if (existingCategory) {
                this._logger.error(
                    `A category with this name: '${updateCategoryDto.name}' already exists`
                );
                return false;
            }

            const category = await this.getCategoryById(updateCategoryDto.categoryId);
            if (category) {
                if (!category.isEditable) {
                    this._logger.error(
                        `The category: '${updateCategoryDto.name}' may not be edited`
                    );
                    return false;
                }

                category.name = updateCategoryDto.name;

                await this._databaseService.save(category);
                return true;
            }

            this._logger.warn(`Could not find category to update: ${updateCategoryDto.categoryId}`);
            return false;
        } catch (e) {
            this._logger.error('Exception when updating category:', e);
            return false;
        }
    }

    /**
     * Delete an existing category
     *
     * @param id
     */
    async deleteCategory(id: string): Promise<boolean> {
        try {
            const category = await this.getCategoryById(id, ['transactionCategories']);
            if (!category) {
                this._logger.log(`Could not find category to delete: ${id}`);
                return true;
            }

            if (!category.isEditable) {
                this._logger.error(`The category: '${category.name}' may not be deleted`);
                return false;
            }

            // Check for transactions
            if (category.transactionCategories && category.transactionCategories.length > 0) {
                this._logger.error(
                    `Category: '${category.name}' cannot be deleted, it has ${category.transactionCategories.length} transactions`
                );
                return false;
            }

            await this._databaseService.remove(category);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting category:', e);
            return false;
        }
    }

    /**
     * Validate the `TransactionCategoryDto` data
     *
     * @param categories
     * @param transactionAmount
     */
    async validateTransactionCategories(
        categories: TransactionCategoryDto[],
        transactionAmount: number
    ): Promise<boolean> {
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

        // Validate all categories exist
        for (const cat of categories) {
            if (!(await this.getCategoryById(cat.categoryId))) {
                this._logger.error(`Invalid category: ${cat.categoryId}`);
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
     * @param queryRunner
     */
    async createTransactionCategories(
        categories: TransactionCategoryDto[],
        transaction: Transaction,
        queryRunner?: QueryRunner
    ): Promise<TransactionCategory[]> {
        try {
            const transactionCategories: TransactionCategory[] = [];
            for (const c of categories) {
                const category = await this.getCategoryById(c.categoryId);
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
            return (await this._databaseService.save(transactionCategories, queryRunner)) ?? [];
        } catch (e) {
            this._logger.error('Exception when creating TransactionCategories:', e);
            return [];
        }
    }

    /**
     * Update `TransactionCategory` relations to set the passed categories on the transaction
     *
     * @param categories
     * @param transaction
     * @param queryRunner
     */
    async updateTransactionCategories(
        categories: TransactionCategoryDto[],
        transaction: Transaction,
        queryRunner?: QueryRunner
    ): Promise<TransactionCategory[]> {
        try {
            // Get the changes to make
            const transactionCategories = await this._getTransactionCategories(
                transaction.transactionId
            );
            const compare = this._compareTransactionCategories(transactionCategories, categories);

            // Delete removed categories
            if (compare.removed.length > 0)
                await this._databaseService.remove(compare.removed, queryRunner);

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
                            const newCategory = await this.getCategoryById(updated.dto.categoryId);
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

                await this._databaseService.save(updatedList, queryRunner);
            }

            // Add new categories
            if (compare.added.length > 0)
                await this.createTransactionCategories(compare.added, transaction, queryRunner);

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
            this._logger.error('Exception when updating TransactionCategories:', e);
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
            isEditable: category.isEditable,
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
            relations: {
                category: true,
            },
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
            const amountChanged = existing.amount !== modified.amount;
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
