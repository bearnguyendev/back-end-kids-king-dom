import db from "../models/index";
import { Message } from "../config/message";
let createNewTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.minValue) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.TypeVoucher.create({
                    type: data.type,
                    value: data.value,
                    maxValue: data.maxValue,
                    minValue: data.minValue
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.TypeVoucher.addFail
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: Message.TypeVoucher.add
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailTypeVoucherById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.TypeVoucher.findOne({
                    where: { id: id },
                    include: [
                        { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'keyMap'] },
                    ],
                    raw: true,
                    nest: true
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
let getAllTypeVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.TypeVoucher.findAll({
                include: [
                    { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'keyMap'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: res
            })
        } catch (error) {
            reject(error)
        }
    })
}
let updateTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type || !data.value || !data.minValue) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let typeVoucher = await db.TypeVoucher.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (typeVoucher) {
                    typeVoucher.type = data.type;
                    typeVoucher.value = data.value;
                    typeVoucher.maxValue = data.maxValue;
                    typeVoucher.minValue = data.minValue;
                    let res = await typeVoucher.save()
                    if (res) {
                        resolve({
                            errCode: 0,
                            errMessage: Message.TypeVoucher.up
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: Message.TypeVoucher.upFail
                        })
                    }

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.TypeVoucher.errCode2
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let deleteTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let typeVoucher = await db.TypeVoucher.findOne({
                    where: { id: data.id }
                })
                if (typeVoucher) {
                    let voucher = await db.Voucher.findOne({
                        where: { typeVoucherId: data.id }
                    })
                    if (!voucher) {
                        let res = await db.TypeVoucher.destroy({
                            where: { id: data.id }
                        })
                        if (!res) {
                            resolve({
                                errCode: 3,
                                errMessage: Message.TypeVoucher.dltFail
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: Message.TypeVoucher.dlt
                            })
                        }
                    } else {
                        resolve({
                            errCode: 4,
                            errMessage: Message.TypeVoucher.used
                        })
                    }

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.TypeVoucher.errCode2
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getSelectTypeVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let res = await db.TypeVoucher.findAll({
                include: [
                    { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'keyMap'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: res
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewTypeVoucher: createNewTypeVoucher,
    getDetailTypeVoucherById: getDetailTypeVoucherById,
    getAllTypeVoucher: getAllTypeVoucher,
    updateTypeVoucher: updateTypeVoucher,
    deleteTypeVoucher: deleteTypeVoucher,
    getSelectTypeVoucher: getSelectTypeVoucher,
}