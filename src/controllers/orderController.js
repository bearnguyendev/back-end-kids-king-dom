import orderService from '../services/orderService';

let createNewOrder = async (req, res) => {
    try {
        let data = await orderService.createNewOrder(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
module.exports = {
    createNewOrder: createNewOrder,
    getAllOrders: getAllOrders,
    getDetailOrderById: getDetailOrderById,
    updateStatusOrder: updateStatusOrder,
    getAllOrdersByUserId: getAllOrdersByUserId,
}