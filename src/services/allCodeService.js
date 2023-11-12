import db from "../models/index";
const { Op, where } = require("sequelize");
import { Message } from "../config/message";
let getAllCode = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let data = await db.Allcode.findAll({
                    where: { type: type }
                });
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let createNewAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.keyMap) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                const [res, created] = await db.Allcode.findOrCreate({
                    where: { [Op.or]: [{ keyMap: data.keyMap }, { value: data.value }] },
                    defaults: {
                        type: data.type,
                        value: data.value,
                        keyMap: data.keyMap
                    }
                })
                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Allcode.alreadyExists
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: Message.Allcode.errCode0
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updateAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value || !data.keyMap || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Allcode.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })
                if (res) {
                    res.value = data.value
                    res.keyMap = data.keyMap
                    await res.save();
                    resolve({
                        errCode: 0,
                        errMessage: Message.Allcode.errCode0
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Allcode.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let foundAllCode = await db.Allcode.findOne({
                    where: { id: data.id }
                })
                if (!foundAllCode) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Allcode.errCode2
                    })
                }
                let res = ''
                if (data.type === "BRAND") {
                    res = await db.Product.findOne({
                        where: { brandId: foundAllCode.keyMap },
                    })
                }
                if (data.type === "CATEGORY") {
                    res = await db.Product.findOne({
                        where: { categoryId: foundAllCode.keyMap },
                    })
                }
                if (data.type === "SUBJECT") {
                    res = await db.Blog.findOne({
                        where: { subjectId: foundAllCode.keyMap },
                    })
                }
                if (res) {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Allcode.used
                    })
                } else {
                    await db.Allcode.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: Message.Allcode.delete
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let changeStatusAllcode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Allcode.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (res) {
                    if (data.type === 'BAN') {
                        res.status = 1;
                        await res.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Allcode.hidden
                        })
                    }
                    if (data.type === 'PERMIT') {
                        res.status = 0;
                        await res.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Allcode.show
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Allcode.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.limit) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {

                let res = await db.Allcode.findAll({
                    where: { type: data.type },
                    limit: +data.limit,
                })
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
let getDetailAllCodeById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let data = await db.Allcode.findOne({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getAllCode: getAllCode,
    createNewAllCode: createNewAllCode,
    updateAllCode: updateAllCode,
    deleteAllCode: deleteAllCode,
    getListAllCode: getListAllCode,
    getDetailAllCodeById: getDetailAllCodeById,
    changeStatusAllcode: changeStatusAllcode
}