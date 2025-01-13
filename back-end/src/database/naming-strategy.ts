import { NamingStrategyInterface, Table, View } from 'typeorm';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const NAMING_STRATEGY: NamingStrategyInterface = {
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
        return `${getTableName(tableOrName)}_pkey`;
    },

    /**
     * Index name
     *
     * @param tableOrName
     * @param columns
     * @param where
     */
    indexName(tableOrName: Table | View | string, columns: string[], where?: string): string {
        return mergeTableAndColumnNames(tableOrName, columns, 'idx');
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
        return mergeTableAndColumnNames(tableOrName, columnNames, 'fkey');
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
        return `${firstTableName}_${secondTableName}`;
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

    /**
     * Check constraint name
     *
     * @param tableOrName
     * @param expression
     * @param isEnum
     */
    checkConstraintName(tableOrName: Table | string, expression: string, isEnum?: boolean): string {
        return `${getTableName(tableOrName)}_check`;
    },

    /**
     * Closure junction table name
     *
     * @param originalClosureTableName
     */
    closureJunctionTableName(originalClosureTableName: string): string {
        return `${originalClosureTableName}_junc`;
    },

    /**
     * Default constraint name
     *
     * @param tableOrName
     * @param columnName
     */
    defaultConstraintName(tableOrName: Table | string, columnName: string): string {
        return mergeTableAndColumnNames(tableOrName, [columnName], 'df');
    },

    /**
     * Exclusion constraint name
     *
     * @param tableOrName
     * @param expression
     */
    exclusionConstraintName(tableOrName: Table | string, expression: string): string {
        return `${getTableName(tableOrName)}_excl`;
    },

    /**
     * Join table column duplication prefix
     *
     * @param columnName
     * @param index
     */
    joinTableColumnDuplicationPrefix(columnName: string, index: number): string {
        return `${columnName}_${index}`;
    },

    /**
     * Prefix table name
     *
     * @param prefix
     * @param tableName
     */
    prefixTableName(prefix: string, tableName: string): string {
        return `${prefix}_${tableName}`;
    },

    /**
     * Relation constraint name
     *
     * @param tableOrName
     * @param columnNames
     * @param where
     */
    relationConstraintName(
        tableOrName: Table | string,
        columnNames: string[],
        where?: string
    ): string {
        return mergeTableAndColumnNames(tableOrName, columnNames, 'rel');
    },

    /**
     * Relation name
     *
     * @param propertyName
     */
    relationName(propertyName: string): string {
        return convertToLowercase(propertyName);
    },

    /**
     * Unique constraint name
     *
     * @param tableOrName
     * @param columnNames
     */
    uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
        return mergeTableAndColumnNames(tableOrName, columnNames, 'unq');
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

/**
 * Convert the table and column names to a single string with '_' between them
 *
 * @param tableOrName
 * @param columns
 * @param suffix Optional suffix
 */
function mergeTableAndColumnNames(
    tableOrName: Table | View | string,
    columns: string[],
    suffix = ''
): string {
    return `${getTableName(tableOrName)}_${columns.join('_')}${suffix ? `_${suffix}` : ''}`;
}

/**
 * Get the table name
 *
 * @param tableOrName
 */
function getTableName(tableOrName: Table | View | string): string {
    return tableOrName instanceof Table || tableOrName instanceof View
        ? tableOrName.name
        : tableOrName;
}
