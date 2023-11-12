import typeShipService from '../services/typeShipService';
import { Message } from "../config/message";
let createNewTypeShip = async (req, res) => {
    try {
        let data = await typeShipService.createNewTypeShip(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailTypeShipById = async (req, res) => {
    try {
        let data = await typeShipService.getDetailTypeShipById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllTypeShip = async (req, res) => {
    try {
        let data = await typeShipService.getAllTypeShip();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getListTypeShip = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await typeShipService.getListTypeShip(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateTypeShip = async (req, res) => {
    try {
        let data = await typeShipService.updateTypeShip(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteTypeShip = async (req, res) => {
    try {
        let data = await typeShipService.deleteTypeShip(req.body);
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
    createNewTypeShip: createNewTypeShip,
    getDetailTypeShipById: getDetailTypeShipById,
    getAllTypeShip: getAllTypeShip,
    getListTypeShip: getListTypeShip,
    updateTypeShip: updateTypeShip,
    deleteTypeShip: deleteTypeShip,
}