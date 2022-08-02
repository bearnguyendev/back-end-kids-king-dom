import receiverService from '../services/receiverService';

let createNewReceiver = async (req, res) => {
    try {
        let data = await receiverService.createNewReceiver(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getAllReceiverByUserId = async (req, res) => {
    try {
        let data = await receiverService.getAllReceiverByUserId(req.query.userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteReceiver = async (req, res) => {
    try {
        let data = await receiverService.deleteReceiver(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let editReceiver = async (req, res) => {
    try {
        let data = await receiverService.editReceiver(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getDetailReceiverById = async (req, res) => {
    try {
        let data = await receiverService.getDetailReceiverById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let handleChangeStatusReceiver = async (req, res) => {
    try {
        let data = await receiverService.handleChangeStatusReceiver(req.body);
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
    createNewReceiver: createNewReceiver,
    getAllReceiverByUserId: getAllReceiverByUserId,
    deleteReceiver: deleteReceiver,
    editReceiver: editReceiver,
    getDetailReceiverById: getDetailReceiverById,
    handleChangeStatusReceiver: handleChangeStatusReceiver
}