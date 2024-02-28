import { Router } from 'express'
import { add, bestSellingProducts, catalogue, deleted, exhausted, search, test, update, filterByCategory } from './product.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate.js'

const api = Router()

api.get('/test', test)
api.post('/add', [validateJwt, isAdmin], add)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleted)
api.get('/search/:search', search)
api.get('/catalogue', catalogue)
api.get('/exhausted', [validateJwt, isAdmin], exhausted)
api.get('/bestSeller', bestSellingProducts)
api.get('/filterCategory/:id', filterByCategory)

export default api