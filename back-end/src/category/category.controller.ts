import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryInfoDto } from './dto/category-info.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) {}

    @Get()
    getAllCategories(): Promise<CategoryInfoDto[]> {
        return this._categoryService.getAllCategoryInfos();
    }

    @Get(':id')
    getCategoryById(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryInfoDto | null> {
        return this._categoryService.getCategoryInfo(id);
    }

    @Post()
    createCategory(@Body() dto: CreateCategoryDto): Promise<string | null> {
        return this._categoryService.createCategory(dto);
    }

    @Put()
    updateCategory(@Body() dto: UpdateCategoryDto): Promise<boolean> {
        return this._categoryService.updateCategory(dto);
    }

    @Delete(':id')
    deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._categoryService.deleteCategory(id);
    }
}
