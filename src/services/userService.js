import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);
let createANewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phoneNumber || !data.genderId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Email của bạn đã được sử dụng. Vui lòng thử một email khác!'
                    })
                } else {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        birthday: data.birthday,
                        phoneNumber: data.phoneNumber,
                        image: data.avatar,
                        statusId: 'S1',
                        genderId: data.genderId,
                        roleId: data.roleId,
                        ActiveEmail: 0,
                        userToken: '',
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Thêm mới người dùng thành công!"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getAllUsers = (statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!statusId) {
                return res.status(500).json({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!',
                    data: []
                });
            }
            let data = '';
            if (statusId === 'ALL') {
                data = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData', attributes: ['value'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                    ],
                    raw: true,
                    nest: true,
                })
            }
            if (statusId && statusId !== 'ALL') {
                data = await db.User.findAll({
                    where: { statusId: statusId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData', attributes: ['value'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                    ],
                    raw: true,
                    nest: true,
                })
            }
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData', attributes: ['value'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {}
                }
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
let editAUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.firstName || !data.lastName || !data.address || !data.birthday || !data.phoneNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.birthday = data.birthday;
                    user.phoneNumber = data.phoneNumber;
                    user.genderId = data.genderId;
                    user.roleId = data.roleId;
                    if (data.image) {
                        user.image = data.image;
                    }
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thông tin thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteAUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: id },
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
                await db.User.destroy({
                    where: { id: id }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Xoá người dùng thành công!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let userData = {};
                let isExist = await checkUserEmail(data.email);
                if (isExist === true) {
                    let user = await db.User.findOne({
                        where: { email: data.email },
                        raw: true
                    })
                    if (user) {
                        if (user.image) {
                            user.image = new Buffer.from(user.image, 'base64').toString('binary');
                        }
                        let check = await bcrypt.compareSync(data.password, user.password)
                        if (check) {
                            if (user.statusId === 'S1') {
                                userData.errCode = 0;
                                userData.errMessage = 'Ok';
                                delete user.password;
                                userData.user = user;
                            } else {
                                userData.errCode = 3;
                                userData.errMessage = 'Tài khoản của bạn đã bị vô hiệu hoá!';
                            }
                        } else {
                            userData.errCode = 2;
                            userData.errMessage = 'Sai mật khẩu!';
                        }
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = 'Không tìm thấy người dùng!'
                    }
                } else {
                    userData.errCode = 5;
                    userData.errMessage = `Email của bạn không tồn tại trong hệ thống. Vui lòng thử một email khác!`
                }
                resolve(userData)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleChangePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.oldPassword || !data.newPassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    let check = await bcrypt.compareSync(data.oldPassword, user.password)
                    if (check) {
                        user.password = await hashUserPassword(data.newPassword)
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Thay đổi mật khẩu thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Mật khẩu cũ không chính xác'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendVerifyEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    let token = uuidv4();
                    user.userToken = token;
                    await emailService.sendSimpleEmail({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        redirectLink: `${process.env.URL_REACT}/verify-email?token=${token}&userId=${user.id}`,
                        email: user.email,
                        type: 'verifyEmail'
                    })
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleVerifyEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.userId,
                        userToken: data.token
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    user.ActiveEmail = 1
                    user.userToken = "";
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok'
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendForgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    let token = uuidv4();
                    user.userToken = token;
                    await emailService.sendSimpleEmail({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        redirectLink: `${process.env.URL_REACT}/reset-password?token=${token}&userId=${user.id}`,
                        email: user.email,
                        type: 'forgotPassword'
                    })
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Email của bạn không tồn tại trong hệ thống. Vui lòng thử một email khác!`
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleResetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.token || !data.newPassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.userId,
                        userToken: data.token
                    },
                    raw: false
                })
                if (user) {
                    let check = await bcrypt.compareSync(data.newPassword, user.password)
                    if (check) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Mật khẩu mới không được trùng với mật khẩu cũ'
                        })
                    } else {
                        user.password = await hashUserPassword(data.newPassword);
                        user.userToken = "";
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Ok'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let changeStatusUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    if (data.type === 'BAN') {
                        user.statusId = 'S2';
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Vô hiệu hoá người dùng thành công!'
                        })
                    }
                    if (data.type === 'PERMIT') {
                        user.statusId = 'S1';
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Mở khoá người dùng thành công!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy người dùng!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createANewUser: createANewUser,
    getAllUsers: getAllUsers,
    getDetailUserById: getDetailUserById,
    editAUser: editAUser,
    deleteAUser: deleteAUser,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    sendVerifyEmail: sendVerifyEmail,
    handleVerifyEmail: handleVerifyEmail,
    sendForgotPassword: sendForgotPassword,
    handleResetPassword: handleResetPassword,
    changeStatusUser: changeStatusUser,
}