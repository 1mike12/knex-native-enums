import {expect} from "chai";
import {getCurrentEnumValues} from "./getCurrentEnumValues";
import {getNewKnexInstance} from "../helpers/getNewKnexInstance";

describe("addOrUpdateEnum", () => {

   let knex
   before(async () => {
      knex = getNewKnexInstance()
   })

   after(async () => {
      await knex.destroy()
   })

   it("should get the current enum values", async () => {
      const name = "getCurrentEnumValuesTest"
      await knex.raw(`DROP TYPE IF EXISTS "${name}";`);
      await knex.raw(`CREATE TYPE "${name}" AS ENUM ('value1', 'value2', 'value3');`);
      const values = await getCurrentEnumValues(knex, name)
      expect(values).to.have.members(['value1', 'value2', 'value3'])
   })

   it("should get the current enum values when the enum has no values", async () => {
      const name = "getCurrentEnumValuesTest2"
      await knex.raw(`DROP TYPE IF EXISTS "${name}";`);
      await knex.raw(`CREATE TYPE "${name}" AS ENUM ();`);
      const values = await getCurrentEnumValues(knex, name)
      expect(values).to.have.members([])
   })

   it('should return empty array if doesnt exist', async () => {
      const name = "getCurrentEnumValuesTest3"
      await knex.raw(`DROP TYPE IF EXISTS "${name}";`);
      const values = await getCurrentEnumValues(knex, name)
      expect(values.length).to.equal(0)
   })
});
