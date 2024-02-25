import { Router } from "express";
import { test, add } from "./shopping.controller.js";

const api = Router()

api.get('/test', test)
api.post('/add', add)

export default api