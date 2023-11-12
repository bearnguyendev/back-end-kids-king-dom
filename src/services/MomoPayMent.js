//npm install momo-payment-sdk
const MomoPaymentSDK = require('momo-payment-sdk');
import axios from 'axios';
require('dotenv').config();
const momoConfig = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    environment: process.env.MOMO_ENVIRONMENT,
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
        notifyUrl: `${process.env.URL_REACT}/notify`,
    };

    try {
        const paymentUrl = await momoPayment.createPayment(paymentInfo);
        return paymentUrl.data
    } catch (error) {
        console.error('Error:', error);
    }
}
module.exports = initiatePayment;



