import bannerService from '../services/bannerService';

let createNewBanner = async (req, res) => {
    try {
        let data = await bannerService.createNewBanner(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getDetailBannerById = async (req, res) => {
    try {
        let data = await bannerService.getDetailBannerById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getAllBanner = async (req, res) => {
    try {
        let data = await bannerService.getAllBanner();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getListBanner = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await bannerService.getListBanner(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let updateBanner = async (req, res) => {
    try {
        let data = await bannerService.updateBanner(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteBanner = async (req, res) => {
    try {
        let data = await bannerService.deleteBanner(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let changeStatusBanner = async (req, res) => {
    try {
        let data = await bannerService.changeStatusBanner(req.body);
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
    createNewBanner: createNewBanner,
    getDetailBannerById: getDetailBannerById,
    getAllBanner: getAllBanner,
    getListBanner: getListBanner,
    updateBanner: updateBanner,
    deleteBanner: deleteBanner,
    changeStatusBanner: changeStatusBanner
}