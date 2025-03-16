import {Knex} from 'knex';

/**
 * Drops the PostgreSQL enum type if it exists.
 *
 * @param knex - The Knex instance.
 * @param typeName - The name of the enum type to drop.
 */
export async function removeEnumIfExists(
   knex: Knex,
   typeName: string
): Promise<void> {
   await knex.raw(`DROP TYPE IF EXISTS "${typeName}";`);
}
