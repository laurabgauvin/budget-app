import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class ColumnNumericTransformer implements ValueTransformer {
    /**
     * Writing to the database
     *
     * @param data
     */
    to(data: number | undefined): number | undefined {
        return data;
    }

    /**
     * Reading from the database
     *
     * @param data
     */
    from(data: string | undefined): number | undefined {
        return data ? parseFloat(data) : undefined;
    }
}
