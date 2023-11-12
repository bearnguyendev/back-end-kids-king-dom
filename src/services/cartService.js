import db from "../models/index";
import { Message } from "../config/message";
let addItemCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.quantity || !data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let cart = await db.Cart.findOne({
                    where: {
                        userId: data.userId,
                        productId: data.productId,
                        statusId: 0
                    },
                    raw: false
                })
                if (cart) {
                    let res = await db.Product.findOne({
                        where: { id: data.productId }
                    })
                    if (data.type === "UPDATE_QUANTITY") {
                        if (+data.quantity > res.stock) {
                            resolve({
                                errCode: 2,
                                errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                                quantity: res.stock
                            })
                        } else {
                            cart.quantity = +data.quantity
                            await cart.save()
                            resolve({
                                errCode: 0,
                                errMessage: Message.Cart.up,
                            })
                        }
                    } else {
                        if ((+cart.quantity + (+data.quantity)) > res.stock) {
                            resolve({
                                errCode: 2,
                                errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                                quantity: res.stock
                            })
                        } else {
                            cart.quantity = +cart.quantity + (+data.quantity)
                            await cart.save()
                        }
                    }

                }
                else {
                    let res = await db.Product.findOne({ where: { id: data.productId } })
                    if (data.quantity > res.stock) {
                        resolve({
                            errCode: 2,
                            errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                            quantity: res.stock
                        })
                    } else {
                        await db.Cart.create({
                            userId: data.userId,
                            productId: data.productId,
                            quantity: data.quantity,
                            statusId: 0
                        })
                    }

                }
                resolve({
                    errCode: 0,
                    errMessage: Message.Cart.add
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCartByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ["id", "email", "firstName", "lastName"],
                    include: {
                        model: db.Product, as: 'ProductUserCartData',
                        include: [
                            { model: db.ProductImage, as: 'productImageData', attributes: ['image'] }
                        ]
                    },
                    raw: false
                })
                if (res && res.ProductUserCartData) {
                    res.ProductUserCartData.length > 0 && res.ProductUserCartData.map((item) => {
                        return (
                            item.productImageData && item.productImageData.length > 0 && item.productImageData.map((imageData) => {
                                return (
                                    imageData.image = new Buffer.from(imageData.image, 'base64').toString('binary')
                                )
                            })
                        )
                    })
                    resolve({
                        errCode: 0,
                        data: res
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Cart.notFound
                    })

                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteItemCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Cart.findOne({ where: { productId: data.productId, statusId: 0 } })
                if (res) {
                    await db.Cart.destroy({
                        where: { productId: data.productId }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: Message.Cart.deleteItem
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Cart.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteItemCartByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Cart.findAll({ where: { userId: data.userId, statusId: 0 } })
                if (res) {
                    await db.Cart.destroy({
                        where: { userId: data.userId }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: Message.Cart.delete
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Cart.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    addItemCart: addItemCart,
    getAllCartByUserId: getAllCartByUserId,
    deleteItemCart: deleteItemCart,
    deleteItemCartByUserId: deleteItemCartByUserId
}