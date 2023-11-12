import userService from "../services/userService";
import { Message } from "../config/message";
let createANewUser = async (req, res) => {
    try {
        let data = await userService.createANewUser(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getAllUsers = async (req, res) => {
    try {
        let data = await userService.getAllUsers(req.query.statusId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let getDetailUserById = async (req, res) => {
    try {
        let data = await userService.getDetailUserById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let editAUser = async (req, res) => {
    try {
        let data = await userService.editAUser(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let deleteAUser = async (req, res) => {
    try {
        let data = await userService.deleteAUser(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let handleLogin = async (req, res) => {
    try {
        let data = await userService.handleLogin(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let handleChangePassword = async (req, res) => {
    try {
        let data = await userService.handleChangePassword(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let sendVerifyEmail = async (req, res) => {
    try {
        let data = await userService.sendVerifyEmail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let handleVerifyEmail = async (req, res) => {
    try {
        let data = await userService.handleVerifyEmail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let sendForgotPassword = async (req, res) => {
    try {
        let data = await userService.sendForgotPassword(req.body.email);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let handleResetPassword = async (req, res) => {
    try {
        let data = await userService.handleResetPassword(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: Message.errCode500
        })
    }
}
let changeStatusUser = async (req, res) => {
    try {
        let data = await userService.changeStatusUser(req.body);
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
    createANewUser: createANewUser,
    getAllUsers: getAllUsers,
    getDetailUserById: getDetailUserById,
    editAUser: editAUser,
    deleteAUser: deleteAUser,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    sendVerifyEmail: sendVerifyEmail,
    handleVerifyEmail: handleVerifyEmail,
    sendForgotPassword: sendForgotPassword,
    handleResetPassword: handleResetPassword,
    changeStatusUser: changeStatusUser,
}