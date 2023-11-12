import commentService from '../services/commentService'
import { Message } from "../config/message";
let createNewComment = async (req, res) => {
    try {
        let data = await commentService.createNewComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: Message.errCode500
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
            errMessage: Message.errCode500
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
            errMessage: Message.errCode500
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
            errMessage: Message.errCode500
        })
    }
}
module.exports = {
    createNewComment: createNewComment,
    getAllCommentByProductId: getAllCommentByProductId,
    ReplyComment: ReplyComment,
    deleteComment: deleteComment
}