//npm install momo-payment-sdk
const MomoPaymentSDK = require('momo-payment-sdk');
import axios from 'axios';
const crypto = require('crypto');
const momoConfig = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    environment: 'sandbox',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create'
};
const momoPayment = new MomoPaymentSDK(momoConfig);
async function initiatePayment(data) {
    const paymentInfo = {
        requestId: `ID-${data.orderId}`,
        orderId: data.orderId + new Date().getTime(),
        amount: data.amount,
        orderInfo: data.orderInfo,
        returnUrl: `${process.env.URL_REACT}/payment-success`,
        //redirectUrl: `${process.env.URL_REACT}/payment-success`,
        notifyUrl: `${process.env.URL_REACT}/notify`,
        //ipnUrl: `${process.env.URL_REACT}/notify`,
        //requestType: "payWithATM",
        //extraData: "",
    };
    // const rawSignature = `accessKey= ${momoConfig.accessKey}&amount${data.amount}&extraData${paymentInfo.extraData}&ipnUrl${paymentInfo.ipnUrl}&orderId${data.orderId}&orderInfo${data.orderInfo}&partnerCode${momoConfig.partnerCode}&redirectUrl${paymentInfo.redirectUrl}&requestId${paymentInfo.requestId}&requestType${paymentInfo.requestType}`;
    // const signature = crypto.createHmac('sha256', momoConfig.secretKey)
    //     .update(rawSignature)
    //     .digest('hex')
    try {
        // const res = await axios({
        //     method: 'POST',
        //     headers: { 'content-type': 'application/json' },
        //     url: momoConfig.endpoint,
        //     data: {
        //         accessKey: momoConfig.accessKey,
        //         partnerCode: momoConfig.partnerCode,
        //         requestType: paymentInfo.requestType,
        //         ipnUrl: paymentInfo.ipnUrl,
        //         //returnUrl: `${process.env.URL_REACT}/payment-success`,
        //         redirectUrl: paymentInfo.redirectUrl,
        //         orderId: data.orderId + new Date().getTime(),
        //         amount: data.amount,
        //         orderInfo: data.orderInfo,
        //         requestId: data.orderId,
        //         extraData: paymentInfo.extraData,
        //         signature: signature,
        //     },
        // });
        // console.log("CHECK PAYMENTURL: ", res);
        // return res.data;
        const paymentUrl = await momoPayment.createPayment(paymentInfo);
        console.log("CHECK PAYMENTURL: ", paymentUrl);
        return paymentUrl.data
    } catch (error) {
        console.error('Error:', error);
    }
}
module.exports = initiatePayment;



