import db from "../models/index";
require('dotenv').config();
const { Op } = require("sequelize");
import { Message } from "../config/message";
let createNewBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.contentMarkdown || !data.contentHTML || !data.image || !data.subjectId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Blog.create({
                    title: data.title,
                    shortDes: data.shortDes,
                    subjectId: data.subjectId,
                    statusId: 'S1',
                    image: data.image,
                    contentMarkdown: data.contentMarkdown,
                    contentHTML: data.contentHTML
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Blog.addFail
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: Message.Blog.add
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailBlogById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Blog.findOne({
                    where: { id: id },
                    include: [
                        { model: db.Allcode, as: 'subjectData', attributes: ['value', 'keyMap'] },

                    ],
                    raw: true,
                    nest: true
                })
                if (res && res.image) {
                    res.image = new Buffer.from(res.image, 'base64').toString('binary');
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
let getAllBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let conditionObject = {
                    include: [
                        { model: db.Allcode, as: 'subjectData', attributes: ['value', 'keyMap'] },
                    ],
                    raw: false,
                    nest: true
                }
                if (data.statusId && data.statusId !== 'ALL') conditionObject.where = { statusId: data.statusId }
                if (data.subjectId && data.subjectId !== 'ALL') conditionObject.where = { ...conditionObject.where, subjectId: data.subjectId }
                if (data.valueSearch && data.valueSearch !== 'ALL') conditionObject.where = { ...conditionObject.where, title: { [Op.substring]: data.valueSearch } }
                let res = await db.Blog.findAll(conditionObject)
                if (res && res.length > 0) {
                    res.map(item => item.image = new Buffer.from(item.image, 'base64').toString('binary'))
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
let getListBlog = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                    data: []
                });
            } else {
                let res = await db.Blog.findAll({
                    where: { statusId: 'S1' },
                    limit: limit,
                    order: [
                        ['createdAt', 'DESC'],
                    ],
                    include: [
                        { model: db.Allcode, as: 'subjectData', attributes: ['value', 'keyMap'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (res && res.length > 0) {
                    res.map(item => item.image = new Buffer.from(item.image, 'base64').toString('binary'))
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
let updateBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.title || !data.contentMarkdown || !data.contentHTML || !data.image || !data.subjectId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let blog = await db.Blog.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (blog) {
                    blog.title = data.title;
                    blog.shortDes = data.shortDes;
                    blog.image = data.image;
                    blog.subjectId = data.subjectId;
                    blog.statusId = data.statusId;
                    blog.contentMarkdown = data.contentMarkdown;
                    blog.contentHTML = data.contentHTML;
                    let res = await blog.save();
                    if (!res) {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Blog.addFail
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: Message.Blog.up
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Blog.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let blog = await db.Blog.findOne({
                    where: { id: data.id }
                })
                if (blog) {
                    let res = await db.Blog.destroy({
                        where: { id: data.id }
                    })
                    if (!res) {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Blog.deleteFail
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: Message.Blog.delete
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Blog.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let changeStatusBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let blog = await db.Blog.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (blog) {
                    if (data.type === 'BAN') {
                        blog.statusId = 'S2';
                        await blog.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Blog.hidden
                        })
                    }
                    if (data.type === 'PERMIT') {
                        blog.statusId = 'S1';
                        await blog.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Blog.show
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Blog.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
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