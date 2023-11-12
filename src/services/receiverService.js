import db from "../models/index";
import { Message } from "../config/message";
let validatePhoneNumber = (phoneNumber) => {
    const regExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    const check = regExp.test(phoneNumber)
    let errMessage = "";
    if (!check) {
        errMessage = Message.failPhoneNumber
    } else {
        errMessage = "";
    }
    return errMessage;
}
let createNewReceiver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let isValidPhoneNumber = validatePhoneNumber(data.phoneNumber)
                if (isValidPhoneNumber === "") {
                    let res = await db.Receiver.create({
                        userId: data.userId,
                        name: data.name,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        status: data.status ? data.status : 0
                    })
                    if (!res) {
                        resolve({
                            errCode: 2,
                            errMessage: Message.Receiver.addFail
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: Message.Receiver.add
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: isValidPhoneNumber
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllReceiverByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let res = await db.Receiver.findAll({
                    where: { userId: userId }
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Receiver.errCode2
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: res
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteReceiver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let receiver = await db.Receiver.findOne({
                    where: {
                        id: data.id
                    }
                })
                if (receiver) {
                    let res = await db.Receiver.destroy({
                        where: {
                            id: data.id
                        }
                    })
                    if (res) {
                        resolve({
                            errCode: 0,
                            errMessage: Message.Receiver.delete
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Receiver.deleteFail
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Receiver.errCode2
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let editReceiver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.address || !data.phoneNumber) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let receiver = await db.Receiver.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false
                })
                if (receiver) {
                    let isValidPhoneNumber = validatePhoneNumber(data.phoneNumber)
                    if (isValidPhoneNumber === "") {
                        receiver.name = data.name
                        receiver.phoneNumber = data.phoneNumber
                        receiver.address = data.address
                        receiver.status = data.status ? data.status : 0
                        await receiver.save()
                        resolve({
                            errCode: 0,
                            errMessage: Message.Receiver.up
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: isValidPhoneNumber
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Receiver.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailReceiverById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let res = await db.Receiver.findOne({
                    where: { id: id }
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Receiver.errCode2
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: res
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleChangeStatusReceiver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                })
            } else {
                let receiver = await db.Receiver.findAll({
                    raw: false
                })
                if (receiver) {
                    for (let x of receiver) {
                        x.status = 0
                        await x.save()
                    }
                    let res = await db.Receiver.findOne({
                        where: {
                            id: data.id,
                        },
                        raw: false
                    })
                    res.status = 1;
                    await res.save()
                    resolve({
                        errCode: 0,
                        errMessage: Message.Receiver.setDefault
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Receiver.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewReceiver: createNewReceiver,
    getAllReceiverByUserId: getAllReceiverByUserId,
    deleteReceiver: deleteReceiver,
    editReceiver: editReceiver,
    getDetailReceiverById: getDetailReceiverById,
    handleChangeStatusReceiver: handleChangeStatusReceiver
}