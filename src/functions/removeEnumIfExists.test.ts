import {expect} from "chai";
import {removeEnumIfExists} from "./removeEnumIfExists";
import {getNewKnexInstance} from "../helpers/getNewKnexInstance";

describe("addOrUpdateEnum", () => {

   let knex
   before(async () => {
      knex = getNewKnexInstance()
   })

   after(async () => {
      await knex.destroy()
   })

   it("should remove an enum", async () => {
      const name = 'removeEnumIfExistsTest';
      const typeExists = await knex.raw(
         `SELECT 1 FROM pg_type WHERE typname = ?;`,
         [name]
      );

      if (typeExists.rows.length === 0) {
         await knex.raw(`CREATE TYPE "${name}" AS ENUM ('value1', 'value2', 'value3');`);
      }

      await removeEnumIfExists(knex, name);

      const typeExistsAfter = await knex.raw(
         `SELECT 1 FROM pg_type WHERE typname = ?;`,
         [name]
      );

      expect(typeExistsAfter.rows.length).to.equal(0);
   })
});
