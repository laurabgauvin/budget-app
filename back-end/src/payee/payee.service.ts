import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { PayeeInfoDto } from './dto/payee-info.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { Payee } from './entities/payee.entity';

@Injectable()
export class PayeeService {
    constructor(
        @InjectRepository(Payee)
        private _payeeRepository: Repository<Payee>,
        private readonly _categoryService: CategoryService
    ) {}

    /**
     * Get all payees `PayeeInfoDto`
     */
    async getAllPayeeInfos(): Promise<PayeeInfoDto[]> {
        const payees = await this._payeeRepository.find();
        if (payees.length > 0) {
            return payees.map((c) => this._mapPayeeInfo(c));
        }
        return [];
    }

    /**
     * Get a single payee `PayeeInfoDto`
     *
     * @param id
     */
    async getPayeeInfo(id: string): Promise<PayeeInfoDto | null> {
        const payee = await this.getPayee(id);
        if (payee) {
            return this._mapPayeeInfo(payee);
        }
        return null;
    }

    /**
     * Get a single payee `Payee`
     *
     * @param id
     */
    async getPayee(id: string): Promise<Payee | null> {
        return await this._payeeRepository.findOneBy({ payee_id: id });
    }

    /**
     * Create a new payee
     *
     * @param createPayeeDto
     */
    async createPayee(createPayeeDto: CreatePayeeDto): Promise<string | null> {
        try {
            const payee = new Payee();
            payee.name = createPayeeDto.name;
            if (createPayeeDto.defaultCategoryId) {
                const category = await this._categoryService.getCategory(
                    createPayeeDto.defaultCategoryId
                );
                if (category) {
                    payee.default_category = category;
                }
            }

            const db = await this._payeeRepository.save(payee);
            return db.payee_id;
        } catch {
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
            const payee = await this.getPayee(updatePayeeDto.payeeId);
            if (payee) {
                payee.name = updatePayeeDto.name;
                if (updatePayeeDto.defaultCategoryId) {
                    const category = await this._categoryService.getCategory(
                        updatePayeeDto.defaultCategoryId
                    );
                    if (category) {
                        payee.default_category = category;
                    }
                }

                await this._payeeRepository.save(payee);
                return true;
            }
            return false;
        } catch {
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
            payeeId: payee.payee_id,
            name: payee.name,
            defaultCategoryId: payee.default_category?.category_id,
        };
    }
}
