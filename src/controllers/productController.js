import productService from '../services/productService';
import { Message } from "../config/message";
let createNewProduct = async (req, res) => {
    try {
        let data = await productService.createNewProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateProduct = async (req, res) => {
    try {
        let data = await productService.updateProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllProduct = async (req, res) => {
    try {
        let data = await productService.getAllProduct(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getTopProductHomePage = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) limit = 10;
        let data = await productService.getTopProductHomePage(+limit, req.query.typeSort);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteProduct = async (req, res) => {
    try {
        let data = await productService.deleteProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailProductById = async (req, res) => {
    try {
        let data = await productService.getDetailProductById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let changeStatusProduct = async (req, res) => {
    try {
        let data = await productService.changeStatusProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}

let createNewProductImage = async (req, res) => {
    try {
        let data = await productService.createNewProductImage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateProductImage = async (req, res) => {
    try {
        let data = await productService.updateProductImage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllProductImageFromProduct = async (req, res) => {
    try {
        let data = await productService.getAllProductImageFromProduct(req.query.productId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteProductImage = async (req, res) => {
    try {
        let data = await productService.deleteProductImage(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let searchProduct = async (req, res) => {
    try {
        let data = await productService.searchProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getTopProductSold = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) limit = 10;
        let data = await productService.getTopProductSold(+limit);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
module.exports = {
    createNewProduct: createNewProduct,
    updateProduct: updateProduct,
    getAllProduct: getAllProduct,
    getTopProductHomePage: getTopProductHomePage,
    deleteProduct: deleteProduct,
    changeStatusProduct: changeStatusProduct,
    getDetailProductById: getDetailProductById,
    createNewProductImage: createNewProductImage,
    updateProductImage: updateProductImage,
    getAllProductImageFromProduct: getAllProductImageFromProduct,
    deleteProductImage: deleteProductImage,
    searchProduct: searchProduct,
    getTopProductSold: getTopProductSold
}