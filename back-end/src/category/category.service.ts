import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryInfoDto } from './dto/category-info.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private _categoryRepository: Repository<Category>
    ) {}

    /**
     * Get all categories
     */
    async getAllCategories(): Promise<CategoryInfoDto[]> {
        const categories = await this._categoryRepository.find();
        if (categories.length > 0) {
            return categories.map((c) => this._mapCategoryInfo(c));
        }
        return [];
    }

    /**
     * Get a single category
     *
     * @param id
     */
    async getCategory(id: string): Promise<CategoryInfoDto | null> {
        const category = await this._categoryRepository.findOneBy({ category_id: id });
        if (category) {
            return this._mapCategoryInfo(category);
        }
        return null;
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
            return db.category_id;
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
            const category = await this._categoryRepository.findOneBy({
                category_id: updateCategoryDto.categoryId,
            });
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
     * Map a `Category` to a `CategoryInfoDto`
     *
     * @param category
     */
    private _mapCategoryInfo(category: Category): CategoryInfoDto {
        return {
            categoryId: category.category_id,
            name: category.name,
        };
    }
}
