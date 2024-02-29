import { Router } from "express";
import { test, add } from "./shopping.controller.js";
import { isAdmin, validateJwt } from '../middleware/validate.js'

const api = Router()

api.get('/test', test)
api.post('/add', [validateJwt], add)

export default api