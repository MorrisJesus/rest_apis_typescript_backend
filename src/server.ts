import colors from "colors";
import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

//Conectar a la base de datos
export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.blue.bold('Base de datos conectada'))
    } catch (error) {
        console.log(error)
        console.log(colors.red.bold('Error al conectar a la base de datos'))
    }
    
}

connectDB()
//Instacia de express
const server = express();
//Permitir el acceso a la API desde cualquier origen
//Si tambien quierres permitir el acceso desde localhost, puedes agregarlo a la lista de orígenes permitidos
//server.use(cors())
//Permitir el acceso a la API desde el frontend
//Toma en cuenta video 422 de del curso habilitando CORS en el backend
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
    'https://rest-apis-typescript-backendfullstack1.onrender.com/api/products'
];

const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        
        if(!origin || allowedOrigins.includes(origin) ) {
            callback(null, true)
            console.log(origin+ " aceppted" )
        } else {
            callback(new Error('Error de CORS')) 
    
        }
    }
}
server.use(cors(corsOptions))

//Leer datos de formulario
server.use(express.json())

//Middleware para mostrar las peticiones en consola
server.use(morgan('dev'))

server.use('/api/products',router)
//Documentación de la API
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
