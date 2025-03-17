import {Knex} from "knex";
import {addEnum} from "./addEnum";
import {getCurrentEnumValues} from "./getCurrentEnumValues";

export async function addOrUpdateEnum(
  knex: Knex,
  enumName: string,
  tsEnum: object
): Promise<void> {
  const dbValues = await getCurrentEnumValues(knex, enumName);
  const tsValues: string[] = Object.values(tsEnum) as string[];

  if (dbValues.length === 0) {
    // Enum doesn't exist; create it inside a transaction.
    await knex.transaction(async (trx) => {
      await addEnum(trx, enumName, tsEnum);
    });
    return;
  }

  const missingInTs = dbValues.filter((val) => !tsValues.includes(val));
  if (missingInTs.length > 0) {
    throw new Error(
      `The TypeScript enum for "${enumName}" is missing values present in the database: ${missingInTs.join(
        ', '
      )}`
    );
  }

  const newValues = tsValues.filter((val) => !dbValues.includes(val));

  try {
    // Attempt to add new values inside a transaction.
    await knex.transaction(async (trx: Knex.Transaction) => {
      for (const value of newValues) {
        await trx.raw(`ALTER TYPE "${enumName}" ADD VALUE '${value}';`);
      }
    });
  } catch (err: any) {
    // Check for the specific error indicating the command cannot run in a transaction.
    if (err.message.includes("cannot run inside a transaction block")) {
      // Fallback: run ALTER TYPE commands outside of a transaction.
      for (const value of newValues) {
        await knex.raw(`ALTER TYPE "${enumName}" ADD VALUE '${value}';`);
      }
    } else {
      throw err;
    }
  }
}
