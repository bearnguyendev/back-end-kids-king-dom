import commentService from '../services/commentService'

let createNewComment = async (req, res) => {
    try {
        let data = await commentService.createNewComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let getAllCommentByProductId = async (req, res) => {
    try {

        let data = await commentService.getAllCommentByProductId(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let ReplyComment = async (req, res) => {
    try {

        let data = await commentService.ReplyComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
let deleteComment = async (req, res) => {
    try {

        let data = await commentService.deleteComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ!'
        })
    }
}
module.exports = {
    createNewComment: createNewComment,
    getAllCommentByProductId: getAllCommentByProductId,
    ReplyComment: ReplyComment,
    deleteComment: deleteComment
}