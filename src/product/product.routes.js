import { Router } from 'express'
import { add, catalogue, deleted, exhausted, search, test, update } from './product.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate.js'

const api = Router()

api.get('/test', test)
api.post('/add', [validateJwt, isAdmin], add)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleted)
api.get('/search/:search', search)
api.get('/catalogue', catalogue)
api.get('/exhausted', [validateJwt, isAdmin], exhausted)

export default api