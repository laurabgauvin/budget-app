import { Logger } from '@nestjs/common';
import {
    EntityManager,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    SoftRemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Transaction } from './transaction.entity';

@EventSubscriber()
export class TransactionSubscriber implements EntitySubscriberInterface<Transaction> {
    private readonly logger = new Logger(TransactionSubscriber.name);

    /**
     * Indicates that this subscriber only listen to `Transaction` events
     */
    listenTo() {
        return Transaction;
    }

    /**
     * Called after entity insertion
     *
     * @param event
     */
    async afterInsert(event: InsertEvent<Transaction>) {
        await this._updateAccountBalance(event.manager, event.entity);
    }

    /**
     * Called before entity update
     *
     * @param event
     */
    async beforeUpdate(event: UpdateEvent<Transaction>) {
        // If the account changed on the transaction, update the balance of the old account
        if (event.updatedRelations.some((c) => c.propertyName === 'account'))
            await this._updateAccountBalance(event.manager, event.databaseEntity, 'before');
    }

    /**
     * Called after entity update
     *
     * @param event
     */
    async afterUpdate(event: UpdateEvent<Transaction>) {
        // If the transaction amount or account changed, update the balance on the current account
        if (
            event.entity instanceof Transaction &&
            (event.updatedColumns.some((c) => c.propertyName === 'totalAmount') ||
                event.updatedRelations.some((c) => c.propertyName === 'account'))
        )
            await this._updateAccountBalance(event.manager, event.entity, 'after');
    }

    /**
     * Called after entity removal
     *
     * @param event
     */
    async afterRemove(event: RemoveEvent<Transaction>) {
        await this._updateAccountBalance(event.manager, event.databaseEntity);
    }

    /**
     * Called after entity soft removal
     *
     * @param event
     */
    async afterSoftRemove(event: SoftRemoveEvent<Transaction>) {
        await this._updateAccountBalance(event.manager, event.databaseEntity);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the account balance
     *
     * @param manager
     * @param transaction
     * @param beforeAfter Before or after the database update
     */
    private async _updateAccountBalance(
        manager: EntityManager,
        transaction: Transaction,
        beforeAfter: 'before' | 'after' = 'after'
    ): Promise<void> {
        try {
            // Get new balance
            let newBalance =
                (await manager.sum(
                    {
                        type: transaction,
                        name: 'transaction',
                    },
                    // @ts-expect-error columnName is valid
                    'totalAmount',
                    {
                        account: {
                            accountId: transaction.account.accountId,
                        },
                    }
                )) ?? 0;
            if (beforeAfter === 'before') newBalance -= Number(transaction.totalAmount ?? 0);

            await manager.update(Account, transaction.account.accountId, { balance: newBalance });
        } catch (e) {
            this.logger.error('Exception when auto-updating account balance:', e);
        }
    }
}
