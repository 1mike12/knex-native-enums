import {expect} from "chai";
import {getPgEnumValues} from "./getPgEnumValues";
import {getNewKnexInstance} from "../helpers/getNewKnexInstance";

describe("getPgEnum", () => {
   let knex
   before(async () => {
      knex = getNewKnexInstance();
   })

   after(async () => {
      if (knex) await knex.destroy();
   })

   it("should get enums from postgres", async () => {
      const enumName = "getPgEnumTest"
      await knex.raw(`DROP TYPE IF EXISTS "${enumName}";`);
      await knex.raw(`CREATE TYPE "${enumName}" AS ENUM ('a', 'b', 'c');`);
      const values = await getPgEnumValues(knex, enumName)
      expect(values).to.deep.equal(['a', 'b', 'c'])
   });

   it("should return empty array if enum does not exist", async () => {
      const enumName = "sdfasdfasdsdf"
      const values = await getPgEnumValues(knex, enumName)
      expect(values).to.deep.equal([])
   });
});
