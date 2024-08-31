import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { PayeeInfoDto } from './dto/payee-info.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { PayeeService } from './payee.service';

@ApiTags('Payee')
@Controller('payee')
export class PayeeController {
    constructor(private readonly _payeeService: PayeeService) {}

    @Get()
    getAllPayees(): Promise<PayeeInfoDto[]> {
        return this._payeeService.getAllPayeeInfos();
    }

    @Get(':id')
    getPayeeById(@Param('id') id: string): Promise<PayeeInfoDto | null> {
        return this._payeeService.getPayeeInfo(id);
    }

    @Post()
    createPayee(@Body() dto: CreatePayeeDto): Promise<string | null> {
        return this._payeeService.createPayee(dto);
    }

    @Put()
    updatePayee(@Body() dto: UpdatePayeeDto): Promise<boolean> {
        return this._payeeService.updatePayee(dto);
    }
}
