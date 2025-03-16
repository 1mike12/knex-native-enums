import path from "path";
import dotenv from "dotenv";

dotenv.config({path: path.resolve(__dirname, './.env')})

export default {
   test: {
      client: "pg",
      connection: {
         port: process.env.DB_PORT_TEST,
         host: "localhost",
         database: process.env.DB_NAME_TEST,
         user: process.env.DB_USER_TEST,
         password: process.env.DB_PASSWORD_TEST,
         multipleStatements: true,
      },
      migrations: {
         directory: "./migrations",
         tableName: "knex_migrations",
         extension: "ts",
      },
      seeds: {
         directory: "./seeds",
      },
      debug: true,
   }
}
