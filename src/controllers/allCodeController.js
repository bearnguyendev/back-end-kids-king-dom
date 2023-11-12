import allCodeService from "../services/allCodeService";
import { Message } from "../config/message";
let getAllCode = async (req, res) => {
    try {
        let data = await allCodeService.getAllCode(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let createNewAllCode = async (req, res) => {
    try {
        let data = await allCodeService.createNewAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateAllCode = async (req, res) => {
    try {
        let data = await allCodeService.updateAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteAllCode = async (req, res) => {
    try {
        let data = await allCodeService.deleteAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getListAllCode = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await allCodeService.getListAllCode(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailAllCodeById = async (req, res) => {
    try {
        let data = await allCodeService.getDetailAllCodeById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let changeStatusAllcode = async (req, res) => {
    try {
        let data = await allCodeService.changeStatusAllcode(req.body);
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
    getAllCode: getAllCode,
    createNewAllCode: createNewAllCode,
    updateAllCode: updateAllCode,
    deleteAllCode: deleteAllCode,
    getListAllCode: getListAllCode,
    getDetailAllCodeById: getDetailAllCodeById,
    changeStatusAllcode: changeStatusAllcode
}