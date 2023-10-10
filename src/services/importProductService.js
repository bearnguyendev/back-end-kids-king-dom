import db from "../models/index";
let addImport = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.priceImport || !data.quantity || !data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                const [res, created] = await db.ImportProduct.findOrCreate({
                    where: {
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
                        errMessage: `Phiếu nhập sản phẩm ${product.name} có giá  nhập ${data.priceImport} đã tồn tại! Hãy cập nhật số lượng`
                    })
                } else {
                    if (product) {
                        product.stock += +data.quantity
                        await product.save()
                        resolve({
                            errCode: 0,
                            errMessage: 'Tạo mới phiếu nhập thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy sản phẩm!'
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
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let importProduct = await db.ImportProduct.findOne({
                    where: { id: data.id, productId: data.productId },
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
                            errCode: 3,
                            errMessage: 'Không tìm thấy sản phẩm!'
                        })
                    }
                    importProduct.priceImport = data.priceImport
                    importProduct.quantity = data.quantity
                    importProduct.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật phiếu nhập thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phiếu nhập!'
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
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let importProduct = await db.ImportProduct.findOne({
                    where: { id: data.id }
                })
                if (importProduct) {
                    await db.ImportProduct.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Xoá phiếu nhập thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phiếu nhập!'
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