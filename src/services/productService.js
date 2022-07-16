import db from "../models/index";
const { Op } = require("sequelize");
let checkRequiredFields = (inputData) => {
    let arrFields = ['name', 'origin', 'material', 'categoryId', 'brandId', 'warrantyId', 'nameDetail', 'long', 'width', 'height', 'weight', 'stock', 'originalPrice', 'percentDiscount', 'desMarkdown', 'desHTML']
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }

    }
    return {
        isValid: isValid,
        element: element
    }
}
let createNewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(data);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Thiếu thông số bắt buộc: ${checkObj.element}`
                })
            } else {
                let product = await db.Product.create({
                    name: data.name,
                    origin: data.origin,
                    material: data.material,
                    statusId: 'S1',
                    categoryId: data.categoryId,
                    brandId: data.brandId,
                    warrantyId: data.warrantyId,
                    shortDes: data.shortDes,
                    view: 0,
                    long: data.long,
                    width: data.width,
                    height: data.height,
                    weight: data.weight,
                    stock: data.stock,
                    nameDetail: data.nameDetail,
                    originalPrice: data.originalPrice,
                    percentDiscount: data.percentDiscount,
                    discountPrice: data.discountPrice,
                    desMarkdown: data.desMarkdown,
                    desHTML: data.desHTML
                })
                if (product) {
                    let productImage = await db.ProductImage.create({
                        productId: product.id,
                        image: data.image
                    })
                    if (productImage) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Thêm mới sản phẩm thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Thêm mới hình ảnh sản phẩm thất bại!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Thêm mới sản phẩm thất bại!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(data);
            if (checkObj.isValid === false || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: checkObj.element ? `Thiếu thông số bắt buộc: ${checkObj.element}` : `Thiếu thông số bắt buộc: id`
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (product) {
                    product.name = data.name;
                    product.origin = data.origin;
                    product.material = data.material;
                    product.categoryId = data.categoryId;
                    product.brandId = data.brandId;
                    product.warrantyId = data.warrantyId;
                    product.shortDes = data.shortDes;
                    product.long = data.long;
                    product.width = data.width;
                    product.height = data.height;
                    product.weight = data.weight;
                    product.stock = data.stock;
                    product.nameDetail = data.nameDetail;
                    product.originalPrice = data.originalPrice;
                    product.percentDiscount = data.percentDiscount;
                    product.discountPrice = data.discountPrice;
                    product.desMarkdown = data.desMarkdown;
                    product.desHTML = data.desHTML;
                    let productImage = await db.ProductImage.findAll({
                        where: { productId: data.id },
                        raw: false
                    })
                    if (productImage && productImage.length > 0) {
                        productImage[0].image = new Buffer.from(productImage[0].image, 'base64').toString('binary')
                    }
                    if (productImage[0].image === data.oldImage) {
                        productImage[0].image = data.image
                        await productImage[0].save()
                    }
                    await product.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật sản phẩm thành công!'
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllProduct = (statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!statusId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!',
                    data: []
                });
            }
            let data = '';
            let conditionObject = {
                include: [
                    { model: db.Allcode, as: 'categoryData', attributes: ['value'] },
                    { model: db.Allcode, as: 'brandData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    { model: db.Allcode, as: 'warrantyData', attributes: ['value'] },
                    { model: db.ProductImage, as: 'productImageData' },
                ],
                raw: false,
                nest: true,
            }
            if (statusId === 'ALL') {
                data = await db.Product.findAll(conditionObject)
                if (data && data.length > 0) {
                    data.map((product) => {
                        return (
                            product.productImageData && product.productImageData.length > 0 &&
                            product.productImageData.map((item) => {
                                return (
                                    item.image = new Buffer.from(item.image, 'base64').toString('binary')
                                )
                            })
                        )
                    })
                }
            }
            if (statusId && statusId !== 'ALL') {
                let conditionObject1 = { where: { statusId: statusId }, ...conditionObject }
                data = await db.Product.findAll(conditionObject1)
                if (data && data.length > 0) {
                    data.map((product) => {
                        return (
                            product.productImageData && product.productImageData.length > 0 &&
                            product.productImageData.map((item) => {
                                return (
                                    item.image = new Buffer.from(item.image, 'base64').toString('binary')
                                )
                            })
                        )
                    })
                }
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
let searchProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.search) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.Product.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${data.search}%`
                        }
                    }
                });
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
let changeStatusProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (product) {
                    if (data.type === 'BAN') {
                        product.statusId = 'S2';
                        await product.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Ẩn sản phẩm thành công!'
                        })
                    }
                    if (data.type === 'PERMIT') {
                        product.statusId = 'S1';
                        await product.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Hiện sản phẩm thành công!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: id },
                    raw: false
                })

                if (product) {
                    await db.ProductImage.destroy({
                        where: { productId: id }
                    })
                    await db.Product.destroy({
                        where: { id: id }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'Xoá sản phẩm thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let createNewProductImage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.productId || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: `Thiếu các thông số bắt buộc`
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: data.productId }
                })
                if (product) {
                    let productImage = await db.ProductImage.create({
                        productId: product.id,
                        title: data.title,
                        image: data.image
                    })
                    if (productImage) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Thêm mới hình ảnh thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Thêm mới hình ảnh sản phẩm thất bại!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy sản phẩm để thêm hình ảnh!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updateProductImage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.image || !data.productId) {
                resolve({
                    errCode: 1,
                    errMessage: `Thiếu các thông số bắt buộc`
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: data.productId },
                    raw: false
                })
                if (product) {
                    let productImage = await db.ProductImage.findOne({
                        where: { id: data.id },
                        raw: false
                    })
                    productImage.image = data.image;
                    productImage.title = data.title;
                    let res = await productImage.save();
                    if (res) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhật hình ảnh sản phẩm thành công!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy hình ảnh sản phẩm!'
                        })
                    }


                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy sản phẩm!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllProductImageFromProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!productId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!',
                    data: []
                });
            }
            let data = await db.ProductImage.findAll({
                where: { productId: productId },
            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
                resolve({
                    errCode: 0,
                    data
                })
            }

            else {
                resolve({
                    errCode: 2,
                    errMessage: 'Lấy dữ liệu hình ảnh thất bại!',
                    data: []
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteProductImage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                await db.ProductImage.destroy({
                    where: { id: id }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Xoá hình ảnh thành công!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewProduct: createNewProduct,
    updateProduct: updateProduct,
    getAllProduct: getAllProduct,
    searchProduct: searchProduct,
    changeStatusProduct: changeStatusProduct,
    deleteProduct: deleteProduct,
    createNewProductImage: createNewProductImage,
    updateProductImage: updateProductImage,
    getAllProductImageFromProduct: getAllProductImageFromProduct,
    deleteProductImage: deleteProductImage,
}
