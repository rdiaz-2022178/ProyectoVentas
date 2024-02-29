import {Router} from 'express'
import {deleted, historyPurchase, login, signUp, signUpAdmin, test, update} from './user.controller.js'
import { isAdmin, validateJwt } from '../middleware/validate.js'

const api = Router()

api.get('/test', test)
api.post('/signup', signUp)
api.post('/signupAdmin', [validateJwt, isAdmin], signUpAdmin)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleted)
api.get('/history', [validateJwt], historyPurchase)
export default api