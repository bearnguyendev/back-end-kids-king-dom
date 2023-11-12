import importProductService from "../services/importProductService"
import { Message } from "../config/message";
let addImport = async (req, res) => {
    try {
        let data = await importProductService.addImport(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateImport = async (req, res) => {
    try {
        let data = await importProductService.updateImport(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllImport = async (req, res) => {
    try {
        let data = await importProductService.getAllImport(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteImport = async (req, res) => {
    try {
        let data = await importProductService.deleteImport(req.body);
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
    addImport: addImport,
    updateImport: updateImport,
    getAllImport: getAllImport,
    deleteImport: deleteImport
}