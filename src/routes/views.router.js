import { Router } from 'express'
import ProductManager from '../dao/mongo/productManager.js'

const viewsRouter = Router()
const productManager = new ProductManager()

viewsRouter.get('/', async(req, res) => {
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: await productManager.getProducts()
    })
})

viewsRouter.get('/realTimeProducts', async(req, res) => {
    res.render('realTimeProducts', {
        title: "Handlebars | Websocket",
        products: await productManager.getProducts()
    })
})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat', {})
})

export default viewsRouter