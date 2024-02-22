import {Router} from 'express'
import {add, deleted, find, test, update} from './category.controller.js'
import {validateJwt, isAdmin} from '../middleware/validate.js'

const api = Router()

api.get('/test', test)
api.post('/add', [validateJwt, isAdmin], add)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleted)
api.get('/find', find)
export default api