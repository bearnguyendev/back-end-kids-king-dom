import importProductService from "../services/importProductService"

let addImport = async (req, res) => {
    try {
        let data = await importProductService.addImport(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
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
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
module.exports = {
    addImport: addImport,
    updateImport: updateImport,
    getAllImport: getAllImport,
    deleteImport: deleteImport
}