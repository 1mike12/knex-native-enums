import {expect} from "chai";
import {addEnum} from "./addEnum";
import {getNewKnexInstance} from "../helpers/getNewKnexInstance";

describe("addEnum", () => {

   let knex
   before(async () => {
      knex = getNewKnexInstance()
   })

   after(async () => {
      await knex.destroy()
   })

   it("should add an enum", async () => {
      const ENUM_NAME = "add_enum_test"
      await knex.raw(`DROP TYPE IF EXISTS "${ENUM_NAME}";`);
      enum TestEnum {
         A = "a",
         B = "b",
         C = "c"
      }

      await addEnum(knex, "add_enum_test", TestEnum)
      // get the enum values straight from the database

      // Query the database for the enum values
      const result = await knex.raw(
         `SELECT e.enumlabel as value
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = ?
          ORDER BY e.enumsortorder;`,
         [ENUM_NAME]
      );

      // Extract the values from the query result
      const dbValues = result.rows ? result.rows.map((row: any) => row.value) : result.map((row: any) => row.value);

      // Compare the extracted values with the expected values from TestEnum
      const expectedValues = Object.values(TestEnum);
      expect(dbValues).to.have.members(expectedValues);
   });
});
