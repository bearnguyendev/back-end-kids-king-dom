import voucherService from '../services/voucherService';
import { Message } from "../config/message";
let createNewVoucher = async (req, res) => {
    try {
        let data = await voucherService.createNewVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllVoucher = async (req, res) => {
    try {
        let data = await voucherService.getAllVoucher(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}

let updateVoucher = async (req, res) => {
    try {
        let data = await voucherService.updateVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteVoucher = async (req, res) => {
    try {
        let data = await voucherService.deleteVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let saveUserVoucher = async (req, res) => {
    try {
        let data = await voucherService.saveUserVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailVoucherById = async (req, res) => {
    try {
        let data = await voucherService.getDetailVoucherById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllVoucherByUserId = async (req, res) => {
    try {
        let data = await voucherService.getAllVoucherByUserId(req.query.userId);
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
    createNewVoucher: createNewVoucher,
    getDetailVoucherById: getDetailVoucherById,
    getAllVoucher: getAllVoucher,
    updateVoucher: updateVoucher,
    deleteVoucher: deleteVoucher,
    saveUserVoucher: saveUserVoucher,
    getAllVoucherByUserId: getAllVoucherByUserId
}