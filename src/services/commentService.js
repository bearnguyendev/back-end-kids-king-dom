import db from "../models/index";
require('dotenv').config();

let createNewComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.content || !data.productId || !data.userId || !data.star) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.Comment.create({
                    content: data.content,
                    productId: data.productId,
                    userId: data.userId,
                    star: data.star,
                    image: data.image
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Bình luận thành công!'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Bình luận thất bại!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCommentByProductId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.Comment.findAll({
                    where: {
                        productId: id
                    },
                    include: [
                        { model: db.User, as: "userCommentData", attributes: ["image", "firstName", "lastName", "id"] }
                    ],
                    raw: true,
                    nest: true
                })
                let Obj = {}
                if (res && res.length > 0) {
                    res.map(item => item.image ? item.image = new Buffer.from(item.image, 'base64').toString('binary') : "")
                    res.map(item => item.userCommentData.image ? item.userCommentData.image = new Buffer.from(item.userCommentData.image, 'base64').toString('binary') : "")

                    for (let i = 0; i < res.length; i++) {
                        res[i].childComment = await db.Comment.findAll({ where: { parentId: res[i].id } })

                    }
                    // for (const iterator of res) {
                    //     iterator.childComment = await db.Comment.findAll({ where: { parentId: iterator.id } })
                    // }
                }
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let ReplyComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.content || !data.productId || !data.userId || !data.parentId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.Comment.create({
                    content: data.content,
                    productId: data.productId,
                    userId: data.userId,
                    parentId: data.parentId
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Phản hồi bình luận thành công!'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Phản hồi bình luận thất bại!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let review = await db.Comment.findOne({
                    where: { id: data.id }
                })
                if (review) {
                    let res = await db.Comment.destroy({
                        where: { id: data.id }
                    })
                    if (res) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Xoá bình luận thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Xoá bình luận thất bại!'
                        })
                    }
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewComment: createNewComment,
    getAllCommentByProductId: getAllCommentByProductId,
    ReplyComment: ReplyComment,
    deleteComment: deleteComment
}