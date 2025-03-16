import {Knex} from "knex";
import {getValuesFromResult} from "./getValuesFromResult";

export async function getCurrentEnumValues(knex: Knex, enumName: string) {

   const result = await knex.raw(
      `SELECT e.enumlabel as value
       FROM pg_type t
       JOIN pg_enum e ON t.oid = e.enumtypid
       WHERE t.typname = ?
       ORDER BY e.enumsortorder;`,
      [enumName]
   );

   return getValuesFromResult(result)
}
