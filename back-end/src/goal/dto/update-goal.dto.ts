import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateGoalDto } from './create-goal.dto';

export class UpdateGoalDto extends CreateGoalDto {
    @ApiProperty()
    @IsUUID()
    goalId!: string;
}
