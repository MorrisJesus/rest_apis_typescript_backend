import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

// const db = new Sequelize(
// 	process.env.DB_NAME,
// 	process.env.DB_USER,
// 	process.env.DB_PASSWORD,
// 	{
// 		host: "localhost",
// 		dialect: "postgres",
// 		port: 5433,
// 		models: [ __dirname + "/../models/**/*"],
// 		logging: false
// 	},
	
// );

const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../models/**/*'],
    logging: false
})

export default db;
