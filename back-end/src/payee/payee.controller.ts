import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { PayeeInfoDto } from './dto/payee-info.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { PayeeService } from './payee.service';

@ApiTags('Payee')
@Controller('payee')
export class PayeeController {
    constructor(private readonly _payeeService: PayeeService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ GET
    // -----------------------------------------------------------------------------------------------------

    @Get()
    getAllPayees(): Promise<PayeeInfoDto[]> {
        return this._payeeService.getAllPayeeInfos();
    }

    @Get(':id')
    getPayeeById(@Param('id', ParseUUIDPipe) id: string): Promise<PayeeInfoDto | null> {
        return this._payeeService.getPayeeInfo(id);
    }

    @Get('count/:id')
    getPayeeTransactionCount(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
        return this._payeeService.getPayeeTransactionCount(id);
    }

    @Get('name/:name')
    getPayeeByName(@Param('name') name: string): Promise<PayeeInfoDto | null> {
        return this._payeeService.getPayeeInfoByName(name);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ POST
    // -----------------------------------------------------------------------------------------------------

    @Post()
    createPayee(@Body() dto: CreatePayeeDto): Promise<string | null> {
        return this._payeeService.createPayee(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ PUT
    // -----------------------------------------------------------------------------------------------------

    @Put()
    updatePayee(@Body() dto: UpdatePayeeDto): Promise<boolean> {
        return this._payeeService.updatePayee(dto);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ DELETE
    // -----------------------------------------------------------------------------------------------------

    @Delete(':id')
    deletePayee(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._payeeService.deletePayee(id);
    }
}
