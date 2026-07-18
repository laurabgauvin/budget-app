import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalInfoDto } from './dto/goal-info.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';

@ApiTags('Goal')
@Controller('goal')
export class GoalController {
    constructor(private readonly _goalService: GoalService) {}

    @Get()
    @ApiQuery({
        name: 'archived',
        type: 'boolean',
        required: true,
    })
    getAllGoals(@Query('archived', ParseBoolPipe) archived: boolean): Promise<GoalInfoDto[]> {
        return this._goalService.getAllGoalInfos(archived);
    }

    @Get(':id')
    @ApiQuery({
        name: 'archived',
        type: 'boolean',
        required: true,
    })
    getGoalById(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('archived', ParseBoolPipe) archived: boolean
    ): Promise<GoalInfoDto | null> {
        return this._goalService.getGoalInfo(id, archived);
    }

    @Post()
    createGoal(@Body() dto: CreateGoalDto): Promise<string | null> {
        return this._goalService.createGoal(dto);
    }

    @Put()
    updateGoal(@Body() dto: UpdateGoalDto): Promise<boolean> {
        return this._goalService.updateGoal(dto);
    }

    @Delete('archive/:id')
    archiveGoal(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._goalService.archiveGoal(id);
    }

    @Delete(':id')
    deleteGoal(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._goalService.permanentlyDeleteGoal(id);
    }
}
