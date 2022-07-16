import typeVoucherService from '../services/typeVoucherService';

let createNewTypeVoucher = async (req, res) => {
    try {
        let data = await typeVoucherService.createNewTypeVoucher(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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