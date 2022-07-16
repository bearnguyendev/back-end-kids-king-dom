import allCodeService from "../services/allCodeService";
let getAllCode = async (req, res) => {
    try {
        let data = await allCodeService.getAllCode(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteAllCode = async (req, res) => {
    try {
        let data = await allCodeService.deleteAllCode(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
module.exports = {
    getAllCode: getAllCode,
    createNewAllCode: createNewAllCode,
    updateAllCode: updateAllCode,
    deleteAllCode: deleteAllCode,
    getListAllCode: getListAllCode,
    getDetailAllCodeById: getDetailAllCodeById
}