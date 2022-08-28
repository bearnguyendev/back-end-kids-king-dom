import cartService from '../services/cartService';

let addItemCart = async (req, res) => {
    try {
        let data = await cartService.addItemCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getAllCartByUserId = async (req, res) => {
    try {
        let data = await cartService.getAllCartByUserId(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteItemCart = async (req, res) => {
    try {
        let data = await cartService.deleteItemCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteItemCartByUserId = async (req, res) => {
    try {
        let data = await cartService.deleteItemCartByUserId(req.body);
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
    addItemCart: addItemCart,
    getAllCartByUserId: getAllCartByUserId,
    deleteItemCart: deleteItemCart,
    deleteItemCartByUserId: deleteItemCartByUserId
}