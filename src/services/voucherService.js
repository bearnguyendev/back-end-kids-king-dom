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
                let res = await db.Voucher.create({
                    fromDate: data.fromDate,
                    toDate: data.toDate,
                    typeVoucherId: data.typeVoucherId,
                    number: data.number,
                    codeVoucher: data.codeVoucher
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Thêm mới mã giảm giá thất bại!'
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
let getAllVoucherByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.User.findAll({
                    where: {
                        id: data.id,
                    },
                    include: {
                        model: db.Voucher, as: 'VoucherUserUsedData'
                    },
                    raw: false
                })
                if (!res) {
                    resolve({
                        errCode: 0,
                        errMessage: "Không tìm thấy mã giảm giá người dùng đã sử dụng!"
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
module.exports = {
    createNewVoucher: createNewVoucher,
    getDetailVoucherById: getDetailVoucherById,
    getAllVoucher: getAllVoucher,
    updateVoucher: updateVoucher,
    deleteVoucher: deleteVoucher,
    saveUserVoucher: saveUserVoucher,
    getAllVoucherByUserId: getAllVoucherByUserId
}