import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import chatRouter from './routes/chat.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './dao/mongo/productManager.js'
import messageModel from './dao/models/message.model.js'
import mongoose from 'mongoose'

const app = express()
const PORT = 8080

const productManager = new ProductManager()
const httpServer = app.listen(PORT, () =>  console.log(`Server Express Puerto ${PORT}`))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.static('./src/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    req.io = io
    next()
})


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)
app.use('/chat', chatRouter)

io.on("connection", socket => {
    console.log('A new client has connected to the Server')

    socket.on('productList', async(data) => {
        await productManager.addProducts(data)
            .then(data => {
                io.emit('updatedProducts', data)
            })
            .catch(err => {
                console.error('Error:', err);
            })
    });

    messageModel.find().lean().exec()
        .then(messages => {
            socket.emit('logs', messages);
        })
        .catch(error => {
            console.error('Error al obtener los mensajes:', error);
        });

    socket.on('message', async (data) => {
        await messageModel.create(data)
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
            });

        messageModel.find().lean().exec()
            .then(messages => {
                io.emit('logs', messages);
            })
            .catch(error => {
                console.error('Error al obtener los mensajes:', error);
            });
    });
});

mongoose.set('strictQuery', false)
try{
    await mongoose.connect('mongodb+srv://coder:coder@cluster0.tvsk3y1.mongodb.net/ecommerce')
} catch(err){
    console.log(err.message)
}