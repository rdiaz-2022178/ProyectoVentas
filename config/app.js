import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import categoryRoutes from '../src/category/category.routes.js'
import userRoutes from '../src/user/user.routes.js'
import productRoutes from '../src/product/product.routes.js'
import shoppingRoutes from '../src/shopping/shopping.routes.js'


const app = express()
config();
const port = process.env.PORT || 3156

//Configuración del servidor
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) //Aceptar o denegar solicitudes de diferentes orígenes (local, remoto) / políticas de acceso
app.use(helmet()) //Aplica capa de seguridad básica al servidor
app.use(morgan('dev')) //Logs de solicitudes al servidor HTTP

app.use('/category', categoryRoutes)
app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/shopping', shoppingRoutes )

export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}