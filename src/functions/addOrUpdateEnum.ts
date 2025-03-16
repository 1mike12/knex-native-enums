import {Knex} from "knex";
import {addEnum} from "./addEnum";
import {getCurrentEnumValues} from "./getCurrentEnumValues";

/**
 * Creates or updates a PostgreSQL enum type based on the provided TypeScript enum.
 * This function runs inside a transaction so that adding multiple values is atomic.
 *
 * If the type exists:
 *   - It throws an error if any value in the database is missing from the TS enum.
 *   - It adds any new values from the TS enum to the database.
 * If the type doesn't exist, it creates it.
 *
 * @param knex - The Knex instance.
 * @param enumName - The name of the enum type.
 * @param tsEnum - The TypeScript enum object.
 */
export async function addOrUpdateEnum(
   knex: Knex,
   enumName: string,
   tsEnum: object
): Promise<void> {
   await knex.transaction(async (trx) => {

      const dbValues = await getCurrentEnumValues(knex, enumName)
      const tsValues: string[] = Object.values(tsEnum) as string[];

      if (dbValues.length === 0) {
         // Enum doesn't exist; create it.
         await addEnum(trx, enumName, tsEnum);
         return;
      }

      // If the database has values not present in the TS enum, throw an error.
      const missingInTs = dbValues.filter((val) => !tsValues.includes(val));
      if (missingInTs.length > 0) {
         throw new Error(
            `The TypeScript enum for "${enumName}" is missing values present in the database: ${missingInTs.join(
               ', '
            )}`
         );
      }

      // Add new values that exist in TS enum but not in the database.
      const newValues = tsValues.filter((val) => !dbValues.includes(val));
      for (const value of newValues) {
         // PostgreSQL doesn't allow adding multiple enum values in one command.
         await trx.raw(`ALTER TYPE "${enumName}" ADD VALUE '${value}';`);
      }
   });
}
