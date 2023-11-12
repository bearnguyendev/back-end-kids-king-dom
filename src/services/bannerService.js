import db from "../models/index";
require('dotenv').config();
import { Message } from "../config/message";
let createNewBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.image || !data.description || !data.name) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                await db.Banner.create({
                    name: data.name,
                    statusId: 'S1',
                    image: data.image,
                    description: data.description,
                })
                resolve({
                    errCode: 0,
                    errMessage: Message.Banner.add
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailBannerById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Banner.findOne({
                    where: { id: id }
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
let getAllBanner = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Banner.findAll()
            if (res && res.length > 0) {
                res.map(item => item.image = new Buffer.from(item.image, 'base64').toString('binary'))
            }
            resolve({
                errCode: 0,
                data: res
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getListBanner = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Banner.findAll({
                    where: { statusId: 'S1' },
                    limit: +limit,
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
let updateBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.image || !data.description || !data.name) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let banner = await db.Banner.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (banner) {
                    banner.name = data.name;
                    banner.description = data.description;
                    banner.image = data.image;
                    await banner.save()
                    resolve({
                        errCode: 0,
                        errMessage: Message.Banner.update
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Banner.errCode2
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let deleteBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let banner = await db.Banner.findOne({
                    where: { id: data.id }
                })
                if (banner) {
                    await db.Banner.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: Message.Banner.delete
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Banner.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let changeStatusBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let banner = await db.Banner.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (banner) {
                    if (data.type === 'BAN') {
                        banner.statusId = 'S2';
                        await banner.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Banner.hidden
                        })
                    }
                    if (data.type === 'PERMIT') {
                        banner.statusId = 'S1';
                        await banner.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Banner.show
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Banner.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
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