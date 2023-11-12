import _ from "lodash";
import db from "../models/index";
const { Op } = require("sequelize");
import { Message } from "../config/message";
let checkRequiredFields = (inputData) => {
    let arrFields = ['name', 'origin', 'material', 'categoryId', 'brandId', 'warrantyId', 'nameDetail', 'long', 'width', 'height', 'weight', 'originalPrice', 'percentDiscount', 'desMarkdown', 'desHTML']
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
                    stock: 0,
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
                    data.arrAgeUseProduct = data.arrAgeUseProduct.map(item => {
                        item.productId = product.id
                        return item;
                    })
                    // get all existing data
                    // let existing = await db.AgeUseProduct.findAll(
                    //     {
                    //         where: { productId: product.id },
                    //         attributes: ['ageId', 'productId'],
                    //         raw: true
                    //     }
                    // )
                    //compare different
                    // let toCreate = _.differenceWith(data.arrAgeUseProduct, existing, (a, b) => {
                    //     return a.ageId === b.ageId;
                    // });
                    //create data
                    let res = ''
                    if (data.arrAgeUseProduct && data.arrAgeUseProduct.length > 0) {
                        res = await db.AgeUseProduct.bulkCreate(data.arrAgeUseProduct);
                    }
                    if (productImage && res) {
                        resolve({
                            errCode: 0,
                            errMessage: Message.Product.addProduct
                        })
                    } else {
                        if (!productImage) {
                            resolve({
                                errCode: 2,
                                errMessage: Message.Product.addImgFail
                            })
                        }
                        if (!res) {
                            resolve({
                                errCode: 4,
                                errMessage: Message.Product.addAgeFail
                            })
                        }
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Product.addProductFail
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
                    errMessage: checkObj.element ? `Thiếu thông số bắt buộc: ${checkObj.element}` : Message.Product.noId
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
                    //product.stock = data.stock;
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
                    data.arrAgeUseProduct && data.arrAgeUseProduct.length > 0 &&
                        await db.AgeUseProduct.bulkCreate(data.arrAgeUseProduct, { updateOnDuplicate: ['status'] });
                    await product.save()
                    resolve({
                        errCode: 0,
                        errMessage: Message.Product.up
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Product.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                    res: []
                });
            }
            let conditionObject = {
                include: [
                    { model: db.Allcode, as: 'categoryData', attributes: ['value', 'keyMap'] },
                    { model: db.Allcode, as: 'brandData', attributes: ['value', 'keyMap'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value', 'keyMap'] },
                    { model: db.Allcode, as: 'warrantyData', attributes: ['value', 'keyMap'] },
                    { model: db.ProductImage, as: 'productImageData' },
                    {
                        model: db.AgeUseProduct, as: 'productAgeData',
                        include: { model: db.Allcode, as: 'AgeUseProductData', attributes: ['value'] }
                    },
                    { model: db.OrderProduct, as: 'OrderDetailData' }
                ],
                raw: false,
                nest: true,
            }
            if (data.statusId && data.statusId !== 'ALL') conditionObject.where = { statusId: data.statusId }
            if (data.categoryId && data.categoryId !== 'ALL') conditionObject.where = { ...conditionObject.where, categoryId: data.categoryId }
            if (data.brandId && data.brandId !== 'ALL') conditionObject.where = { ...conditionObject.where, brandId: data.brandId }
            if (data.valueSearch && data.valueSearch !== 'ALL') conditionObject.where = { ...conditionObject.where, name: { [Op.substring]: data.valueSearch } }
            if (data.sortName && data.sortName === "true") {
                conditionObject.order = [['name', 'ASC']]
            } else if (data.sortName && data.sortName === "false") {
                conditionObject.order = [['name', 'DESC']]
            }
            if (data.sortPrice && data.sortPrice === "true") {
                conditionObject.order = [['discountPrice', 'ASC']]
            } else if (data.sortPrice && data.sortPrice === "false") {
                conditionObject.order = [['discountPrice', 'DESC']]
            }
            if (data.sortPercent && data.sortPercent === "true") {
                conditionObject.order = [['percentDiscount', 'ASC']]
            } else if (data.sortPercent && data.sortPercent === "false") {
                conditionObject.order = [['percentDiscount', 'DESC']]
            }
            if (data.sortView && data.sortView === "true") {
                conditionObject.order = [['view', 'DESC']]
            }
            if (data.sortCreatedAt && data.sortCreatedAt === "true") {
                conditionObject.order = [['createdAt', 'DESC']]
            }
            if (data.sortCount && data.sortCount === "true") {
                conditionObject.order = [['count', 'DESC']]
            }
            let res = await db.Product.findAll(conditionObject)
            if (res && res.length > 0) {
                res.map((product) => {
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
            resolve({
                errCode: 0,
                data: res
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getTopProductHomePage = (limit, typeSort) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit || !typeSort) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1,
                    data: []
                });
            } else {
                let res = await db.Product.findAll({
                    where: { statusId: 'S1' },
                    order: [
                        [typeSort, 'DESC'],
                    ],
                    include: [
                        { model: db.Allcode, as: 'categoryData', attributes: ['value'] },
                        { model: db.Allcode, as: 'brandData', attributes: ['value'] },
                        { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                        { model: db.Allcode, as: 'warrantyData', attributes: ['value'] },
                        { model: db.ProductImage, as: 'productImageData' },
                    ],
                    limit: limit,
                    raw: false,
                    nest: true
                })
                if (res && res.length > 0) {
                    res.map((product) => {
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
let searchProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.valueSearch) {
                resolve({
                    errCode: 1,
                    errMessage: Message.Product.noName
                })
            } else {
                let res = await db.Product.findAll({
                    where: {
                        name: {
                            [Op.substring]: data.valueSearch
                        }
                    },
                    include: [
                        { model: db.Allcode, as: 'categoryData', attributes: ['value', 'keyMap'] },
                        { model: db.Allcode, as: 'brandData', attributes: ['value', 'keyMap'] },
                        { model: db.Allcode, as: 'statusData', attributes: ['value', 'keyMap'] },
                        { model: db.Allcode, as: 'warrantyData', attributes: ['value', 'keyMap'] },
                        { model: db.ProductImage, as: 'productImageData' },
                    ],
                    raw: false,
                    nest: true,
                });
                if (res && res.length > 0) {
                    res.map((product) => {
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
                    errMessage: Message.errCode1
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
                            errMessage: Message.Product.hidden
                        })
                    }
                    if (data.type === 'PERMIT') {
                        product.statusId = 'S1';
                        await product.save();
                        resolve({
                            errCode: 0,
                            errMessage: Message.Product.show
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Product.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Product.findOne({
                where: { id: data.id },
            })
            let isCheck = data && data.OrderDetailData && data.OrderDetailData.length > 0 ? 1 : 0
            if (isCheck === 1) {
                resolve({
                    errCode: 3,
                    errMessage: Message.Product.bought
                })
            } else {
                if (product) {
                    await db.ProductImage.destroy({
                        where: { productId: data.id }
                    })
                    await db.AgeUseProduct.destroy({
                        where: { productId: data.id }
                    })
                    await db.Product.destroy({
                        where: { id: data.id }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: Message.Product.delete
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Product.errCode2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.Product.findOne({
                    where: { id: id },
                    include: [
                        { model: db.Allcode, as: 'categoryData', attributes: ['value'] },
                        { model: db.Allcode, as: 'brandData', attributes: ['value'] },
                        { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                        { model: db.Allcode, as: 'warrantyData', attributes: ['value'] },
                        { model: db.ProductImage, as: 'productImageData' },
                        {
                            model: db.AgeUseProduct, as: 'productAgeData',
                            include: { model: db.Allcode, as: 'AgeUseProductData', attributes: ['value'] }
                        },
                    ],
                    raw: false,
                    nest: true
                })
                res && !_.isEmpty(res) && res.productImageData && res.productImageData.length > 0 &&
                    res.productImageData.map(item => item.image = new Buffer.from(item.image, 'base64').toString('binary'))

                let product = await db.Product.findOne({
                    where: { id: id },
                    raw: false
                })
                product.view += 1
                await product.save()
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
let createNewProductImage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.productId || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
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
                            errMessage: Message.Product.addImg
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Product.addImgFail
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Product.errCode2
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
                    errMessage: Message.errCode1
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
                            errMessage: Message.Product.upImg
                        })
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: Message.Product.noImg
                        })
                    }


                } else {
                    resolve({
                        errCode: 2,
                        errMessage: Message.Product.errCode2
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
                    errMessage: Message.errCode1,
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
                    errMessage: Message.Product.getImgFail,
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
                    errMessage: Message.errCode1
                })
            } else {
                let res = await db.ProductImage.destroy({
                    where: { id: id }
                });
                if (res) {
                    resolve({
                        errCode: 0,
                        errMessage: Message.Product.dltImg
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Product.dltImgFail
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getTopProductSold = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.OrderProduct.findAll({
                where: { statusId: 'S7' },
                include: [
                    { model: db.OrderDetail, as: 'orderData', attributes: ['productId'] },
                ],
                limit: limit,
                raw: false,
                nest: true
            })
            if (res) {
                resolve({
                    errCode: 0,
                    data: res
                })
            } else {
                resolve({
                    errCode: 3,
                    errMessage: Message.Product.getDataFail
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
    getTopProductHomePage: getTopProductHomePage,
    searchProduct: searchProduct,
    changeStatusProduct: changeStatusProduct,
    deleteProduct: deleteProduct,
    getDetailProductById: getDetailProductById,
    createNewProductImage: createNewProductImage,
    updateProductImage: updateProductImage,
    getAllProductImageFromProduct: getAllProductImageFromProduct,
    deleteProductImage: deleteProductImage,
    getTopProductSold: getTopProductSold
}
