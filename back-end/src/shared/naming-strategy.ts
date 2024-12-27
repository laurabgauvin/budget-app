import { NamingStrategyInterface, Table, View } from 'typeorm';

export const namingStrategy: NamingStrategyInterface = {
    /**
     * Table name
     *
     * @param targetName
     * @param userSpecifiedName
     */
    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName ?? convertToLowercase(targetName);
    },

    /**
     * Column name
     *
     * @param propertyName
     * @param customName
     * @param embeddedPrefixes
     */
    columnName(
        propertyName: string,
        customName: string | undefined,
        embeddedPrefixes: string[]
    ): string {
        return customName ?? convertToLowercase(propertyName);
    },

    /**
     * Table primary key
     *
     * @param tableOrName
     * @param columnNames
     */
    primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
        return (tableOrName instanceof Table ? tableOrName.name : tableOrName) + '_pkey';
    },

    /**
     * Index name
     *
     * @param tableOrName
     * @param columns
     * @param where
     */
    indexName(tableOrName: Table | View | string, columns: string[], where?: string): string {
        return (
            (tableOrName instanceof Table || tableOrName instanceof View
                ? tableOrName.name
                : tableOrName) +
            '_' +
            columns.join('_') +
            '_idx'
        );
    },

    /**
     * Join column name
     *
     * @param relationName
     * @param referencedColumnName
     */
    joinColumnName(relationName: string, referencedColumnName: string): string {
        return convertToLowercase(referencedColumnName);
    },

    /**
     * Foreign key name
     *
     * @param tableOrName
     * @param columnNames
     * @param referencedTablePath
     * @param referencedColumnNames
     */
    foreignKeyName(
        tableOrName: Table | string,
        columnNames: string[],
        referencedTablePath?: string,
        referencedColumnNames?: string[]
    ): string {
        return (
            (tableOrName instanceof Table ? tableOrName.name : tableOrName) +
            '_' +
            columnNames.join('_') +
            '_fkey'
        );
    },

    /**
     * Join table name
     *
     * @param firstTableName
     * @param secondTableName
     * @param firstPropertyName
     * @param secondPropertyName
     */
    joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        secondPropertyName: string
    ): string {
        return firstTableName + '_' + secondTableName;
    },

    /**
     * Join table column name
     *
     * @param tableName
     * @param propertyName
     * @param columnName
     */
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return convertToLowercase(propertyName);
    },

    /**
     * Join table inverse column name
     *
     * @param tableName
     * @param propertyName
     * @param columnName
     */
    joinTableInverseColumnName(
        tableName: string,
        propertyName: string,
        columnName?: string
    ): string {
        return convertToLowercase(propertyName);
    },

    materializedPathColumnName: '',
    nestedSetColumnNames: { left: '', right: '' },

    checkConstraintName(tableOrName: Table | string, expression: string, isEnum?: boolean): string {
        console.log(
            'checkConstraintName:',
            tableOrName instanceof Table ? tableOrName.name : tableOrName,
            expression,
            isEnum
        );
        return tableOrName instanceof Table ? tableOrName.name : tableOrName;
    },

    closureJunctionTableName(originalClosureTableName: string): string {
        console.log('closureJunctionTableName:', originalClosureTableName);
        return originalClosureTableName;
    },

    defaultConstraintName(tableOrName: Table | string, columnName: string): string {
        console.log(
            'defaultConstraintName:',
            tableOrName instanceof Table ? tableOrName.name : tableOrName,
            columnName
        );
        return tableOrName instanceof Table ? tableOrName.name : tableOrName;
    },

    exclusionConstraintName(tableOrName: Table | string, expression: string): string {
        console.log(
            'exclusionConstraintName:',
            tableOrName instanceof Table ? tableOrName.name : tableOrName,
            expression
        );
        return tableOrName instanceof Table ? tableOrName.name : tableOrName;
    },

    joinTableColumnDuplicationPrefix(columnName: string, index: number): string {
        console.log('joinTableColumnDuplicationPrefix:', columnName, index);
        return columnName;
    },

    prefixTableName(prefix: string, tableName: string): string {
        console.log('prefixTableName:', prefix, tableName);
        return tableName;
    },

    relationConstraintName(
        tableOrName: Table | string,
        columnNames: string[],
        where?: string
    ): string {
        console.log(
            'relationConstraintName:',
            tableOrName instanceof Table ? tableOrName.name : tableOrName,
            columnNames,
            where
        );
        return tableOrName instanceof Table ? tableOrName.name : tableOrName;
    },

    relationName(propertyName: string): string {
        console.log('relationName:', propertyName);
        return propertyName;
    },

    uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
        console.log(
            'uniqueConstraintName:',
            tableOrName instanceof Table ? tableOrName.name : tableOrName,
            columnNames
        );
        return tableOrName instanceof Table ? tableOrName.name : tableOrName;
    },
};

/**
 * Convert the passed string to all lowercase with '_' between words
 *
 * @param value
 */
function convertToLowercase(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
