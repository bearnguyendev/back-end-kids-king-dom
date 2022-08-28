import db from "../models/index";
let validatePhoneNumber = (phoneNumber) => {
    const regExp = /^[0-9\b]+$/;
    const check = regExp.test(phoneNumber)
    let errMessage = "";
    if (!check) {
        errMessage = "Vui lòng nhập số điện thoại là số"
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
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
                            errMessage: 'Tạo mới địa chỉ nhận hàng thất bại!'
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Tạo mới địa chỉ nhận hàng thành công!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
                })
            } else {
                let res = await db.Receiver.findAll({
                    where: { userId: userId }
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy địa chỉ nhận hàng!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
                })
            } else {
                let receiver = await db.Receiver.findOne({
                    where: {
                        id: data.id
                    }
                })
                if (receiver) {
                    await db.Receiver.destroy({
                        where: {
                            id: data.id
                        }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Xoá địa chỉ nhận hàng thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Địa chỉ nhận hàng không tìm thấy!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
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
                            errMessage: 'Chỉnh sửa địa chỉ nhận hàng thành công!'
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
                        errMessage: 'Địa chỉ nhận hàng không tồn tại'
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
                })
            } else {
                let res = await db.Receiver.findOne({
                    where: { id: id }
                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy địa chỉ nhận hàng!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
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
                        errMessage: 'Đặt địa chỉ nhận hàng làm mặc định thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không có dữ liệu địa chỉ nhận hàng'
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