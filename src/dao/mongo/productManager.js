import productModel from "../models/product.model.js"
export default class ProductManager{
    constructor(){
    }

    getProducts = async() => {
        return await productModel.find().lean().exec()
    }

    addProducts = async(product) => {
        return await productModel.create(product)
    }

    getProductById = async(id) => {
        return await productModel.findById(id)
    }

    updateProducts = async(id, product) => {
        return await productModel.findByIdAndUpdate(id, product, { returnDocument: "after"})
    }

    deleteProducts = async(id) => {
        return await productModel.findByIdAndDelete(id)
    }

}
