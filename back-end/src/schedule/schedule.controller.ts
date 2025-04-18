import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleInfoDto } from './dto/schedule-info.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
    constructor(private readonly _scheduleService: ScheduleService) {}

    @Get()
    getAllSchedules(): Promise<ScheduleInfoDto[]> {
        return this._scheduleService.getAllScheduleInfos();
    }

    @Get(':id')
    getScheduleById(@Param('id', ParseUUIDPipe) id: string): Promise<ScheduleInfoDto | null> {
        return this._scheduleService.getScheduleInfo(id);
    }

    @Post()
    createSchedule(@Body() dto: CreateScheduleDto): Promise<string | null> {
        return this._scheduleService.createSchedule(dto);
    }

    @Put()
    updateSchedule(@Body() dto: UpdateScheduleDto): Promise<boolean> {
        return this._scheduleService.updateSchedule(dto);
    }

    @Delete(':id')
    deleteSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._scheduleService.deleteSchedule(id);
    }
}
