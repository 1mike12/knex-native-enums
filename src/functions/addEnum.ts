import {Knex} from 'knex';

/**
 * Creates a PostgreSQL enum type based on the provided TypeScript enum.
 * Throws an error if the type already exists (use addOrUpdateEnum for updating).
 *
 * @param knex - The Knex instance.
 * @param enumName - The name for the PostgreSQL enum type.
 * @param tsEnum - The TypeScript enum object.
 *
 */
export async function addEnum(
   knex: Knex,
   enumName: string,
   tsEnum: object
): Promise<void> {
   const values = Object.values(tsEnum)
   .map((val) => `'${val}'`)
   .join(', ');
   await knex.raw(`CREATE TYPE "${enumName}" AS ENUM (${values});`);
}
