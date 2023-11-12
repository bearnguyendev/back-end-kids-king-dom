import db from "../models/index";
import { Message } from "../config/message";
let addImport = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.priceImport || !data.quantity || !data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                const [res, created] = await db.ImportProduct.findOrCreate({
                    where: {
                        productId: data.productId,
                        priceImport: data.priceImport
                    },
                    defaults: {
                        productId: data.productId,
                        quantity: data.quantity,
                        priceImport: data.priceImport
                    }
                })
                let product = await db.Product.findOne({
                    where: { id: data.productId },
                    raw: false
                })
                if (!created) {
                    resolve({
                        errCode: 3,
                        errMessage: `Phiếu nhập sản phẩm ${product.name} có giá  nhập ${data.priceImport} VND đã tồn tại. Hãy cập nhật số lượng!`
                    })
                } else {
                    if (product) {
                        product.stock += +data.quantity
                        await product.save()
                        resolve({
                            errCode: 0,
                            errMessage: Message.Import.add
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: Message.Import.errCode2SP
                        })
                    }

                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllImport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.ImportProduct.findAll({
                include: [
                    { model: db.Product, as: 'importData', attributes: ['name'] }],
                raw: false
            })
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

let updateImport = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.priceImport || !data.quantity || !data.productId || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let importProduct = await db.ImportProduct.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (importProduct) {
                    let product = await db.Product.findOne({
                        where: { id: data.productId },
                        raw: false
                    })
                    if (product) {
                        if (importProduct.quantity > data.quantity) {
                            product.stock -= importProduct.quantity - data.quantity
                            await product.save()
                        } else if (importProduct.quantity < data.quantity) {
                            product.stock += data.quantity - importProduct.quantity
                            await product.save()
                        } else {

                        }
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: Message.Import.errCode2SP
                        })
                    }
                    importProduct.productId = data.productId
                    importProduct.priceImport = data.priceImport
                    importProduct.quantity = data.quantity
                    importProduct.save()
                    resolve({
                        errCode: 0,
                        errMessage: Message.Import.up
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Import.noProductInImport
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteImport = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let importProduct = await db.ImportProduct.findOne({
                    where: { id: data.id }
                })
                if (importProduct) {
                    let product = await db.Product.findOne({
                        where: { id: data.productId },
                        raw: false
                    })
                    if (product) {
                        product.stock -= +data.quantity
                        await product.save()
                        await db.ImportProduct.destroy({
                            where: { id: data.id }
                        })
                        resolve({
                            errCode: 0,
                            errMessage: Message.Import.delete
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Import.noProductInImport
                        })
                    }

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Import.errCode2PN
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    addImport: addImport,
    getAllImport: getAllImport,
    updateImport: updateImport,
    deleteImport: deleteImport
}