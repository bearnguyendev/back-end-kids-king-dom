import db from "../models/index";
let createNewOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiverId || !data.typeShipId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let product = await db.OrderProduct.create({
                    orderDate: data.orderDate,
                    receiverId: data.receiverId,
                    statusId: 'S3',
                    typeShipId: data.typeShipId,
                    voucherId: data.voucherId,
                    note: data.note
                })

                data.arrDataShopCart = data.arrDataShopCart.map((item, index) => {
                    item.orderId = product.dataValues.id
                    return item;
                })

                await db.OrderDetail.bulkCreate(data.arrDataShopCart)
                let res = await db.ShopCart.findOne({
                    where: { userId: data.userId, statusId: 0 },
                    // include: [
                    //     { model: db.Product, as: 'typeShipData', attributes: ['stock'] }
                    // ]
                })
                if (res) {
                    await db.ShopCart.destroy({
                        where: { userId: data.userId }
                    })
                    for (let i = 0; i < data.arrDataShopCart.length; i++) {
                        let productDetailSize = await db.ProductDetailSize.findOne({
                            where: { id: data.arrDataShopCart[i].productId },
                            raw: false
                        })
                        productDetailSize.stock = productDetailSize.stock - data.arrDataShopCart[i].quantity
                        await productDetailSize.save()

                    }

                }
                if (data.voucherId && data.userId) {
                    let voucherUses = await db.VoucherUsed.findOne({
                        where: {
                            voucherId: data.voucherId,
                            userId: data.userId
                        },
                        raw: false
                    })
                    voucherUses.status = 1;
                    await voucherUses.save()
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllOrders = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let objectFilter = {
                    limit: +data.limit,
                    offset: +data.offset,
                    include: [
                        { model: db.TypeShip, as: 'typeShipData' },
                        { model: db.Voucher, as: 'voucherData' },
                        { model: db.Allcode, as: 'statusOrderData' },

                    ],
                    order: [['createdAt', 'DESC']],
                    raw: true,
                    nest: true
                }
                if (data.statusId && data.statusId !== 'ALL') objectFilter.where = { statusId: data.statusId }
                let res = await db.OrderProduct.findAndCountAll(objectFilter)
                for (let i = 0; i < res.rows.length; i++) {
                    let addressUser = await db.AddressUser.findOne({ id: res.rows[i].receiverId })
                    if (addressUser) {
                        let user = await db.User.findOne({ id: addressUser.userId })
                        res.rows[i].userData = user
                    }

                }
                resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getDetailOrderById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let order = await db.OrderProduct.findOne({
                    where: { id: id },
                    include: [
                        { model: db.TypeShip, as: 'typeShipData' },
                        { model: db.Voucher, as: 'voucherData' },
                        { model: db.Allcode, as: 'statusOrderData' },

                    ],
                    raw: true,
                    nest: true
                })
                order.voucherData.typeVoucherOfVoucherData = await db.TypeVoucher.findOne({
                    where: { id: order.voucherData.typeVoucherId }
                })
                let orderDetail = await db.OrderDetail.findAll({
                    where: { orderId: id }
                })
                let addressUser = await db.AddressUser.findOne({
                    where: { id: order.receiverId }
                })
                order.addressUser = addressUser
                let user = await db.User.findOne({
                    where: { id: addressUser.userId },
                    attributes: {
                        exclude: ['password', 'image']
                    },
                    raw: true,
                    nest: true
                })
                order.userData = user
                for (let i = 0; i < orderDetail.length; i++) {
                    orderDetail[i].productDetailSize = await db.ProductDetailSize.findOne({
                        where: { id: orderDetail[i].productId },
                        include: [
                            { model: db.Allcode, as: 'sizeData' },
                        ],
                        raw: true,
                        nest: true
                    })
                    orderDetail[i].productDetail = await db.ProductDetail.findOne({
                        where: { id: orderDetail[i].productDetailSize.productdetailId }
                    })
                    orderDetail[i].product = await db.Product.findOne({
                        where: { id: orderDetail[i].productDetail.productId }
                    })
                    orderDetail[i].productImage = await db.ProductImage.findAll({
                        where: { productdetailId: orderDetail[i].productDetail.id }
                    })
                    for (let j = 0; j < orderDetail[i].productImage.length; j++) {
                        orderDetail[i].productImage[j].image = new Buffer(orderDetail[i].productImage[j].image, 'base64').toString('binary')
                    }
                }

                order.orderDetail = orderDetail;
                resolve({
                    errCode: 0,
                    data: order
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let updateStatusOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let order = await db.OrderProduct.findOne({
                    where: { id: data.id },
                    raw: false
                })
                order.statusId = data.statusId
                await order.save()
                // cong lai stock khi huy don
                if (data.statusId == 'S7' && data.dataOrder.orderDetail && data.dataOrder.orderDetail.length > 0) {
                    for (let i = 0; i < data.dataOrder.orderDetail.length; i++) {
                        let productDetailSize = await db.ProductDetailSize.findOne({
                            where: { id: data.dataOrder.orderDetail[i].productDetailSize.id },
                            raw: false
                        })
                        productDetailSize.stock = productDetailSize.stock + data.dataOrder.orderDetail[i].quantity
                        await productDetailSize.save()
                    }
                }


                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllOrdersByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let addressUser = await db.AddressUser.findAll({
                    where: { userId: userId }
                })
                for (let i = 0; i < addressUser.length; i++) {
                    addressUser[i].order = await db.OrderProduct.findAll({
                        where: { receiverId: addressUser[i].id },
                        include: [
                            { model: db.TypeShip, as: 'typeShipData' },
                            { model: db.Voucher, as: 'voucherData' },
                            { model: db.Allcode, as: 'statusOrderData' },

                        ],
                        raw: true,
                        nest: true
                    })
                    for (let j = 0; j < addressUser[i].order.length; j++) {
                        addressUser[i].order[j].voucherData.typeVoucherOfVoucherData = await db.TypeVoucher.findOne({
                            where: { id: addressUser[i].order[j].voucherData.typeVoucherId }
                        })
                        let orderDetail = await db.OrderDetail.findAll({
                            where: { orderId: addressUser[i].order[j].id }
                        })
                        for (let k = 0; k < orderDetail.length; k++) {
                            orderDetail[k].productDetailSize = await db.ProductDetailSize.findOne({
                                where: { id: orderDetail[k].productId },
                                include: [
                                    { model: db.Allcode, as: 'sizeData' },
                                ],
                                raw: true,
                                nest: true
                            })
                            orderDetail[k].productDetail = await db.ProductDetail.findOne({
                                where: { id: orderDetail[k].productDetailSize.productdetailId }
                            })
                            orderDetail[k].product = await db.Product.findOne({
                                where: { id: orderDetail[k].productDetail.productId }
                            })
                            orderDetail[k].productImage = await db.ProductImage.findAll({
                                where: { productdetailId: orderDetail[k].productDetail.id }
                            })
                            for (let f = 0; f < orderDetail[k].productImage.length; f++) {
                                orderDetail[k].productImage[f].image = new Buffer(orderDetail[k].productImage[f].image, 'base64').toString('binary')
                            }
                        }


                        addressUser[i].order[j].orderDetail = orderDetail
                    }



                }


                resolve({
                    errCode: 0,
                    data: addressUser

                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let paymentOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listItem = []
            let totalPriceProduct = 0
            for (let i = 0; i < data.result.length; i++) {
                data.result[i].productDetailSize = await db.ProductDetailSize.findOne({
                    where: { id: data.result[i].productId },
                    include: [
                        { model: db.Allcode, as: 'sizeData' },
                    ],
                    raw: true,
                    nest: true
                })
                data.result[i].productDetail = await db.ProductDetail.findOne({
                    where: { id: data.result[i].productDetailSize.productdetailId }
                })
                data.result[i].product = await db.Product.findOne({
                    where: { id: data.result[i].productDetail.productId }
                })
                listItem.push({
                    "name": data.result[i].product.name + " | " + data.result[i].productDetail.nameDetail + " | " + data.result[i].productDetailSize.sizeData.value,
                    "sku": data.result[i].productId + "",
                    "price": data.result[i].realPrice + "",
                    "currency": "USD",
                    "quantity": data.result[i].quantity
                })
                totalPriceProduct += data.result[i].realPrice * data.result[i].quantity
            }
            listItem.push({
                "name": "Phi ship + Voucher",
                "sku": "1",
                "price": (data.total - totalPriceProduct) + "",
                "currency": "USD",
                "quantity": 1
            })


            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `http://localhost:5000/payment/success`,
                    "cancel_url": "http://localhost:5000/payment/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": listItem
                    },
                    "amount": {
                        "currency": "USD",
                        "total": data.total
                    },
                    "description": "This is the payment description."
                }]
            };
            console.log(listItem)
            console.log("total :", data.total)
            console.log("extraprice :", data.total - totalPriceProduct)
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    resolve({
                        errCode: -1,
                        errMessage: error,

                    })


                } else {
                    console.log("Create Payment Response");
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                        link: payment.links[1].href
                    })

                }
            });


        } catch (error) {
            reject(error)
        }
    })
}
let paymentOrderSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.PayerID || !data.paymentId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                var execute_payment_json = {
                    "payer_id": data.PayerID,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": data.total
                        }
                    }]
                };

                var paymentId = data.paymentId;

                paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                    if (error) {
                        resolve({
                            errCode: 0,
                            errMessage: error
                        })
                    } else {
                        console.log("Get Payment Response");

                        let product = await db.OrderProduct.create({
                            orderDate: data.orderDate,
                            receiverId: data.receiverId,
                            isPaymentOnlien: data.isPaymentOnlien,
                            statusId: 'S3',
                            typeShipId: data.typeShipId,
                            voucherId: data.voucherId,
                            note: data.note

                        })

                        data.arrDataShopCart = data.arrDataShopCart.map((item, index) => {
                            item.orderId = product.dataValues.id
                            return item;
                        })

                        await db.OrderDetail.bulkCreate(data.arrDataShopCart)
                        let res = await db.ShopCart.findOne({ where: { userId: data.userId, statusId: 0 } })
                        if (res) {
                            await db.ShopCart.destroy({
                                where: { userId: data.userId }
                            })
                            for (let i = 0; i < data.arrDataShopCart.length; i++) {
                                let productDetailSize = await db.ProductDetailSize.findOne({
                                    where: { id: data.arrDataShopCart[i].productId },
                                    raw: false
                                })
                                productDetailSize.stock = productDetailSize.stock - data.arrDataShopCart[i].quantity
                                await productDetailSize.save()

                            }

                        }
                        if (data.voucherId && data.userId) {
                            let voucherUses = await db.VoucherUsed.findOne({
                                where: {
                                    voucherId: data.voucherId,
                                    userId: data.userId
                                },
                                raw: false
                            })
                            voucherUses.status = 1;
                            await voucherUses.save()
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'ok'
                        })
                        //  console.log(JSON.stringify(payment));
                    }
                });








            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewOrder: createNewOrder,
    getAllOrders: getAllOrders,
    getDetailOrderById: getDetailOrderById,
    updateStatusOrder: updateStatusOrder,
    getAllOrdersByUser: getAllOrdersByUser,
    paymentOrder: paymentOrder,
    paymentOrderSuccess: paymentOrderSuccess
}