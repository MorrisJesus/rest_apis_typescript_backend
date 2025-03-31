//Codigo para limpiar la base de datos cada vez que se realizen test

import { exit } from "node:process";
import db from "../config/db";

const clearDB = async () => {
    try {
        await db.sync({ force: true });
        console.log("Datos eliminados correctamente"); 
        exit();
    } catch (error) {
        console.log(error);
        exit( 1 );
    }

}
if(process.argv[2] === "--clear"){
    clearDB();
}