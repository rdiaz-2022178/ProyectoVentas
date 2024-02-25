import {Router} from 'express'
import {deleted, historyPurchase, login, signUp, signUpAdmin, test, update} from './user.controller.js'

const api = Router()

api.get('/test', test)
api.post('/signup', signUp)
api.post('/signupAdmin', signUpAdmin)
api.post('/login', login)
api.put('/update/:id', update)
api.delete('/delete/:id', deleted)
api.get('/history', historyPurchase)
export default api