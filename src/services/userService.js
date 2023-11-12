import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();
import { Message } from "../config/message";
const salt = bcrypt.genSaltSync(10);
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
            const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (regex.test(userEmail) === false) {
                resolve({
                    isValidEmail: 1,
                    errMessage: Message.email.e1
                })
            } else {
                let user = await db.User.findOne({
                    where: { email: userEmail },
                });
                if (user) {
                    resolve({
                        isValidEmail: 2,
                        errMessage: Message.email.e2
                    });
                } else {
                    resolve({ isValidEmail: 0 });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};
let validatePassword = (passwordInputValue) => {
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;
    const passwordLength = passwordInputValue.length;
    const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
    const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
    const digitsPassword = digitsRegExp.test(passwordInputValue);
    const specialCharPassword = specialCharRegExp.test(passwordInputValue);
    const minLengthPassword = minLengthRegExp.test(passwordInputValue);
    let errMessage = "";
    if (passwordLength === 0) {
        errMessage = Message.password.e1;
    } else if (!uppercasePassword) {
        errMessage = Message.password.e2;
    } else if (!lowercasePassword) {
        errMessage = Message.password.e3;
    } else if (!digitsPassword) {
        errMessage = Message.password.e4;
    } else if (!specialCharPassword) {
        errMessage = Message.password.e5;
    } else if (!minLengthPassword) {
        errMessage = Message.password.e6;
    } else {
        errMessage = "";
    }
    return errMessage;
};
let validatePhoneNumber = (phoneNumber) => {
    const regExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    const check = regExp.test(phoneNumber)
    let errMessage = "";
    if (!check) {
        errMessage = "Số điện thoại không đúng định dạng!"
    } else {
        errMessage = "";
    }
    return errMessage;
}
let createANewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phoneNumber || !data.genderId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let check = await checkUserEmail(data.email);
                if (check.isValidEmail !== 0) {
                    resolve({
                        errCode: 2,
                        errMessage: check.errMessage
                    })
                } else {
                    let isValidPw = validatePassword(data.password);
                    if (isValidPw === "") {
                        let isValidPhoneNumber = validatePhoneNumber(data.phoneNumber)
                        if (isValidPhoneNumber === "") {
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
                                errMessage: Message.User.add
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
                            errMessage: isValidPw
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!statusId) {
                return res.status(500).json({
                    errCode: 1,
                    errMessage: Message.errCode1,
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
                    errMessage: Message.errCode1
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
                    errMessage: Message.errCode1
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    let isValidPhoneNumber = validatePhoneNumber(data.phoneNumber)
                    if (isValidPhoneNumber === "") {
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
                            errMessage: Message.User.up
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
                        errMessage: Message.User.errCode2
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
                    errMessage: Message.errCode1
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: id },
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.errCode2
                    })
                }
                let res = await db.User.destroy({
                    where: { id: id }
                });
                if (res) {
                    resolve({
                        errCode: 0,
                        errMessage: Message.User.dlt
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.User.dltFail
                    })
                }
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
                    errMessage: Message.errCode1
                })
            } else {
                let userData = {};
                let check = await checkUserEmail(data.email);
                if (check.isValidEmail === 2) {
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
                                userData.errMessage = Message.User.ok;
                                delete user.password;
                                userData.user = user;
                            } else {
                                userData.errCode = 3;
                                userData.errMessage = Message.User.block;
                            }
                        } else {
                            userData.errCode = 4;
                            userData.errMessage = Message.User.wrongPassword;
                        }
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = Message.User.errCode2
                    }
                } else {
                    if (check.isValidEmail === 1) {
                        userData.errCode = 6;
                        userData.errMessage = check.errMessage
                    } else {
                        userData.errCode = 5;
                        userData.errMessage = Message.User.noEmail
                    }

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
                    errMessage: Message.errCode1
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    let check = await bcrypt.compareSync(data.oldPassword, user.password)
                    if (check) {
                        let isValidPw = validatePassword(data.newPassword);
                        if (isValidPw === '') {
                            user.password = await hashUserPassword(data.newPassword)
                            await user.save();
                            resolve({
                                errCode: 0,
                                errMessage: Message.User.upPassword
                            })
                        } else {
                            resolve({
                                errCode: 3,
                                errMessage: isValidPw
                            })
                        }
                    } else {
                        resolve({
                            errCode: 4,
                            errMessage: Message.User.wrongOldPass
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.errCode2
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
                    errMessage: Message.errCode1
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
                        errMessage: Message.User.ok
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.errCode2
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
                    errMessage: Message.errCode1
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
                        errMessage: Message.User.ok
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.errCode2
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
                    errMessage: Message.User.enterEmail
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
                        errMessage: Message.User.ok
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.noEmail
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
                    errMessage: Message.errCode1
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
                            errCode: 3,
                            errMessage: Message.User.newNotSameOld
                        })
                    } else {
                        let isValidPw = validatePassword(data.newPassword);
                        if (isValidPw === "") {
                            user.password = await hashUserPassword(data.newPassword);
                            user.userToken = "";
                            await user.save();
                            resolve({
                                errCode: 0,
                                errMessage: Message.User.ok
                            })
                        } else {
                            resolve({
                                errCode: 4,
                                errMessage: isValidPw
                            })
                        }
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.User.errCode2
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
                    errMessage: Message.errCode1
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
                            errMessage: Message.User.ban
                        })
                    }
                    if (data.type === 'PERMIT') {
                        user.statusId = 'S1';
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.User.permit
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.User.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let upsertUserSocialMedia = (typeAcc, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = null
            if (typeAcc === 'GOOGLE') {
                const [res, created] = await db.User.findOrCreate({
                    where: {
                        email: data.email,
                        type: typeAcc
                    },
                    defaults: {
                        email: data.email,
                        lastName: data.userName,
                        type: typeAcc
                    }
                })
                user = res
                console.log("check user: ", user);
                // resolve({
                //     errCode: 0,
                //     user
                // })

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