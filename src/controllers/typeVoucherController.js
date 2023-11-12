import typeVoucherService from '../services/typeVoucherService';
import { Message } from "../config/message";
let createNewTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.createNewTypeVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailTypeVoucherById = async (req, res) => {
    try {
        let data = await typeVoucherService.getDetailTypeVoucherById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.getAllTypeVoucher();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.updateTypeVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.deleteTypeVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getSelectTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.getSelectTypeVoucher();
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
    createNewTypeVoucher: createNewTypeVoucher,
    getDetailTypeVoucherById: getDetailTypeVoucherById,
    getAllTypeVoucher: getAllTypeVoucher,
    updateTypeVoucher: updateTypeVoucher,
    deleteTypeVoucher: deleteTypeVoucher,
    getSelectTypeVoucher: getSelectTypeVoucher,
}