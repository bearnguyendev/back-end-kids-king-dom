import _ from "lodash";
import db from "../models/index";
let createNewVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.fromDate || !data.toDate || !data.typeVoucherId || !data.number || !data.codeVoucher) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                const [res, created] = await db.Voucher.findOrCreate({
                    where: {
                        codeVoucher: data.codeVoucher
                    },
                    defaults: {
                        fromDate: data.fromDate,
                        toDate: data.toDate,
                        typeVoucherId: data.typeVoucherId,
                        number: data.number,
                        codeVoucher: data.codeVoucher
                    }
                })
                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: `Mã giảm giá ${data.codeVoucher}đã tồn tại! Hãy xoá mã giảm giá cũ trước khi thêm mới`
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Thêm mới mã giảm giá thành công!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailVoucherById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.Voucher.findOne({
                    where: { id: id },
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        data: res
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: "Không tìm thấy mã giảm giá!"
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            let res = await db.Voucher.findAll({
                include: [
                    {
                        model: db.TypeVoucher, as: 'typeVoucherOfVoucherData',
                        include: [
                            { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'keyMap'] },
                        ],
                    },
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
let updateVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.fromDate || !data.toDate || !data.typeVoucherId || !data.number || !data.codeVoucher) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let voucher = await db.Voucher.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (voucher) {
                    voucher.fromDate = data.fromDate;
                    voucher.toDate = data.toDate;
                    voucher.typeVoucherId = data.typeVoucherId;
                    voucher.number = data.number;
                    voucher.codeVoucher = data.codeVoucher;
                    let res = await voucher.save()
                    if (!res) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Cập nhật mã giảm giá thất bại!'
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhật mã giảm giá thành công!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy mã giảm giá!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let checkVoucherUsed = await db.VoucherUsed.findOne({
                    where: { voucherId: data.id }
                })
                if (checkVoucherUsed) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không thể xoá mã giảm giá đã được sử dụng!'
                    })
                } else {
                    let voucher = await db.Voucher.findOne({
                        where: { id: data.id }
                    })
                    if (voucher) {
                        let res = await db.Voucher.destroy({
                            where: { id: data.id }
                        })
                        if (!res) {
                            resolve({
                                errCode: 2,
                                errMessage: 'Xoá mã giảm giá thất bại!'
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Xoá mã giảm giá thành công!'
                            })
                        }
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy mã giảm giá!'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let saveUserVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.voucherId || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                const [res, created] = await db.VoucherUsed.findOrCreate({
                    where: { voucherId: data.voucherId, userId: data.userId },
                    defaults: {
                        voucherId: data.voucherId,
                        userId: data.userId
                    }
                })
                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bạn đã lưu mã giảm giá này!'
                    })
                } else {
                    let voucher = await db.Voucher.findOne({
                        where: {
                            id: data.voucherId
                        },
                        raw: false
                    })
                    voucher.numberUsed++;
                    await voucher.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Lưu mã giảm giá thành công!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllVoucherByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    include: {
                        model: db.Voucher, as: 'VoucherOfUser',
                        include: {
                            model: db.TypeVoucher, as: 'typeVoucherOfVoucherData',
                        }
                    },
                    attributes: ['id', 'email'],
                    raw: false
                })
                if (res && !_.isEmpty(res)) {
                    let arrTemp = []
                    arrTemp = res.VoucherOfUser.filter(item => +item.VoucherUsed.status === 0)
                    resolve({
                        errCode: 0,
                        data: arrTemp
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: "Không tìm thấy mã giảm giá người dùng đã sử dụng!"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewVoucher: createNewVoucher,
    getDetailVoucherById: getDetailVoucherById,
    getAllVoucher: getAllVoucher,
    updateVoucher: updateVoucher,
    deleteVoucher: deleteVoucher,
    saveUserVoucher: saveUserVoucher,
    getAllVoucherByUserId: getAllVoucherByUserId
}