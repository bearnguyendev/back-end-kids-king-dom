import orderService from '../services/orderService';
import { Message } from "../config/message";
let createNewOrder = async (req, res) => {
    try {
        let data = await orderService.createNewOrder(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllOrders = async (req, res) => {
    try {
        let data = await orderService.getAllOrders(req.query.statusId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailOrderById = async (req, res) => {
    try {
        let data = await orderService.getDetailOrderById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateStatusOrder = async (req, res) => {
    try {
        let data = await orderService.updateStatusOrder(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllOrdersByUserId = async (req, res) => {
    try {
        let data = await orderService.getAllOrdersByUserId(req.query.userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let paymentMomoOrder = async (req, res) => {
    try {
        let data = await orderService.paymentMomoOrder(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let paymentPayPalOrder = async (req, res) => {
    try {
        let data = await orderService.paymentPayPalOrder(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let paymentPayPalSuccess = async (req, res) => {
    try {
        let data = await orderService.paymentPayPalSuccess(req.body);
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
    createNewOrder: createNewOrder,
    getAllOrders: getAllOrders,
    getDetailOrderById: getDetailOrderById,
    updateStatusOrder: updateStatusOrder,
    getAllOrdersByUserId: getAllOrdersByUserId,
    paymentMomoOrder: paymentMomoOrder,
    paymentPayPalOrder: paymentPayPalOrder,
    paymentPayPalSuccess: paymentPayPalSuccess
}