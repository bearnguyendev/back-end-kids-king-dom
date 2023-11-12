import blogService from '../services/blogService';
import { Message } from "../config/message";
let createNewBlog = async (req, res) => {
    try {
        let data = await blogService.createNewBlog(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailBlogById = async (req, res) => {
    try {
        let data = await blogService.getDetailBlogById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllBlog = async (req, res) => {
    try {
        let data = await blogService.getAllBlog(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getListBlog = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await blogService.getListBlog(+limit);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let updateBlog = async (req, res) => {
    try {
        let data = await blogService.updateBlog(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteBlog = async (req, res) => {
    try {
        let data = await blogService.deleteBlog(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let changeStatusBlog = async (req, res) => {
    try {
        let data = await blogService.changeStatusBlog(req.body);
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
    createNewBlog: createNewBlog,
    getDetailBlogById: getDetailBlogById,
    getAllBlog: getAllBlog,
    getListBlog: getListBlog,
    updateBlog: updateBlog,
    deleteBlog: deleteBlog,
    changeStatusBlog: changeStatusBlog
}