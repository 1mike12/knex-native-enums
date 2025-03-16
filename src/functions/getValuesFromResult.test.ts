import {expect} from "chai";
import {getValuesFromResult} from "./getValuesFromResult";

describe("getValuesFromResult", () => {

   it("should return values for a preVersion7 result (array input)", () => {
      const input = [{value: "a"}, {value: "b"}];
      const output = getValuesFromResult(input);
      expect(output).to.deep.equal(["a", "b"]);
   });

   it("should return values for a version7 result (object with rows property)", () => {
      const input = {rows: [{value: "x"}, {value: "y"}]};
      const output = getValuesFromResult(input);
      expect(output).to.deep.equal(["x", "y"]);
   });

   it("should return an empty array when given an empty array", () => {
      const input: any[] = [];
      const output = getValuesFromResult(input);
      expect(output).to.deep.equal([]);
   });

   it("should return an empty array when given an object with an empty rows array", () => {
      const input = {rows: []};
      const output = getValuesFromResult(input);
      expect(output).to.deep.equal([]);
   });
});
