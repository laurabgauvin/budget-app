import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryInfoDto } from './dto/category-info.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) {}

    @Get()
    getAllCategories(): Promise<CategoryInfoDto[]> {
        return this._categoryService.getAllCategories();
    }

    @Get(':id')
    getCategoryById(@Param('id') id: string): Promise<CategoryInfoDto | null> {
        return this._categoryService.getCategory(id);
    }

    @Post()
    createCategory(@Body() dto: CreateCategoryDto): Promise<string | null> {
        return this._categoryService.createCategory(dto);
    }

    @Put()
    updateCategory(@Body() dto: UpdateCategoryDto): Promise<boolean> {
        return this._categoryService.updateCategory(dto);
    }
}
