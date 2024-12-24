export type SortDirection = 'asc' | 'desc';

/**
 * Sort by date
 *
 * @param dateA
 * @param dateB
 * @param direction
 */
export function sortByDate(
    dateA: Date | undefined,
    dateB: Date | undefined,
    direction: SortDirection
): number {
    const a = dateA ?? new Date();
    const b = dateB ?? new Date();

    if (direction === 'asc') {
        return a.getTime() - b.getTime();
    } else {
        return b.getTime() - a.getTime();
    }
}
