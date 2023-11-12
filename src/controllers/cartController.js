import cartService from '../services/cartService';
import { Message } from "../config/message";
let addItemCart = async (req, res) => {
    try {
        let data = await cartService.addItemCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllCartByUserId = async (req, res) => {
    try {
        let data = await cartService.getAllCartByUserId(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteItemCart = async (req, res) => {
    try {
        let data = await cartService.deleteItemCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteItemCartByUserId = async (req, res) => {
    try {
        let data = await cartService.deleteItemCartByUserId(req.body);
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
    addItemCart: addItemCart,
    getAllCartByUserId: getAllCartByUserId,
    deleteItemCart: deleteItemCart,
    deleteItemCartByUserId: deleteItemCartByUserId
}