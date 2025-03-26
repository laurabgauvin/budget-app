import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Goal')
@Controller('goal')
export class GoalController {}
