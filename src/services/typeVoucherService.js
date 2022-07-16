import db from "../models/index";
let createNewTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.minValue) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
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
                        errMessage: 'Thêm mới loại giảm giá thất bại!'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Thêm mới loại giảm giá thành công!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!'
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
                    await typeVoucher.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thông tin loại giảm giá thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy loại giảm giá để chỉnh sửa!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let typeVoucher = await db.TypeVoucher.findOne({
                    where: { id: data.id }
                })
                if (typeVoucher) {
                    let res = await db.TypeVoucher.destroy({
                        where: { id: data.id }
                    })
                    if (!res) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Xoá loại giảm giá thất bại!'
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Xoá loại giảm giá thành công!'
                        })
                    }
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