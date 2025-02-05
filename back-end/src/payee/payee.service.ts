import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { DatabaseService } from '../database/database.service';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { PayeeInfoDto } from './dto/payee-info.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { Payee, PayeeType } from './entities/payee.entity';

export type PayeeRelation = 'defaultCategory' | 'transactions';

@Injectable()
export class PayeeService {
    private readonly _logger = new Logger(PayeeService.name);

    constructor(
        @InjectRepository(Payee)
        private readonly _payeeRepository: Repository<Payee>,
        private readonly _categoryService: CategoryService,
        private readonly _databaseService: DatabaseService
    ) {}

    /**
     * Get all payees `PayeeInfoDto`
     */
    async getAllPayeeInfos(): Promise<PayeeInfoDto[]> {
        try {
            const payees = await this._payeeRepository.find({
                where: {
                    type: PayeeType.UserDefined,
                },
                relations: {
                    defaultCategory: true,
                },
            });
            if (payees.length > 0) {
                return payees.map((c) => this._mapPayeeInfo(c));
            }

            this._logger.log('No payee found');
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all payees:', e);
            return [];
        }
    }

    /**
     * Get a single payee `PayeeInfoDto`
     *
     * @param id
     */
    async getPayeeInfo(id: string): Promise<PayeeInfoDto | null> {
        try {
            const payee = await this.getPayeeById(id, ['defaultCategory']);
            if (payee) {
                return this._mapPayeeInfo(payee);
            }

            this._logger.warn(`Could not find payee: '${id}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting the payee:', e);
            return null;
        }
    }

    /**
     * Get a single payee `PayeeInfoDto` by name
     *
     * @param name
     */
    async getPayeeInfoByName(name: string): Promise<PayeeInfoDto | null> {
        try {
            const payee = await this._payeeRepository.findOne({
                where: { name: name },
                relations: {
                    defaultCategory: true,
                },
            });
            if (payee) {
                return this._mapPayeeInfo(payee);
            }

            this._logger.log(`No payee found with name: '${name}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting the payee by name:', e);
            return null;
        }
    }

    /**
     * Get a single payee `Payee`
     *
     * @param id
     * @param loadRelations
     */
    async getPayeeById(id: string, loadRelations: PayeeRelation[]): Promise<Payee | null> {
        try {
            return await this._payeeRepository.findOne({
                where: {
                    payeeId: id,
                },
                relations: loadRelations,
            });
        } catch (e) {
            this._logger.error('Exception when getting the payee:', e);
            return null;
        }
    }

    /**
     * Get the number of transactions using this payee
     *
     * @param id
     */
    async getPayeeTransactionCount(id: string): Promise<number> {
        try {
            const payee = await this.getPayeeById(id, ['transactions']);
            if (!payee) return 0;

            return payee.transactions?.length ?? 0;
        } catch (e) {
            this._logger.error('Exception when getting the payee transaction count:', e);
            return -1;
        }
    }

    /**
     * Get the 'Starting Balance' payee. Loads `DefaultCategory` relation
     */
    async getStartingBalancePayee(): Promise<Payee | null> {
        try {
            return await this._payeeRepository.findOne({
                where: {
                    type: PayeeType.StartingBalance,
                },
                relations: {
                    defaultCategory: true,
                },
            });
        } catch (e) {
            this._logger.error('Exception when getting the starting balance payee:', e);
            return null;
        }
    }

    /**
     * Create a new payee
     *
     * @param createPayeeDto
     */
    async createPayee(createPayeeDto: CreatePayeeDto): Promise<string | null> {
        try {
            // Check if a payee with that name already exists
            const existingPayee = await this.getPayeeInfoByName(createPayeeDto.name);
            if (existingPayee) {
                this._logger.error(
                    `A payee with this name: '${createPayeeDto.name}' already exists`
                );
                return null;
            }

            const payee = new Payee();
            payee.name = createPayeeDto.name;
            if (isUUID(createPayeeDto.defaultCategoryId)) {
                const category = await this._categoryService.getCategoryById(
                    createPayeeDto.defaultCategoryId
                );
                if (category) {
                    payee.defaultCategory = category;
                }
            }

            const db = await this._databaseService.save(payee);
            if (!db) {
                this._logger.error('Something went wrong when creating the payee');
                return null;
            }
            return db.payeeId;
        } catch (e) {
            this._logger.error('Exception when creating payee:', e);
            return null;
        }
    }

    /**
     * Update an existing payee
     *
     * @param updatePayeeDto
     */
    async updatePayee(updatePayeeDto: UpdatePayeeDto): Promise<boolean> {
        try {
            // Check if a payee with that name already exists
            const existingPayee = await this.getPayeeInfoByName(updatePayeeDto.name);
            if (existingPayee && existingPayee.payeeId !== updatePayeeDto.payeeId) {
                this._logger.error(
                    `A payee with this name: '${updatePayeeDto.name}' already exists`
                );
                return false;
            }

            const payee = await this.getPayeeById(updatePayeeDto.payeeId, ['defaultCategory']);
            if (!payee) {
                this._logger.warn(`Could not find payee: '${updatePayeeDto.payeeId}' to update`);
                return false;
            }

            if (payee.type === PayeeType.StartingBalance) {
                this._logger.error('Cannot update default payee');
                return false;
            }

            if (!payee.isEditable) {
                this._logger.error(`This payee: '${payee.name}' cannot be edited`);
                return false;
            }

            payee.name = updatePayeeDto.name;
            if (isUUID(updatePayeeDto.defaultCategoryId)) {
                const category = await this._categoryService.getCategoryById(
                    updatePayeeDto.defaultCategoryId
                );
                if (category) {
                    payee.defaultCategory = category;
                }
            } else {
                payee.defaultCategory = null;
            }

            await this._databaseService.save(payee);
            return true;
        } catch (e) {
            this._logger.error('Exception when updating payee:', e);
            return false;
        }
    }

    /**
     * Delete an existing payee
     *
     * @param id
     */
    async deletePayee(id: string): Promise<boolean> {
        try {
            const payee = await this.getPayeeById(id, ['transactions']);
            if (!payee) return true;

            if (payee.type === PayeeType.StartingBalance) {
                this._logger.error('Cannot delete default payee');
                return false;
            }

            if (!payee.isEditable) {
                this._logger.error(`This payee: '${payee.name}' cannot be edited`);
                return false;
            }

            // Check for transactions
            if (payee.transactions && payee.transactions.length > 0) {
                this._logger.error(
                    `Payee: '${payee.name}' cannot be deleted, it has ${payee.transactions.length} transactions`
                );
                return false;
            }

            await this._databaseService.remove(payee);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting payee:', e);
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Payee` to a `PayeeInfoDto`
     *
     * @param payee
     */
    private _mapPayeeInfo(payee: Payee): PayeeInfoDto {
        return {
            payeeId: payee.payeeId,
            name: payee.name,
            defaultCategoryId: payee.defaultCategory?.categoryId,
        };
    }
}
