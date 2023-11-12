import _ from "lodash";
import db from "../models/index";
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import paypal from 'paypal-rest-sdk'
import axios from 'axios';
import { Message } from "../config/message";
const vnpay = require('vn-payments');
import initiatePayment from "./MomoPayMent"
//const vnpay = require('vnpay');
paypal.configure({
    'mode': process.env.PAYPAL_MODE, //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});
let createNewOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiverId || !data.typeShipId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                let product = await db.OrderProduct.create({
                    orderDate: data.orderDate,
                    receiverId: data.receiverId,
                    statusId: 'S3',
                    typeShipId: data.typeShipId,
                    voucherId: data.voucherId,
                    note: data.note,
                    totalPayment: data.totalPayment,
                    isPaymentOnl: data.isPaymentOnl ? data.isPaymentOnl : 0
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
                    errMessage: Message.Order.success
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
                    errMessage: Message.errCode1
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
                    errMessage: Message.errCode1
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
                        errMessage: Message.Order.cancel
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: Message.Order.ok
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
                    errMessage: Message.errCode1
                })
            } else {
                let receiver = await db.Receiver.findAll({
                    where: { userId: userId },
                    attributes: ['id', 'name'],
                    include: {
                        model: db.OrderProduct, as: 'receiverOrderData', order: [['createdAt', 'ASC']], attributes: ["statusId", "totalPayment", 'id', "updatedAt", 'isPaymentOnl', 'createdAt'],
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
let paymentVNPayOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                const orderInfo = req.body.orderInfo;
                const amount = req.body.amount;
                const tmnCode = process.env.VNPAY_TMNCODE; // Mã doanh nghiệp (TMNCODE)
                const returnUrl = process.env.VNPAY_RETURN_URL; // Link để hiển thị kết quả thanh toán
                const secretKey = process.env.VNPAY_HASHSECRET; // Secret key của doanh nghiệp
                const rawHashData = `vnp_Amount=${amount}&vnp_Command=pay&vnp_CreateDate=${Date.now()}&vnp_CurrCode=VND&vnp_IpAddr=${req.ip}&vnp_Locale=vn&vnp_OrderInfo=${orderInfo}&vnp_ReturnUrl=${returnUrl}&vnp_TmnCode=${tmnCode}`;
                const secureHash = cryptoJS.HmacMD5(rawHashData, secretKey).toString();

                const apiEndpoint = process.env.VNPAY_API_ENDPOINT;
                const response = await axios.post(apiEndpoint, {
                    vnp_Amount: amount,
                    vnp_Command: 'pay',
                    vnp_CreateDate: Date.now(),
                    vnp_CurrCode: 'VND',
                    vnp_IpAddr: req.ip,
                    vnp_Locale: 'vn',
                    vnp_OrderInfo: orderInfo,
                    vnp_ReturnUrl: returnUrl,
                    vnp_TmnCode: tmnCode,
                    vnp_SecureHashType: 'MD5',
                    vnp_SecureHash: secureHash
                });

                // Redirect người dùng tới URL từ response của VNPAY
                res.redirect(response.data);
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
                //vnpay

                // const res = await VNPaySandbox.generatePaymentUrl(data);
                // resolve({
                //     res
                // })

                // let { amount, orderInfo, orderId } = data;
                // const result = {
                //     vnp_TmnCode: process.env.VNPAY_TMNCODE,
                //     vnp_Amount: +amount * 100,
                //     vnp_Command: 'pay',
                //     vnp_CreateDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                //     vnp_CurrCode: 'VND',
                //     //   vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                //     vnp_Locale: 'vn',
                //     vnp_OrderInfo: orderInfo,
                //     vnp_ReturnUrl: process.env.VNPAY_RETURNURL,
                //     vnp_TxnRef: orderId,
                //     vnp_Version: '2.0.0',
                //     vnp_SecureHashType: 'SHA256',
                //     vnp_SecureHash: '',
                // };
                // const params = new URLSearchParams(result).toString();
                // const secureHash = require('crypto').createHmac('sha256', process.env.VNPAY_HASHSECRET).update(params).digest('hex');

                // data.vnp_SecureHash = secureHash;
                // const vnpayResponse = await axios.post(process.env.VNPAY_URL, params);
                // console.log("---------");
                // console.log(vnpayResponse);
                // console.log("---------");
                // resolve({
                //     url: vnpayResponse.data
                // })


                // const vnp_TmnCode = '195JTS5P'; // Thông tin merchant ID
                // const vnp_HashSecret = 'CRXZBSKCNSHBMGIFIBWBAWVUNMFVJNVL'; // Thông tin secure secret key
                // const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
                // const vnp_ReturnUrl = `${process.env.URL_REACT}/payment/success`; // URL trang kết quả thanh toán
                // const vnp = new vnpay.VNPay(config);
                // const orderId = 'MA_DON_HANG';
                // const amount = 100000; // Số tiền cần thanh toán (đơn vị là VND)

                // const params = {
                //     vnp_TmnCode: config.vnp_TmnCode,
                //     vnp_Amount: amount * 100, // Chuyển về đơn vị tiền của VNPAY
                //     vnp_Command: 'pay',
                //     vnp_CreateDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format: YYYY-MM-DD HH:mm:ss
                //     vnp_CurrCode: 'VND',
                //     vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                //     vnp_Locale: 'vn',
                //     vnp_OrderInfo: 'THONG_TIN_DON_HANG',
                //     vnp_OrderType: '100000',
                //     vnp_ReturnUrl: config.vnp_ReturnUrl,
                //     vnp_TxnRef: orderId,
                //     vnp_Version: '2.0.0'
                // };

                // const paymentUrl = vnp.buildPaymentUrl(params);

                // res.redirect(paymentUrl);

                // const vnpayUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
                // const vnpayParams = {
                //     // Các tham số cần thiết của VnPay
                //     vnp_OrderInfo: 'Order description',
                //     vnp_Amount: 100000,
                //     vnp_Command: 'pay',
                //     vnp_CreateDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                //     // ...Thêm các tham số khác tùy chọn
                // };

                // // Gửi yêu cầu tới VnPay và nhận URL redirect
                // const response = await axios.post(vnpayUrl, vnpayParams);
                // resolve({
                //     errCode: 0,
                //     errMessage: "ok",
                //     link: response.data
                // })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let paymentMomoOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.orderId || !data.amount || !data.orderInfo) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                const res = await initiatePayment(data)
                if (res) {
                    resolve({
                        res
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: Message.Order.paymentFail
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })

}
let paymentPayPalOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                console.log(data.totalPayment);
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `${process.env.URL_REACT}/payment-success`,
                        "cancel_url": `${process.env.URL_REACT}/payment/cancel`
                    },
                    "transactions": [{
                        "item_list": {
                            "items": data.items
                        },
                        "amount": {
                            "currency": "USD",
                            "total": data.totalPayment
                        },
                        "description": "This is the payment description."
                    }]
                };
                paypal.payment.create(create_payment_json, (error, payment) => {
                    console.log("chek payment: ", payment);
                    if (error) {
                        resolve({
                            errCode: -1,
                            errMessage: error,
                        })
                    } else {
                        console.log("Create Payment Response");
                        resolve({
                            errCode: 0,
                            errMessage: Message.Order.ok,
                            // link: payment.links[1].href
                            link: payment.links.find((link) => link.rel === 'approval_url').href
                        })
                    }
                });
            }


        } catch (error) {
            reject(error)
        }
    })
}
let paymentPayPalSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.PayerID || !data.paymentId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: Message.errCode1
                })
            } else {
                var execute_payment_json = {
                    "payer_id": data.PayerID,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": data.totalUSD
                        }
                    }]
                };

                var paymentId = data.paymentId;

                paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
                    if (error) {
                        resolve({
                            errCode: 0,
                            errMessage: error
                        })
                        console.log("chek payment: ", payment);

                    } else {
                        console.log("Get Payment Response");
                        let res = await createNewOrder(data.orderData)
                        if (res) {
                            resolve(res)
                        } else {
                            resolve({
                                errCode: 3,
                                errMessage: Message.Order.paymentFail
                            })
                        }
                        // let product = await db.OrderProduct.create({
                        //     orderDate: data.orderDate,
                        //     receiverId: data.receiverId,
                        //     statusId: 'S3',
                        //     typeShipId: data.typeShipId,
                        //     voucherId: data.voucherId,
                        //     note: data.note,
                        //     totalPayment: data.totalPayment,
                        //     isPaymentOnl: isPaymentOnl
                        // })
                        // data.arrDataCart = data.arrDataCart.map((item, index) => {
                        //     item.orderId = product.dataValues.id
                        //     return item;
                        // })

                        // await db.OrderDetail.bulkCreate(data.arrDataCart)
                        // let res = await db.Cart.findOne({
                        //     where: { userId: data.userId, statusId: 0 },
                        //     // include: [
                        //     //     { model: db.Product, as: 'typeShipData', attributes: ['stock'] }
                        //     // ]
                        // })
                        // if (res) {
                        //     await db.Cart.destroy({
                        //         where: { userId: data.userId }
                        //     })
                        //     for (let i = 0; i < data.arrDataCart.length; i++) {
                        //         let res = await db.Product.findOne({
                        //             where: { id: data.arrDataCart[i].productId },
                        //             raw: false
                        //         })
                        //         res.stock = res.stock - data.arrDataCart[i].quantity
                        //         await res.save()
                        //     }
                        // }
                        // if (data.voucherId && data.userId) {
                        //     let voucherUsed = await db.VoucherUsed.findOne({
                        //         where: {
                        //             voucherId: data.voucherId,
                        //             userId: data.userId
                        //         },
                        //         raw: false
                        //     })
                        //     voucherUsed.status = 1;
                        //     await voucherUsed.save()
                        // }
                        // resolve({
                        //     errCode: 0,
                        //     errMessage: 'Đặt hàng thành công!'
                        // })
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
    getAllOrdersByUserId: getAllOrdersByUserId,
    paymentMomoOrder: paymentMomoOrder,
    paymentPayPalOrder: paymentPayPalOrder,
    paymentPayPalSuccess: paymentPayPalSuccess
}