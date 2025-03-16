import Knex from "knex";
import knexfile from "../../knexfile";

const environment = process.env.NODE_ENV
console.log("NODE_ENV for knexfile: ", environment)
if (!environment) {
   throw new Error("NODE_ENV not set")
}
const config: Knex.Knex.Config = knexfile[environment]

export function getNewKnexInstance() {
   return Knex(config)
}
