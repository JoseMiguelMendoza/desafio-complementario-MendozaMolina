import productModel from "../models/product.model.js"
import cartModel from '../models/cart.model.js'

export default class CartManager{
    constructor(){
    }

    getCarts = async() => {
        return await cartModel.find().lean().exec()
    }

    addCarts = async(cart) => {
        return await cartModel.create(cart)
    }


    getCartsById = async(id) => {
        return await cartModel.findById(id)
    }

    addProductInCart = async(cartId, productId) => {
        let cartByIdInDB = await cartModel.findById(cartId)
        if(!cartByIdInDB) return 'Cart Not Found'
        let productByIdInDB = await productModel.findById(productId)
        if(!productByIdInDB) return 'Product Not Found'

        const productIndex = cartByIdInDB.products.findIndex(
            (item) => item.product.toString() === productId
        );
        if (productIndex !== -1) {
            // El producto ya está en el carrito, incrementar la cantidad
            cartByIdInDB.products[productIndex].quantity += 1;
        } else {
            // El producto no está en el carrito, agregarlo
            cartByIdInDB.products.push({
            product: productId,
            quantity: 1,
            });
        }
        await cartByIdInDB.save()
        return cartByIdInDB
    }
}