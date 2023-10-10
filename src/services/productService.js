import _ from "lodash";
import db from "../models/index";
const { Op } = require("sequelize");
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
                            errMessage: 'Thêm mới sản phẩm thành công!'
                        })
                    } else {
                        if (!productImage) {
                            resolve({
                                errCode: 2,
                                errMessage: 'Thêm mới hình ảnh sản phẩm thất bại!'
                            })
                        }
                        if (!res) {
                            resolve({
                                errCode: 2,
                                errMessage: 'Thêm mới độ tuổi sử dụng sản phẩm thất bại!'
                            })
                        }
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
let getAllProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!',
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
                    errMessage: 'Thiếu các thông số bắt buộc!',
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
                    errMessage: 'Chưa nhập tên phẩm cần tìm!'
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
                    errMessage: 'Sản phẩm đã có người mua chỉ có thể ẩn không thể xoá!'
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
let getDetailProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
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
