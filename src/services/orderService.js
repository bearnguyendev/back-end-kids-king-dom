import _ from "lodash";
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
                    note: data.note,
                    totalPayment: data.totalPayment
                })
                data.arrDataCart = data.arrDataCart.map((item, index) => {
                    item.orderId = product.dataValues.id
                    return item;
                })

                await db.OrderDetail.bulkCreate(data.arrDataCart)
                let res = await db.Cart.findOne({
                    where: { userId: data.userId, statusId: 0 },
                    // include: [
                    //     { model: db.Product, as: 'typeShipData', attributes: ['stock'] }
                    // ]
                })
                if (res) {
                    await db.Cart.destroy({
                        where: { userId: data.userId }
                    })
                    for (let i = 0; i < data.arrDataCart.length; i++) {
                        let res = await db.Product.findOne({
                            where: { id: data.arrDataCart[i].productId },
                            raw: false
                        })
                        res.stock = res.stock - data.arrDataCart[i].quantity
                        await res.save()
                    }
                }
                if (data.voucherId && data.userId) {
                    let voucherUsed = await db.VoucherUsed.findOne({
                        where: {
                            voucherId: data.voucherId,
                            userId: data.userId
                        },
                        raw: false
                    })
                    voucherUsed.status = 1;
                    await voucherUsed.save()
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Đặt hàng thành công!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllOrders = (statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {
                include: [
                    { model: db.TypeShip, as: 'typeShipData' },
                    { model: db.Voucher, as: 'voucherData' },
                    { model: db.Allcode, as: 'statusOrderData' },
                    {
                        model: db.Product, as: 'OrderDetailData', attributes: ['name', 'id', 'discountPrice'],
                        include: {
                            model: db.ProductImage, as: 'productImageData', attributes: ['id', 'image']
                        }
                    },
                    {
                        model: db.Receiver, as: 'receiverOrderData',
                        include: [
                            {
                                model: db.User, as: 'userData', attributes: {
                                    exclude: ['password', 'image']
                                },
                            }
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
            }
            if (statusId && statusId !== 'ALL') objectFilter.where = { statusId: statusId }
            let res = await db.OrderProduct.findAll(objectFilter)
            resolve({
                errCode: 0,
                data: res
            })
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
                        {
                            model: db.Product, as: 'OrderDetailData',
                            include: {
                                model: db.ProductImage, as: 'productImageData', attributes: ['id', 'image']
                            }
                        },
                        { model: db.TypeShip, as: 'typeShipData' },
                        {
                            model: db.Voucher, as: 'voucherData',
                            include: [
                                { model: db.TypeVoucher, as: 'typeVoucherOfVoucherData' },
                            ]
                        },
                        { model: db.Allcode, as: 'statusOrderData' },
                        { model: db.OrderDetail, as: 'orderData' },
                        {
                            model: db.Receiver, as: 'receiverOrderData',
                            include: [
                                {
                                    model: db.User, as: 'userData', attributes: {
                                        exclude: ['password', 'image']
                                    },
                                }
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })
                {
                    order && !_.isEmpty(order) && order.OrderDetailData && order.OrderDetailData.length > 0
                        && order.OrderDetailData.map(item => item.productImageData && item.productImageData.length > 0 && item.productImageData.map(item1 =>
                            item1.image = new Buffer.from(item1.image, 'base64').toString('binary')))
                }
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
                if (data.statusId === 'S7' && data.dataOrderUser.OrderDetailData && data.dataOrderUser.OrderDetailData.length > 0) {
                    for (const iterator of data.dataOrderUser.OrderDetailData) {
                        let product = await db.Product.findOne({
                            where: { id: iterator.OrderDetail.productId },
                            raw: false
                        })
                        if (product) {
                            product.count++
                            await product.save()
                        }
                    }
                    order.orderDateSuccess = data.orderDateSuccess && data.orderDateSuccess
                    await order.save()
                }
                // cong lai stock khi huy don
                if (data.statusId === 'S8' && data.dataOrderUser.OrderDetailData && data.dataOrderUser.OrderDetailData.length > 0) {
                    for (const iterator of data.dataOrderUser.OrderDetailData) {
                        let product = await db.Product.findOne({
                            where: { id: iterator.OrderDetail.productId },
                            raw: false
                        })
                        if (product) {
                            product.stock += iterator.OrderDetail.quantity
                            await product.save()
                        }
                    }
                    // if (data.dataOrderUser.voucherId) {
                    //     let voucherUsed = await db.VoucherUsed.findOne({
                    //         where: {
                    //             userId: data.dataOrderUser.receiverOrderData.userData.id,
                    //             voucherId: data.dataOrderUser.voucherId
                    //         },
                    //         raw: false
                    //     })
                    //     if (voucherUsed) {
                    //         voucherUsed.status = 0
                    //         await voucherUsed.save()
                    //     }
                    // }
                    resolve({
                        errCode: 0,
                        errMessage: 'Huỷ đơn hàng thành công!'
                    })
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
let getAllOrdersByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let receiver = await db.Receiver.findAll({
                    where: { userId: userId },
                    attributes: ['id', 'name'],
                    include: {
                        model: db.OrderProduct, as: 'receiverOrderData', order: [['updatedAt', 'DESC']], attributes: ["statusId", "totalPayment", 'id', "updatedAt"],
                        include: [
                            { model: db.TypeShip, as: 'typeShipData' },
                            // {
                            //     model: db.Voucher, as: 'voucherData',
                            //     include: [
                            //         { model: db.TypeVoucher, as: 'typeVoucherOfVoucherData' },
                            //     ]
                            // },
                            { model: db.Allcode, as: 'statusOrderData', attributes: ['value', 'keyMap'], },
                            //{ model: db.OrderDetail, as: 'orderData' },
                            {
                                model: db.Product, as: 'OrderDetailData', attributes: ['name', 'discountPrice', 'id', 'originalPrice', 'stock'],
                                include: {
                                    model: db.ProductImage, as: 'productImageData', attributes: ['id', 'image']
                                }
                            },
                        ]
                    },
                    raw: false, //tra ve array
                    nest: true
                })
                {
                    receiver && receiver.length > 0 &&
                        receiver.map(item =>
                            item.receiverOrderData && item.receiverOrderData.length > 0 && item.receiverOrderData.map(item1 =>
                                item1.OrderDetailData && item1.OrderDetailData.length > 0 && item1.OrderDetailData.map(item2 =>
                                    item2.productImageData && item2.productImageData.length > 0 && item2.productImageData.map(item3 =>
                                        item3.image = new Buffer.from(item3.image, 'base64').toString('binary')
                                    )
                                )
                            )
                        )
                }
                resolve({
                    errCode: 0,
                    data: receiver

                })
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
    getAllOrdersByUserId: getAllOrdersByUserId,
}