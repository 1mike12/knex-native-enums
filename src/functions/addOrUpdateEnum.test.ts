import {expect} from "chai";
import {addOrUpdateEnum} from "./addOrUpdateEnum";
import {getNewKnexInstance} from "../helpers/getNewKnexInstance";

describe("addOrUpdateEnum", () => {

   let knex
   before(async () => {

      knex = getNewKnexInstance()
   })

   after(async () => {
      await knex.destroy()
   })
   it("should add an enum", async () => {

      const ENUM_NAME = "addOrUpdateEnumTest"
      //make sure enum doesnt exist
      await knex.raw(`DROP TYPE IF EXISTS "${ENUM_NAME}";`);

      enum TestEnum {
         A = "a",
         B = "b",
         C = "c"
      }

      await addOrUpdateEnum(knex, ENUM_NAME, TestEnum)
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

   it("should update an existing enum", async () => {
      const ENUM_NAME = "addOrUpdateEnumTest2"

      enum TestEnum {
         A = "a",
         B = "b",
      }

      await knex.raw(`DROP TYPE IF EXISTS "${ENUM_NAME}";`);

      await addOrUpdateEnum(knex, ENUM_NAME, TestEnum)
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

      enum TestEnum2 {
         A = "a",
         B = "b",
         C = "c"
      }

      await addOrUpdateEnum(knex, ENUM_NAME, TestEnum2)

      const result2 = await knex.raw(
         `SELECT e.enumlabel as value
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = ?
          ORDER BY e.enumsortorder;`,
         [ENUM_NAME]
      );

      const dbValues2 = result2.rows ? result2.rows.map((row: any) => row.value) : result2.map((row: any) => row.value);
      const expectedValues2 = Object.values(TestEnum2);
      expect(dbValues2).to.have.members(expectedValues2);
   })

   it("should throw an error if the TS enum is missing values present in the database", async () => {
      const ENUM_NAME = "addOrUpdateEnumTest3"
      await knex.raw(`DROP TYPE IF EXISTS "${ENUM_NAME}";`);

      enum TestEnum {
         A = "a",
         B = "b",
      }

      await addOrUpdateEnum(knex, ENUM_NAME, TestEnum)
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

      enum TestEnum2 {
         A = "a",
      }

      try {
         await addOrUpdateEnum(knex, ENUM_NAME, TestEnum2)
      } catch (e) {
         expect(e.message).to.equal(`The TypeScript enum for "${ENUM_NAME}" is missing values present in the database: b`)
      }
   })
});
